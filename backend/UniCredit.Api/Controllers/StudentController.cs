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
    public async Task<IActionResult> GetCurrentStudent(
        [FromQuery] string code = "B21DCCN001",
        [FromQuery] bool all = false)
    {
        if (all)
        {
            var students = await _service.GetAllStudentsAsync();
            return Ok(ApiResponse<List<Student>>.Ok(students));
        }

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

    [HttpPatch]
    public async Task<ActionResult<ApiResponse<Student>>> UpdateStatus([FromBody] UpdateStudentStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.StudentCode) || string.IsNullOrWhiteSpace(request.AcademicStatus))
            return BadRequest(ApiResponse<Student>.Fail("Thiếu mã sinh viên hoặc trạng thái học vụ."));

        var result = await _service.UpdateStudentStatusAsync(request.StudentCode, request.AcademicStatus);
        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}
