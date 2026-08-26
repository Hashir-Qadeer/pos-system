using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;
using PosSystem.Infrastructure.Persistence;

namespace PosSystem.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
	private readonly AppDbContext _context;

	public UserRepository(AppDbContext context)
	{
		_context = context;
	}

	public async Task<User?> GetByEmailAsync(string email) =>
		await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

	public async Task AddAsync(User user)
	{
		_context.Users.Add(user);
		await _context.SaveChangesAsync();
	}

	public async Task<bool> EmailExistsAsync(string email) =>
		await _context.Users.AnyAsync(u => u.Email == email);
}
