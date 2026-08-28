using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Moq;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;
using Xunit;

namespace PosSystem.UnitTests.Services;

public class CheckoutServiceTests
{
	private readonly Mock<IProductRepository> _productRepoMock = new();
	private readonly Mock<IOrderRepository> _orderRepoMock = new();
	private readonly Mock<IInventoryLogRepository> _inventoryLogRepoMock = new();
	private readonly CheckoutService _sut;

	public CheckoutServiceTests()
	{
		_sut = new CheckoutService(_productRepoMock.Object, _orderRepoMock.Object, _inventoryLogRepoMock.Object);
	}

	[Fact]
	public async Task CheckoutAsync_WithEmptyCart_ReturnsNull()
	{
		var dto = new CreateOrderDto { CashierId = 1, Items = new List<OrderItemRequestDto>() };

		var result = await _sut.CheckoutAsync(dto);

		Assert.Null(result);
		_orderRepoMock.Verify(r => r.CreateAsync(It.IsAny<Order>()), Times.Never);
	}

	[Fact]
	public async Task CheckoutAsync_WithInsufficientStock_ReturnsNullAndDoesNotReduceStock()
	{
		var dto = new CreateOrderDto
		{
			CashierId = 1,
			Items = new List<OrderItemRequestDto> { new() { ProductId = 1, Quantity = 10 } }
		};
		_productRepoMock.Setup(r => r.GetByIdAsync(1))
			.ReturnsAsync(new Product { Id = 1, Name = "Coke", Price = 70, StockQty = 3 });

		var result = await _sut.CheckoutAsync(dto);

		Assert.Null(result);
		_productRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Never);
		_orderRepoMock.Verify(r => r.CreateAsync(It.IsAny<Order>()), Times.Never);
	}

	[Fact]
	public async Task CheckoutAsync_WithValidCart_CreatesOrderAndReducesStock()
	{
		var dto = new CreateOrderDto
		{
			CashierId = 1,
			Items = new List<OrderItemRequestDto> { new() { ProductId = 1, Quantity = 2 } }
		};
		var product = new Product { Id = 1, Name = "Coke", Price = 70, StockQty = 5 };
		_productRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
		_orderRepoMock.Setup(r => r.CreateAsync(It.IsAny<Order>()))
			.ReturnsAsync((Order o) => o);

		var result = await _sut.CheckoutAsync(dto);

		Assert.NotNull(result);
		Assert.Equal(140, result!.TotalAmount); // 70 * 2
		_productRepoMock.Verify(r => r.UpdateAsync(It.Is<Product>(p => p.StockQty == 3)), Times.Once);
		_inventoryLogRepoMock.Verify(r => r.AddAsync(It.IsAny<InventoryLog>()), Times.Once);
		_orderRepoMock.Verify(r => r.CreateAsync(It.IsAny<Order>()), Times.Once);
	}
}
