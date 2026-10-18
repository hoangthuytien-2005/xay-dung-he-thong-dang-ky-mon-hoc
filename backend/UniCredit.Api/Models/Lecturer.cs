using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UniCredit.Api.Models;

public class Lecturer
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("lecturerCode")]
    public string LecturerCode { get; set; } = string.Empty;

    [BsonElement("fullName")]
    public string FullName { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("department")]
    public string Department { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("teachingClassCodes")]
    public List<string> TeachingClassCodes { get; set; } = new();
}
