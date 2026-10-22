using UniCredit.Api.Models;
using UniCredit.Api.Services;
using Xunit;

namespace UniCredit.Tests;

public class RegistrationValidationTests
{
    private readonly RegistrationValidationService _validator = new();

    [Fact]
    public void CheckScheduleOverlap_WhenPeriodsIntersect_ReturnsTrue()
    {
        // Thứ 2, tiết 1-3 và Thứ 2, tiết 3-5 -> Giao nhau tại tiết 3
        bool overlap = _validator.CheckScheduleOverlap(dayA: 2, startA: 1, countA: 3,
                                                       dayB: 2, startB: 3, countB: 3);
        Assert.True(overlap, "Hai kíp học trùng tiết 3 phải được phát hiện trùng lịch.");
    }

    [Fact]
    public void CheckScheduleOverlap_WhenAdjacentOrDifferentDays_ReturnsFalse()
    {
        // Thứ 2, tiết 1-3 và Thứ 2, tiết 4-6 -> Liền kề, không trùng
        bool adjacentOverlap = _validator.CheckScheduleOverlap(dayA: 2, startA: 1, countA: 3,
                                                              dayB: 2, startB: 4, countB: 3);
        Assert.False(adjacentOverlap, "Tiết 1-3 và Tiết 4-6 không trùng.");

        // Thứ 2 và Thứ 3 -> Khác thứ
        bool differentDayOverlap = _validator.CheckScheduleOverlap(dayA: 2, startA: 1, countA: 3,
                                                                  dayB: 3, startB: 1, countB: 3);
        Assert.False(differentDayOverlap, "Khác thứ không được báo trùng.");
    }

    [Fact]
    public void CheckPrerequisites_WhenPrerequisiteNotPassed_ReturnsInvalid()
    {
        var course = new Course
        {
            Code = "INT14115",
            Name = "Học máy chuyên sâu",
            Prerequisites = new List<string> { "INT1416" } // Yêu cầu Trí tuệ nhân tạo
        };

        var studentHistory = new List<CompletedCourse>
        {
            new() { CourseCode = "INT1416", Grade = "F", IsPassed = false }
        };

        var result = _validator.CheckPrerequisites(course, studentHistory);

        Assert.False(result.IsValid);
        Assert.Equal("PREREQUISITE_FAILED", result.ErrorType);
    }

    [Fact]
    public void CheckCreditLimit_WhenExceedsMaxCredits_ReturnsInvalid()
    {
        int currentCredits = 22;
        int newCredits = 3;
        int maxCredits = 24;

        var result = _validator.CheckCreditLimit(currentCredits, newCredits, maxCredits);

        Assert.False(result.IsValid);
        Assert.Equal("MAX_CREDITS_EXCEEDED", result.ErrorType);
    }

    [Fact]
    public void CheckSlotAvailability_WhenClassIsFull_ReturnsInvalid()
    {
        var fullClass = new CourseClass
        {
            ClassCode = "INT1434-02",
            MaxSlots = 50,
            CurrentSlots = 50
        };

        var result = _validator.CheckSlotAvailability(fullClass);

        Assert.False(result.IsValid);
        Assert.Equal("SLOT_FULL", result.ErrorType);
    }

    [Fact]
    public void CheckDuplicateCourse_WhenAlreadyEnrolledAnotherClassOfCourse_ReturnsInvalid()
    {
        var registeredList = new List<CourseClass>
        {
            new() { ClassCode = "INT1434-01", CourseCode = "INT1434" }
        };

        var result = _validator.CheckDuplicateCourse("INT1434", registeredList);

        Assert.False(result.IsValid);
        Assert.Equal("DUPLICATE_COURSE", result.ErrorType);
    }
}
