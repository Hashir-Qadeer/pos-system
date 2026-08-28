using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Infrastructure.Persistence.Repositories;

public class InventoryLogRepository : IInventoryLogRepository
{
	private readonly AppDbContext _context;

	public InventoryLogRepository(AppDbContext context)
	{
		_context = context;
	}

	public async Task AddAsync(InventoryLog log)
	{
		_context.InventoryLogs.Add(log);
		await _context.SaveChangesAsync();
	}
}
