using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisTextLis
    {
        public int IdTextLis { get; set; }
        public int IdUserEdit { get; set; }
        public int Version { get; set; }
        public string TextLis { get; set; }
        public string XmlLis { get; set; }
        public string Notes { get; set; }

        public LisUser IdUserEditNavigation { get; set; }
    }
}
