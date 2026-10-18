using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IRegistrationService _service;

    public AuthController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
            return BadRequest(ApiResponse<LoginResponse>.Fail("Tên đăng nhập không được để trống."));

        if (request.Role.Equals("lecturer", StringComparison.OrdinalIgnoreCase))
        {
            var lecturer = await _service.GetLecturerAsync(request.Username);
            if (lecturer == null)
            {
                // Fallback default lecturer
                var list = await _service.GetAllLecturersAsync();
                lecturer = list.FirstOrDefault();
            }

            return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse
            {
                Role = "lecturer",
                Lecturer = lecturer,
                Token = $"token_lecturer_{request.Username}_{Guid.NewGuid():N}"
            }, "Đăng nhập Giảng viên thành công."));
        }
        else
        {
            var student = await _service.GetStudentProfileAsync(request.Username.ToUpper());
            if (student == null)
            {
                student = await _service.GetStudentProfileAsync("B21DCCN001");
            }

            return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse
            {
                Role = "student",
                Student = student,
                Token = $"token_student_{request.Username}_{Guid.NewGuid():N}"
            }, "Đăng nhập Sinh viên thành công."));
        }
    }
}
