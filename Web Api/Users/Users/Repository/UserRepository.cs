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
				return await connection.QueryFirstOrDefaultAsync<User>(query, new { username });
			}
		}
	}
}

