using EShopBuilder.Subscriptions.API.Data.Configuration;
using EShopBuilder.Subscriptions.API.Models;
using EShopBuilder.Subscriptions.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using Subscription = EShopBuilder.Subscriptions.API.Models.Subscription;

namespace EShopBuilder.Subscriptions.API.Controllers;

[Route("api/webhook")]
[ApiController]
public class StripeWebhookController : ControllerBase
{
    private readonly SubscriptionDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly string _webhookSecret;

    public StripeWebhookController(
        SubscriptionDbContext context, 
        IOptions<StripeSettings> stripeSettings,
        IIdentityService identityService) 
    {
        _context = context;
        _identityService = identityService; // Now the compiler recognizes this variable
        _webhookSecret = stripeSettings.Value.WebhookSecret;
    }

    [HttpPost]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _webhookSecret,
                throwOnApiVersionMismatch: false
            );
            
            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;
                await HandleSubscriptionSuccess(session!);
            }

            return Ok();
        }
        catch (StripeException e)
        {
            Console.WriteLine($"Stripe Webhook Error: {e.Message}");
            return BadRequest(new { error = e.Message });
        }
    }

    private async Task HandleSubscriptionSuccess(Session session)
    {
        if (!session.Metadata.TryGetValue("UserId", out var userId))
        {
            Console.WriteLine("Webhook error: No UserId in metadata.");
            return;
        }
        
        var isOwner = await _identityService.CheckUserRole(userId, "Owner"); 
        if (!isOwner)
        {
            Console.WriteLine($"Unauthorized: User {userId} is not an Owner. Subscription ignored.");
            return;
        }
        
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (subscription == null)
        {
            subscription = new Subscription { UserId = userId };
            _context.Subscriptions.Add(subscription);
        }

        subscription.IsActive = true;
        subscription.StripeSubscriptionId = session.SubscriptionId;
        subscription.StripeCustomerId = session.CustomerId;
        subscription.PlanType = "Pro"; 
        subscription.ExpiryDate = DateTime.UtcNow.AddMonths(1);

        await _context.SaveChangesAsync();
    }
}