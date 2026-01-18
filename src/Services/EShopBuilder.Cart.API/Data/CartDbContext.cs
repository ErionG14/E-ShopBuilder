using EShopBuilder.Cart.API.Data.Configuration;
using EShopBuilder.Cart.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Cart.API.Data;

public class CartDbContext : DbContext
{
    public CartDbContext(DbContextOptions<CartDbContext> options) : base(options) { }

    public DbSet<CartItem> CartItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new CartConfiguration());
    }
}