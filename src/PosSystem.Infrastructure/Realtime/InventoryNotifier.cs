using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;
using PosSystem.Application.Interfaces;

namespace PosSystem.Infrastructure.Realtime;

public class InventoryNotifier : IInventoryNotifier
{
	private readonly IHubContext<InventoryHub> _hubContext;

	public InventoryNotifier(IHubContext<InventoryHub> hubContext)
	{
		_hubContext = hubContext;
	}

	public async Task NotifyLowStockAsync(int productId, string productName, int currentStock, int reorderLevel)
	{
		await _hubContext.Clients.All.SendAsync("LowStockAlert", new
		{
			productId,
			productName,
			currentStock,
			reorderLevel,
			timestamp = DateTime.UtcNow
		});
	}
}