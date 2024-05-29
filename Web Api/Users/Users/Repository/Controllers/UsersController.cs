using System;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Users.Contracts;
using Users.Entities.Dto;
using Users.Entities.Models;
using Users.Helpers;
using System.Security.Principal;

namespace Users.Repository.Controllers
{
	[Route("api/users")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserRepository _userRepo;
		// private readonly JwtUtils _jwtUtils;

		public UsersController(IUserRepository userRepo
		// JwtUtils jwtUtils
		)
		{
			_userRepo = userRepo;
			// _jwtUtils = jwtUtils;
		}

		// [HttpGet, Authorize(Roles = "Admin")]
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

		// [HttpGet("{id}", Name = "UserById"), Authorize]
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

		// [HttpGet("by-username/{username}", Name = "UserByUsername"), Authorize]
		[HttpGet("by-username/{username}", Name = "UserByUsername")]
		public async Task<IActionResult> FindUserByUsername(string username)
		{
			try
			{
				var user = await _userRepo.FindUserByUsername(username);
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

		// [HttpPut("{id}"), Authorize]
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

		// [HttpDelete("{id}"), Authorize]
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
			if (user == null)
			{
				return NotFound(new { error = new { message = "User Not Found!" } });
			}

			var PasswordHash = Encoding.UTF8.GetString(user.PasswordHash);
			if (!BCrypt.Net.BCrypt.Verify(model.Password, PasswordHash))
			{
				return Unauthorized(new { error = new { message = "Invalid Password!" } });
			}

			// var token = _jwtUtils.GenerateToken(user);
			var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ultraSuperPuperExtraSecretKey@369963"));
			var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

			var roles = await _userRepo.GetUserRoles(user.Id);
			var combinedRoles = "";
			if (roles != null)
			{
				foreach (var role in roles)
				{
					combinedRoles += role.Role;
				}
			}
			else
			{
				Console.WriteLine("No roles found for user.");
			}

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.Role, combinedRoles),
			};

			var tokeOptions = new JwtSecurityToken(
				issuer: "https://localhost:4201",
				audience: "https://localhost:4201",
				// claims: new List<Claim>(),
				claims: claims,
				expires: DateTime.Now.AddMinutes(50),
				signingCredentials: signinCredentials
			);
			var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

			// var userRoles = user.Roles.Select(r => r.Name).ToList();

			return Ok(new AuthenticatedResponse
			{
				Token = tokenString
			});
		}


		[HttpGet("role-by-id/{id}")]
		public async Task<IActionResult> GetUserRoles(int id)
		{
			try
			{
				var user = await _userRepo.GetUserRoles(id);
				if (user == null) return NotFound();

				return Ok(user);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpGet("role/{id}", Name = "UserRoleById")]
		public async Task<IActionResult> GetUserRole(int id)
		{
			try
			{
				var user = await _userRepo.GetUserRole(id);
				if (user == null) return NotFound();

				return Ok(user);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPost("role/register")]
		public async Task<IActionResult> CreateRole(UserRoleForCreationDto role)
		{
			try
			{
				var createdRole = await _userRepo.CreateUserRole(role);
				return CreatedAtRoute("UserRoleById", new { id = createdRole.Id }, createdRole);
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPut("role/{id}")]
		public async Task<IActionResult> UpdateRole(int id, UserRoleForUpdateDto role)
		{
			try
			{
				var dbHotel = await _userRepo.GetUserRole(id);
				if (dbHotel == null)
					return NotFound();

				await _userRepo.UpdateUserRole(id, role);
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		[HttpDelete("role/{id}", Name = "RoleDelete")]
		public async Task<IActionResult> DeleteRole(int id)
		{
			try
			{
				var dbRole = await _userRepo.GetUserRole(id);
				if (dbRole == null)
					return NotFound();

				await _userRepo.DeleteUserRole(id);
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}
	}
}

