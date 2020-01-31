using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisEdition
    {
        public LisEdition()
        {
            LisForecast = new HashSet<LisForecast>();
            LisTimeframe = new HashSet<LisTimeframe>();
        }

        public int IdEdition { get; set; }
        public int TimeEdition { get; set; }

        public ICollection<LisForecast> LisForecast { get; set; }
        public ICollection<LisTimeframe> LisTimeframe { get; set; }
    }
}
