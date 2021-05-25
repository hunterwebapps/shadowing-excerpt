namespace Shadowing.Models.Auth.BindingModels
{
    public class LoginCredentials
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Remember { get; set; }
    }
}
