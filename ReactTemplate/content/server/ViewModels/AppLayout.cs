using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
// using System.Timers;
using System.Threading;
using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
// using AspNet.Security.OpenIdConnect.Extensions;
// using AspNet.Security.OpenIdConnect.Primitives;

namespace dotnetify_react_template
{
   [Authorize]
   public class AppLayout : BaseVM, IRoutable
   {
      private enum _levels // Route
      {
         Home,
         Dashboard,
         FormPage,
         TablePage,
         TablePage_1
      };

      private Timer _timer => null;
      private readonly string _connectionString;

      public string Greetings => "Hello World!";
      public DateTime ServerTime1 => DateTime.Now;
      public string ServerTime => ServerTime1.ToString("MM/dd/yyyy HH:mm:ss");
      public static string FormPagePath => "Form";
      public RoutingState RoutingState { get; set; }

      public string UserName; // { get; set; }
      public int UserId; // { get; set; }
      public string UserAvatar; // { get; set; }
      public bool UserIsAdmin;

      // public object Menus_del1 => new List<object>();
      // public object Menus_del2 => new List<object>();
      /*
      public static string[] Foo = new string[16];

      private Route[] Routes1 => new Route[
         this.GetRoute(nameof(_levels.Dashboard)),
         this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1"),
         this.GetRoute(nameof(_levels.TablePage)),
         this.GetRoute(nameof(_levels.TablePage_1))
      ];
      */
      public object Menus_del1_bak => new List<object>()
      {
         new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(_levels.Dashboard)) },
         new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1") },
         new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(_levels.TablePage)) }
      };
      public object Menus_del2_bak => new List<object>()
      {
         new { Title = "Dizionario",   Icon = "assessment", Route = this.GetRoute(nameof(_levels.TablePage_1)) },
         new { Title = "Traduzione",   Icon = "grid_on",    Route = this.GetRoute(nameof(_levels.TablePage_1)) }
      };
      public object Menus_del1;
      public object Menus_del2;
      // public List genericListType => typeof(List<object>);
      public AppLayout(IConfiguration configuration, IPrincipalAccessor principalAccessor)
      {
         // Console.WriteLine("Route dashboard: " + this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1"));
         // string _connectionString = cs; //onfiguration["ConnectionStrings:lis"]; // configuration.GetValue<string>("ConnectionStrings:lis");
         // configuration.GetValue<string>("Scripts:lis");
         _connectionString = configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
         Console.WriteLine("AppLayout.cs - costruttore, stringa connessione DB MySQL: " + _connectionString); //_configuration["ConnectionStrings:lis"]);

         var userIdentity = principalAccessor.Principal.Identity as ClaimsIdentity;
         foreach (Claim claim in userIdentity.Claims)  
         {  
            Console.WriteLine("CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value); //  + "</br>");
         }  
         UserName = userIdentity.Name;
         // UserId = 9;
         Console.WriteLine("Applayout - UserId: " + UserId);

         // Int32.Parse(userIdentity.NameIdentifier);
         // userIdentity.Claims.Subject.Value;
         // Int32.Parse(userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.NameIdentifier)?.Value);
         // Int32.Parse(userIdentity.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value);
         if (int.TryParse(userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value, out int id)) {
            UserId = id;
            Console.WriteLine("Applayout - UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
            Console.WriteLine("Applayout - id: " + id);
         }
         else {
            Console.WriteLine("Applayout - No UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
         }

         UserAvatar = userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.Uri)?.Value;
         // userIdentity.Uri.Value;
         UserIsAdmin = string.Equals(UserName, "rai");
         /*
         Menus_del1 = new List<object>()
         {
            new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(_levels.Dashboard)) },
            // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1") },
            new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(_levels.TablePage)) }
         };
         */
         // AddProperty<object>(Menus_del1, { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1") });  
         // Menus_del1[2] = new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1") };  
         /*
         Menus_del2 = new List<object>()
         {
            new { Title = "Dizionario/composizione",   Icon = "grid_on",    Route = this.GetRoute(nameof(_levels.TablePage_1)) }
         };
         */

         var genericListType = typeof(List<>);
         var specificListType = genericListType.MakeGenericType(typeof(List<object>));
         Menus_del1 = Activator.CreateInstance(specificListType);
         Menus_del2 = Activator.CreateInstance(specificListType);
         /*
         Menus_del2 = new List<object>()
         {
            new { Title = "Dizionario",   Icon = "assessment", Route = new RouteTemplate(nameof(_levels.TablePage_1)) { UrlPattern = "TablePage_1", ViewUrl = nameof(_levels.TablePage_1) }   }, // new RouteTemplate("TablePage_1")}, // { UrlPattern = "page1" }), // ,this.GetRoute(nameof(_levels.TablePage_1)) },
            new { Title = "Traduzione",   Icon = "grid_on",    Route = new RouteTemplate(nameof(_levels.TablePage_1)) { UrlPattern = "TablePage_1", ViewUrl = nameof(_levels.TablePage_1) }   }  //  new RouteTemplate("TablePage_1")}  // { UrlPattern = "page1" }), // ,this.GetRoute(nameof(_levels.TablePage_1)) }, // this.GetRoute(nameof(_levels.TablePage_1)) }
            // new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(this._levels.TablePage_1)) },
            // new { Title = "Traduzionbbbbe",   Icon = "grid_on",    Route = this.GetRoute(nameof(this._levels.TablePage_1)) }
         };
         public class Route
         {
            /// <summary>
            /// Identifies the route template.
            /// </summary>
            public string TemplateId { get; set; }

            /// <summary>
            /// Route path relative to the root path.
            /// </summary>
            public string Path { get; set; }

            /// <summary>
            /// Optional; only set it if you want to redirect to a different root.
            /// </summary>
            public string RedirectRoot { get; set; }
         */

         if (UserId == 3 || UserIsAdmin) {
            Menus_del1 = new List<object>()
            {
               new { Title = "Meteo",        Icon = "assessment", Route = new {TemplateId = "Dashboard", Path = "Dashboard", primaryText = "Meteo"} },               // this.GetRoute(nameof(_levels.Dashboard)) },
               new { Title = "Impostazioni", Icon = "web",        Route = new {TemplateId = "FormPage",  Path = $"{FormPagePath}/1", primaryText = "Impostazioni"} },// Route = this.GetRoute(nameof(_levels.FormPage), $"{FormPagePath}/1") },
               new { Title = "Le mie liste", Icon = "grid_on",    Route = new {TemplateId = "TablePage", Path = "TablePage", primaryText = "Le mie liste"} }        // this.GetRoute(nameof(_levels.TablePage)) }
            };
            this.RegisterRoutes("/", new List<RouteTemplate>
            {
               new RouteTemplate(nameof(_levels.Home)) { UrlPattern = "", ViewUrl = nameof(_levels.Dashboard) },
               new RouteTemplate(nameof(_levels.Dashboard)),
               new RouteTemplate(nameof(_levels.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)" },
               new RouteTemplate(nameof(_levels.TablePage)),
               new RouteTemplate(nameof(_levels.TablePage_1))
            });
         }

         if (UserId == 4 || UserIsAdmin) {
            Menus_del2 = new List<object>()
            {
               new { Title = "Dizionario",   Icon = "assessment", Route = new {TemplateId = "TablePage_1", Path = "TablePage_1", primaryText = "Dizionario"} },
               new { Title = "Traduzione",   Icon = "web",        Route = new {TemplateId = "TablePage_1", Path = "TablePage_1", primaryText = "Traduzione"} }, // this.GetRoute(nameof(_levels.TablePage_1)) }
               // new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(this._levels.TablePage_1)) },
               new { Title = "I miei video", Icon = "grid_on",    Route = new {TemplateId = "TablePage", Path = "TablePage", primaryText = "I miei video"} }
            };
            this.RegisterRoutes("/", new List<RouteTemplate>
            {
               new RouteTemplate(nameof(_levels.Home)) { UrlPattern = "", ViewUrl = nameof(_levels.TablePage_1) },
               new RouteTemplate(nameof(_levels.Dashboard)),
               new RouteTemplate(nameof(_levels.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)" },
               new RouteTemplate(nameof(_levels.TablePage)),
               new RouteTemplate(nameof(_levels.TablePage_1))
            });
         }
         Changed(nameof(Menus_del1));
         Changed(nameof(Menus_del2));
         // PushUpdates();
         /*
         _timer = null; // timer per far arrivare alla gui l'ora corrente aggiornata al secondo - copiato da HelloWorld
         _timer = new Timer(state =>
         {
            Changed(nameof(ServerTime));
            PushUpdates();
         }, null, 0, 1000); // every 1000 ms.
         */
      }
      /*
      public object Menus_del2 => new List<object>()
      {
         new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(_levels.TablePage_1)) },
         new { Title = "Traduzionbbbbe",   Icon = "grid_on",    Route = this.GetRoute(nameof(_levels.TablePage_1)) }
      };
      */
      public override void Dispose() => _timer.Dispose();
   }
}
