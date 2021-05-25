using Shadowing.Models.Episode.BindingModels;
using Shadowing.Models.Persona.BindingModels;
using System.ComponentModel.DataAnnotations;

namespace Shadowing.Models.Series.BindingModels
{
    public class CreateSeries
    {
        [Required]
        public string VideoId { get; set; }
        [Required]
        public string Title { get; set; }
        public CreateEpisode[] Episodes { get; set; }
        public CreatePersona[] Personas { get; set; }
    }
}
