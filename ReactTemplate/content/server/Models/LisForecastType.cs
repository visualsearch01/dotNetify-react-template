using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisForecastType
    {
        public LisForecastType()
        {
            LisForecastData = new HashSet<LisForecastData>();
        }

        public int IdForecastType { get; set; }
        public string NameType { get; set; }

        public ICollection<LisForecastData> LisForecastData { get; set; }
    }
}
