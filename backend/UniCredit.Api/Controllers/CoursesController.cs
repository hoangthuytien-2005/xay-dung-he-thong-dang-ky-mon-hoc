using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly IRegistrationService _service;

    public CoursesController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Course>>>> GetCourses(
        [FromQuery] int? semester,
        [FromQuery] string? search)
    {
        var courses = await _service.GetAllCoursesAsync();

        if (semester.HasValue)
        {
            courses = courses.Where(c => c.SemesterProposal == semester.Value).ToList();
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            courses = courses.Where(c =>
                c.Name.ToLower().Contains(s) ||
                c.Code.ToLower().Contains(s) ||
                c.Department.ToLower().Contains(s)
            ).ToList();
        }

        return Ok(ApiResponse<List<Course>>.Ok(courses));
    }
}
