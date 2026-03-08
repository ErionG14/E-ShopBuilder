FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src

COPY ["EShopBuilder.Cart.API.csproj", "."]
RUN dotnet restore "./EShopBuilder.Cart.API.csproj"

COPY . .
RUN dotnet publish "EShopBuilder.Cart.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EShopBuilder.Cart.API.dll"]