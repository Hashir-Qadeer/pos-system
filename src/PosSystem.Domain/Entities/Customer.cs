using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Domain.Entities;

public class Customer
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? Phone { get; set; }
	public int LoyaltyPoints { get; set; }

	public ICollection<Order> Orders { get; set; } = new List<Order>();
}
