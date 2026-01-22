using System.ComponentModel.DataAnnotations;

namespace EShopBuilder.Store.API.DTO;

public class StoreCreateDto
{
    [Required(ErrorMessage = "Store name is required.")]
    [StringLength(100, ErrorMessage = "Store name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "URL Slug is required.")]
    [RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "Slug can only contain lowercase letters, numbers, and hyphens.")]
    public string Slug { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }
}