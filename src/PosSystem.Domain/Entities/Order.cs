using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Domain.Entities;

public class Order
{
	public int Id { get; set; }
	public decimal TotalAmount { get; set; }
	public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled
	public string? PaymentMethod { get; set; }
	public decimal? AmountPaid { get; set; }
	public DateTime? PaidAt { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	public int CashierId { get; set; }
	public User Cashier { get; set; } = null!;

	public int? CustomerId { get; set; }
	public Customer? Customer { get; set; }

	public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
