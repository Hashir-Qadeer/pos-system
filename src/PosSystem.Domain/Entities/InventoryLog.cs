using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Domain.Entities;

public class InventoryLog
{
	public int Id { get; set; }
	public int ChangeQty { get; set; }
	public string Reason { get; set; } = string.Empty; // "Sale", "Restock", "Correction"
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;

	public int ProductId { get; set; }
	public Product Product { get; set; } = null!;
}
