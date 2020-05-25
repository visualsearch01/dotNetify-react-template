// using AspNet.Security.OpenIdConnect.Extensions;
// using AspNet.Security.OpenIdConnect.Primitives;
using DotNetify.Routing;
using DotNetify.Security;
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

    public string UserName; // { get; set; }
    public int UserId; // { get; set; }
    public string UserAvatar; // { get; set; }
    public bool UserIsAdmin;

    private RouteTemplate DashboardHom_Template => new RouteTemplate(nameof(_routes.Home)) { UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) };

    private RouteTemplate DashboardHomeTemplate => new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) };
    private RouteTemplate TablePage_1HomeTemplate => new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.TablePage_1) };
    private RouteTemplate DashboardTemplate => new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) };
    private RouteTemplate FormPageTemplate => new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) };
    private RouteTemplate TablePageTemplate => new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) };
    private RouteTemplate TablePage_1Template => new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) };

    private Route dasroute => this.GetRoute(nameof(_routes.Dashboard), $"{DashboardPath}");
    private Route ffff => this.GetRoute(nameof(_routes.TablePage), $"{TablePagePath}/meteo");
    // new RouteTemplate(nameof(_routes.Dashboard)) { UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
    // new RouteTemplate(nameof(_routes.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
    // new RouteTemplate(nameof(_routes.TablePage)) { UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
    // new RouteTemplate(nameof(_routes.TablePage_1)) { UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }

    // public object Menus_del1 => new List<object>();
    // public object Menus_del2 => new List<object>();

    /*
    public static string[] Foo = new string[16];

    private Route[] Routes1 => new Route[
      this.GetRoute(nameof(_routes.Dashboard)),
      this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1"),
      this.GetRoute(nameof(_routes.TablePage)),
      this.GetRoute(nameof(_routes.TablePage_1))
    ];
    */
    public Route ggg() {return this.ffff;}

    public object Menus_del1 => new List<object>()
    {
      new { Title = "Meteo",          Icon = "assessment", Route = this.GetRoute(nameof(_routes.Dashboard), $"{DashboardPath}") },
      // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}") }, // $"{FormPagePath}/1") },
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
      // new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(_routes.Dashboard)) },
      new { Title = "Impostazioni", Icon = "web",          Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}") } // $"{FormPagePath}/1") },
      // new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage)) }
    };
    public object Menus_del1_new;
    public object Menus_del2_new;
    public object Menus_amm_new;
    // public List genericListType => typeof(List<object>);
    public AppLayout(IConfiguration configuration, IPrincipalAccessor principalAccessor, ILogger<AppLayout> logger)
    {
      _logger = logger;
      try {
        // Route formRoute = this.GetRoute(nameof(AppLayout._routes.FormPage), $"{AppLayout.FormPagePath}/1");
        // Route formRoute = this.GetRoute("Form", $"{AppLayout.FormPagePath}/1");
        // _logger.LogWarning("AppLayout.cs - formRoute: " + formRoute); //_configuration["ConnectionStrings:lis"]);
        // Un errore qui magari compila ma se non preso da un catch fa il logout subito dopo il login
        _logger.LogWarning("AppLayout.cs - _routes.FormPage:");
        // _logger.LogWarning(AppLayout._routes.FormPage);
        // var Homer = this.GetRoute(nameof(_routes.Home));
        // _logger.LogWarning("AppLayout.cs - Home route:");
        // _logger.LogWarning(Homer);
        _logger.LogWarning("AppLayout.cs - RoutingState:");
        // _logger.LogWarning(this.RoutingState);
      } catch(Exception ex) {
        _logger.LogWarning("AppLayout.cs GetRoute Exception - " + ex.Message);
      }
         
      // _logger.LogWarning("Route dashboard: " + this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1"));
      // string _connectionString = cs; //onfiguration["ConnectionStrings:lis"]; // configuration.GetValue<string>("ConnectionStrings:lis");
      // configuration.GetValue<string>("Scripts:lis");
      _connectionString = configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
      _logger.LogWarning("AppLayout.cs - costruttore, stringa connessione DB MySQL: " + _connectionString); //_configuration["ConnectionStrings:lis"]);

      var userIdentity = principalAccessor.Principal.Identity as ClaimsIdentity;
      foreach (Claim claim in userIdentity.Claims)  
      {  
        _logger.LogWarning("CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value); //  + "</br>");
      }  
      UserName = userIdentity.Name;
      // UserId = 9;
      _logger.LogWarning("Applayout - UserId: " + UserId);

      // Int32.Parse(userIdentity.NameIdentifier);
      // userIdentity.Claims.Subject.Value;
      // Int32.Parse(userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.NameIdentifier)?.Value);
      // Int32.Parse(userIdentity.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value);
      if (int.TryParse(userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value, out int id)) {
        UserId = id;
        _logger.LogWarning("Applayout - UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
        _logger.LogWarning("Applayout - id: " + id);
      }
      else {
        _logger.LogWarning("Applayout - No UserId: " + userIdentity.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
      }

      UserAvatar = userIdentity.Claims.FirstOrDefault(i => i.Type == ClaimTypes.Uri)?.Value;
      // userIdentity.Uri.Value;
      UserIsAdmin = string.Equals(UserName, "rai");
      /*
      Menus_del1 = new List<object>()
      {
        new { Title = "Meteo",        Icon = "assessment", Route = this.GetRoute(nameof(_routes.Dashboard)) },
        // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") },
        new { Title = "Lista video",  Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage)) }
      };
      */
      // AddProperty<object>(Menus_del1, { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") });  
      // Menus_del1[2] = new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") };  
      /*
      Menus_del2 = new List<object>()
      {
        new { Title = "Dizionario/composizione",   Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage_1)) }
      };
      */
      /*
      var genericListType = typeof(List<>);
      var specificListType = genericListType.MakeGenericType(typeof(List<object>));
      Menus_del1 = Activator.CreateInstance(specificListType);
      Menus_del2 = Activator.CreateInstance(specificListType);
      Menus_amm = Activator.CreateInstance(specificListType);
      */
      /*
      Menus_del2 = new List<object>()
      {
        new { Title = "Dizionario",   Icon = "assessment", Route = new RouteTemplate(nameof(_routes.TablePage_1)) { UrlPattern = "TablePage_1", ViewUrl = nameof(_routes.TablePage_1) }   }, // new RouteTemplate("TablePage_1")}, // { UrlPattern = "page1" }), // ,this.GetRoute(nameof(_routes.TablePage_1)) },
        new { Title = "Traduzione",   Icon = "grid_on",    Route = new RouteTemplate(nameof(_routes.TablePage_1)) { UrlPattern = "TablePage_1", ViewUrl = nameof(_routes.TablePage_1) }   }  //  new RouteTemplate("TablePage_1")}  // { UrlPattern = "page1" }), // ,this.GetRoute(nameof(_routes.TablePage_1)) }, // this.GetRoute(nameof(_routes.TablePage_1)) }
        // new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(this._routes.TablePage_1)) },
        // new { Title = "Traduzionbbbbe",   Icon = "grid_on",    Route = this.GetRoute(nameof(this._routes.TablePage_1)) }
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
      
      // if (UserIsAdmin) {
        /*
        try {
            Menus_amm = this.Menus_amm_bak;
        } catch(Exception ex) {
            _logger.LogWarning("AppLayout.cs Menus_amm = this.Menus_amm_bak Exception - " + ex.Message);
        }
        */
      //   Menus_amm = new List<object>()
      //   {
      //      new { Title = "Impostazioni", Icon = "web",        Route = new {TemplateId = "FormPage",  Path = $"{FormPagePath}/1", primaryText = "Impostazioni"} }
      //   };
      // }
         
      if (UserId == 3 || UserIsAdmin) {
        // Menus_del1_bak = new List<object>();
        // Menus_del1 = this.Menus_del1_bak;
      /*   
        Menus_del1 = new List<object>()
        {
            new { Title = "Meteo",        Icon = "assessment", Route = new {TemplateId = "Dashboard", Path = "Dashboard", primaryText = "Meteo"} },               // this.GetRoute(nameof(_routes.Dashboard)) },
            // new { Title = "Impostazioni", Icon = "web",        Route = new {TemplateId = "FormPage",  Path = $"{FormPagePath}/1", primaryText = "Impostazioni"} },// Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") }
            // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") }, // Compila ma slogga l'app subito appena dopo login
            new { Title = "Le mie liste", Icon = "grid_on",    Route = new {TemplateId = "TablePage", Path = "TablePage", primaryText = "Le mie liste"} }        // this.GetRoute(nameof(_routes.TablePage)) }
        };
        */            
        
        /*
        /// Contructor that accepts the identity key and JS module to load.
        /// </summary>
        /// <param name="id">Identifies this template; also used for the View name and the URL pattern by default.</param>
        /// <param name="jsModuleUrl">URL of Javascript module.</param>
        public RouteTemplate(string id, string jsModuleUrl = null) : this()
        {
            Id = id;
            JSModuleUrl = jsModuleUrl;
        }
        
        Menus_del1 = new List<object>()
        {
            new { Title = "Meteo",        Icon = "assessment", Route = new RouteTemplate("Dashboard", $"./views/Dashboard.js") },
            // new { Title = "Impostazioni", Icon = "web",        Route = new {TemplateId = "FormPage",  Path = $"{FormPagePath}/1", primaryText = "Impostazioni"} },// Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") }
            // new { Title = "Impostazioni", Icon = "web",        Route = this.GetRoute(nameof(_routes.FormPage), $"{FormPagePath}/1") }, // Compila ma slogga l'app subito appena dopo login
            new { Title = "Le mie liste", Icon = "grid_on",    Route = new RouteTemplate("TablePage", $"./views/TablePage.js") }
        };
        */
        /*
        public RoutingState RoutingState { get; set; }
        public ActivatedEventArgs TestActivatedEventArgs { get; set; }
        public TestNavBarVM()
        {
            this.RegisterRoutes("index", new List<RouteTemplate>
            {
              new RouteTemplate { Id = "Books", UrlPattern = "books", Target = "NavContent", ViewUrl = "/BookStore_cshtml", VMType = typeof(TestBookStoreVM) },
            });
            this.OnActivated((sender, e) => TestActivatedEventArgs = e);
        }
        */
        this.RegisterRoutes("/", new List<RouteTemplate>
        {
          /*
          new RouteTemplate(nameof(_routes.Home)) { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate(nameof(_routes.Dashboard)) { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate(nameof(_routes.FormPage)) { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
          new RouteTemplate(nameof(_routes.TablePage)) { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
          new RouteTemplate(nameof(_routes.TablePage_1)) { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }
          */
          new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
          new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
          new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }

        });
      }

      else if (UserId == 4 || UserIsAdmin) {
        // Menus_del2 = this.Menus_del2_bak;
          /*           
        Menus_del2 = new List<object>()
        {
            new { Title = "Dizionario",   Icon = "assessment", Route = new {TemplateId = "TablePage_1", Path = "TablePage_1", primaryText = "Dizionario"} },
            new { Title = "Traduzione",   Icon = "web",        Route = new {TemplateId = "TablePage_1", Path = "TablePage_1", primaryText = "Traduzione"} }, // this.GetRoute(nameof(_routes.TablePage_1)) }
            // new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(this._routes.TablePage_1)) },
            new { Title = "I miei video", Icon = "grid_on",    Route = new {TemplateId = "TablePage", Path = "TablePage", primaryText = "I miei video"} }
        };
        */        
        this.RegisterRoutes("/", new List<RouteTemplate>
        {
          /*
            new RouteTemplate(nameof(_routes.Home)) { Id = nameof(_routes.Home), UrlPattern = "", ViewUrl = nameof(_routes.TablePage_1) },
            new RouteTemplate(nameof(_routes.Dashboard)) { UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
            new RouteTemplate(nameof(_routes.FormPage)) { UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
            new RouteTemplate(nameof(_routes.TablePage)) { UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
            new RouteTemplate(nameof(_routes.TablePage_1)) { Id = nameof(_routes.TablePage_1), UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }
          */

          new RouteTemplate { Id = "Home", UrlPattern = "", ViewUrl = nameof(_routes.TablePage_1) },
          new RouteTemplate { Id = "Dashboard", UrlPattern = $"{DashboardPath}(/:id)", ViewUrl = nameof(_routes.Dashboard) },
          new RouteTemplate { Id = "FormPage", UrlPattern = $"{FormPagePath}(/:id)", ViewUrl = nameof(_routes.FormPage) },
          new RouteTemplate { Id = "TablePage", UrlPattern = $"{TablePagePath}(/:id)", ViewUrl = nameof(_routes.TablePage) },
          new RouteTemplate { Id = "TablePage_1", UrlPattern = $"{TablePage_1Path}(/:id)", ViewUrl = nameof(_routes.TablePage_1) }
        });
      }
      // Changed(nameof(Menus_del1));
      // Changed(nameof(Menus_del2));
      // Changed(nameof(Menus_amm));
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
        new { Title = "Dizionaribbbo",   Icon = "assessment", Route = this.GetRoute(nameof(_routes.TablePage_1)) },
        new { Title = "Traduzionbbbbe",   Icon = "grid_on",    Route = this.GetRoute(nameof(_routes.TablePage_1)) }
    };
    */
    public override void Dispose() => _timer.Dispose();
   }
}
