using System;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Users.Entities.Models;
using Users.Entities.Dto;

namespace Users.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public AccountsController(UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost("Registration")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistration)
        {
            if (userRegistration == null || !ModelState.IsValid)
                return BadRequest();

            var user = _mapper.Map<User>(userRegistration);
            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new UserRegistrationResponseDto { Errors = errors });
            }

            return StatusCode(201);
        }
    }
}

