using Microsoft.EntityFrameworkCore;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;
using PosSystem.Infrastructure.Persistence;

namespace PosSystem.Infrastructure.Services;

public class DashboardService : IDashboardService
{
	private readonly AppDbContext _context;

	public DashboardService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<DashboardSummaryDto> GetSummaryAsync()
	{
		var todayStart = DateTime.UtcNow.Date;

		var todaysOrders = await _context.Orders
			.Where(o => o.CreatedAt >= todayStart && o.Status == "Completed")
			.ToListAsync();

		var lowStockCount = await _context.Products
			.CountAsync(p => p.IsActive && p.StockQty <= p.ReorderLevel);

		var topProducts = await _context.OrderItems
			.Include(oi => oi.Product)
			.GroupBy(oi => oi.Product.Name)
			.Select(g => new TopProductDto { Name = g.Key, UnitsSold = g.Sum(oi => oi.Quantity) })
			.OrderByDescending(p => p.UnitsSold)
			.Take(5)
			.ToListAsync();

		var recentOrders = await _context.Orders
			.OrderByDescending(o => o.CreatedAt)
			.Take(5)
			.Select(o => new RecentOrderDto { Id = o.Id, TotalAmount = o.TotalAmount, CreatedAt = o.CreatedAt })
			.ToListAsync();

		return new DashboardSummaryDto
		{
			TodaysSales = todaysOrders.Sum(o => o.TotalAmount),
			TodaysOrderCount = todaysOrders.Count,
			LowStockCount = lowStockCount,
			TopProducts = topProducts,
			RecentOrders = recentOrders
		};
	}
}