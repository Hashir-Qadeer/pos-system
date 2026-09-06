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
public class ProductsController : ControllerBase
{
	private readonly IProductService _productService;

	public ProductsController(IProductService productService)
	{
		_productService = productService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var products = await _productService.GetAllAsync();
		return Ok(products);
	}

	[HttpPost]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Create(CreateProductDto dto)
	{
		var result = await _productService.CreateAsync(dto);
		if (result is null)
			return Conflict("SKU already exists or category is invalid.");

		return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
	}

	[HttpPost("{id}/reduce-stock")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> ReduceStock(int id, [FromBody] int quantity)
	{
		var success = await _productService.ReduceStockAsync(id, quantity);
		if (!success)
			return BadRequest("Insufficient stock or product not found.");

		return NoContent();
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Delete(int id)
	{
		var success = await _productService.SoftDeleteAsync(id);
		if (!success)
			return NotFound();

		return NoContent();
	}
}  