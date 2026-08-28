using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Domain.Entities;

namespace PosSystem.Domain.Interfaces;

public interface IOrderRepository
{
	Task<Order> CreateAsync(Order order);
	Task<Order?> GetByIdAsync(int id);
}