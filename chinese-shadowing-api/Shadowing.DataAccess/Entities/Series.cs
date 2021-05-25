using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Entities
{
    public class Series
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UrlTitle { get; set; }
        public List<Episode> Episodes { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
    }
}
