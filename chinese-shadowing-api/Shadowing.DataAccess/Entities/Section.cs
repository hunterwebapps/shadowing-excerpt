using System;

namespace Shadowing.DataAccess.Entities
{
    public class Section
    {
        public string Id { get; set; }
        public double Start { get; set; }
        public double End { get; set; }
        public string AudioUrl { get; set; }
        public string Text { get; set; }
        public string PersonaId { get; set; }
        public Persona Persona { get; set; }
        public string EpisodeId { get; set; }
        public Episode Episode { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
