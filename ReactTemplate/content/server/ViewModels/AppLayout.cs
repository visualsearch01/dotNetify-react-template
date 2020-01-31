using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
         TablePage
      };
      public static string FormPagePath => "Form";
      public RoutingState RoutingState { get; set; }
      public string UserName { get; set; }
      public int IdUser { get; set; }
      public string UserAvatar { get; set; }
      public object Menus => new List<object>()
      {
         new { Title = "Meteo",     Icon = "assessment", Route = this.GetRoute(nameof(Route.Dashboard)) },
         new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(Route.FormPage), $"{FormPagePath}/1") },
         new { Title = "Le mie liste",   Icon = "grid_on",    Route = this.GetRoute(nameof(Route.TablePage)) }
      };
      public AppLayout(IPrincipalAccessor principalAccessor)
      {
         var userIdentity = principalAccessor.Principal.Identity as ClaimsIdentity;

         foreach (Claim claim in userIdentity.Claims)  
         {  
            Console.WriteLine("CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value); //  + "</br>");  
         }  

         UserName = userIdentity.Name;
         IdUser = 9;
            // Int32.Parse(userIdentity.NameIdentifier);
            // userIdentity.Claims.Subject.Value;
            // Int32.Parse(userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.NameIdentifier)?.Value);
            // Int32.Parse(userIdentity.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value);

         if (int.TryParse(userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value, out int id)) {
               IdUser = id;
               Console.WriteLine("Applayout - IdUser: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
               Console.WriteLine("Applayout - id: " + id);
         }
         else {
            Console.WriteLine("Applayout - No IdUser: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
         }

         UserAvatar = 
         // userIdentity.Uri.Value;
         userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.Uri)?.Value;
         Console.WriteLine("Applayout - IdUser: " + IdUser);

         this.RegisterRoutes("/", new List<RouteTemplate>
            {
                new RouteTemplate(nameof(Route.Home)) { UrlPattern = "", ViewUrl = nameof(Route.Dashboard) },
                new RouteTemplate(nameof(Route.Dashboard)),
                new RouteTemplate(nameof(Route.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)" },
                new RouteTemplate(nameof(Route.TablePage))
            });
      }
   }
}
