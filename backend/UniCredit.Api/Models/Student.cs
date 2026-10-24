using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UniCredit.Api.Models;

[BsonIgnoreExtraElements]
public class CompletedCourse
{
    [BsonElement("courseCode")]
    public string CourseCode { get; set; } = string.Empty;

    [BsonElement("courseName")]
    public string CourseName { get; set; } = string.Empty;

    [BsonElement("credits")]
    public int Credits { get; set; }

    [BsonElement("grade")]
    public string Grade { get; set; } = string.Empty;

    [BsonElement("gradePoint")]
    public double GradePoint { get; set; }

    [BsonElement("isPassed")]
    public bool IsPassed { get; set; }

    [BsonElement("semester")]
    public string Semester { get; set; } = string.Empty;
}

[BsonIgnoreExtraElements]
public class Student
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("studentCode")]
    public string StudentCode { get; set; } = string.Empty;

    [BsonElement("fullName")]
    public string FullName { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("major")]
    public string Major { get; set; } = string.Empty;

    [BsonElement("administrativeClass")]
    public string AdministrativeClass { get; set; } = string.Empty;

    [BsonElement("academicYear")]
    public int AcademicYear { get; set; } = 2021;

    [BsonElement("cpa")]
    public double Cpa { get; set; }

    [BsonElement("accumulatedCredits")]
    public int AccumulatedCredits { get; set; }

    [BsonElement("advisorName")]
    public string AdvisorName { get; set; } = "PGS.TS Nguyễn Mạnh Hùng";

    [BsonElement("completedCourses")]
    public List<CompletedCourse> CompletedCourses { get; set; } = new();

    [BsonElement("registeredClasses")]
    public List<string> RegisteredClasses { get; set; } = new();
}
