using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Application.DTOs;

namespace PosSystem.Application.Services;

public interface ICategoryService
{
	Task<CategoryDto?> CreateAsync(CreateCategoryDto dto);
	Task<List<CategoryDto>> GetAllAsync();
	Task<bool> DeleteAsync(int categoryId);
}
