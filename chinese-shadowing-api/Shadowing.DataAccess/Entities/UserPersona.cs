using System;

namespace Shadowing.DataAccess.Entities
{
    public class UserPersona
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string PersonaId { get; set; }
        public Persona Persona { get; set; }
        public string RoomId { get; set; }
        public Room Room { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
