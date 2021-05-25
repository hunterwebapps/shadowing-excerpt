using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Entities
{
    public class Episode
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UrlTitle { get; set; }
        public double Duration { get; set; }
        public string Difficulty { get; set; }
        public string VideoUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string BackgroundUrl { get; set; }
        public string SeriesId { get; set; }
        public Series Series { get; set; }
        public List<Section> Sections { get; set; }
        public List<Room> Rooms { get; set; }
        public List<Favorite> Favorites { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
