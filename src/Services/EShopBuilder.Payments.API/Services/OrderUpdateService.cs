namespace EShopBuilder.Payments.API.Services;

public class OrderUpdateService : IOrderUpdateService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OrderUpdateService> _logger;

    public OrderUpdateService(HttpClient httpClient, ILogger<OrderUpdateService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> UpdateOrderStatus(int orderId, string status)
    {
        try
        {
            // This calls the Order Service via the Gateway
            // Note: Make sure your OrderController has an endpoint matching this URL
            var response = await _httpClient.PutAsJsonAsync($"/api/order/{orderId}/status", new { status });

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Successfully updated Order {OrderId} to status {Status}", orderId, status);
                return true;
            }

            _logger.LogError("Failed to update Order {OrderId}. Status Code: {StatusCode}", orderId, response.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Order {OrderId}", orderId);
            return false;
        }
    }
}