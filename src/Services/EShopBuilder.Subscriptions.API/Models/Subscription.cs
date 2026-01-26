namespace EShopBuilder.Subscriptions.API.Models;

public class Subscription
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty; // Linked to Identity
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string PlanType { get; set; } = "Free"; // e.g., Basic, Pro
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
}