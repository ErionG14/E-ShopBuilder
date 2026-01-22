using System.ComponentModel.DataAnnotations;

namespace EShopBuilder.Order.API.Models;

public class Orders
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; } = "Pending";
    
    public string ShippingAddress { get; set; } = string.Empty;
    
    public List<OrderItem> OrderItems { get; set; } = new();
}