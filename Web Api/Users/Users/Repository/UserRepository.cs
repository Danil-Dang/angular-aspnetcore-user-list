using System;
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
			
			var query = "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, PasswordSalt, IsActive, CreatedDate) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @PasswordSalt, @IsActive, @CreatedDate)" +
				"SELECT CAST(SCOPE_IDENTITY() as int)";

			var parameters = new DynamicParameters();
			parameters.Add("FirstName", user.FirstName, DbType.String);
			parameters.Add("LastName", user.LastName, DbType.String);
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
					Email = user.Email,
					Password = user.Password,
					IsActive = user.IsActive,
					CreatedDate = user.CreatedDate
				};

				return createdUser;
			}
		}
	}
}

