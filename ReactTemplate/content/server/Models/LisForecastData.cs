using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisForecastData
    {
        public int IdForecastData { get; set; }
        public int IdForecast { get; set; }
        public int IdForecastType { get; set; }
        public int IdTranslation { get; set; }
        public string Notes { get; set; }

        public LisForecast IdForecastNavigation { get; set; }
        public LisForecastType IdForecastTypeNavigation { get; set; }
        public LisTextTrans IdTranslationNavigation { get; set; }
    }
}
