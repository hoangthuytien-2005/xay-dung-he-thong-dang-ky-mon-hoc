using Microsoft.AspNetCore.Mvc;
using UniCredit.Api.DTOs;
using UniCredit.Api.Services;

namespace UniCredit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly IRegistrationService _service;

    public SeedController(IRegistrationService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> ReSeed()
    {
        var result = await _service.ReSeedAsync();
        return Ok(result);
    }
}
