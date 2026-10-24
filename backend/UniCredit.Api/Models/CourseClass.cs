using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UniCredit.Api.Models;

[BsonIgnoreExtraElements]
public class AttendanceEntry
{
    [BsonElement("studentCode")]
    public string StudentCode { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "PRESENT"; // PRESENT, ABSENT, EXCUSED, LATE

    [BsonElement("note")]
    public string? Note { get; set; }

    [BsonElement("updatedAt")]
    public string? UpdatedAt { get; set; }
}

[BsonIgnoreExtraElements]
public class CourseClass
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("classCode")]
    public string ClassCode { get; set; } = string.Empty;

    [BsonElement("courseCode")]
    public string CourseCode { get; set; } = string.Empty;

    [BsonElement("courseName")]
    public string CourseName { get; set; } = string.Empty;

    [BsonElement("credits")]
    public int Credits { get; set; }

    [BsonElement("periodId")]
    public string PeriodId { get; set; } = string.Empty;

    [BsonElement("dayOfWeek")]
    public int DayOfWeek { get; set; } // 2 (Thứ Hai) đến 8 (Chủ Nhật)

    [BsonElement("startPeriod")]
    public int StartPeriod { get; set; } // 1..12

    [BsonElement("periodCount")]
    public int PeriodCount { get; set; } // 2, 3, 4

    [BsonElement("room")]
    public string Room { get; set; } = string.Empty;

    [BsonElement("lecturer")]
    public string Lecturer { get; set; } = string.Empty;

    [BsonElement("maxSlots")]
    public int MaxSlots { get; set; } = 60;

    [BsonElement("currentSlots")]
    public int CurrentSlots { get; set; } = 0;

    [BsonElement("registeredStudents")]
    public List<string> RegisteredStudents { get; set; } = new();

    [BsonElement("attendanceRecords")]
    public List<AttendanceEntry> AttendanceRecords { get; set; } = new();

    [BsonElement("tuitionPerCredit")]
    public decimal TuitionPerCredit { get; set; } = 450000;
}
