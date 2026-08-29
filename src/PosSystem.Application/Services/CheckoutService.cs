using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PosSystem.Application.Interfaces;
using PosSystem.Application.DTOs;
using PosSystem.Application.Interfaces;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Application.Services;

public class CheckoutService : ICheckoutService
{
	private readonly IProductRepository _productRepository;
	private readonly IOrderRepository _orderRepository;
	private readonly IInventoryLogRepository _inventoryLogRepository;
	private readonly IInventoryNotifier _inventoryNotifier;

	public CheckoutService(
		IProductRepository productRepository,
		IOrderRepository orderRepository,
		IInventoryLogRepository inventoryLogRepository,
		IInventoryNotifier inventoryNotifier)
	{
		_productRepository = productRepository;
		_orderRepository = orderRepository;
		_inventoryLogRepository = inventoryLogRepository;
		_inventoryNotifier = inventoryNotifier;
	}

	public async Task<OrderResponseDto?> CheckoutAsync(CreateOrderDto dto)
	{
		if (dto.Items is null || dto.Items.Count == 0)
			return null;

		// Validate every line BEFORE touching anything — no partial state on failure
		var validatedItems = new List<(Product Product, int Quantity)>();

		foreach (var item in dto.Items)
		{
			var product = await _productRepository.GetByIdAsync(item.ProductId);
			if (product is null || product.StockQty < item.Quantity)
				return null;

			validatedItems.Add((product, item.Quantity));
		}

		var order = new Order
		{
			CashierId = dto.CashierId,
			CustomerId = dto.CustomerId,
			Status = "Completed",
			CreatedAt = DateTime.UtcNow
		};

		decimal total = 0;

		foreach (var (product, quantity) in validatedItems)
		{
			var subtotal = product.Price * quantity;
			total += subtotal;

			order.OrderItems.Add(new OrderItem
			{
				ProductId = product.Id,
				Quantity = quantity,
				UnitPrice = product.Price
			});

			product.StockQty -= quantity;
			await _productRepository.UpdateAsync(product);

			await _inventoryLogRepository.AddAsync(new InventoryLog
			{
				ProductId = product.Id,
				ChangeQty = -quantity,
				Reason = "Sale",
				Timestamp = DateTime.UtcNow
			});
			if (product.StockQty <= product.ReorderLevel)
			{
				await _inventoryNotifier.NotifyLowStockAsync(
					product.Id, product.Name, product.StockQty, product.ReorderLevel);
			}
		}

		order.TotalAmount = total;
		var createdOrder = await _orderRepository.CreateAsync(order);

		return new OrderResponseDto
		{
			Id = createdOrder.Id,
			TotalAmount = createdOrder.TotalAmount,
			Status = createdOrder.Status,
			CreatedAt = createdOrder.CreatedAt,
			Items = validatedItems.Select(vi => new OrderItemResponseDto
			{
				ProductId = vi.Product.Id,
				ProductName = vi.Product.Name,
				Quantity = vi.Quantity,
				UnitPrice = vi.Product.Price,
				Subtotal = vi.Product.Price * vi.Quantity
			}).ToList()
		};
	}
}
