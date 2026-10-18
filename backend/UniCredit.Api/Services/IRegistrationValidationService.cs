using UniCredit.Api.Models;

namespace UniCredit.Api.Services;

public record ValidationResult(bool IsValid, string? Message = null, string? ErrorType = null, object? Data = null);

public interface IRegistrationValidationService
{
    bool CheckScheduleOverlap(int dayA, int startA, int countA, int dayB, int startB, int countB);
    ValidationResult CheckTimeConflict(CourseClass newClass, IEnumerable<CourseClass> registeredClasses);
    ValidationResult CheckPrerequisites(Course course, IEnumerable<CompletedCourse> completedCourses);
    ValidationResult CheckCreditLimit(int currentCredits, int newCredits, int maxCredits);
    ValidationResult CheckSlotAvailability(CourseClass courseClass);
    ValidationResult CheckDuplicateCourse(string courseCode, IEnumerable<CourseClass> registeredClasses);
}

public class RegistrationValidationService : IRegistrationValidationService
{
    public bool CheckScheduleOverlap(int dayA, int startA, int countA, int dayB, int startB, int countB)
    {
        if (dayA != dayB) return false;
        int endA = startA + countA - 1;
        int endB = startB + countB - 1;
        return Math.Max(startA, startB) <= Math.Min(endA, endB);
    }

    public ValidationResult CheckTimeConflict(CourseClass newClass, IEnumerable<CourseClass> registeredClasses)
    {
        foreach (var reg in registeredClasses)
        {
            if (reg.ClassCode == newClass.ClassCode) continue;

            if (CheckScheduleOverlap(newClass.DayOfWeek, newClass.StartPeriod, newClass.PeriodCount,
                                     reg.DayOfWeek, reg.StartPeriod, reg.PeriodCount))
            {
                var dayName = newClass.DayOfWeek == 8 ? "Chủ nhật" : $"Thứ {newClass.DayOfWeek}";
                var msg = $"Trùng lịch học vào {dayName} (Tiết {newClass.StartPeriod}-{newClass.StartPeriod + newClass.PeriodCount - 1}) với lớp {reg.CourseName} [{reg.ClassCode}] (Tiết {reg.StartPeriod}-{reg.StartPeriod + reg.PeriodCount - 1}, Phòng {reg.Room}).";
                return new ValidationResult(false, msg, "TIME_CONFLICT", reg);
            }
        }
        return new ValidationResult(true);
    }

    public ValidationResult CheckPrerequisites(Course course, IEnumerable<CompletedCourse> completedCourses)
    {
        if (course.Prerequisites == null || course.Prerequisites.Count == 0)
            return new ValidationResult(true);

        var missing = new List<string>();
        foreach (var prereqCode in course.Prerequisites)
        {
            var passed = completedCourses.Any(c => c.CourseCode == prereqCode && c.IsPassed);
            if (!passed)
            {
                missing.Add(prereqCode);
            }
        }

        if (missing.Count > 0)
        {
            var msg = $"Chưa đạt điều kiện tiên quyết: Bạn chưa hoàn thành học phần [{string.Join(", ", missing)}].";
            return new ValidationResult(false, msg, "PREREQUISITE_FAILED", missing);
        }

        return new ValidationResult(true);
    }

    public ValidationResult CheckCreditLimit(int currentCredits, int newCredits, int maxCredits)
    {
        int total = currentCredits + newCredits;
        if (total > maxCredits)
        {
            var msg = $"Vượt quá giới hạn tín chỉ: Tổng số tín chỉ sau khi thêm là {total} TC, vượt mức tối đa {maxCredits} TC trong một học kỳ.";
            return new ValidationResult(false, msg, "MAX_CREDITS_EXCEEDED", total);
        }
        return new ValidationResult(true);
    }

    public ValidationResult CheckSlotAvailability(CourseClass courseClass)
    {
        if (courseClass.CurrentSlots >= courseClass.MaxSlots)
        {
            var msg = $"Lớp học phần [{courseClass.ClassCode}] đã đầy sĩ số ({courseClass.CurrentSlots}/{courseClass.MaxSlots}).";
            return new ValidationResult(false, msg, "SLOT_FULL");
        }
        return new ValidationResult(true);
    }

    public ValidationResult CheckDuplicateCourse(string courseCode, IEnumerable<CourseClass> registeredClasses)
    {
        var existing = registeredClasses.FirstOrDefault(c => c.CourseCode == courseCode);
        if (existing != null)
        {
            var msg = $"Bạn đã đăng ký môn học này ở lớp [{existing.ClassCode}]. Vui lòng hủy lớp cũ trước nếu muốn đổi lớp.";
            return new ValidationResult(false, msg, "DUPLICATE_COURSE", existing.ClassCode);
        }
        return new ValidationResult(true);
    }
}
