using EShopBuilder.Payments.API.Middleware;
using EShopBuilder.Payments.API.Services;

var builder = WebApplication.CreateBuilder(args);

ServiceConfiguration.ConfigureServices(builder);

builder.Services.AddHttpClient<IOrderUpdateService, OrderUpdateService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5174"); 
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("_myAllowSpecificOrigins");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();