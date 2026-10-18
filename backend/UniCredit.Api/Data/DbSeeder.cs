using MongoDB.Driver;
using UniCredit.Api.Models;

namespace UniCredit.Api.Data;

public static class DbSeeder
{
    public static readonly RegistrationPeriod DefaultPeriod = new()
    {
        PeriodId = "2024-2025-HK1",
        Name = "Đợt 1 - Học kỳ 1 Năm học 2024 - 2025 (Chính thức)",
        AcademicYear = "2024-2025",
        Semester = 1,
        StartDate = DateTime.UtcNow.AddMonths(-1),
        EndDate = DateTime.UtcNow.AddMonths(2),
        MinCredits = 10,
        MaxCredits = 24,
        TargetBatches = new List<string> { "K21", "K22", "K23" },
        IsActive = true
    };

    public static readonly Student DefaultStudent = new()
    {
        StudentCode = "B21DCCN001",
        FullName = "Nguyễn Hoàng Minh",
        Email = "minhnh.b21cn001@unicredit.edu.vn",
        Major = "Công nghệ Thông tin",
        AdministrativeClass = "D21CQCN01-B",
        AcademicYear = 2021,
        Cpa = 3.38,
        AccumulatedCredits = 74,
        AdvisorName = "PGS.TS Nguyễn Mạnh Hùng",
        CompletedCourses = new List<CompletedCourse>
        {
            new() { CourseCode = "BAS1201", CourseName = "Đại số tuyến tính", Credits = 3, Grade = "B+", GradePoint = 3.5, IsPassed = true, Semester = "2021-2022-HK1" },
            new() { CourseCode = "BAS1203", CourseName = "Giải tích 1", Credits = 3, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2021-2022-HK1" },
            new() { CourseCode = "INT1155", CourseName = "Tin học cơ sở 2 (C/C++)", Credits = 3, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "BAS1105", CourseName = "Triết học Mác - Lênin", Credits = 3, Grade = "C+", GradePoint = 2.5, IsPassed = true, Semester = "2021-2022-HK2" },
            new() { CourseCode = "INT1306", CourseName = "Cấu trúc dữ liệu và giải thuật", Credits = 3, Grade = "A", GradePoint = 4.0, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "INT1332", CourseName = "Kiến trúc máy tính", Credits = 3, Grade = "B", GradePoint = 3.0, IsPassed = true, Semester = "2022-2023-HK1" },
            new() { CourseCode = "INT1340", CourseName = "Cơ sở dữ liệu", Credits = 3, Grade = "D+", GradePoint = 1.5, IsPassed = true, Semester = "2022-2023-HK2" },
            new() { CourseCode = "INT1416", CourseName = "Trí tuệ nhân tạo cơ bản", Credits = 3, Grade = "F", GradePoint = 0.0, IsPassed = false, Semester = "2023-2024-HK1" }
        },
        RegisteredClasses = new List<string> { "INT1434-01", "INT1339-02" }
    };

    public static List<Course> GetDefaultCourses() => new()
    {
        new() { Code = "INT1405", Name = "Công nghệ phần mềm", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1340" }, PreviousCourses = new() { "INT1306" } },
        new() { Code = "INT1434", Name = "Lập trình Web và ứng dụng", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1340" } },
        new() { Code = "INT1339", Name = "Mạng máy tính", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Mạng & Truyền thông", SemesterProposal = 5, Prerequisites = new() { "INT1332" } },
        new() { Code = "INT1412", Name = "An toàn và bảo mật hệ thống thông tin", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa An toàn Thông tin", SemesterProposal = 6, Prerequisites = new() { "INT1339" } },
        new() { Code = "INT1416", Name = "Trí tuệ nhân tạo cơ bản", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 5, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT1340", Name = "Cơ sở dữ liệu", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 4, Prerequisites = new() { "INT1306" } },
        new() { Code = "INT14115", Name = "Học máy chuyên sâu (Deep Learning)", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa CNTT 1", SemesterProposal = 7, Prerequisites = new() { "INT1416" } },
        new() { Code = "SKI1014", Name = "Kỹ năng làm việc nhóm & Thuyết trình", Credits = 2, TheoryCredits = 2, PracticeCredits = 0, Department = "Bộ môn Kỹ năng Mềm", SemesterProposal = 5 },
        new() { Code = "ELE1433", Name = "Thiết kế hệ thống nhúng và IoT", Credits = 3, TheoryCredits = 2, PracticeCredits = 1, Department = "Khoa Điện tử 1", SemesterProposal = 6, Prerequisites = new() { "INT1332" } }
    };

    public static List<CourseClass> GetDefaultClasses() => new()
    {
        // INT1434 - Lập trình Web
        new() { ClassCode = "INT1434-01", CourseCode = "INT1434", CourseName = "Lập trình Web và ứng dụng", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 1, PeriodCount = 3, Room = "401-A2", Lecturer = "TS. Hoàng Xuân Dậu", MaxSlots = 60, CurrentSlots = 45, RegisteredStudents = new() { "B21DCCN001", "B21DCCN012" } },
        new() { ClassCode = "INT1434-02", CourseCode = "INT1434", CourseName = "Lập trình Web và ứng dụng", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 7, PeriodCount = 3, Room = "204-A3", Lecturer = "ThS. Phạm Thế Quynh", MaxSlots = 55, CurrentSlots = 55 }, // ĐẦY SĨ SỐ

        // INT1339 - Mạng máy tính
        new() { ClassCode = "INT1339-01", CourseCode = "INT1339", CourseName = "Mạng máy tính", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 2, StartPeriod = 1, PeriodCount = 3, Room = "305-A2", Lecturer = "PGS.TS Vũ Hữu Tiến", MaxSlots = 60, CurrentSlots = 40 }, // Trùng lịch INT1434-01
        new() { ClassCode = "INT1339-02", CourseCode = "INT1339", CourseName = "Mạng máy tính", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 4, PeriodCount = 3, Room = "102-A2", Lecturer = "TS. Lê Quang Minh", MaxSlots = 60, CurrentSlots = 38, RegisteredStudents = new() { "B21DCCN001" } },

        // INT1405 - Công nghệ phần mềm
        new() { ClassCode = "INT1405-01", CourseCode = "INT1405", CourseName = "Công nghệ phần mềm", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 1, PeriodCount = 3, Room = "301-A3", Lecturer = "TS. Ngô Xuân Bách", MaxSlots = 65, CurrentSlots = 32 },
        new() { ClassCode = "INT1405-02", CourseCode = "INT1405", CourseName = "Công nghệ phần mềm", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 7, PeriodCount = 3, Room = "502-A2", Lecturer = "ThS. Trần Thị Kim Oanh", MaxSlots = 60, CurrentSlots = 48 },

        // INT1412 - An toàn thông tin
        new() { ClassCode = "INT1412-01", CourseCode = "INT1412", CourseName = "An toàn và bảo mật hệ thống thông tin", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 1, PeriodCount = 3, Room = "302-A2", Lecturer = "TS. Hoàng Đăng Hải", MaxSlots = 50, CurrentSlots = 27 },
        new() { ClassCode = "INT1412-02", CourseCode = "INT1412", CourseName = "An toàn và bảo mật hệ thống thông tin", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 4, PeriodCount = 3, Room = "201-A3", Lecturer = "ThS. Đỗ Tuấn Anh", MaxSlots = 50, CurrentSlots = 15 },

        // INT1416 - AI (Học lại)
        new() { ClassCode = "INT1416-01", CourseCode = "INT1416", CourseName = "Trí tuệ nhân tạo cơ bản", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 6, StartPeriod = 1, PeriodCount = 3, Room = "405-A2", Lecturer = "PGS.TS Từ Minh Phương", MaxSlots = 60, CurrentSlots = 51 },

        // INT1340 - Cơ sở dữ liệu (Cải thiện)
        new() { ClassCode = "INT1340-01", CourseCode = "INT1340", CourseName = "Cơ sở dữ liệu", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 3, StartPeriod = 7, PeriodCount = 3, Room = "203-A2", Lecturer = "TS. Nguyễn Kiều Linh", MaxSlots = 60, CurrentSlots = 35 },

        // INT14115 - Deep Learning (Chặn tiên quyết)
        new() { ClassCode = "INT14115-01", CourseCode = "INT14115", CourseName = "Học máy chuyên sâu (Deep Learning)", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 5, StartPeriod = 7, PeriodCount = 3, Room = "Lab AI-A2", Lecturer = "TS. Nguyễn Kim Anh", MaxSlots = 40, CurrentSlots = 20 },

        // SKI1014 - Kỹ năng mềm
        new() { ClassCode = "SKI1014-01", CourseCode = "SKI1014", CourseName = "Kỹ năng làm việc nhóm & Thuyết trình", Credits = 2, PeriodId = "2024-2025-HK1", DayOfWeek = 7, StartPeriod = 1, PeriodCount = 2, Room = "Hội trường A2", Lecturer = "ThS. Lê Thị Thu Hằng", MaxSlots = 80, CurrentSlots = 42 },

        // ELE1433 - IoT
        new() { ClassCode = "ELE1433-01", CourseCode = "ELE1433", CourseName = "Thiết kế hệ thống nhúng và IoT", Credits = 3, PeriodId = "2024-2025-HK1", DayOfWeek = 4, StartPeriod = 4, PeriodCount = 3, Room = "Lab IoT-303", Lecturer = "TS. Vũ Khánh Quý", MaxSlots = 45, CurrentSlots = 29 }
    };

    public static List<Lecturer> GetDefaultLecturers() => new()
    {
        new() { LecturerCode = "GV01", FullName = "TS. Hoàng Xuân Dậu", Title = "Tiến sĩ - Trưởng bộ môn CNPM", Department = "Khoa Công nghệ Thông tin 1", Email = "dauhx@unicredit.edu.vn", Phone = "0912.345.678", TeachingClassCodes = new() { "INT1434-01" } },
        new() { LecturerCode = "GV02", FullName = "PGS.TS Vũ Hữu Tiến", Title = "Phó Giáo sư, Tiến sĩ", Department = "Khoa Mạng & Truyền thông", Email = "tienvh@unicredit.edu.vn", Phone = "0988.765.432", TeachingClassCodes = new() { "INT1339-01" } },
        new() { LecturerCode = "GV03", FullName = "TS. Ngô Xuân Bách", Title = "Tiến sĩ", Department = "Khoa Công nghệ Thông tin 1", Email = "bachnx@unicredit.edu.vn", Phone = "0904.112.233", TeachingClassCodes = new() { "INT1405-01" } }
    };

    public static async Task SeedAsync(IMongoDbContext context)
    {
        // 1. Populate In-Memory fallback store
        context.MemoryPeriod = DefaultPeriod;
        context.MemoryStudents.Clear();
        context.MemoryStudents.Add(DefaultStudent);

        context.MemoryCourses.Clear();
        context.MemoryCourses.AddRange(GetDefaultCourses());

        context.MemoryClasses.Clear();
        context.MemoryClasses.AddRange(GetDefaultClasses());

        context.MemoryLecturers.Clear();
        context.MemoryLecturers.AddRange(GetDefaultLecturers());

        // 2. If MongoDB is online, seed into MongoDB collections
        if (context.IsConnected && context.Students != null)
        {
            try
            {
                // Registration Period
                await context.RegistrationPeriods!.DeleteManyAsync(FilterDefinition<RegistrationPeriod>.Empty);
                await context.RegistrationPeriods.InsertOneAsync(DefaultPeriod);

                // Student
                await context.Students.DeleteManyAsync(FilterDefinition<Student>.Empty);
                await context.Students.InsertOneAsync(DefaultStudent);

                // Courses
                await context.Courses!.DeleteManyAsync(FilterDefinition<Course>.Empty);
                await context.Courses.InsertManyAsync(GetDefaultCourses());

                // Course Classes
                await context.CourseClasses!.DeleteManyAsync(FilterDefinition<CourseClass>.Empty);
                await context.CourseClasses.InsertManyAsync(GetDefaultClasses());

                // Lecturers
                await context.Lecturers!.DeleteManyAsync(FilterDefinition<Lecturer>.Empty);
                await context.Lecturers.InsertManyAsync(GetDefaultLecturers());
            }
            catch
            {
                // Fallback gracefully
            }
        }
    }
}
