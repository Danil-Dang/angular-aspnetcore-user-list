using System;
using FluentMigrator;

namespace Users.Migrations
{
	[Migration(1)]
	public class InitialTables_1 : Migration
	{
		public override void Down()
		{
			Delete.Table("Users");
		}

		public override void Up()
		{
			Create.Table("Users")
				.WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
				.WithColumn("FirstName").AsString(50).Nullable()
				.WithColumn("LastName").AsString(60).Nullable()
				.WithColumn("Email").AsString(50).NotNullable()
				.WithColumn("Password").AsString(50).NotNullable()
				.WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true)
				.WithColumn("CreatedDate").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentDateTime);
		}
	}
}

