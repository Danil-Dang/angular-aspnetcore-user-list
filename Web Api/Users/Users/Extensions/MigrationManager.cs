using System;
using Users.Migrations;

namespace Users.Extensions
{
	public static class MigrationManager
	{
        public static IHost MigrateDatabase(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var databaseService = scope.ServiceProvider.GetRequiredService<Database>();
                try
                {
                    databaseService.CreateDatabase("ngNetDB");
                }
                catch
                {
                    //log errors or ...
                    throw;
                }
            }
            return host;
        }
    }
}

