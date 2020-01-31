using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    public partial class LisMenu
    {
        public int IdMenu { get; set; }
        public byte Auth { get; set; }
        public string NameMenu { get; set; }
        public string UrlMenu { get; set; }
        public string Notes { get; set; }
    }
}
