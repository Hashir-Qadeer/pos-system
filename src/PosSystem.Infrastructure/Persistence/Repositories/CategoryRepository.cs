using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Infrastructure.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
	private readonly AppDbContext _context;

	public CategoryRepository(AppDbContext context)
	{
		_context = context;
	}

	public async Task<Category?> GetByIdAsync(int id) =>
		await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

	public async Task<bool> NameExistsAsync(string name) =>
		await _context.Categories.AnyAsync(c => c.Name == name);

	public async Task<bool> HasProductsAsync(int categoryId) =>
		await _context.Products.AnyAsync(p => p.CategoryId == categoryId && p.IsActive);

	public async Task<List<Category>> GetAllAsync() =>
		await _context.Categories.ToListAsync();

	public async Task AddAsync(Category category)
	{
		_context.Categories.Add(category);
		await _context.SaveChangesAsync();
	}
}