using EShopBuilder.Payments.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Payments.API.Data.Configuration;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options) 
    { 
    }
    
    public DbSet<PaymentTransaction> Transactions { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PaymentDbContext).Assembly);
    }
}