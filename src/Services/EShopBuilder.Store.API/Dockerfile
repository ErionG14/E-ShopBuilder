FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src

COPY ["EShopBuilder.Store.API.csproj", "."]
RUN dotnet restore "./EShopBuilder.Store.API.csproj"

COPY . .
RUN dotnet publish "EShopBuilder.Store.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EShopBuilder.Store.API.dll"]