using System;
using Microsoft.EntityFrameworkCore;
using Users.Repository;

namespace Users.Extensions
{
	public static class ServiceExtensions
	{
        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

        public static void ConfigureIISIntegration(this IServiceCollection services) =>
            services.Configure<IISOptions>(options =>
            {

            });

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<ApplicationContext>(opts =>
                opts.UseSqlServer(configuration.GetConnectionString("Default"), b => b.MigrationsAssembly("Users")));

    }
}

