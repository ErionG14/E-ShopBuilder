using EShopBuilder.Identity.API.DTO;
using EShopBuilder.Identity.API.Models;
using EShopBuilder.Identity.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Identity.API.Controllers;

[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDTO model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return Unauthorized(new { Message = "Invalid login attempt." });

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var token = await _tokenService.GenerateTokenAsync(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            // --- ADD COOKIE LOGIC HERE ---
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,   // Protects against XSS
                Secure = false,    // Set to TRUE in production for HTTPS
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(60) // Access token lifespan
            };

            // Append the Access Token to a cookie
            Response.Cookies.Append("jwt_token", token, cookieOptions);

            // Append the Refresh Token to a cookie (with a longer expiry)
            cookieOptions.Expires = DateTime.UtcNow.AddDays(7);
            Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);

            return Ok(new { Message = "Login successful" });
        }

        return Unauthorized(new { Message = "Invalid login attempt." });
    }
    
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        // Read tokens from the cookies
        var refreshToken = Request.Cookies["refresh_token"];
        var userName = User.Identity?.Name; // Or get this from the expired token if needed

        if (string.IsNullOrEmpty(refreshToken)) return BadRequest("Refresh token missing");

        // Important: Since the user is likely unauthorized (expired token), 
        // you may need to find the user by the RefreshToken itself in the DB
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return BadRequest("Invalid or expired refresh token");
        }

        // Generate new ones
        var newAccessToken = await _tokenService.GenerateTokenAsync(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        // Update Cookies
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddMinutes(60)
        };

        Response.Cookies.Append("jwt_token", newAccessToken, cookieOptions);
    
        cookieOptions.Expires = DateTime.UtcNow.AddDays(7);
        Response.Cookies.Append("refresh_token", newRefreshToken, cookieOptions);

        return Ok(new { Message = "Token refreshed" });
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete("jwt_token");
        Response.Cookies.Delete("refresh_token");
        return Ok(new { Message = "Logged out" });
    }
}
