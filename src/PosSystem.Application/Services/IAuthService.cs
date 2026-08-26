using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PosSystem.Application.DTOs;

namespace PosSystem.Application.Services;

public interface IAuthService
{
	Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
	Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}