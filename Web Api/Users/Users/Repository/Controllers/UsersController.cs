using System;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Users.Contracts;
using Users.Entities.Dto;
using Users.Entities.Models;
using  Users.Helpers;

namespace Users.Repository.Controllers
{
	[Route("api/users")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserRepository _userRepo;
		private readonly JwtUtils _jwtUtils;
		
		public UsersController(IUserRepository userRepo, JwtUtils jwtUtils)
		{
			_userRepo = userRepo;
			_jwtUtils = jwtUtils;
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

		[HttpPost("register")]
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

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto user)
		{
			try
			{
				var dbUser = await _userRepo.GetUser(id);
				if (dbUser == null)
					return NotFound();
				
				await _userRepo.UpdateUser(id, user);
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteUser(int id)
		{
			try
			{
				var dbUser = await _userRepo.GetUser(id);
				if (dbUser == null)
					return NotFound();

				await _userRepo.DeleteUser(id);
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPost("login")]
		[AllowAnonymous]
		public async Task<IActionResult> LoginUser(UserForLoginDto model)
		{
			var user = await _userRepo.FindUserByUsername(model.Username);
			var PasswordHash = Encoding.UTF8.GetString(user.PasswordHash);
			if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, PasswordHash))
				return Unauthorized();

			var token = _jwtUtils.GenerateToken(user);
			return Ok(new { token }); 
		}
	}
}

