using System.Text.Json;
using UniCredit.Api.Data;
using UniCredit.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with JSON camelCase configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// 2. Configure MongoDB Settings
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddSingleton<IMongoDbContext, MongoDbContext>();

// 3. Register Business Logic Services
builder.Services.AddSingleton<IRegistrationValidationService, RegistrationValidationService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();

// 4. Configure CORS for Frontend Next.js (port 3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo
    {
        Title = "UniCredit SIS Portal API",
        Version = "v1",
        Description = "Cổng Backend API Đăng ký Tín chỉ & Quản lý Học vụ (C# ASP.NET Core & MongoDB)"
    });
});

var app = builder.Build();

// 6. Automatic Seed on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<IMongoDbContext>();
    await DbSeeder.SeedAsync(context);
}

// 7. Configure Pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniCredit SIS Portal API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Health check root
app.MapGet("/", () => Results.Ok(new
{
    service = "UniCredit Course Registration API",
    version = "1.0.0",
    framework = ".NET 10.0 / C#",
    database = "MongoDB",
    swagger = "/swagger"
}));

app.Run();
