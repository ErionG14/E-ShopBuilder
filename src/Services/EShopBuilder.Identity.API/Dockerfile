# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["EShopBuilder.Identity.API.csproj", "."]
RUN dotnet restore "./EShopBuilder.Identity.API.csproj"

# Copy the rest of the code and build it
COPY . .
RUN dotnet publish "EShopBuilder.Identity.API.csproj" -c Release -o /app/publish

# Use the runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "EShopBuilder.Identity.API.dll"]