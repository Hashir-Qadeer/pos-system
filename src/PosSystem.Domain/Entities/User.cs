using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Domain.Entities;

public class User
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string PasswordHash { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty; // "Admin", "Manager", "Cashier"
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	public ICollection<Order> Orders { get; set; } = new List<Order>();
}
