using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Shadowing.Business.Auth;
using Shadowing.Business.Series;
using Shadowing.Business.Episodes;
using Shadowing.Business.Users;
using Shadowing.DataAccess;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Shadowing.Business.Favorites;
using Shadowing.Business.Rooms;
using Microsoft.Extensions.Logging;
using Shadowing.Business.Shadows;

namespace Shadowing.API
{
    public class Startup
    {
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry();

            services.AddControllers();

            services.AddDbContext<ApplicationDbContext>(opts =>
            {
                var assemblyName = typeof(ApplicationDbContext).Namespace;
                opts.UseSqlServer(
                    this.configuration.GetConnectionString("ShadowingDB"),
                    sqlOpts => sqlOpts.MigrationsAssembly(assemblyName));
            });

            services
                .AddMvcCore()
                .AddJsonOptions(cfg =>
                {
                    cfg.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddAuthorization();

            services
                .AddAuthentication(config =>
                {
                    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddCookie(opts =>
                {
                    opts.Cookie.HttpOnly = true;
                    opts.Cookie.SameSite = SameSiteMode.Lax;
                    opts.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                })
                .AddJwtBearer(config =>
                {
                    config.RequireHttpsMetadata = true;
                    config.SaveToken = true;
                    config.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(this.configuration["JwtSecret"])),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                    config.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies["shadowing_jwt"];

                            return Task.CompletedTask;
                        },
                    };
                });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(config =>
                {
                    config.WithOrigins(
                        this.configuration["BaseUrls:AdminClient"])
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            services.AddHttpClient();

            services.AddAzureClients(builder =>
            {
                builder.AddBlobServiceClient(this.configuration.GetConnectionString("storage"));
            });

            // AutoMapper
            var mapper = Mapper.Initialize();
            services.AddSingleton(mapper);

            // Managers
            services.AddTransient<AuthManager>();
            services.AddTransient<UserManager>();
            services.AddTransient<SeriesManager>();
            services.AddTransient<EpisodesManager>();
            services.AddTransient<RoomsManager>();
            services.AddTransient<ShadowsManager>();
            services.AddTransient<FavoritesManager>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseRouting();

            app.UseCors();

            app.UseCookiePolicy();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            logger.LogTrace("Startup Completed");
        }
    }
}

