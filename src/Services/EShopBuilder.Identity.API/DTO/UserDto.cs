using EShopBuilder.Identity.API.Enums;

namespace EShopBuilder.Identity.API.DTO;

public class UserDto
{
    public string Id { get; set; }
    
    public string Name { get; set; }

    public string Surname { get; set; }

    public string Address { get; set; }

    public string PhoneNumber { get; set; }

    public string Gender { get; set; }

    public DateTime? Birthdate { get; set; }

    public string? Email { get; set; }

    public Roles Role { get; set; }
}