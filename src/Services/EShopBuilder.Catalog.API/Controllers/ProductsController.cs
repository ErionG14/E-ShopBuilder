using System.Security.Claims;
using EShopBuilder.Catalog.API.Data;
using EShopBuilder.Catalog.API.DTO;
using EShopBuilder.Catalog.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Catalog.API.Controllers;

[Route("api/[controller]")]
[ApiController]
        public class ProductsController : ControllerBase
{
    private readonly CatalogDbContext _context;

    public ProductsController(CatalogDbContext context)
    {
        _context = context;
    }

    // GET: api/products (Public - Anyone can see products)
    [HttpGet("getProduct")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    // GET: api/products/{id}
    [HttpGet("getProduct/{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    // POST: api/products (Private)
    [HttpPost("addProduct")]
    //[Authorize]
    public async Task<IActionResult> CreateProduct( ProductCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

    // PUT: api/products/{id} (Private - Owner only)
    [HttpPut("updateProduct/{id}")]
    //[Authorize]
    public async Task<IActionResult> UpdateProduct(int id,  ProductCreateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        // Security check: Is this the owner?
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (product.UserId != userId) return Forbid();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.Category = dto.Category;
        product.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/products/{id} (Private - Owner only)
    [HttpDelete("{id}")]
    //[Authorize]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        // Security check: Is this the owner?
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (product.UserId != userId) return Forbid();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}