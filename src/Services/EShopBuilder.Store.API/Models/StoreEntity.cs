using System.ComponentModel.DataAnnotations;

namespace EShopBuilder.Store.API.Models;

public class StoreEntity
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Slug { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public string? LogoUrl { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
}