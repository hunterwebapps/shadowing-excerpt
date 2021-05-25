using Shadowing.Models.Section.ViewModels;
using Shadowing.Models.Episode.Enums;
using System.Collections.Generic;

namespace Shadowing.Models.Episode.ViewModels
{
    public class EpisodeDetails
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UrlTitle { get; set; }
        public double Duration { get; set; }
        public Difficulty Difficulty { get; set; }
        public string ThumbnailUrl { get; set; }
        public string VideoUrl { get; set; }
        public string BackgroundUrl { get; set; }
        public string SeriesId { get; set; }
        public List<SectionDetails> Sections { get; set; }
    }
}
