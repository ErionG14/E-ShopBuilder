using System.ComponentModel.DataAnnotations;

namespace EShopBuilder.Cart.API.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int StoreId { get; set; } 

    [Required]
    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
    public int Quantity { get; set; }

    // These fields help display the cart without calling the Catalog service every time
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow; 
}