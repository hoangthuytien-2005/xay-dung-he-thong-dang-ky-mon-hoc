using MongoDB.Driver;
using UniCredit.Api.Data;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;

namespace UniCredit.Api.Services;

public interface IRegistrationService
{
    Task<Student?> GetStudentProfileAsync(string studentCode);
    Task<List<Course>> GetAllCoursesAsync();
    Task<List<CourseClass>> GetAllClassesAsync(string periodId);
    Task<RegistrationPeriod> GetActivePeriodAsync();
    Task<ApiResponse<Student>> RegisterClassAsync(string studentCode, string classCode);
    Task<ApiResponse<Student>> DropClassAsync(string studentCode, string classCode);
    Task<ApiResponse> UpdatePeriodConfigAsync(int minCredits, int maxCredits, bool isActive);
    Task<List<Lecturer>> GetAllLecturersAsync();
    Task<Lecturer?> GetLecturerAsync(string lecturerCode);
    Task<ApiResponse> ReSeedAsync();
}

public class RegistrationService : IRegistrationService
{
    private readonly IMongoDbContext _context;
    private readonly IRegistrationValidationService _validator;
    private readonly ILogger<RegistrationService> _logger;

    public RegistrationService(
        IMongoDbContext context,
        IRegistrationValidationService validator,
        ILogger<RegistrationService> logger)
    {
        _context = context;
        _validator = validator;
        _logger = logger;
    }

    public async Task<Student?> GetStudentProfileAsync(string studentCode)
    {
        if (_context.IsConnected && _context.Students != null)
        {
            try
            {
                var s = await _context.Students.Find(x => x.StudentCode == studentCode).FirstOrDefaultAsync();
                if (s != null) return s;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB read student error, falling back to memory: {Msg}", ex.Message);
            }
        }

        return _context.MemoryStudents.FirstOrDefault(x => x.StudentCode == studentCode)
               ?? _context.MemoryStudents.FirstOrDefault();
    }

    public async Task<List<Course>> GetAllCoursesAsync()
    {
        if (_context.IsConnected && _context.Courses != null)
        {
            try
            {
                var list = await _context.Courses.Find(FilterDefinition<Course>.Empty).ToListAsync();
                if (list.Count > 0) return list;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB read courses error, falling back to memory: {Msg}", ex.Message);
            }
        }

        return _context.MemoryCourses;
    }

    public async Task<List<CourseClass>> GetAllClassesAsync(string periodId)
    {
        if (_context.IsConnected && _context.CourseClasses != null)
        {
            try
            {
                var list = await _context.CourseClasses.Find(x => x.PeriodId == periodId).ToListAsync();
                if (list.Count > 0) return list;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB read classes error, falling back to memory: {Msg}", ex.Message);
            }
        }

        return _context.MemoryClasses.Where(x => x.PeriodId == periodId).ToList();
    }

    public async Task<RegistrationPeriod> GetActivePeriodAsync()
    {
        if (_context.IsConnected && _context.RegistrationPeriods != null)
        {
            try
            {
                var p = await _context.RegistrationPeriods.Find(x => x.IsActive).FirstOrDefaultAsync();
                if (p != null) return p;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB read period error, falling back to memory: {Msg}", ex.Message);
            }
        }

        return _context.MemoryPeriod;
    }

    public async Task<ApiResponse<Student>> RegisterClassAsync(string studentCode, string classCode)
    {
        // 1. Check period status
        var period = await GetActivePeriodAsync();
        if (!period.IsActive)
        {
            return ApiResponse<Student>.Fail("Đợt đăng ký tín chỉ hiện đang đóng.", "PERIOD_CLOSED");
        }

        // 2. Load Student, Course, Classes
        var student = await GetStudentProfileAsync(studentCode);
        if (student == null)
            return ApiResponse<Student>.Fail($"Không tìm thấy sinh viên [{studentCode}].", "STUDENT_NOT_FOUND");

        var allClasses = await GetAllClassesAsync(period.PeriodId);
        var targetClass = allClasses.FirstOrDefault(c => c.ClassCode == classCode);
        if (targetClass == null)
            return ApiResponse<Student>.Fail($"Không tìm thấy lớp học phần [{classCode}].", "CLASS_NOT_FOUND");

        var allCourses = await GetAllCoursesAsync();
        var targetCourse = allCourses.FirstOrDefault(c => c.Code == targetClass.CourseCode);
        if (targetCourse == null)
            return ApiResponse<Student>.Fail($"Không tìm thấy môn học [{targetClass.CourseCode}].", "COURSE_NOT_FOUND");

        // 3. Already registered check
        if (student.RegisteredClasses.Contains(classCode))
            return ApiResponse<Student>.Fail($"Bạn đã đăng ký lớp học phần [{classCode}] này rồi.", "ALREADY_REGISTERED");

        var registeredClasses = allClasses.Where(c => student.RegisteredClasses.Contains(c.ClassCode)).ToList();

        // 4. Check duplicate course
        var dupCheck = _validator.CheckDuplicateCourse(targetClass.CourseCode, registeredClasses);
        if (!dupCheck.IsValid)
            return ApiResponse<Student>.Fail(dupCheck.Message!, dupCheck.ErrorType);

        // 5. Check prerequisites
        var prereqCheck = _validator.CheckPrerequisites(targetCourse, student.CompletedCourses);
        if (!prereqCheck.IsValid)
            return ApiResponse<Student>.Fail(prereqCheck.Message!, prereqCheck.ErrorType);

        // 6. Check time conflict
        var conflictCheck = _validator.CheckTimeConflict(targetClass, registeredClasses);
        if (!conflictCheck.IsValid)
            return ApiResponse<Student>.Fail(conflictCheck.Message!, conflictCheck.ErrorType);

        // 7. Check slot availability
        var slotCheck = _validator.CheckSlotAvailability(targetClass);
        if (!slotCheck.IsValid)
            return ApiResponse<Student>.Fail(slotCheck.Message!, slotCheck.ErrorType);

        // 8. Check credit limits
        int currentCredits = registeredClasses.Sum(c => c.Credits);
        var creditCheck = _validator.CheckCreditLimit(currentCredits, targetClass.Credits, period.MaxCredits);
        if (!creditCheck.IsValid)
            return ApiResponse<Student>.Fail(creditCheck.Message!, creditCheck.ErrorType);

        // 9. Commit registration
        student.RegisteredClasses.Add(classCode);
        targetClass.CurrentSlots += 1;
        if (!targetClass.RegisteredStudents.Contains(studentCode))
            targetClass.RegisteredStudents.Add(studentCode);

        // Update MongoDB if connected
        if (_context.IsConnected && _context.Students != null && _context.CourseClasses != null)
        {
            try
            {
                await _context.Students.UpdateOneAsync(
                    s => s.StudentCode == studentCode,
                    Builders<Student>.Update.AddToSet(s => s.RegisteredClasses, classCode));

                await _context.CourseClasses.UpdateOneAsync(
                    c => c.ClassCode == classCode,
                    Builders<CourseClass>.Update
                        .Inc(c => c.CurrentSlots, 1)
                        .AddToSet(c => c.RegisteredStudents, studentCode));
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB write error: {Msg}", ex.Message);
            }
        }

        return ApiResponse<Student>.Ok(student, $"Đăng ký thành công lớp [{classCode}]!");
    }

