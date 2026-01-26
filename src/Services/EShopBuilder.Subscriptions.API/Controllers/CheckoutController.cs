using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace EShopBuilder.Subscriptions.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CheckoutController : ControllerBase
{
    [HttpPost("create-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] string planType)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID not found in token." });
        }
        
        var priceAmount = planType.ToLower() == "pro" ? 2000 : 1000; // $20 vs $10

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = priceAmount,
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"E-ShopBuilder {planType} Plan",
                            Description = "Unlock full store building capabilities",
                        },
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            Metadata = new Dictionary<string, string> { { "UserId", userId } }, 
            SuccessUrl = "http://localhost:3000/dashboard?session_success=true",
            CancelUrl = "http://localhost:3000/pricing",
        };

        var service = new SessionService();
        try 
        {
            Session session = await service.CreateAsync(options);
            return Ok(new { url = session.Url }); 
        }
        catch (Stripe.StripeException e)
        {
            return BadRequest(new { message = e.Message });
        }
    }
}