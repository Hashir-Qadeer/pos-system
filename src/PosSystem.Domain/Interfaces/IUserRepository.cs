using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Domain.Entities;

namespace PosSystem.Domain.Interfaces;

public interface IUserRepository
{
	Task<User?> GetByEmailAsync(string email);
	Task AddAsync(User user);
	Task<bool> EmailExistsAsync(string email);
}