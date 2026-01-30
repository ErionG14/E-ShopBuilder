namespace EShopBuilder.Subscriptions.API.Services;
public interface IIdentityService
{
    Task<bool> CheckUserRole(string userId, string roleName);
}

public class IdentityService : IIdentityService
{
    private readonly HttpClient _httpClient;

    public IdentityService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<bool> CheckUserRole(string userId, string roleName)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/identity/check-role?userId={userId}&role={roleName}");
            
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking user role: {ex.Message}");
            return false;
        }
    }
}
