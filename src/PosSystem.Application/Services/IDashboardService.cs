using PosSystem.Application.DTOs;

namespace PosSystem.Application.Services;

public interface IDashboardService
{
	Task<DashboardSummaryDto> GetSummaryAsync();
}
