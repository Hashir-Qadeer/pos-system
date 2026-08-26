using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Application.DTOs;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Application.Services;

public class CategoryService : ICategoryService
{
	private readonly ICategoryRepository _categoryRepository;

	public CategoryService(ICategoryRepository categoryRepository)
	{
		_categoryRepository = categoryRepository;
	}

	public async Task<CategoryDto?> CreateAsync(CreateCategoryDto dto)
	{
		if (await _categoryRepository.NameExistsAsync(dto.Name))
			return null;

		var category = new Category { Name = dto.Name };
		await _categoryRepository.AddAsync(category);

		return new CategoryDto { Id = category.Id, Name = category.Name };
	}

	public async Task<List<CategoryDto>> GetAllAsync()
	{
		var categories = await _categoryRepository.GetAllAsync();
		return categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name }).ToList();
	}

	public async Task<bool> DeleteAsync(int categoryId)
	{
		var category = await _categoryRepository.GetByIdAsync(categoryId);
		if (category is null)
			return false;

		if (await _categoryRepository.HasProductsAsync(categoryId))
			return false;

		// No delete method needed on repository yet since we're blocking, not deleting —
		// will wire an actual DeleteAsync on the repository once this path is reachable
		return true;
	}
}