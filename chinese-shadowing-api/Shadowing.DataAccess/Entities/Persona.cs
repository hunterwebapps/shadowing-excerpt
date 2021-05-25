using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Entities
{
    public class Persona
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public List<Section> Sections { get; set; }
        public List<UserPersona> UserPersonas { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
