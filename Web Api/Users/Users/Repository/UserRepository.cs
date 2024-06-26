﻿using System;
using Users.Contracts;
using Users.Entities.Models;
using Dapper;
using Users.Entities.Dto;
using System.Data;
using BCrypt.Net;
using System.Text;

namespace Users.Repository
{
	public class UserRepository : IUserRepository
	{
		private readonly DapperContext _context;

		public UserRepository(DapperContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<User>> GetUsers()
		{
			var query = "SELECT * FROM Users";

			using (var connection = _context.CreateConnection())
			{
				var users = await connection.QueryAsync<User>(query);
				return users.ToList();
			}
		}

		public async Task<User> GetUser(int id)
		{
			var query = "SELECT * FROM Users WHERE Id = @Id";

			using (var connection = _context.CreateConnection())
			{
				var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { id });
				return user;
			}
		}

		public async Task<User> CreateUser(UserForCreationDto user)
		{
			var PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
			user.PasswordHash = Encoding.UTF8.GetBytes(PasswordHash);
			var PasswordSalt = BCrypt.Net.BCrypt.GenerateSalt();
			user.PasswordSalt = Encoding.UTF8.GetBytes(PasswordSalt);

			var query = "INSERT INTO Users (FirstName, LastName, Username, Email, PasswordHash, PasswordSalt, IsActive, CreatedDate) VALUES (@FirstName, @LastName, @Username, @Email, @PasswordHash, @PasswordSalt, @IsActive, @CreatedDate)" +
				"SELECT CAST(SCOPE_IDENTITY() as int)";

			var parameters = new DynamicParameters();
			parameters.Add("FirstName", user.FirstName, DbType.String);
			parameters.Add("LastName", user.LastName, DbType.String);
			parameters.Add("Username", user.Username, DbType.String);
			parameters.Add("Email", user.Email, DbType.String);
			parameters.Add("PasswordHash", user.PasswordHash, DbType.Binary);
			parameters.Add("PasswordSalt", user.PasswordSalt, DbType.Binary);
			parameters.Add("IsActive", user.IsActive, DbType.Boolean);
			parameters.Add("CreatedDate", user.CreatedDate, DbType.DateTime2);

			using (var connection = _context.CreateConnection())
			{
				var id = await connection.QuerySingleAsync<int>(query, parameters);

				var createdUser = new User
				{
					Id = id,
					FirstName = user.FirstName,
					LastName = user.LastName,
					Username = user.Username,
					Email = user.Email,
					Password = user.Password,
					IsActive = user.IsActive,
					CreatedDate = user.CreatedDate
				};

				return createdUser;
			}
		}

		public async Task UpdateUser(int id, UserForUpdateDto user)
		{
			var query = "UPDATE Users SET FirstName = @FirstName, LastName = @LastName, Username = @Username, Email = @Email WHERE Id = @Id";

			var parameters = new DynamicParameters();
			parameters.Add("Id", id, DbType.Int32);
			parameters.Add("FirstName", user.FirstName, DbType.String);
			parameters.Add("LastName", user.LastName, DbType.String);
			parameters.Add("Username", user.Username, DbType.String);
			parameters.Add("Email", user.Email, DbType.String);

			using (var connection = _context.CreateConnection())
			{
				await connection.ExecuteAsync(query, parameters);
			}
		}

		public async Task DeleteUser(int id)
		{
			var query = "DELETE FROM Users WHERE Id = @Id";

			using (var connection = _context.CreateConnection())
			{
				await connection.ExecuteAsync(query, new { id });
			}
		}

		public async Task<User> FindUserByUsername(string username)
		{
			var query = "SELECT * FROM Users WHERE Username = @username";

			using (var connection = _context.CreateConnection())
			{
				var user = await connection.QueryFirstOrDefaultAsync<User>(query, new { username });
				return user;
			}
		}

		// public async Task<GetRoleResponse> GetUserRole(int id)
		public async Task<IEnumerable<GetRoleResponse>> GetUserRoles(int id)
		{
			// var query = "SELECT r.Role FROM UserRoles ur INNER JOIN Roles r ON ur.RoleId = r.Id WHERE ur.UserId = @Id";
			var query = "SELECT ur.Id, r.Role FROM UserRoles ur INNER JOIN Roles r ON ur.RoleId = r.Id WHERE ur.UserId = @Id";

			using (var connection = _context.CreateConnection())
			{
				var user = await connection.QueryAsync<GetRoleResponse>(query, new { id });
				return user.ToList();
			}
		}

		public async Task<Role> GetUserRole(int id)
		{
			var query = "SELECT * FROM UserRoles WHERE Id = @Id";

			using (var connection = _context.CreateConnection())
			{
				var user = await connection.QuerySingleOrDefaultAsync<Role>(query, new { id });
				return user;
			}
		}

		public async Task<UserRoleForCreationDto> CreateUserRole(UserRoleForCreationDto user)
		// public async Task CreateUserRole(UserRoleForCreationDto user)
		{
			var query = "INSERT INTO UserRoles (UserId, RoleId, CreatedDate) VALUES (@UserId, @RoleId, @CreatedDate)" +
						"SELECT CAST(SCOPE_IDENTITY() as int)";

			var parameters = new DynamicParameters();
			parameters.Add("UserId", user.UserId, DbType.Int32);
			parameters.Add("RoleId", user.RoleId, DbType.Int32);
			parameters.Add("CreatedDate", user.CreatedDate, DbType.DateTime2);

			using (var connection = _context.CreateConnection())
			{
				// await connection.ExecuteAsync(query, parameters);
				var id = await connection.QuerySingleAsync<int>(query, parameters);

				var createdRole = new UserRoleForCreationDto
				{
					Id = id,
					UserId = user.UserId,
					RoleId = user.RoleId,
					CreatedDate = user.CreatedDate
				};

				return createdRole;
			}
		}

		public async Task UpdateUserRole(int id, UserRoleForUpdateDto user)
		{
			// var query = "UPDATE UserRoles SET UserId = @UserId, RoleId = @RoleId WHERE Id = @Id";
			var query = "UPDATE UserRoles SET RoleId = @RoleId WHERE Id = @Id";

			var parameters = new DynamicParameters();
			parameters.Add("Id", id, DbType.Int32);
			// parameters.Add("UserId", user.UserId, DbType.Int32);
			parameters.Add("RoleId", user.RoleId, DbType.Int32);

			using (var connection = _context.CreateConnection())
			{
				await connection.ExecuteAsync(query, parameters);
			}
		}

		public async Task DeleteUserRole(int id)
		{
			var query = "DELETE FROM UserRoles WHERE Id = @Id";

			using (var connection = _context.CreateConnection())
			{
				await connection.ExecuteAsync(query, new { id });
			}
		}
	}
}

