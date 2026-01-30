using EShopBuilder.Payments.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EShopBuilder.Payments.API.Data.Configuration;

public class PaymentConfiguration : IEntityTypeConfiguration<PaymentTransaction>
{
    public void Configure(EntityTypeBuilder<PaymentTransaction> builder)
    {
        builder.ToTable("PaymentTransactions");

        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.StripeSessionId)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Currency)
            .HasMaxLength(10);

        // This makes searching for an order's payment history much faster
        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => p.StripeSessionId);
    }
}