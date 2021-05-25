using Shadowing.Models.Auth.Enums;
using Shadowing.Models.Common.Enums;
using System;
using System.Collections.Generic;

namespace Shadowing.Models.User.ViewModels
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string AvatarUrl { get; set; }
        public Gender Gender { get; set; }
        public bool IsAnonymous { get; set; }
        public List<RoleIdentifier> Roles { get; set; }
        public DateTime Created { get; set; }
    }
}
