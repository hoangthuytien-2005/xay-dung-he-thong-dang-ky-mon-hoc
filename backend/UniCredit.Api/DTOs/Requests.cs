namespace UniCredit.Api.DTOs;

public class RegisterRequest
{
    public string StudentCode { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
}

public class DropRequest
{
    public string StudentCode { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
}

public class PeriodConfigRequest
{
    public int MinCredits { get; set; } = 10;
    public int MaxCredits { get; set; } = 24;
    public bool IsActive { get; set; } = true;
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "student"; // "student" or "lecturer"
}

public class LoginResponse
{
    public string Role { get; set; } = "student";
    public Models.Student? Student { get; set; }
    public Models.Lecturer? Lecturer { get; set; }
    public string Token { get; set; } = string.Empty;
}
