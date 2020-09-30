using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;

using DotNetify;
using DotNetify.Security;

using dotnetify_react_template.server.Data;
using dotnetify_react_template.server.Models;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Session;
using Microsoft.AspNetCore.SpaServices.Webpack;

using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.EntityFrameworkCore;
using MySql.Data.EntityFrameworkCore.Extensions;

using System;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace dotnetify_react_template
{
  public class Startup
  {
    private IConfiguration _configuration { get; }
    private string _connectionString;
    private ILogger _logger;

    public Startup(IHostingEnvironment env, ILogger<Startup> logger) {
      _logger = logger;
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json",                        optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true,  reloadOnChange: true)
        .AddEnvironmentVariables();
        _configuration = builder.Build();
    }

    public void ConfigureServices(IServiceCollection services) {
      // Add OpenID Connect server to produce JWT access tokens.
      // string connectionString = _configuration["ConnectionStrings:lis"];
      // La stringa di connessione viene passata solo all'istanza auth server e all EmployeeService, cosi' che le query vengano eseguite solo da li'
      
      _connectionString = Microsoft
                 .Extensions
                 .Configuration
                 .ConfigurationExtensions
                 .GetConnectionString(_configuration, "lis");
      
      
      // _configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
      
      _logger.LogInformation("Startup!");
      _logger.LogInformation("Startup.cs - ConfigureServices, stringa DB: " + _connectionString); //_configuration["ConnectionStrings:lis"]);
      
      // services.AddDbContext<HouserContext>(o => o.UseMySql(connectionString));
      // services.AddDbContext<ApplicationDbContext>(options => options.UseMySQL(_connectionString)); // Configuration.GetConnectionString("ConnectionStrings:lis")));
      // services.AddDbContext<DataContext>(options => options.UseMySQL(_connectionString)); // Configuration.GetConnectionString("ConnectionStrings:lis")));
      // services.AddDbContext<lis2Context>(options => options.UseMySQL(_configuration.GetConnectionString(_connectionString)));
      services.AddDbContext<ApplicationDbContext>(options => options.UseMySQL(_connectionString));

      try {
        services.AddAuthenticationServer(_connectionString, _configuration);
        services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddMemoryCache();
        services.AddSignalR();
        services.AddDotNetify();
        // services.AddHttpContextAccessor();
        // services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddTransient<ILiveDataService, MockLiveDataService>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);
        services.AddSingleton<IEmployeeService, EmployeeService>(serviceProvider => {
          // var connectionString = _configuration["ConnectionStrings:lis"];
          return new EmployeeService(_connectionString);
        });
      } catch(Exception ex) {
        _logger.LogError("Startup.cs Exception - " + ex.Message);
      }
      try {
        // app.UseSession();
        services
          .AddMvc()
          .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
          .AddSessionStateTempDataProvider();
        services.AddSession();
        // services.AddMvc();
        // services.AddControllersWithViews();
        // services.AddHttpContextAccessor();
        // services.AddHttpContextAccessor();
        // services.AddTransient<IUserRepository, UserRepository>();
        // services.AddHttpContextAccessor();
        // services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        // services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
        // services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
        // services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);
        // services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        // services.AddSingleton<IEmployeeService, EmployeeService>(); // _configuration );
        // services.AddHttpContextAccessor();
        // services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
      } catch(Exception ex) {
        _logger.LogError("Startup.cs Exception - " + ex.Message);
      }
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
      loggerFactory.AddConsole(_configuration.GetSection("Logging"));
      loggerFactory.AddDebug();
      app.UseSession();
      app.UseAuthentication();
      
      // app.UseWebSockets();
      // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-3.1
      var webSocketOptions = new WebSocketOptions() 
      {
          KeepAliveInterval = TimeSpan.FromSeconds(120),
          ReceiveBufferSize = 4 * 1024
      };
      app.UseWebSockets(webSocketOptions);
      
      app.UseSignalR(routes => routes.MapDotNetifyHub());
      app.UseDotNetify(config => {
        // Middleware to do authenticate token in incoming request headers.
        config.UseJwtBearerAuthentication(new TokenValidationParameters
        {
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AuthServer.SecretKey)),
          ValidateIssuerSigningKey = true,
          ValidateAudience = false,
          ValidateIssuer = false,
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromSeconds(0)
        });

        // Filter to check whether user has permission to access view models with [Authorize] attribute.
        config.UseFilter<AuthorizeFilter>();
      });
         
      if (env.IsDevelopment())
      {
        _logger.LogInformation("Startup.cs - Configure, env: DEVELOPMENT - env.EnvironmentName: " + env.EnvironmentName);
        app.UseDeveloperExceptionPage();
        app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
        {
          HotModuleReplacement = true
        });
      }
      else
      {
        _logger.LogInformation("Startup.cs - Configure, env: PRODUCTION - env.EnvironmentName: " + env.EnvironmentName);
        // app.UseExceptionHandler("/Home/Error");
        // app.UseDeveloperExceptionPage();
        app.UseBrowserLink();
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
        // app.UseExceptionHandler("/Home/Error");
      }

      // app.UseFileServer();
      /*
      Da indagare per IIS
      app.UseFileServer(new FileServerOptions
      {
          FileProvider = new PhysicalFileProvider(@"\\server\path"),
          RequestPath = new PathString("/MyPath"),
          EnableDirectoryBrowsing = false
      });
      */
      /*
      app.UseStaticFiles();
      // _configuration.GetValue<string>("Paths:video_rel"), _configuration.GetValue<string>("Paths:video_dir")
      var videoPath = Path.Combine(Directory.GetCurrentDirectory(), _configuration.GetValue<string>("Paths:video_rel"), _configuration.GetValue<string>("Paths:video_dir"));
      _logger.LogInformation("Startup.cs - Configure, video relative path: " + videoPath);
      _logger.LogInformation("Startup.cs - Configure, video absolute path: " + Path.GetFullPath((new Uri(videoPath)).LocalPath)); // Si potrebbe usare direttamente il path assoluto senza doverne montare due relativi..

      app.UseStaticFiles(new StaticFileOptions()
      {
        FileProvider = new PhysicalFileProvider(videoPath),
        RequestPath = new PathString( _configuration.GetValue<string>("Urls:video_url")) // "/video_gen/mp4")
      });
      */    
      
      // Versione su macchina remota di test
      app.UseFileServer();
      /*
      app.UseFileServer(new FileServerOptions
      {
          FileProvider = new PhysicalFileProvider(_configuration.GetValue<string>("Paths:video_dir")),
          RequestPath = new PathString( _configuration.GetValue<string>("Urls:video_url")),
          EnableDirectoryBrowsing = false
      });
      */
      app.UseStaticFiles();
      
      var videoPath = Path.Combine(
        Directory.GetCurrentDirectory(), 
        _configuration.GetValue<string>("Paths:video_rel"), 
        _configuration.GetValue<string>("Paths:video_dir"));
      _logger.LogInformation("Startup.cs - Configure, video relative path: " + videoPath);
      _logger.LogInformation("Startup.cs - Configure, video absolute path: " + Path.GetFullPath((new Uri(videoPath)).LocalPath)); 
      
      app.UseStaticFiles(new StaticFileOptions()
      {
        FileProvider = new PhysicalFileProvider(videoPath),
        RequestPath = new PathString( _configuration.GetValue<string>("Urls:video_url")) // "/video_gen/mp4")
      });
      
      
      /*
      // Creazione automatica cartella rules sotto /wwwroot se non esiste
      // Non sembra funzionare in Release
      // string rulesPath = Path.Combine(HostingEnvironment.ApplicationPhysicalPath, @"wwwroot\rules");
      string rulesPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\dist\rules");
      if (!Directory.Exists(rulesPath))
      {
        _logger.LogInformation("Startup.cs - Configure, rules path KO: " + rulesPath);
        Directory.CreateDirectory(rulesPath);
      }
      else {
        _logger.LogInformation("Startup.cs - Configure, rules path OK: " + rulesPath);
      }
      */
      
      app.UseMvc(routes =>
      {
        _logger.LogInformation("Startup.cs - UseMvc routes: " + routes);
        routes.MapRoute(
          name: "api",
          // template: "api/{controller=Values}/{action=values}/{id?}"
          template: "api/{controller=Home}/{action=values}/{target=Index}/{id?}"
        );
      });

      app.Run(async(context) =>
      {
        _logger.LogWarning("Startup.cs - app.Run(async(context):" + context);

        var uri = context.Request.Path.ToUriComponent();
        if (uri.EndsWith(".map"))
          return;
        else if (uri.EndsWith("_hmr"))  // Fix HMR for deep links.
          context.Response.Redirect("/dist/__webpack_hmr");
        using (var reader = new StreamReader(File.OpenRead("wwwroot/index.html")))
          await context.Response.WriteAsync(reader.ReadToEnd());
      });
    }
  }
}
