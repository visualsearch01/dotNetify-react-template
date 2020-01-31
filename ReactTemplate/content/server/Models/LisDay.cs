using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisDay
    {
        public LisDay()
        {
            LisForecast = new HashSet<LisForecast>();
        }

        public int IdDay { get; set; }
        public int IdTimeframe { get; set; }
        public DateTime DateDay { get; set; }
        public string Notes { get; set; }

        public ICollection<LisForecast> LisForecast { get; set; }
    }
}
