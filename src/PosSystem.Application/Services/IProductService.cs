using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Application.DTOs;

namespace PosSystem.Application.Services;

public interface IProductService
{
	Task<ProductDto?> CreateAsync(CreateProductDto dto);
	Task<bool> ReduceStockAsync(int productId, int quantity);
	Task<List<ProductDto>> GetAllAsync();
	Task<bool> SoftDeleteAsync(int productId);
}
