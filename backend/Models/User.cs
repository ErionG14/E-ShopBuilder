using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User : IdentityUser
{
    [Required]
    [StringLength(20, ErrorMessage = "The name should be less than 20 characters.")]
    public string? Name { get; set; }

    [Required]
    [StringLength(10, ErrorMessage = "The name should be less than 10 characters.")]
    public string? Surname { get; set; }
    
    [StringLength(20, ErrorMessage = "The address should be less than 20 characters.")]
    public string? Address { get; set; }
    
    
    [RegularExpression(@"^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid e-mail format")]
    public new string Email { get; set; }
    
    //This is Age attribute updated to BirthDate so it can show youre date, month, year of birth instead of youre age
    public DateTime? Birthdate { get; set; } 
    
    public string? Gender { get; set; }
    
    [RegularExpression(@"^\+?\d{1,3}[- ]?\d{3,14}$", ErrorMessage = "Invalid phone number format")]
    public string? PhoneNumber { get; set; }
}