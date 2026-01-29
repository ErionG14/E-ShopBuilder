using EShopBuilder.Payments.API.Data.Configuration;
using EShopBuilder.Payments.API.DTO;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace EShopBuilder.Payments.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly PaymentDbContext _context;

    public PaymentController(PaymentDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] OrderDTO order)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = order.OrderItems.Select(item => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = (long)(item.Price * 100), // Stripe uses cents
                    Currency = "eur",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = item.ProductName,
                    },
                },
                Quantity = item.Quantity,
            }).ToList(),
            Mode = "payment",
            SuccessUrl = "http://localhost:3000/success?orderId=" + order.Id,
            CancelUrl = "http://localhost:3000/cancel",
            Metadata = new Dictionary<string, string>
            {
                { "OrderId", order.Id.ToString() },
                { "UserId", order.UserId }
            }
        };

        var service = new SessionService();
        Session session = await service.CreateAsync(options);

        return Ok(new { sessionId = session.Id, url = session.Url });
    }
}