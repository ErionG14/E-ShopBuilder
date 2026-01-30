namespace EShopBuilder.Payments.API.DTO;

public class OrderDTO
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public List<OrderItemDTO> OrderItems { get; set; } = new();
}