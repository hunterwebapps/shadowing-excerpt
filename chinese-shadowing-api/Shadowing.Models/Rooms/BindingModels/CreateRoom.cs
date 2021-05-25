using System.Collections.Generic;

namespace Shadowing.Models.Room.BindingModels
{
    public class CreateRoom
    {
        public string EpisodeId { get; set; }
        public List<string> PersonaIds { get; set; }
    }
}
