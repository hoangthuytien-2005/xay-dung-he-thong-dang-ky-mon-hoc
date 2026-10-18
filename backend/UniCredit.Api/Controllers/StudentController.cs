using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IRegistrationService _service;

    public StudentController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<Student>>> GetCurrentStudent([FromQuery] string code = "B21DCCN001")
    {
        var student = await _service.GetStudentProfileAsync(code);
        if (student == null)
            return NotFound(ApiResponse<Student>.Fail("Không tìm thấy thông tin sinh viên."));

        return Ok(ApiResponse<Student>.Ok(student));
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<ApiResponse<Student>>> GetByCode(string code)
    {
        var student = await _service.GetStudentProfileAsync(code);
        if (student == null)
            return NotFound(ApiResponse<Student>.Fail("Không tìm thấy thông tin sinh viên."));

        return Ok(ApiResponse<Student>.Ok(student));
    }
}
