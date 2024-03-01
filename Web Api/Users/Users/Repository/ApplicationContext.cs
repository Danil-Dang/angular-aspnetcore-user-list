using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Users.Entities.Models;

namespace Users.Repository
{
	public class ApplicationContext : IdentityDbContext<User>
    {
		public ApplicationContext(DbContextOptions options)
			: base(options)
		{
		}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

