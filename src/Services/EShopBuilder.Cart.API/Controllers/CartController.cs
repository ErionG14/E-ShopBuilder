using System.Security.Claims;
using EShopBuilder.Cart.API.Data;
using EShopBuilder.Cart.API.DTO;
using EShopBuilder.Cart.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Cart.API.Controllers;

[Route("api")]
[ApiController]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartDbContext _context;

    public CartController(CartDbContext context)
    {
        _context = context;
    }
    
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    [HttpPost("AddToCart")]
    public async Task<IActionResult> AddToCart([FromBody] CartItemDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Check if this user already has this specific product in their cart
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

        if (existingItem != null)
        {
            // Just increase the quantity
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            // Create a new entry
            var newItem = new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                StoreId = dto.StoreId,
                ProductName = dto.ProductName,
                Price = dto.Price,
                Quantity = dto.Quantity,
                ImageUrl = dto.ImageUrl
            };
            _context.CartItems.Add(newItem);
        }

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Cart updated!" });
    }
    
    [HttpGet("MyCart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public async Task<IActionResult> GetMyCart()
    {
        // Extract the UserId from the JWT token
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User not identified." });
        }

        // Fetch items belonging to this user
        var cartItems = await _context.CartItems
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.AddedAt) // Show most recently added items first
            .ToListAsync();

        return Ok(cartItems);
    }
    
    // PUT: api/Cart/UpdateCart/5
    [HttpPut("UpdateCart/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public async Task<IActionResult> UpdateCart(int id, [FromBody] int newQuantity)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        // Security: Ensure the item exists AND belongs to the logged-in user
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Item not found in your cart." });
        }

        if (newQuantity <= 0)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Item removed because quantity was 0." });
        }

        cartItem.Quantity = newQuantity;
        _context.CartItems.Update(cartItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Quantity updated!", data = cartItem });
    }

// DELETE: api/Cart/DeleteCart/5
    [HttpDelete("DeleteCart/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public async Task<IActionResult> DeleteCart(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Item not found." });
        }

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Item removed from cart." });
    }
    
    // DELETE: api/Cart/ClearCart
    [HttpDelete("ClearCart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Find all items belonging to this user
        var userItems = _context.CartItems.Where(c => c.UserId == userId);

        if (await userItems.AnyAsync())
        {
            _context.CartItems.RemoveRange(userItems);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Cart cleared successfully!" });
    }
}