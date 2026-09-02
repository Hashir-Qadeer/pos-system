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
public class CategoriesController : ControllerBase
{
	private readonly ICategoryService _categoryService;

	public CategoriesController(ICategoryService categoryService)
	{
		_categoryService = categoryService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var categories = await _categoryService.GetAllAsync();
		return Ok(categories);
	}

	[HttpPost]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Create(CreateCategoryDto dto)
	{
		var result = await _categoryService.CreateAsync(dto);
		if (result is null)
			return Conflict("Category name already exists.");

		return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Delete(int id)
	{
		var success = await _categoryService.DeleteAsync(id);
		if (!success)
			return BadRequest("Category not found or still has active products.");

		return NoContent();
	}
}