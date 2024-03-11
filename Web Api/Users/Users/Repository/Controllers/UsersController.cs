using System;
using Microsoft.AspNetCore.Mvc;
using Users.Contracts;

namespace Users.Repository.Controllers
{
	[Route("api/users")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserRepository _userRepo;
		
		public UsersController(IUserRepository userRepo)
		{
			_userRepo = userRepo;
		}

		[HttpGet]
		public async Task<IActionResult> GetUsers()
		{
			try
			{
				var users = await _userRepo.GetUsers();
				return Ok(users);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}
	}
}

