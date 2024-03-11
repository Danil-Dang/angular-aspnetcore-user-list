﻿using System;
using Users.Entities.Models;

namespace Users.Contracts
{
	public interface IUserRepository
	{
		public Task<IEnumerable<User>> GetUsers();
	}
}

