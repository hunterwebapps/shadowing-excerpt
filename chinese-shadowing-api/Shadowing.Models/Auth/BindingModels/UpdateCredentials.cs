using System.ComponentModel.DataAnnotations;

namespace Shadowing.Models.Auth.BindingModels
{
    public class UpdateCredentials
    {
        [EmailAddress, Required]
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
