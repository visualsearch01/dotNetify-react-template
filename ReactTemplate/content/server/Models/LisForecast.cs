using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisForecast
    {
        public LisForecast()
        {
            LisForecastData = new HashSet<LisForecastData>();
        }

        public int IdForecast { get; set; }
        public int IdDay { get; set; }
        public int IdEdition { get; set; }
        public int OffsetDay { get; set; }
        public string Notes { get; set; }

        public LisDay IdDayNavigation { get; set; }
        public LisEdition IdEditionNavigation { get; set; }
        public ICollection<LisForecastData> LisForecastData { get; set; }
    }
}
