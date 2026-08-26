using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
	private readonly AppDbContext _context;

	public ProductRepository(AppDbContext context)
	{
		_context = context;
	}

	public async Task<Product?> GetByIdAsync(int id) =>
		await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

	public async Task<Product?> GetBySkuAsync(string sku) =>
		await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Sku == sku);

	public async Task<bool> SkuExistsAsync(string sku) =>
		await _context.Products.AnyAsync(p => p.Sku == sku);

	public async Task<List<Product>> GetAllActiveAsync() =>
		await _context.Products.Include(p => p.Category).Where(p => p.IsActive).ToListAsync();

	public async Task AddAsync(Product product)
	{
		_context.Products.Add(product);
		await _context.SaveChangesAsync();
	}

	public async Task UpdateAsync(Product product)
	{
		_context.Products.Update(product);
		await _context.SaveChangesAsync();
	}
}
