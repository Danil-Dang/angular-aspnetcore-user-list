using System;
namespace Users.Entities.Models
{
	public class User
	{
		public int Id { get; set; }
		public string? FirstName { get; set; }
        public string? LastName { get; set; }
		public string? Username { get; set; }
		public string? Email { get; set; }
		public string? Password { get; set; }
		public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}

