using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Domain.Entities;

public class Product
{
	public int Id { get; set; }
	public string Sku { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public decimal Price { get; set; }
	public int StockQty { get; set; }
	public int ReorderLevel { get; set; }
	public bool IsActive { get; set; } = true;
	public DateTime? DeletedAt { get; set; }

	public int CategoryId { get; set; }
	public Category Category { get; set; } = null!;

	public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
	public ICollection<InventoryLog> InventoryLogs { get; set; } = new List<InventoryLog>();
}