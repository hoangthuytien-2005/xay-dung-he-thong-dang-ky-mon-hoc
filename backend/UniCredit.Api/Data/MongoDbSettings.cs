namespace UniCredit.Api.Data;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://127.0.0.1:27017";
    public string DatabaseName { get; set; } = "unicredit_db";
}
