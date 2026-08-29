using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace PosSystem.Application.Interfaces;

public interface IInventoryNotifier
{
	Task NotifyLowStockAsync(int productId, string productName, int currentStock, int reorderLevel);
}
