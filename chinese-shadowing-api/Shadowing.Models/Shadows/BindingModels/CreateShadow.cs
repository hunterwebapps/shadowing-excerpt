using System;
using System.Collections.Generic;
using System.Text;

namespace Shadowing.Models.Shadows.BindingModels
{
    public class CreateShadow
    {
        public string RoomId { get; set; }
        public string SectionId { get; set; }
        public string InferenceText { get; set; }
        public string RecordingUrl { get; set; }
    }
}
