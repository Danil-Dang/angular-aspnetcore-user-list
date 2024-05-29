using System;
using Users.Entities.Dto;
using Users.Entities.Models;

namespace Users.Contracts
{
	public interface IUserRepository
	{
		public Task<IEnumerable<User>> GetUsers();
		public Task<User> GetUser(int id);
		public Task<User> CreateUser(UserForCreationDto user);
		public Task UpdateUser(int id, UserForUpdateDto user);
		public Task DeleteUser(int id);

		// public Task LoginUser(UserForLoginDto model);
		public Task<User> FindUserByUsername(string username);
		// public Task<GetRoleResponse> GetUserRole(int id);
		public Task<IEnumerable<GetRoleResponse>> GetUserRoles(int id);
		public Task<Role> GetUserRole(int id);
		public Task<UserRoleForCreationDto> CreateUserRole(UserRoleForCreationDto user);
		public Task UpdateUserRole(int id, UserRoleForUpdateDto user);
		public Task DeleteUserRole(int id);

	}
}