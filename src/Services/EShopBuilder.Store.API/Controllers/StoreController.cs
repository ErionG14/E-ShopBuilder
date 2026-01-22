using System.Security.Claims;
using EShopBuilder.Store.API.Data;
using EShopBuilder.Store.API.DTO;
using EShopBuilder.Store.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Store.API.Controllers;

[Route("api/[controller]")]
[ApiController]
// This is the "Gatekeeper": Only users with the "Owner" role in their token can enter.
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Owner")]
public class StoreController : ControllerBase
{
    private readonly StoreDbContext _context;

    public StoreController(StoreDbContext context)
    {
        _context = context;
    }

    [HttpPost("Create")]
    public async Task<IActionResult> CreateStore([FromBody] StoreCreateDto model)
    {
        // 1. Extract the unique User ID (Subject) from the token. 
        // This is the link between your Identity DB and your Store DB.
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "User ID not found in token." });
        }

        // 2. Check if this user already has a store (optional, but good for business logic)
        var existingStore = _context.Stores.Any(s => s.UserId == userId);
        if (existingStore)
        {
            return BadRequest(new { Message = "User already owns a store." });
        }

        // 3. Create the Store Entity
        var newStore = new StoreEntity
        {
            Name = model.Name,
            // Slugs should be lowercase and have no spaces for valid URLs
            Slug = model.Slug.ToLower().Replace(" ", "-"), 
            Description = model.Description,
            UserId = userId, // This is where the 'UserId' is saved as 'OwnerId'
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        // 4. Save to MySQL
        _context.Stores.Add(newStore);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Store created successfully!", StoreId = newStore.Id });
    }
    
    [HttpGet("MyStore")]
    public async Task<IActionResult> GetMyStore()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var store = await _context.Stores.FirstOrDefaultAsync(s => s.UserId == userId);

        if (store == null) return NotFound(new { Message = "You don't have a store yet." });

        return Ok(store);
    }
    
    // 5. PATCH: api/Store/Activate/{id}
    [HttpPatch("Activate/{id}")]
    public async Task<IActionResult> ActivateStore(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var store = await _context.Stores.FindAsync(id);

        if (store == null) return NotFound();
        if (store.UserId != userId) return Forbid();

        store.IsActive = true;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Store is now Active", IsActive = true });
    }

// 6. PATCH: api/Store/Deactivate/{id}
    [HttpPatch("Deactivate/{id}")]
    public async Task<IActionResult> DeactivateStore(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var store = await _context.Stores.FindAsync(id);

        if (store == null) return NotFound();
        if (store.UserId != userId) return Forbid();

        store.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Store is now Deactivated", IsActive = false });
    }
    
    // 2. GET: api/Store/{id}
    // Anyone can view a store by its ID (Publicly available info)
    [HttpGet("{id}")]
    [AllowAnonymous] // Allows customers to see the store details
    public async Task<IActionResult> GetStoreById(int id)
    {
        var store = await _context.Stores.FindAsync(id);
        if (store == null) return NotFound();
        return Ok(store);
    }

    // 3. PUT: api/Store/Update/{id}
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> UpdateStore(int id, [FromBody] StoreCreateDto model)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var store = await _context.Stores.FindAsync(id);

        if (store == null) return NotFound();

        // SECURITY: Check if the logged-in user is actually the owner
        if (store.UserId != userId) 
            return Forbid("You do not have permission to update this store.");

        store.Name = model.Name;
        store.Description = model.Description;
        store.Slug = model.Slug.ToLower().Replace(" ", "-");

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Store updated successfully!" });
    }

    // 4. DELETE: api/Store/Delete/{id}
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> DeleteStore(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var store = await _context.Stores.FindAsync(id);

        if (store == null) return NotFound();

        // SECURITY: Only the owner can delete the store
        if (store.UserId != userId) 
            return Forbid("You do not have permission to delete this store.");

        _context.Stores.Remove(store);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Store deleted successfully!" });
    }
}