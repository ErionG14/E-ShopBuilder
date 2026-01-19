using System.Security.Claims;
using EShopBuilder.Order.API.Configuration;
using EShopBuilder.Order.API.DTO;
using EShopBuilder.Order.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Order.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly OrderDbContext _context;

    public OrderController(OrderDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("Checkout")]
    public async Task<IActionResult> Checkout([FromBody] List<OrderItemDto> items, [FromQuery] string address)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        if (items == null || !items.Any())
            return BadRequest("Cannot place an order with no items.");

        // Create the Order (Header) using your 'Orders' model
        var newOrder = new Orders
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            ShippingAddress = address,
            Status = "Pending",
            TotalAmount = items.Sum(i => i.Price * i.Quantity),
            OrderItems = items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList()
        };

        _context.Orders.Add(newOrder);
        await _context.SaveChangesAsync();

        return Ok(new { 
            Message = "Order placed successfully!", 
            OrderId = newOrder.Id,
            Total = newOrder.TotalAmount 
        });
    }

    [HttpGet("MyOrders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new {
                o.Id,
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                o.ShippingAddress,
                Items = o.OrderItems.Select(i => new {
                    i.ProductId,
                    i.ProductName,
                    i.Price,
                    i.Quantity
                })
            })
            .ToListAsync();

        return Ok(orders);
    }
}