using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;

namespace PosSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class OrdersController : ControllerBase
{
	private readonly ICheckoutService _checkoutService;

	public OrdersController(ICheckoutService checkoutService)
	{
		_checkoutService = checkoutService;
	}

	[HttpPost("checkout")]
	public async Task<IActionResult> Checkout(CreateOrderDto dto)
	{
		var result = await _checkoutService.CheckoutAsync(dto);
		if (result is null)
			return BadRequest("Cart is empty, or one or more items have insufficient stock.");

		return Ok(result);
	}
}
