using System;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Shadowing.DataAccess.Entities;
using Shadowing.Models.Auth.Enums;
using Shadowing.Models.Common.Enums;

namespace Shadowing.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IConfiguration configuration;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            this.configuration = configuration;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Shadow> Shadows { get; set; }
        public DbSet<Persona> Personas { get; set; }
        public DbSet<UserPersona> UserPersonas { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            SeedData(builder);

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddE
                .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

        private void SeedData(ModelBuilder builder)
        {
            var userId = Guid.NewGuid().ToString();
            var salt = new byte[36];
            var password = this.configuration["ROOT_USER_PASSWORD"];

            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }

            using var deriveBytes = new Rfc2898DeriveBytes(password, salt, 1000);

            var hash = deriveBytes.GetBytes(36);

            builder.Entity<User>().HasData(
                new User()
                {
                    Id = userId,
                    DisplayName = "Dwayne Hunter",
                    Email = "dwaynewhunter@gmail.com",
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    Gender = Gender.Male.ToString(),
                    LastLogin = DateTime.UtcNow,
                    Created = DateTime.UtcNow,
                });

            builder.Entity<UserRole>().HasData(
                new UserRole()
                {
                    UserId = userId,
                    Role = RoleIdentifier.Admin.ToString(),
                },
                new UserRole()
                {
                    UserId = userId,
                    Role = RoleIdentifier.User.ToString(),
                });
        }
    }
}
