namespace EShopBuilder.Payments.API.Models;

public class PaymentTransaction
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string StripeSessionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string Status { get; set; } = "Initiated"; // Initiated, Success, Failed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}