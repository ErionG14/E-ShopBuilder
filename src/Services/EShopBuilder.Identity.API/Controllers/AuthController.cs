using EShopBuilder.Identity.API.DTO;
using EShopBuilder.Identity.API.Models;
using EShopBuilder.Identity.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(15) // Access token lifespan
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
    
    [AllowAnonymous] // Crucial: Allow the call even if the Access Token is expired
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        // 1. Extract from cookie
        var refreshToken = Request.Cookies["refresh_token"];

        if (string.IsNullOrEmpty(refreshToken)) 
        {
            return BadRequest(new { Message = "Refresh token cookie missing" });
        }
    
        // 2. Lookup user by the token string only
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            // If the refresh token is also bad/expired, we return 400 (or 401) 
            // which tells the React Interceptor to redirect to login.
            return BadRequest(new { Message = "Invalid or expired refresh token" });
        }

        // 3. Generate new tokens
        var newAccessToken = await _tokenService.GenerateTokenAsync(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        // 4. Update Database
        user.RefreshToken = newRefreshToken;
        // Ensure your GenerateRefreshToken also updates the ExpiryTime if you want to slide the window
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); 
        await _userManager.UpdateAsync(user);

        // 5. Update Cookies
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Set to true in production with HTTPS
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(7)
        };

        cookieOptions.Expires = DateTime.UtcNow.AddMinutes(15);
        Response.Cookies.Append("jwt_token", newAccessToken, cookieOptions);

        cookieOptions.Expires = DateTime.UtcNow.AddDays(7);
        Response.Cookies.Append("refresh_token", newRefreshToken, cookieOptions);
        
        
        return Ok(new { Message = "Token refreshed" });
    }
    
    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User,Owner,Admin")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();
        
        var roles = await _userManager.GetRolesAsync(user);
        
        return Ok(new
        {
            username = user.UserName,
            email = user.Email,
            role = roles.FirstOrDefault() ?? "User",
            user.Image
        });
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete("jwt_token");
        Response.Cookies.Delete("refresh_token");
        return Ok(new { Message = "Logged out" });
    }
}
