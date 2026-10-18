using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Models;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeriodsController : ControllerBase
{
    private readonly IRegistrationService _service;

    public PeriodsController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<RegistrationPeriod>>> GetActivePeriod()
    {
        var period = await _service.GetActivePeriodAsync();
        return Ok(ApiResponse<RegistrationPeriod>.Ok(period));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> UpdatePeriodConfig([FromBody] PeriodConfigRequest request)
    {
        var result = await _service.UpdatePeriodConfigAsync(request.MinCredits, request.MaxCredits, request.IsActive);
        return Ok(result);
    }
}
