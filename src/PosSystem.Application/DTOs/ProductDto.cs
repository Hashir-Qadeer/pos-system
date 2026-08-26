using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Application.DTOs;

public class ProductDto
{
	public int Id { get; set; }
	public string Sku { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public decimal Price { get; set; }
	public int StockQty { get; set; }
	public int ReorderLevel { get; set; }
	public int CategoryId { get; set; }
	public string CategoryName { get; set; } = string.Empty;
}
