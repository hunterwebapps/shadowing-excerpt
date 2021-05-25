using System;

namespace Shadowing.DataAccess.Entities
{
    public class Shadow
    {
        public string Id { get; set; }
        public string SectionId { get; set; }
        public Section Section { get; set; }
        public string RecordedUrl { get; set; }
        public string InferenceText { get; set; }
        public string RoomId { get; set; }
        public Room Room { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
