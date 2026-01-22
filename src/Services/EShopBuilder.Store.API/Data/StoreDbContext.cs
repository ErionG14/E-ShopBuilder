using EShopBuilder.Store.API.Models;
using Microsoft.EntityFrameworkCore;


namespace EShopBuilder.Store.API.Data;

public class StoreDbContext : DbContext
{
    public DbSet<StoreEntity> Stores { get; set; }
    
    public StoreDbContext(DbContextOptions<StoreDbContext> options) : base(options)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<StoreEntity>()
            .HasIndex(s => s.Slug)
            .IsUnique();    
    }
}