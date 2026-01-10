using EShopBuilder.Identity.API.DTO;
using EShopBuilder.Identity.API.Models;
using EShopBuilder.Identity.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Login(LoginDTO model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid login attempt." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var token = await _tokenService.GenerateTokenAsync(user);
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);
            return Ok(new
            {
                Token = token,
                RefreshToken = refreshToken
            });
        }
        else
        {
            return Unauthorized(new { Message = "Invalid login attempt." });
        }
    }
    
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDTO model)
    {
        if (model == null) return BadRequest("Invalid client request");

        var user = await _userManager.FindByNameAsync(model.UserName);

        // Check if user exists and if the provided refresh token matches the one in DB and isn't expired
        if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return BadRequest("Invalid or expired refresh token");
        }

        // Generate a new set of tokens
        var newAccessToken = await _tokenService.GenerateTokenAsync(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        // Update the user with the new refresh token
        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            Token = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }
}
