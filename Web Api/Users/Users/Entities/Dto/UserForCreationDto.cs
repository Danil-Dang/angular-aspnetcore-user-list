using System;
namespace Users.Entities.Dto
{
	public class UserForCreationDto
	{
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }
        public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

// {
//     "firstname": "Second",
//     "lastname": "User",
//     "username": "User",
//     "email": "seconduser@gmail.com",
//     "password": "1234567",
//     "confirmPassword": "1234567"
// }