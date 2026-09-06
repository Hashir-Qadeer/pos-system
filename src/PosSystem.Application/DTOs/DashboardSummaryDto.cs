namespace PosSystem.Application.DTOs;

public class DashboardSummaryDto
{
	public decimal TodaysSales { get; set; }
	public int TodaysOrderCount { get; set; }
	public int LowStockCount { get; set; }
	public List<TopProductDto> TopProducts { get; set; } = new();
	public List<RecentOrderDto> RecentOrders { get; set; } = new();
}

public class TopProductDto
{
	public string Name { get; set; } = string.Empty;
	public int UnitsSold { get; set; }
}

public class RecentOrderDto
{
	public int Id { get; set; }
	public decimal TotalAmount { get; set; }
	public DateTime CreatedAt { get; set; }
}
