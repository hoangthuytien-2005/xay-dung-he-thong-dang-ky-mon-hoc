using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UniCredit.Api.Models;

public class RegistrationPeriod
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("periodId")]
    public string PeriodId { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("academicYear")]
    public string AcademicYear { get; set; } = string.Empty;

    [BsonElement("semester")]
    public int Semester { get; set; }

    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }

    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }

    [BsonElement("minCredits")]
    public int MinCredits { get; set; } = 10;

    [BsonElement("maxCredits")]
    public int MaxCredits { get; set; } = 24;

    [BsonElement("targetBatches")]
    public List<string> TargetBatches { get; set; } = new();

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
}
