using System.Security.Claims;
using EShopBuilder.Identity.API.DTO;
using EShopBuilder.Identity.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Identity.API.Controllers;

[Route("api")]


public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
  private readonly RoleManager<IdentityRole> _roleManager;
  private readonly ILogger<UserController> _logger;

    public UserController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ILogger<UserController> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody]RegisterDTO model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new User
        {
            UserName = model.Username,
            Email = model.Email,
            Name = model.Name,
            Surname = model.Surname,
            Address = model.Address,
            Birthdate = model.Birthdate,
            Gender = model.Gender,
            PhoneNumber = model.PhoneNumber
            // Add other properties as needed from your RegisterUserDto
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            // Assign the default role "User" to the newly registered user
            if (await _roleManager.RoleExistsAsync("User")) // Check if the role exists
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                // Handle the case where the "User" role doesn't exist.
                // You might want to log an error, create the role, or return a specific error to the client.
                ModelState.AddModelError(string.Empty, "The 'User' role does not exist.");
                return BadRequest(ModelState);
            }

            return Ok(new { Message = "Registration successful!" });
        }
        else
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }
    }

    [HttpPost("AddUser")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> AddUser([FromBody]AddUserByAdminDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new User
        {
            UserName = model.Username,
            Email = model.Email,
            Name = model.Name,
            Surname = model.Surname,
            Address = model.Address,
            Birthdate = model.Birthdate,
            Gender = model.Gender,
            PhoneNumber = model.PhoneNumber,
            Role = model.Role // Set the Role property from the DTO
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            // Assign the specified role using RoleManager
            if (await _roleManager.RoleExistsAsync(model.Role.ToString()))
            {
                await _userManager.AddToRoleAsync(user, model.Role.ToString());
                return Ok(new { Message = $"User '{user.UserName}' created successfully with role '{model.Role}'." });
            }
            else
            {
                ModelState.AddModelError(string.Empty, $"The role '{model.Role}' does not exist.");
                return BadRequest(ModelState);
            }
        }
        else
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }
    }
    
    [HttpGet("GetAllUsers")] 
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        
        var userDtos = new List<UserResponseDTO>();
        foreach (var user in users)
        {

            userDtos.Add(new UserResponseDTO
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Name = user.Name,
                Surname = user.Surname,
                Address = user.Address,
                Birthdate = user.Birthdate,
                Gender = user.Gender,
                PhoneNumber = user.PhoneNumber, 
                Image = user.Image,
                Role = user.Role 
            });
        }
        _logger.LogInformation("GetAllUsers: Retrieved {Count} users.", users.Count);
        return Ok(userDtos);
    }

    // Read single user by ID (Admin only)
    [HttpGet("GetUser{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { Message = "User not found." });

        return Ok(user);
    }
    
    [HttpGet("check-role")]
    public async Task<IActionResult> CheckRole(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
    
        if (user == null) 
        {
            _logger.LogWarning("CheckRole: User {UserId} not found.", userId);
            return NotFound(new { message = "User not found" });
        }
        
        var userRoles = await _userManager.GetRolesAsync(user);
        
        var hasRole = userRoles.Any(r => r.Equals(role, StringComparison.OrdinalIgnoreCase));

        if (hasRole)
        {
            _logger.LogInformation("CheckRole: User {UserId} verified as {Role}.", userId, role);
            return Ok(); 
        }
        
        _logger.LogWarning("CheckRole: User {UserId} does not have role {Role}. Found roles: {Roles}", 
            userId, role, string.Join(", ", userRoles));

        return Forbid(); 
    }

    // Update user (Admin only)
    [HttpPut("UpdateUser{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody]UserUpdateDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { Message = "User not found." });

        // Update basic fields
        user.UserName = model.Username;
        user.Email = model.Email;
        user.Name = model.Name;
        user.Surname = model.Surname;
        user.Address = model.Address;
        user.Birthdate = model.Birthdate;
        user.Gender = model.Gender;
        user.PhoneNumber = model.PhoneNumber;
        user.Role = model.Role;

        // Update role
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (await _roleManager.RoleExistsAsync(model.Role.ToString()))
        {
            await _userManager.AddToRoleAsync(user, model.Role.ToString());
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        return Ok(new { Message = $"User '{user.UserName}' updated successfully." });
    }
    
    [HttpPut("UpdateMyProfile")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User, Owner")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UserUpdateByUserDTO model)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("UpdateMyProfile: Invalid ModelState for UserUpdateByUserDTO. Errors: {Errors}", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(ModelState);
        }
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("UpdateMyProfile: User ID not found in token for authenticated request.");
            return Unauthorized(new { Message = "User ID not found in token." });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogError("UpdateMyProfile: Authenticated user with ID {UserId} not found in database.", userId);
            return NotFound(new { Message = "Authenticated user not found." });
        }
        
        user.UserName = model.Username;
        user.Email = model.Email;
        user.Name = model.Name;
        user.Surname = model.Surname;
        user.Address = model.Address;
        user.Birthdate = model.Birthdate;
        user.Gender = model.Gender;
        user.PhoneNumber = model.PhoneNumber;
        user.Image = model.Image;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            _logger.LogError("UpdateMyProfile: Failed to update user {UserId}. Errors: {Errors}", userId, string.Join(", ", result.Errors.Select(e => e.Description)));
            return BadRequest(ModelState);
        }

        _logger.LogInformation("UpdateMyProfile: User '{UserName}' (ID: {UserId}) updated their profile successfully.", user.UserName, userId);
        return Ok(new { Message = $"Your profile has been updated successfully." });
    }
    
    [HttpGet("MyProfile")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User, Owner, Admin")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("GetMyProfile: User ID not found in token for authenticated request.");
            return Unauthorized(new { Message = "User ID not found in token." });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogError("GetMyProfile: Authenticated user with ID {UserId} not found in database.", userId);
            return NotFound(new { Message = "Authenticated user not found." });
        }
        
        _logger.LogInformation("GetMyProfile: Retrieved profile for user '{UserName}' (ID: {UserId}).", user.UserName, userId);
        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.Name,
            user.Surname,
            user.Address,
            user.Birthdate,
            user.Gender,
            user.PhoneNumber,
            user.Image,
            user.Role
        });
    }

    // Delete user (Admin only)
    [HttpDelete("DeleteUser{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { Message = "User not found." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        return Ok(new { Message = $"User '{user.UserName}' deleted successfully." });
    }
}