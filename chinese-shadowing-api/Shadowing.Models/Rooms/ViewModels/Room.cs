using Shadowing.Models.Rooms.Enums;
using Shadowing.Models.Shadows.ViewModels;
using Shadowing.Models.UserPersonas.ViewModels;
using System.Collections.Generic;

namespace Shadowing.Models.Rooms.ViewModels
{
    public class Room
    {
        public string Id { get; set; }
        public string EpisodeId { get; set; }
        public List<UserPersona> UserPersonas { get; set; }
        public List<Shadow> Shadows { get; set; }
        public RoomState State { get; set; }
        public string CreatedById { get; set; }
    }
}
