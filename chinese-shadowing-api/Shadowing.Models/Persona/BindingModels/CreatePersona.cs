using Shadowing.Models.Common.Enums;

namespace Shadowing.Models.Persona.BindingModels
{
    public class CreatePersona
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Gender Gender { get; set; }
    }
}
