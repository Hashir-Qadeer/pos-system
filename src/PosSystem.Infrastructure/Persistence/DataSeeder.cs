using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;
namespace PosSystem.Infrastructure.Persistence;

public static class DataSeeder
{
	public static async Task SeedAsync(AppDbContext context)
	{
		if (!await context.Users.AnyAsync())
		{
			context.Users.Add(new User
			{
				Name = "Admin",
				Email = "admin@possystem.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
				Role = "Admin",
				CreatedAt = DateTime.UtcNow
			});
			await context.SaveChangesAsync();
		}
		// Idempotent guard — never re-seed if categories already exist
		if (await context.Categories.AnyAsync())
			return;

		var categories = new List<Category>
		{
			new() { Name = "Beverages" },
			new() { Name = "Snacks" },
			new() { Name = "Dairy" },
			new() { Name = "Bakery" },
			new() { Name = "Household" },
			new() { Name = "Personal Care" },
		};

		context.Categories.AddRange(categories);
		await context.SaveChangesAsync(); // save first so categories get real IDs

		var beverages = categories[0];
		var snacks = categories[1];
		var dairy = categories[2];
		var bakery = categories[3];
		var household = categories[4];
		var personalCare = categories[5];

		var products = new List<Product>
		{
            // Beverages
            new() { Sku = "BEV-001", Name = "Coca Cola 500ml", Price = 90, StockQty = 40, ReorderLevel = 10, CategoryId = beverages.Id, IsActive = true },
			new() { Sku = "BEV-002", Name = "Pepsi 500ml", Price = 85, StockQty = 35, ReorderLevel = 10, CategoryId = beverages.Id, IsActive = true },
			new() { Sku = "BEV-003", Name = "Sprite 500ml", Price = 85, StockQty = 30, ReorderLevel = 10, CategoryId = beverages.Id, IsActive = true },
			new() { Sku = "BEV-004", Name = "Nestle Mineral Water 1.5L", Price = 60, StockQty = 50, ReorderLevel = 15, CategoryId = beverages.Id, IsActive = true },
			new() { Sku = "BEV-005", Name = "Lipton Ice Tea 500ml", Price = 110, StockQty = 20, ReorderLevel = 8, CategoryId = beverages.Id, IsActive = true },

            // Snacks
            new() { Sku = "SNK-001", Name = "Lays Classic Salted", Price = 50, StockQty = 60, ReorderLevel = 15, CategoryId = snacks.Id, IsActive = true },
			new() { Sku = "SNK-002", Name = "Kurkure Masala Munch", Price = 40, StockQty = 55, ReorderLevel = 15, CategoryId = snacks.Id, IsActive = true },
			new() { Sku = "SNK-003", Name = "Oreo Original", Price = 120, StockQty = 25, ReorderLevel = 10, CategoryId = snacks.Id, IsActive = true },
			new() { Sku = "SNK-004", Name = "KitKat 4 Finger", Price = 130, StockQty = 30, ReorderLevel = 10, CategoryId = snacks.Id, IsActive = true },
			new() { Sku = "SNK-005", Name = "Peanuts Salted 200g", Price = 150, StockQty = 18, ReorderLevel = 5, CategoryId = snacks.Id, IsActive = true },

            // Dairy
            new() { Sku = "DRY-001", Name = "Olpers Milk 1L", Price = 220, StockQty = 40, ReorderLevel = 10, CategoryId = dairy.Id, IsActive = true },
			new() { Sku = "DRY-002", Name = "Nestle Yogurt 400g", Price = 180, StockQty = 25, ReorderLevel = 8, CategoryId = dairy.Id, IsActive = true },
			new() { Sku = "DRY-003", Name = "Kraft Cheese Slices", Price = 450, StockQty = 15, ReorderLevel = 5, CategoryId = dairy.Id, IsActive = true },
			new() { Sku = "DRY-004", Name = "Butter 250g", Price = 380, StockQty = 12, ReorderLevel = 5, CategoryId = dairy.Id, IsActive = true },

            // Bakery
            new() { Sku = "BKY-001", Name = "Sliced White Bread", Price = 130, StockQty = 20, ReorderLevel = 8, CategoryId = bakery.Id, IsActive = true },
			new() { Sku = "BKY-002", Name = "Brown Bread", Price = 150, StockQty = 15, ReorderLevel = 6, CategoryId = bakery.Id, IsActive = true },
			new() { Sku = "BKY-003", Name = "Chocolate Muffin (each)", Price = 80, StockQty = 24, ReorderLevel = 8, CategoryId = bakery.Id, IsActive = true },
			new() { Sku = "BKY-004", Name = "Plain Croissant (each)", Price = 90, StockQty = 18, ReorderLevel = 6, CategoryId = bakery.Id, IsActive = true },

            // Household
            new() { Sku = "HSE-001", Name = "Surf Excel 1kg", Price = 480, StockQty = 20, ReorderLevel = 6, CategoryId = household.Id, IsActive = true },
			new() { Sku = "HSE-002", Name = "Lifebuoy Soap (3-pack)", Price = 210, StockQty = 30, ReorderLevel = 10, CategoryId = household.Id, IsActive = true },
			new() { Sku = "HSE-003", Name = "Harpic Toilet Cleaner", Price = 320, StockQty = 22, ReorderLevel = 8, CategoryId = household.Id, IsActive = true },
			new() { Sku = "HSE-004", Name = "Tissue Box (200 sheets)", Price = 150, StockQty = 35, ReorderLevel = 10, CategoryId = household.Id, IsActive = true },

            // Personal Care
            new() { Sku = "PCR-001", Name = "Colgate Toothpaste 100g", Price = 180, StockQty = 28, ReorderLevel = 10, CategoryId = personalCare.Id, IsActive = true },
			new() { Sku = "PCR-002", Name = "Head & Shoulders Shampoo 200ml", Price = 550, StockQty = 15, ReorderLevel = 5, CategoryId = personalCare.Id, IsActive = true },
			new() { Sku = "PCR-003", Name = "Nivea Body Lotion 200ml", Price = 620, StockQty = 12, ReorderLevel = 4, CategoryId = personalCare.Id, IsActive = true },
		};
		
		context.Products.AddRange(products);
		await context.SaveChangesAsync();
	}
}