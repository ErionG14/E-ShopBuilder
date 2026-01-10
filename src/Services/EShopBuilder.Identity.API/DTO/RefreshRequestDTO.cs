namespace EShopBuilder.Identity.API.DTO;

public class RefreshRequestDTO
{
    public string UserName { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}