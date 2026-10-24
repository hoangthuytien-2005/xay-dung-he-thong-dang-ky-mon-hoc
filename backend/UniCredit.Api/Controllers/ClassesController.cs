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

    [HttpPatch]
    public async Task<ActionResult<ApiResponse<CourseClass>>> UpdateClass([FromBody] UpdateClassRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ClassCode))
            return BadRequest(ApiResponse<CourseClass>.Fail("Mã lớp học phần không được để trống."));

        if (request.Action.Equals("attendance", StringComparison.OrdinalIgnoreCase) && request.AttendanceRecords != null)
        {
            var result = await _service.SaveClassAttendanceAsync(request.ClassCode, request.AttendanceRecords);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        if (request.Action.Equals("schedule", StringComparison.OrdinalIgnoreCase) &&
            request.DayOfWeek.HasValue && request.StartPeriod.HasValue &&
            request.PeriodCount.HasValue && !string.IsNullOrWhiteSpace(request.Room))
        {
            var result = await _service.UpdateClassScheduleAsync(
                request.ClassCode,
                request.DayOfWeek.Value,
                request.StartPeriod.Value,
                request.PeriodCount.Value,
                request.Room);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        return BadRequest(ApiResponse<CourseClass>.Fail("Yêu cầu cập nhật lớp học phần không hợp lệ."));
    }
}
