using EShopBuilder.Identity.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EShopBuilder.Identity.API.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var hasher = new PasswordHasher<User>();

        var adminEmail = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetSection("SiteSettings")["AdminEmail"];

        var adminPassword = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetSection("SiteSettings")["AdminPassword"];

        if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
        {
            
            var ADMIN_ID = Guid.NewGuid().ToString();
            var ROLE_ID = Guid.NewGuid().ToString();
            
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = ROLE_ID,
                Name = "Admin",
                NormalizedName = "ADMIN"
            });
            
            var adminUser = new User
            {
                Id = ADMIN_ID,
                UserName = adminEmail,
                Name = "Admin",
                Surname = "admin",
                NormalizedUserName = adminEmail.ToUpper(),
                Address = "Admin Address",
                Email = adminEmail,
                NormalizedEmail = adminEmail.ToUpper(),
                EmailConfirmed = true,
                Role = Enums.Roles.Admin
            };

            // **CRITICAL: Hash the password before setting PasswordHash**
            adminUser.PasswordHash = hasher.HashPassword(adminUser, adminPassword);

            modelBuilder.Entity<User>().HasData(adminUser);
            
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = ROLE_ID,
                UserId = ADMIN_ID
            });
        }
    }
}