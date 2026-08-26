using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PosSystem.Application.DTOs;

public class AuthResponseDto
{
	public string Token { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
}
