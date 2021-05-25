using Microsoft.AspNetCore.Http;

namespace Shadowing.Models.Shadows.BindingModels
{
    public class SaveRecording
    {
        public string RoomId { get; set; }
        public string SectionId { get; set; }
        public IFormFile Recording { get; set; }
    }
}
