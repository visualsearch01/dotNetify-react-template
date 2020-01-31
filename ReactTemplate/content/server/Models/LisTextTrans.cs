using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisTextTrans
    {
        public LisTextTrans()
        {
            LisForecastData = new HashSet<LisForecastData>();
            LisRequest = new HashSet<LisRequest>();
        }

        public int IdTextTrans { get; set; }
        public int IdTextIta { get; set; }
        public int IdTextLis { get; set; }

        public ICollection<LisForecastData> LisForecastData { get; set; }
        public ICollection<LisRequest> LisRequest { get; set; }
    }
}