    public async Task<ApiResponse<Student>> DropClassAsync(string studentCode, string classCode)
    {
        var student = await GetStudentProfileAsync(studentCode);
        if (student == null)
            return ApiResponse<Student>.Fail($"Không tìm thấy sinh viên [{studentCode}].");

        var period = await GetActivePeriodAsync();
        var allClasses = await GetAllClassesAsync(period.PeriodId);
        var targetClass = allClasses.FirstOrDefault(c => c.ClassCode == classCode);

        student.RegisteredClasses.Remove(classCode);
        if (targetClass != null)
        {
            targetClass.CurrentSlots = Math.Max(0, targetClass.CurrentSlots - 1);
            targetClass.RegisteredStudents.Remove(studentCode);
        }

        // Update MongoDB if connected
        if (_context.IsConnected && _context.Students != null && _context.CourseClasses != null)
        {
            try
            {
                await _context.Students.UpdateOneAsync(
                    s => s.StudentCode == studentCode,
                    Builders<Student>.Update.Pull(s => s.RegisteredClasses, classCode));

                if (targetClass != null)
                {
                    await _context.CourseClasses.UpdateOneAsync(
                        c => c.ClassCode == classCode,
                        Builders<CourseClass>.Update
                            .Inc(c => c.CurrentSlots, -1)
                            .Pull(c => c.RegisteredStudents, studentCode));
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB drop error: {Msg}", ex.Message);
            }
        }

        return ApiResponse<Student>.Ok(student, $"Đã hủy đăng ký lớp [{classCode}] thành công.");
    }

    public async Task<ApiResponse> UpdatePeriodConfigAsync(int minCredits, int maxCredits, bool isActive)
    {
        _context.MemoryPeriod.MinCredits = minCredits;
        _context.MemoryPeriod.MaxCredits = maxCredits;
        _context.MemoryPeriod.IsActive = isActive;

        if (_context.IsConnected && _context.RegistrationPeriods != null)
        {
            try
            {
                await _context.RegistrationPeriods.UpdateOneAsync(
                    p => p.PeriodId == _context.MemoryPeriod.PeriodId,
                    Builders<RegistrationPeriod>.Update
                        .Set(p => p.MinCredits, minCredits)
                        .Set(p => p.MaxCredits, maxCredits)
                        .Set(p => p.IsActive, isActive));
            }
            catch (Exception ex)
            {
                _logger.LogWarning("MongoDB update period error: {Msg}", ex.Message);
            }
        }

        return ApiResponse.Ok("Cập nhật cấu hình đợt đăng ký thành công!");
    }

    public async Task<List<Lecturer>> GetAllLecturersAsync()
    {
        if (_context.IsConnected && _context.Lecturers != null)
        {
            try
            {
                var list = await _context.Lecturers.Find(FilterDefinition<Lecturer>.Empty).ToListAsync();
                if (list.Count > 0) return list;
            }
            catch { }
        }
        return _context.MemoryLecturers;
    }

    public async Task<Lecturer?> GetLecturerAsync(string lecturerCode)
    {
        var list = await GetAllLecturersAsync();
        return list.FirstOrDefault(l => l.LecturerCode.Equals(lecturerCode, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<ApiResponse> ReSeedAsync()
    {
        await DbSeeder.SeedAsync(_context);
        return ApiResponse.Ok("Khôi phục và nạp dữ liệu mẫu thành công!");
    }
}
