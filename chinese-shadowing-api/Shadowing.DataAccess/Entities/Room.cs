using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Entities
{
    public class Room
    {
        public string Id { get; set; }
        public string EpisodeId { get; set; }
        public Episode Episode { get; set; }
        public List<UserPersona> UserPersonas { get; set; }
        public List<Shadow> Shadows { get; set; }
        public string State { get; set; }
        public string CreatedById { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
