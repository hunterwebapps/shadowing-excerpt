using Shadowing.Models.Episode.ViewModels;
using System.Collections.Generic;

namespace Shadowing.Models.Series.ViewModels
{
    public class SeriesDetails
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UrlTitle { get; set; }
        public List<EpisodeDetails> Episodes { get; set; }
    }
}
