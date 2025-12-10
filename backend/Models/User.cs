using System.ComponentModel.DataAnnotations;
using backend.Enums;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User : IdentityUser
{
    [Required]
    [StringLength(8, ErrorMessage = "The name should be less than 20 characters.")]
    public string Name { get; set; }

    [Required]
    [StringLength(10, ErrorMessage = "The name should be less than 10 characters.")]
    public string Surname { get; set; }
    
    [StringLength(20, ErrorMessage = "The address should be less than 20 characters.")]
    public string? Address { get; set; }
    
    //This is Age attribute updated to BirthDate so it can show youre date, month, year of birth instead of youre age
    public DateTime? Birthdate { get; set; } 
    
    public string? Gender { get; set; }
    
    [RegularExpression(@"^\+?\d{1,3}[- ]?\d{3,14}$", ErrorMessage = "Invalid phone number format")]
    public string? PhoneNumber { get; set; }
    
    public string? Image { get; set; }
    
    public Roles Role { get; set; }
}