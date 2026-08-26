using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Domain.Entities;

namespace PosSystem.Domain.Interfaces;

public interface IProductRepository
{
	Task<Product?> GetByIdAsync(int id);
	Task<Product?> GetBySkuAsync(string sku);
	Task<bool> SkuExistsAsync(string sku);
	Task<List<Product>> GetAllActiveAsync();
	Task AddAsync(Product product);
	Task UpdateAsync(Product product);
}

