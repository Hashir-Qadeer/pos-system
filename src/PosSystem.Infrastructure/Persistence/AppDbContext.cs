using Microsoft.EntityFrameworkCore;
using PosSystem.Domain.Entities;

namespace PosSystem.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

	public DbSet<Product> Products => Set<Product>();
	public DbSet<Category> Categories => Set<Category>();
	public DbSet<User> Users => Set<User>();
	public DbSet<Customer> Customers => Set<Customer>();
	public DbSet<Order> Orders => Set<Order>();
	public DbSet<OrderItem> OrderItems => Set<OrderItem>();
	public DbSet<InventoryLog> InventoryLogs => Set<InventoryLog>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<OrderItem>().Ignore(oi => oi.Subtotal);

		modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(10, 2);
		modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(10, 2);
		modelBuilder.Entity<Order>().Property(o => o.AmountPaid).HasPrecision(10, 2);
		modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasPrecision(10, 2);

		modelBuilder.Entity<Order>()
			.HasOne(o => o.Customer)
			.WithMany(c => c.Orders)
			.HasForeignKey(o => o.CustomerId)
			.OnDelete(DeleteBehavior.SetNull);

		modelBuilder.Entity<Order>()
			.HasOne(o => o.Cashier)
			.WithMany(u => u.Orders)
			.HasForeignKey(o => o.CashierId)
			.OnDelete(DeleteBehavior.Restrict);

		modelBuilder.Entity<Product>()
			.HasIndex(p => p.Sku)
			.IsUnique();

		modelBuilder.Entity<User>()
			.HasIndex(u => u.Email)
			.IsUnique();
	}
}