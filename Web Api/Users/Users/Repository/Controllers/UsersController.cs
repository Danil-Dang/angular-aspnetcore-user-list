using System;
using Microsoft.AspNetCore.Mvc;
using Users.Contracts;
using Users.Entities.Dto;

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

		[HttpGet("{id}", Name = "UserById")]
		public async Task<IActionResult> GetUser(int id)
		{
			try
			{
				var user = await _userRepo.GetUser(id);
				if (user == null) return NotFound();

				return Ok(user);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPost]
		public async Task<IActionResult> CreateUser(UserForCreationDto user)
		{
			try
			{
				var createdUser = await _userRepo.CreateUser(user);
				return CreatedAtRoute("UserById", new { id = createdUser.Id }, createdUser);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}


	}
}

