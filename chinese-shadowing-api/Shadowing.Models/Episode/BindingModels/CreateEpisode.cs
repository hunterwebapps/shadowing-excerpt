using Shadowing.Models.Episode.Enums;
using Shadowing.Models.Section.BindingModels;
using System.ComponentModel.DataAnnotations;

namespace Shadowing.Models.Episode.BindingModels
{
    public class CreateEpisode
    {
        [Required]
        public string Title { get; set; }
        public double Thumbnail { get; set; }
        public double Start { get; set; }
        public double End { get; set; }
        public Difficulty Difficulty { get; set; }
        public CreateSection[] Sections { get; set; }
    }
}
