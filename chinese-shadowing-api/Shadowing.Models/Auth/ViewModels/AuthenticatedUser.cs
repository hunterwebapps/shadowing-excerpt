using System;
using UserViewModel = Shadowing.Models.User.ViewModels.User;

namespace Shadowing.Models.Auth.ViewModels
{
    public class AuthenticatedUser
    {
        public UserViewModel User { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
