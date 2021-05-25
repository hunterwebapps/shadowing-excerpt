using System;

namespace Shadowing.DataAccess.Entities
{
    public class Favorite
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string EpisodeId { get; set; }
        public Episode Episode { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
