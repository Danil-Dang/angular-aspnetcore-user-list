using System;
using Users.Contracts;

namespace Users.Repository
{
	public class UserRepository : IUserRepository
	{
		private readonly DapperContext _context;

		public UserRepository(DapperContext context)
		{
			_context = context;
        }
	}
}

