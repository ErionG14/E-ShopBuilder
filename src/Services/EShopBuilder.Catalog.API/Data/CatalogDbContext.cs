using EShopBuilder.Catalog.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Catalog.API.Data;

public class CatalogDbContext : DbContext
{
        public DbSet<Product> Products { get; set; }
        
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options)
        {
            
        }
}