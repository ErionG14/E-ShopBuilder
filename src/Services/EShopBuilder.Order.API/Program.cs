using EShopBuilder.Order.API.Middleware;
using EShopBuilder.Order.API.Services;

var builder = WebApplication.CreateBuilder(args);

ServiceConfiguration.ConfigureServices(builder);

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