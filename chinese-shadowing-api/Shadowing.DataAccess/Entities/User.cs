using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Entities
{
    public class User
    {
        public string Id { get; set; }

        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public string Gender { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool IsAnonymous => Email == null;
        public DateTime LastLogin { get; set; }
        public DateTime Created { get; set; }
        public List<UserPersona> UserPersonas { get; set; }
        public List<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public List<Favorite> Favorites { get; set; }
    }
}
