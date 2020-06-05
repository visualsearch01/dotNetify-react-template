// using AspNet.Security.OpenIdConnect.Extensions;
// using AspNet.Security.OpenIdConnect.Primitives;
using DotNetify.Routing;
using DotNetify.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using DotNetify;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
// using System.Timers;
using System.Threading;

namespace dotnetify_react_template
{
  [Authorize]
  public class AppLayout : BaseVM, IRoutable
  {
    // Enums are types, not variables.
    // Therefore they are 'static' per definition, you dont need the keyword.
    public enum _routes // Route
    {
      Home,
      Dashboard,
      FormPage,
      TablePage,
      TablePage_1
    };

    private Timer _timer => null;
    private readonly string _connectionString;
    ILogger _logger;

    public string Greetings => "Hello World!";
    public DateTime ServerTime1 => DateTime.Now;
    public string ServerTime => ServerTime1.ToString("MM/dd/yyyy HH:mm:ss");
    public static string FormPagePath => "Settings";
    public static string DashboardPath => "Meteo";
    public static string TablePagePath => "Liste";
    public static string TablePage_1Path => "Didattica";
    public RoutingState RoutingState { get; set; }

    public int UserId;
    public string UserName;
    public string UserAvatar;
    public bool UserIsAdmin;

    private RouteTemplate DashboardHom_Template => new RouteTemplate(nameof(_routes.Home)) { UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) };
    private RouteTemplate DashboardHomeTemplate => new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) };
    private RouteTemplate TablePage_1HomeTemplate => new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.TablePage_1) };
    private RouteTemplate DashboardTemplate => new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) };
    private RouteTemplate FormPageTemplate => new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) };
    private RouteTemplate TablePageTemplate => new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) };
    private RouteTemplate TablePage_1Template => new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) };

    // private Route dasroute => this.GetRoute(nameof(_routes.Dashboard), $"{DashboardPath}");
    // private Route ffff => this.GetRoute(nameof(_routes.TablePage), $"{TablePagePath}/meteo");
    // public Route ggg() {return this.ffff;}
    // public static int getUserId() {return UserId;}

    public object Menus_del1 => new List<object>()
    {
      new { Title = "Meteo",          Icon = "assessment", Route = this.GetRoute(nameof(_routes.Dashboard), $"{DashboardPath}") },
      new { Title = "I miei video",   Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage), $"{TablePagePath}/meteo") }
    };
    public object Menus_del2 => new List<object>()
    {
      new { Title = "Dizionario",     Icon = "assessment", Route = this.GetRoute(nameof(_routes.TablePage_1), $"{TablePage_1Path}/dizionario") },
      new { Title = "Traduzione",     Icon = "web",        Route = this.GetRoute(nameof(_routes.TablePage_1), $"{TablePage_1Path}/traduzione") },
      new { Title = "I miei video",   Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage), $"{TablePagePath}/didattica") }
    };
    public object Menus_amm => new List<object>()
    {
      new { Title = "Impostazioni",   Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}") } // $"{FormPagePath}/1") },
    };
    public object Menus_del1_new;
    public object Menus_del2_new;
    public object Menus_amm_new;
    public AppLayout(IConfiguration configuration, IPrincipalAccessor principalAccessor, ILogger<AppLayout> logger)
    {
      _logger = logger;
      _connectionString = configuration.GetConnectionString("lis");
      _logger.LogInformation("AppLayout.cs - costruttore, stringa connessione DB MySQL: " + _connectionString);
      var userIdentity = principalAccessor.Principal.Identity as ClaimsIdentity;
      foreach (Claim claim in userIdentity.Claims)
      {
        _logger.LogInformation("Applayout.cs -------------- CLAIM TYPE: " + claim.Type);
        _logger.LogInformation("Applayout.cs -------------- CLAIM VALUE: " + claim.Value); //  + "</br>");
      }

      try {
        UserName = userIdentity.Name;
        UserAvatar = userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.Uri)?.Value;
        UserIsAdmin = string.Equals(UserName, "rai");
      } catch(Exception ex) {
        _logger.LogError("Applayout.cs Name Exception - " + ex.Message);
      }
      _logger.LogInformation("Applayout.cs - UserName : " + UserName);
      _logger.LogInformation("Applayout.cs - UserId   : " + UserId);
      if (int.TryParse(userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value, out int id)) {
        UserId = id;
        _logger.LogInformation("Applayout.cs - UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
        _logger.LogInformation("Applayout.cs - id: " + id);
      }
      else {
        _logger.LogInformation("Applayout.cs - No UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
      }

      // var _userRepository = new UserRepository(principalAccessor);
      // Console.WriteLine("Applayout.cs - NetworkID -------------------------: " + _userRepository.GetUserNetworkId());


      if (UserId == 3 || UserIsAdmin) {
        this.RegisterRoutes("/", new List<RouteTemplate>
        {
          new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
          new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
          new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }

        });
      }
      else if (UserId == 4 || UserId == 5 || UserIsAdmin) {
        this.RegisterRoutes("/", new List<RouteTemplate>
        {
          new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.TablePage_1) },
          new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
          new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
          new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }
        });
      }

    }

    public override void Dispose() => _timer.Dispose();
   }



    public interface IUserRepository
    {
      string GetUserNetworkId();
      int GetUserPhoneKey();
      string GetUserInfo();
    }


   public class UserRepository : IUserRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserNetworkId()
        {
            string userName = null;
            string NetworkId = null;

            //-------------checking where fails
            if (_httpContextAccessor == null)
            {
                throw new Exception("In IsUserValidated() - Error: _httpContextAccessor == null");
            }

            if (_httpContextAccessor.HttpContext == null)
            {
                throw new Exception("In IsUserValidated() - Error: _httpContextAccessor.HttpContext == null");
            }

            if (_httpContextAccessor.HttpContext.User == null)
            {
                throw new Exception("In IsUserValidated() - Error: _httpContextAccessor.HttpContext.User == null");
            }

            if (_httpContextAccessor.HttpContext.User.Identity == null)
            {
                throw new Exception("In IsUserValidated() - Error: _httpContextAccessor.HttpContext.User.Identity == null");
            }
            //-------------checking where fails done

            var identity = _httpContextAccessor.HttpContext.User.Identity;

            if (identity.IsAuthenticated)
            {
                userName = identity.Name;
                // _httpContextAccessor.HttpContext.User.Name;
            }
            else
            {
                // var basicCredentials = new BasicAuthenticationHeader(_httpContextAccessor.HttpContext);
                userName = "nuuuuu"; // basicCredentials.UserName;
                Console.WriteLine("UserRepository - Nameeeeee -------------------------: " + identity.Name);
                var userClaims = _httpContextAccessor.HttpContext.User.Claims.ToList();
                try {     
                  Console.WriteLine("UserRepository - Nameeeeee -------------------------: " + userClaims[0] );
                } catch(Exception ex) {
                  Console.WriteLine("UserRepository Exception - " + ex.Message);
                }
                
                
                // userName = identity.Id; // _httpContextAccessor.HttpContext.User.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value;//   NameIdentifier;
                // _httpContextAccessor.HttpContext.User.Name;
            }

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
                && Environment.GetEnvironmentVariable("USER_NETWORK_ID") != null) // used for testing in development by setting overriding environmental varibles
            {
                NetworkId = Environment.GetEnvironmentVariable("USER_NETWORK_ID");
            }
            else
            { // assume production
                NetworkId = userName.Split("\\").Last();
            }

            return NetworkId;
        }

        public string GetUserInfo() { return "";}

        public int GetUserPhoneKey()
        {
            // var userInfo = UserInfo.GetUserInfo(GetUserNetworkId());
            int PhoneKey = 66; // userInfo.userPhoneKeyId;
            return PhoneKey;
        }
    }
}
