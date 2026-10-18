using Microsoft.Extensions.Options;
using MongoDB.Driver;
using UniCredit.Api.Models;

namespace UniCredit.Api.Data;

public interface IMongoDbContext
{
    IMongoCollection<Student>? Students { get; }
    IMongoCollection<Course>? Courses { get; }
    IMongoCollection<CourseClass>? CourseClasses { get; }
    IMongoCollection<RegistrationPeriod>? RegistrationPeriods { get; }
    IMongoCollection<Lecturer>? Lecturers { get; }
    bool IsConnected { get; }

    // In-memory fallback stores
    List<Student> MemoryStudents { get; }
    List<Course> MemoryCourses { get; }
    List<CourseClass> MemoryClasses { get; }
    RegistrationPeriod MemoryPeriod { get; set; }
    List<Lecturer> MemoryLecturers { get; }
}

public class MongoDbContext : IMongoDbContext
{
    private readonly IMongoDatabase? _database;
    public bool IsConnected { get; private set; }

    public IMongoCollection<Student>? Students => _database?.GetCollection<Student>("Students");
    public IMongoCollection<Course>? Courses => _database?.GetCollection<Course>("Courses");
    public IMongoCollection<CourseClass>? CourseClasses => _database?.GetCollection<CourseClass>("CourseClasses");
    public IMongoCollection<RegistrationPeriod>? RegistrationPeriods => _database?.GetCollection<RegistrationPeriod>("RegistrationPeriods");
    public IMongoCollection<Lecturer>? Lecturers => _database?.GetCollection<Lecturer>("Lecturers");

    // Fallback Memory Stores
    public List<Student> MemoryStudents { get; } = new();
    public List<Course> MemoryCourses { get; } = new();
    public List<CourseClass> MemoryClasses { get; } = new();
    public RegistrationPeriod MemoryPeriod { get; set; } = new();
    public List<Lecturer> MemoryLecturers { get; } = new();

    public MongoDbContext(IOptions<MongoDbSettings> settings, ILogger<MongoDbContext> logger)
    {
        try
        {
            var mongoUrl = new MongoUrl(settings.Value.ConnectionString);
            var clientSettings = MongoClientSettings.FromUrl(mongoUrl);
            clientSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(2.5); // Quick check
            var client = new MongoClient(clientSettings);

            // Ping database
            _database = client.GetDatabase(settings.Value.DatabaseName);
            var isAlive = _database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}").Wait(2500);

            if (isAlive)
            {
                IsConnected = true;
                logger.LogInformation("✅ [C# Backend] Kết nối MongoDB thành công: {Database}", settings.Value.DatabaseName);
            }
            else
            {
                IsConnected = false;
                logger.LogWarning("⚠️ [C# Backend] Không thể kết nối MongoDB trong 2.5s. Đang kích hoạt In-Memory Repository Fallback.");
            }
        }
        catch (Exception ex)
        {
            IsConnected = false;
            logger.LogWarning("⚠️ [C# Backend] Lỗi kết nối MongoDB ({Message}). Đang kích hoạt In-Memory Repository Fallback.", ex.Message);
        }
    }
}
