using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Application.DTOs;

public class OrderResponseDto
{
	public int Id { get; set; }
	public decimal TotalAmount { get; set; }
	public string Status { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; }
	public List<OrderItemResponseDto> Items { get; set; } = new();
}

public class OrderItemResponseDto
{
	public int ProductId { get; set; }
	public string ProductName { get; set; } = string.Empty;
	public int Quantity { get; set; }
	public decimal UnitPrice { get; set; }
	public decimal Subtotal { get; set; }
}
