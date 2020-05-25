using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace dotnetify_react_template
{
   public class Program
   {
      public static void Main(string[] args)
      {
         BuildWebHost(args).Run();
      }

      public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
               .UseStartup<Startup>()
               .UseUrls("http://0.0.0.0:5000") // Url raggiungibile anche dall'esterno
               .Build();
   }
}
