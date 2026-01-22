namespace EShopBuilder.Cart.API.DTO;

public class CartItemDto
{
    public int ProductId { get; set; }
    public int StoreId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Quantity { get; set; }
}