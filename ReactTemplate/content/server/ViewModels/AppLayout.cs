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
      private enum Route
      {
         Home,
         Dashboard,
         FormPage,
         TablePage,
         TablePage_1
      };

      private Timer _timer;
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

      public object Menus_del1 => new List<object>()
      {
         new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(Route.Dashboard)) },
         new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1") },
         new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(Route.TablePage)) }
      };
      public object Menus_del2 => new List<object>()
      {
         new { Title = "Dizionario/composizione",   Icon = "grid_on",    Route = this.GetRoute(nameof(Route.TablePage_1)) }
      };


      public AppLayout(IPrincipalAccessor principalAccessor)
      {
         // Console.WriteLine("Route dashboard: " + this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1"));
         // string _connectionString = cs; //onfiguration["ConnectionStrings:lis"]; // configuration.GetValue<string>("ConnectionStrings:lis");
         // configuration.GetValue<string>("Scripts:lis");

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
            new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(Route.Dashboard)) },
            // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1") },
            new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(Route.TablePage)) }
         };
*/
         // AddProperty<object>(Menus_del1, { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1") });  
         // Menus_del1[2] = new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1") };  
/*        
         Menus_del2 = new List<object>()
         {
            new { Title = "Dizionario/composizione",   Icon = "grid_on",    Route = this.GetRoute(nameof(Route.TablePage_1)) }
         };
*/
         this.RegisterRoutes("/", new List<RouteTemplate>
         {
            new RouteTemplate(nameof(Route.Home)) { UrlPattern = "", ViewUrl = nameof(Route.Dashboard) },
            new RouteTemplate(nameof(Route.Dashboard)),
            new RouteTemplate(nameof(Route.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)" },
            new RouteTemplate(nameof(Route.TablePage)),
            new RouteTemplate(nameof(Route.TablePage_1))
         });
         /*
         _timer = null; // timer per far arrivare alla gui l'ora corrente aggiornata al secondo - copiato da HelloWorld
         _timer = new Timer(state =>
         {
            Changed(nameof(ServerTime));
            PushUpdates();
         }, null, 0, 1000); // every 1000 ms.
         */
      }
      public override void Dispose() => _timer.Dispose();
   }
}
