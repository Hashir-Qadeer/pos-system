using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;
using Microsoft.AspNetCore.Authorization;
namespace PosSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
	private readonly IAuthService _authService;

	public AuthController(IAuthService authService)
	{
		_authService = authService;
	}

	[HttpPost("register")]
	[Authorize(Roles = "Admin")]

	public async Task<IActionResult> Register(RegisterDto dto)
	{
		var result = await _authService.RegisterAsync(dto);
		if (result is null)
			return Conflict("Email already registered.");

		return Ok(result);
	}

	[HttpPost("login")]
	public async Task<IActionResult> Login(LoginDto dto)
	{
		var result = await _authService.LoginAsync(dto);
		if (result is null)
			return Unauthorized("Invalid email or password.");

		return Ok(result);
	}
}