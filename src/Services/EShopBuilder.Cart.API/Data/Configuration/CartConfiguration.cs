using EShopBuilder.Cart.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EShopBuilder.Cart.API.Data.Configuration;

public class CartConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");

        builder.HasKey(c => c.Id);

        // Ensure a user can't have a quantity of 0
        builder.Property(c => c.Quantity)
            .IsRequired()
            .HasDefaultValue(1);

        // Indexing for performance: We will search by UserId frequently
        builder.HasIndex(c => c.UserId);

        builder.Property(c => c.ProductName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Price)
            .HasPrecision(18, 2);
    }
}