using System.ComponentModel.DataAnnotations;

namespace Shadowing.Models.Auth.BindingModels
{
    public class RegisterCredentials
    {
        [EmailAddress, Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
