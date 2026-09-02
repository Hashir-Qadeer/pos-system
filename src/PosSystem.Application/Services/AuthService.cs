using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Application.DTOs;
using PosSystem.Application.Interfaces;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;

namespace PosSystem.Application.Services;

public class AuthService : IAuthService
{
	private readonly IUserRepository _userRepository;
	private readonly IPasswordHasher _passwordHasher;
	private readonly IJwtTokenGenerator _jwtTokenGenerator;

	public AuthService(
		IUserRepository userRepository,
		IPasswordHasher passwordHasher,
		IJwtTokenGenerator jwtTokenGenerator)
	{
		_userRepository = userRepository;
		_passwordHasher = passwordHasher;
		_jwtTokenGenerator = jwtTokenGenerator;
	}

	public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
	{
		if (await _userRepository.EmailExistsAsync(dto.Email))
			return null;

		var user = new User
		{
			Name = dto.Name,
			Email = dto.Email,
			PasswordHash = _passwordHasher.Hash(dto.Password),
			Role = dto.Role,
			CreatedAt = DateTime.UtcNow
		};

		await _userRepository.AddAsync(user);

		var token = _jwtTokenGenerator.GenerateToken(user);
		return new AuthResponseDto { UserId = user.Id, Token = token, Name = user.Name, Role = user.Role };
	}

	public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
	{
		var user = await _userRepository.GetByEmailAsync(dto.Email);
		if (user is null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
			return null;

		var token = _jwtTokenGenerator.GenerateToken(user);
		return new AuthResponseDto { UserId = user.Id, Token = token, Name = user.Name, Role = user.Role };
	}
}
