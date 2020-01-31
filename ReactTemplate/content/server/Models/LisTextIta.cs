using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisTextIta
    {
        public int IdTextIta { get; set; }
        public int IdUserEdit { get; set; }
        public int Version { get; set; }
        public string TextIta { get; set; }
        public string Notes { get; set; }

        public LisUser IdUserEditNavigation { get; set; }
    }
}
