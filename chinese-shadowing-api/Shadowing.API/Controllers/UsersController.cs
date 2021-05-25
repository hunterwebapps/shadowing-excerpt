using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shadowing.Business.Extensions;
using Shadowing.Business.Users;
using Shadowing.Models.User.BindingModels;
using Shadowing.Models.User.ViewModels;

namespace Shadowing.API.Controllers
{
    [Authorize(Roles = "User")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager userManager;

        public UsersController(UserManager userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet("{userId}", Name = nameof(GetUser))]
        [ProducesResponseType(200, Type = typeof(User))]
        public async Task<IActionResult> GetUser(string userId)
        {
            var model = await this.userManager.GetUserAsync(userId, false);

            return Ok(model);
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<User>))]
        public async Task<IActionResult> GetUsers()
        {
            var models = await this.userManager.GetUsersAsync();

            return Ok(models);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePersonal(UpdatePersonal updatePersonal)
        {
            var user = await this.userManager.UpdatePersonalAsync(updatePersonal, User.GetUserId());

            return Ok(new
            {
                user.AvatarUrl,
                user.DisplayName,
                user.Gender,
            });
        }
    }
}
