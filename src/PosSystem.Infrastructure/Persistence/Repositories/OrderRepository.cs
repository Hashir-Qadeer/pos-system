using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Infrastructure.Persistence.Repositories;

public class OrderRepository : IOrderRepository
{
	private readonly AppDbContext _context;

	public OrderRepository(AppDbContext context)
	{
		_context = context;
	}

	public async Task<Order> CreateAsync(Order order)
	{
		_context.Orders.Add(order);
		await _context.SaveChangesAsync();
		return order;
	}

	public async Task<Order?> GetByIdAsync(int id) =>
		await _context.Orders
			.Include(o => o.OrderItems)
			.ThenInclude(oi => oi.Product)
			.FirstOrDefaultAsync(o => o.Id == id);
}
