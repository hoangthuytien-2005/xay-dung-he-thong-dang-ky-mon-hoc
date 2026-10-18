using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UniCredit.Api.Models;

public class Course
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("code")]
    public string Code { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("credits")]
    public int Credits { get; set; }

    [BsonElement("theoryCredits")]
    public int TheoryCredits { get; set; } = 2;

    [BsonElement("practiceCredits")]
    public int PracticeCredits { get; set; } = 1;

    [BsonElement("department")]
    public string Department { get; set; } = string.Empty;

    [BsonElement("semesterProposal")]
    public int SemesterProposal { get; set; } = 1;

    [BsonElement("prerequisites")]
    public List<string> Prerequisites { get; set; } = new();

    [BsonElement("previousCourses")]
    public List<string> PreviousCourses { get; set; } = new();

    [BsonElement("corequisites")]
    public List<string> Corequisites { get; set; } = new();

    [BsonElement("description")]
    public string? Description { get; set; }
}
