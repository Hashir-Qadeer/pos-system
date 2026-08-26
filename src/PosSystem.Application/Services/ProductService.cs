using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PosSystem.Application.DTOs;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Application.Services;

public class ProductService : IProductService
{
	private readonly IProductRepository _productRepository;
	private readonly ICategoryRepository _categoryRepository;

	public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
	{
		_productRepository = productRepository;
		_categoryRepository = categoryRepository;
	}

	public async Task<ProductDto?> CreateAsync(CreateProductDto dto)
	{
		if (await _productRepository.SkuExistsAsync(dto.Sku))
			return null;

		var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
		if (category is null)
			return null;

		var product = new Product
		{
			Sku = dto.Sku,
			Name = dto.Name,
			Price = dto.Price,
			StockQty = dto.StockQty,
			ReorderLevel = dto.ReorderLevel,
			CategoryId = dto.CategoryId,
			IsActive = true
		};

		await _productRepository.AddAsync(product);

		return new ProductDto
		{
			Id = product.Id,
			Sku = product.Sku,
			Name = product.Name,
			Price = product.Price,
			StockQty = product.StockQty,
			ReorderLevel = product.ReorderLevel,
			CategoryId = product.CategoryId,
			CategoryName = category.Name
		};
	}

	public async Task<bool> ReduceStockAsync(int productId, int quantity)
	{
		var product = await _productRepository.GetByIdAsync(productId);
		if (product is null || product.StockQty < quantity)
			return false;

		product.StockQty -= quantity;
		await _productRepository.UpdateAsync(product);
		return true;
	}

	public async Task<List<ProductDto>> GetAllAsync()
	{
		var products = await _productRepository.GetAllActiveAsync();
		return products.Select(p => new ProductDto
		{
			Id = p.Id,
			Sku = p.Sku,
			Name = p.Name,
			Price = p.Price,
			StockQty = p.StockQty,
			ReorderLevel = p.ReorderLevel,
			CategoryId = p.CategoryId,
			CategoryName = p.Category?.Name ?? string.Empty
		}).ToList();
	}

	public async Task<bool> SoftDeleteAsync(int productId)
	{
		var product = await _productRepository.GetByIdAsync(productId);
		if (product is null)
			return false;

		product.IsActive = false;
		product.DeletedAt = DateTime.UtcNow;
		await _productRepository.UpdateAsync(product);
		return true;
	}
}
