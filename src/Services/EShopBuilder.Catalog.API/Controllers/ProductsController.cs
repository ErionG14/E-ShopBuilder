using System.Security.Claims;
using EShopBuilder.Catalog.API.Data;
using EShopBuilder.Catalog.API.DTO;
using EShopBuilder.Catalog.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
    
    [HttpGet("Store/{storeId}")]
    public async Task<IActionResult> GetProductsByStore(int storeId)
    {
        var products = await _context.Products
            .Where(p => p.StoreId == storeId)
            .ToListAsync();

        return Ok(products);
    }

    // POST: api/products (Private)
    [HttpPost("addProduct")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Owner")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Product), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateProduct( ProductCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "User identification failed." });

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            StoreId =  dto.StoreId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(
            nameof(GetProductById), 
            new { id = product.Id }, 
            new { 
                message = "Product added successfully!", 
                data = product 
            });
    }

    // PUT: api/products/{id} (Private - Owner only)
    [HttpPut("updateProduct/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Owner")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Product), StatusCodes.Status201Created)]
    public async Task<IActionResult> UpdateProduct(int id,  ProductCreateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) 
            return NotFound(new { message = $"Update failed: Product {id} not found." });
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (product.UserId != userId) 
            return Forbid();
        
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.Category = dto.Category;
        product.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            message = "Product updated successfully.", 
            productId = id,
            updatedAt = DateTime.UtcNow 
        });
    }

    // DELETE: api/products/{id} (Private - Owner only)
    [HttpDelete("deleteProduct/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Owner")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Product), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound(new { message = $"Product with ID {id} not found." });
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (product.UserId != userId) return Forbid();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        
        return Ok(new { 
            message = "Product deleted successfully.", 
            productId = id,
            deletedAt = DateTime.UtcNow 
        });
    }
    
    [HttpGet("Search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProducts(
        [FromQuery] string? name, 
        [FromQuery] string? category, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,      // Default to first page
        [FromQuery] int pageSize = 10  // Default 10 items per page
    )
    {
        // Start the query
        var query = _context.Products.AsQueryable();
    
        // --- 1. Applying Filters ---
        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(p => p.Name.Contains(name));
        }
    
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category == category);
        }
    
        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        // --- 2. Calculating Totals ---
        // We count the total filtered items BEFORE we skip/take for the frontend to know the page count
        var totalItems = await query.CountAsync();

        // --- 3. Applying Pagination & Sorting ---
        int skip = (page - 1) * pageSize;

        var results = await query
            .OrderByDescending(p => p.CreatedAt) 
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        // --- 4. Returning Paginated Response ---
        return Ok(new 
        {
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
            CurrentPage = page,
            PageSize = pageSize,
            Data = results
        });
    }
}