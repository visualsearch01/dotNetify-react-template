using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisTimeframe
    {
        public int IdTimeframe { get; set; }
        public int IdEdition { get; set; }

        public LisEdition IdEditionNavigation { get; set; }
    }
}
