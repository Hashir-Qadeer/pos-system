using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Domain.Entities;

namespace PosSystem.Domain.Interfaces;

public interface ICategoryRepository
{
	Task<Category?> GetByIdAsync(int id);
	Task<bool> NameExistsAsync(string name);
	Task<bool> HasProductsAsync(int categoryId);
	Task<List<Category>> GetAllAsync();
	Task AddAsync(Category category);
}
