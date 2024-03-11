using System;
namespace Users.Entities.Models
{
	public class User
	{
		public int Id { get; set; }
		public string? FirstName { get; set; }
        public string? LastName { get; set; }
		public string? Email { get; set; }
		public string? Password { get; set; }
		// public string? ConfirmPassword { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}

