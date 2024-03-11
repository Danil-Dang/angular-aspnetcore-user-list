using System;
using FluentMigrator.Runner;
using Users.Migrations;

namespace Users.Extensions
{
	public static class MigrationManager
	{
        public static WebApplication MigrateDatabase(this WebApplication webApp)
        {
            using (var scope = webApp.Services.CreateScope())
            {
                var databaseService = scope.ServiceProvider.GetRequiredService<Database>();

                try
                {
                    databaseService.CreateDatabase("ngNetDB");
                }
                catch
                {
                    throw;
                }
            }
            return webApp;
        }
    }
}

