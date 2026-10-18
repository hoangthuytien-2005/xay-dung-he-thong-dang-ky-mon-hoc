using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationController : ControllerBase
{
    private readonly IRegistrationService _service;

    public RegistrationController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Student>>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ClassCode))
            return BadRequest(ApiResponse<Student>.Fail("Mã lớp học phần không được để trống."));

        var studentCode = string.IsNullOrWhiteSpace(request.StudentCode) ? "B21DCCN001" : request.StudentCode;
        var result = await _service.RegisterClassAsync(studentCode, request.ClassCode);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<Student>>> Drop([FromBody] DropRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ClassCode))
            return BadRequest(ApiResponse<Student>.Fail("Mã lớp học phần không được để trống."));

        var studentCode = string.IsNullOrWhiteSpace(request.StudentCode) ? "B21DCCN001" : request.StudentCode;
        var result = await _service.DropClassAsync(studentCode, request.ClassCode);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("my-classes")]
    public async Task<ActionResult<ApiResponse<List<CourseClass>>>> GetMyClasses([FromQuery] string studentCode = "B21DCCN001")
    {
        var student = await _service.GetStudentProfileAsync(studentCode);
        if (student == null)
            return NotFound(ApiResponse<List<CourseClass>>.Fail("Không tìm thấy sinh viên."));

        var period = await _service.GetActivePeriodAsync();
        var allClasses = await _service.GetAllClassesAsync(period.PeriodId);
        var myClasses = allClasses.Where(c => student.RegisteredClasses.Contains(c.ClassCode)).ToList();

        return Ok(ApiResponse<List<CourseClass>>.Ok(myClasses));
    }
}
