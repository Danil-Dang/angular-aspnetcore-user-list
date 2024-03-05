using System;
using AutoMapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Users.Entities.Models;
using Users.Entities.Dto;

namespace Users
{
	public class MappingProfile : Profile
    {
		public MappingProfile()
		{
            CreateMap<UserRegistrationDto, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
	}
}

