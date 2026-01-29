using EShopBuilder.Payments.API.Data.Configuration;
using EShopBuilder.Payments.API.Models;
using EShopBuilder.Payments.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace EShopBuilder.Payments.API.Controllers;

[Route("api/webhook")]
[ApiController]
public class StripeWebhookController : ControllerBase
{
    private readonly PaymentDbContext _context;
    private readonly IOrderUpdateService _orderUpdateService;
    private readonly string _webhookSecret;

    public StripeWebhookController(
        PaymentDbContext context,
        IOptions<StripeSettings> stripeSettings,
        IOrderUpdateService orderUpdateService)
    {
        _context = context;
        _orderUpdateService = orderUpdateService;
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
                await HandlePaymentSuccess(session!);
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest(new { error = e.Message });
        }
    }

    private async Task HandlePaymentSuccess(Session session)
    {
        // 1. Get OrderId from Metadata
        if (!session.Metadata.TryGetValue("OrderId", out var orderIdStr) ||
            !int.TryParse(orderIdStr, out var orderId))
        {
            Console.WriteLine("Webhook error: No OrderId found in session metadata.");
            return;
        }

        // 2. Tell the Order Microservice to mark this as "Paid"
        var updateResult = await _orderUpdateService.UpdateOrderStatus(orderId, "Paid");

        if (updateResult)
        {
            // 3. Save the payment record in your local MySQL table
            var transaction = new PaymentTransaction
            {
                OrderId = orderId,
                StripeSessionId = session.Id,
                Amount = (decimal)(session.AmountTotal ?? 0) / 100,
                Status = "Success",
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }
        else
        {
            Console.WriteLine($"Failed to notify Order Service for Order {orderId}. Payment logged as incomplete.");
        }
    }
}