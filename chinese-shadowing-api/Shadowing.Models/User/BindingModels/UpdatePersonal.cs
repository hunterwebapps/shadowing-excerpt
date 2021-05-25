using Shadowing.Models.Common.Enums;

namespace Shadowing.Models.User.BindingModels
{
    public class UpdatePersonal
    {
        public string Avatar { get; set; }
        public string DisplayName { get; set; }
        public Gender Gender { get; set; }
    }
}
