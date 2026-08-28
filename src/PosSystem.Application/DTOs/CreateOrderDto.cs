using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Application.DTOs;

public class CreateOrderDto
{
	public int CashierId { get; set; }
	public int? CustomerId { get; set; }
	public List<OrderItemRequestDto> Items { get; set; } = new();
}
