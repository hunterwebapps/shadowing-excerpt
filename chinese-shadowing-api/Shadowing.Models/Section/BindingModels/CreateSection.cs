using System.ComponentModel.DataAnnotations;

namespace Shadowing.Models.Section.BindingModels
{
    public class CreateSection
    {
        public double Start { get; set; }
        public double End { get; set; }
        [Required]
        public string Text { get; set; }
        public string PersonaId { get; set; }
    }
}
