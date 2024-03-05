using System;
namespace Users.Entities.Dto
{
	public class UserRegistrationResponseDto
	{
        public bool IsSuccessfulRegistration { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}

