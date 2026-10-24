using UniCredit.Api.Models;

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

public class UpdateStudentStatusRequest
{
    public string StudentCode { get; set; } = string.Empty;
    public string AcademicStatus { get; set; } = "ACTIVE"; // ACTIVE, RESERVED, DROPPED_OUT
}

public class UpdateClassRequest
{
    public string Action { get; set; } = string.Empty; // "attendance" or "schedule"
    public string ClassCode { get; set; } = string.Empty;
    public List<AttendanceEntry>? AttendanceRecords { get; set; }
    public int? DayOfWeek { get; set; }
    public int? StartPeriod { get; set; }
    public int? PeriodCount { get; set; }
    public string? Room { get; set; }
}

public class AdminProfileDto
{
    public string AdminCode { get; set; } = "ADMIN01";
    public string FullName { get; set; } = "ThS. Nguyễn Văn Quản Trị";
    public string Title { get; set; } = "Chuyên viên Quản lý Đào tạo";
    public string Department { get; set; } = "Phòng Giáo vụ & Đào tạo Đại học PTIT";
    public string Email { get; set; } = "giaovu@unicredit.edu.vn";
    public string Phone { get; set; } = "024.3756.2186";
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "student"; // "student", "lecturer", "admin"
}

public class LoginResponse
{
    public string Role { get; set; } = "student";
    public Student? Student { get; set; }
    public Lecturer? Lecturer { get; set; }
    public AdminProfileDto? Admin { get; set; }
    public string Token { get; set; } = string.Empty;
}
