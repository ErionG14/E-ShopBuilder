namespace EShopBuilder.Payments.API.Services;

public interface IOrderUpdateService
{
    Task<bool> UpdateOrderStatus(int orderId, string status);
}