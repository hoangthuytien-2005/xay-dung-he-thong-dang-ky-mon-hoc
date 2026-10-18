using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassesController : ControllerBase
{
    private readonly IRegistrationService _service;

    public ClassesController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CourseClass>>>> GetClasses(
        [FromQuery] string periodId = "2024-2025-HK1",
        [FromQuery] string? courseCode = null)
    {
        var classes = await _service.GetAllClassesAsync(periodId);

        if (!string.IsNullOrWhiteSpace(courseCode))
        {
            classes = classes.Where(c => c.CourseCode.Equals(courseCode, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Ok(ApiResponse<List<CourseClass>>.Ok(classes));
    }
}
