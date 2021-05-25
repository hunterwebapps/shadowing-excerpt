namespace Shadowing.DataAccess.Entities
{
    public class UserRole
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string Role { get; set; }
    }
}
