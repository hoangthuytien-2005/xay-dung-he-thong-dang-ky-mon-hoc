using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LecturersController : ControllerBase
{
    private readonly IRegistrationService _service;

    public LecturersController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Lecturer>>>> GetAll()
    {
        var list = await _service.GetAllLecturersAsync();
        return Ok(ApiResponse<List<Lecturer>>.Ok(list));
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<ApiResponse<Lecturer>>> GetByCode(string code)
    {
        var lecturer = await _service.GetLecturerAsync(code);
        if (lecturer == null)
            return NotFound(ApiResponse<Lecturer>.Fail("Không tìm thấy giảng viên."));

        return Ok(ApiResponse<Lecturer>.Ok(lecturer));
    }

    [HttpGet("{code}/classes")]
    public async Task<ActionResult<ApiResponse<List<CourseClass>>>> GetTeachingClasses(string code)
    {
        var lecturer = await _service.GetLecturerAsync(code);
        if (lecturer == null)
            return NotFound(ApiResponse<List<CourseClass>>.Fail("Không tìm thấy giảng viên."));

        var period = await _service.GetActivePeriodAsync();
        var allClasses = await _service.GetAllClassesAsync(period.PeriodId);
        var myClasses = allClasses.Where(c =>
            c.Lecturer.Contains(lecturer.FullName) ||
            lecturer.TeachingClassCodes.Contains(c.ClassCode)
        ).ToList();

        return Ok(ApiResponse<List<CourseClass>>.Ok(myClasses));
    }
}
