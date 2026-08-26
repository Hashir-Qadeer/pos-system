using Moq;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;
using Xunit;

namespace PosSystem.UnitTests.Services;

public class ProductServiceTests
{
	private readonly Mock<IProductRepository> _productRepoMock = new();
	private readonly Mock<ICategoryRepository> _categoryRepoMock = new();
	private readonly ProductService _sut; // "system under test"

	public ProductServiceTests()
	{
		_sut = new ProductService(_productRepoMock.Object, _categoryRepoMock.Object);
	}

	[Fact]
	public async Task CreateAsync_WithDuplicateSku_ReturnsNull()
	{
		// Arrange
		var dto = new CreateProductDto { Sku = "SKU-001", Name = "Test Product", Price = 10, CategoryId = 1 };
		_productRepoMock.Setup(r => r.SkuExistsAsync(dto.Sku)).ReturnsAsync(true);

		// Act
		var result = await _sut.CreateAsync(dto);

		// Assert
		Assert.Null(result);
		_productRepoMock.Verify(r => r.AddAsync(It.IsAny<Product>()), Times.Never);
	}

	[Fact]
	public async Task CreateAsync_WithNewSku_ReturnsProductDto()
	{
		// Arrange
		var dto = new CreateProductDto { Sku = "SKU-002", Name = "New Product", Price = 25, CategoryId = 1 };
		_productRepoMock.Setup(r => r.SkuExistsAsync(dto.Sku)).ReturnsAsync(false);
		_categoryRepoMock.Setup(r => r.GetByIdAsync(dto.CategoryId))
			.ReturnsAsync(new Category { Id = 1, Name = "Beverages" });

		// Act
		var result = await _sut.CreateAsync(dto);

		// Assert
		Assert.NotNull(result);
		Assert.Equal(dto.Sku, result!.Sku);
		_productRepoMock.Verify(r => r.AddAsync(It.IsAny<Product>()), Times.Once);
	}

	[Fact]
	public async Task ReduceStockAsync_WhenQuantityExceedsStock_ReturnsFalse()
	{
		// Arrange
		var product = new Product { Id = 1, StockQty = 5 };
		_productRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

		// Act
		var result = await _sut.ReduceStockAsync(productId: 1, quantity: 10);

		// Assert
		Assert.False(result);
		_productRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Never);
	}
}