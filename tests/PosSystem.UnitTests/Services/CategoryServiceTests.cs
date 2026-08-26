using Moq;
using PosSystem.Application.DTOs;
using PosSystem.Application.Services;
using PosSystem.Domain.Entities;
using PosSystem.Domain.Interfaces;
using Xunit;

namespace PosSystem.UnitTests.Services;

public class CategoryServiceTests
{
	private readonly Mock<ICategoryRepository> _categoryRepoMock = new();
	private readonly CategoryService _sut;

	public CategoryServiceTests()
	{
		_sut = new CategoryService(_categoryRepoMock.Object);
	}

	[Fact]
	public async Task CreateAsync_WithDuplicateName_ReturnsNull()
	{
		var dto = new CreateCategoryDto { Name = "Beverages" };
		_categoryRepoMock.Setup(r => r.NameExistsAsync(dto.Name)).ReturnsAsync(true);

		var result = await _sut.CreateAsync(dto);

		Assert.Null(result);
		_categoryRepoMock.Verify(r => r.AddAsync(It.IsAny<Category>()), Times.Never);
	}

	[Fact]
	public async Task CreateAsync_WithNewName_ReturnsCategoryDto()
	{
		var dto = new CreateCategoryDto { Name = "Snacks" };
		_categoryRepoMock.Setup(r => r.NameExistsAsync(dto.Name)).ReturnsAsync(false);

		var result = await _sut.CreateAsync(dto);

		Assert.NotNull(result);
		Assert.Equal(dto.Name, result!.Name);
		_categoryRepoMock.Verify(r => r.AddAsync(It.IsAny<Category>()), Times.Once);
	}

	[Fact]
	public async Task DeleteAsync_WhenCategoryHasProducts_ReturnsFalse()
	{
		_categoryRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Category { Id = 1, Name = "Beverages" });
		_categoryRepoMock.Setup(r => r.HasProductsAsync(1)).ReturnsAsync(true);

		var result = await _sut.DeleteAsync(1);

		Assert.False(result);
	}
}