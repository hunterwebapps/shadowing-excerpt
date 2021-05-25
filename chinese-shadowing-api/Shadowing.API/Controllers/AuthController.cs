using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shadowing.Business.Auth;
using Shadowing.Business.Extensions;
using Shadowing.Business.Users;
using Shadowing.Models.Auth.BindingModels;
using Shadowing.Models.User.ViewModels;

namespace Shadowing.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthManager authManager;
        private readonly UserManager userManager;

        public AuthController(AuthManager authManager, UserManager userManager)
        {
            this.authManager = authManager;
            this.userManager = userManager;
        }

        [HttpGet("me")]
        [ProducesResponseType(201, Type = typeof(User))]
        [ProducesResponseType(200, Type = typeof(User))]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.GetUserId();

            if (userId == null)
            {
                var anonymousUser = await this.authManager.CreateAnonymousUserAsync();

                this.SetAuthCookie(Response.Cookies, anonymousUser.Token, anonymousUser.Expiration);

                return CreatedAtRoute(
                    nameof(UsersController.GetUser),
                    new { userId = anonymousUser.User.Id },
                    anonymousUser.User);
            }

            var authenticatedUser = await this.authManager.RenewTokenAsync(User);

            this.SetAuthCookie(Response.Cookies, authenticatedUser.Token, authenticatedUser.Expiration);

            return Ok(authenticatedUser.User);
        }

        [HttpPost]
        public async Task<IActionResult> AuthenticateUser(LoginCredentials loginCredentials)
        {
            var authDetails = await this.authManager.AuthenticateUserAsync(loginCredentials, User.GetUserId());

            if (authDetails == null)
            {
                return NotFound();
            }

            this.SetAuthCookie(Response.Cookies, authDetails.Token, authDetails.Expiration);

            return Ok(authDetails.User);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCredentials(UpdateCredentials credentials)
        {
            var user = await this.authManager.UpdateCredentialsAsync(credentials, User.GetUserId());

            return Ok(new
            {
                user.Email,
            });
        }

        [HttpDelete]
        public IActionResult LogoutUser()
        {
            Response.Cookies.Delete("shadowing_jwt");

            return NoContent();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(RegisterCredentials registerCredentials)
        {
            var issues = await this.authManager.CheckCredentialsAsync(registerCredentials);

            if (issues.Count > 0)
            {
                return Ok(issues);
            }

            var user = await this.authManager.RegisterUserAsync(registerCredentials, User.GetUserId());

            return CreatedAtRoute(
                nameof(UsersController.GetUser),
                new { userId = user.Id },
                user);
        }

        private void SetAuthCookie(IResponseCookies cookies, string token, DateTime expiration)
        {
            cookies.Append(
                "shadowing_jwt",
                token,
                new CookieOptions()
                {
                    Path = "/",
                    HttpOnly = true,
                    IsEssential = true,
                    Secure = true,
                    Expires = expiration,
                });
        }
    }
}
