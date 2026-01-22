var builder = WebApplication.CreateBuilder(args);

// 1. Add YARP Services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// 2. Add CORS Policy for your React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("GatewayCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 3. Use CORS before mapping the proxy
app.UseCors("GatewayCorsPolicy");

// 4. Map the proxy
app.MapReverseProxy();
app.MapGet("/", () => "EShopBuilder Gateway is running! Use /api/identity or /api/catalog to access services.");
app.Run();