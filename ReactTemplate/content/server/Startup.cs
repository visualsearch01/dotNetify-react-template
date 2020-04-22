using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;

using DotNetify;
using DotNetify.Security;

using dotnetify_react_template.server.Data;
using dotnetify_react_template.server.Models;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.EntityFrameworkCore;
using MySql.Data.EntityFrameworkCore.Extensions;
using System;
using System.IO;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace dotnetify_react_template
{
   public class Startup
   {
      private IConfiguration _configuration { get; }
      private string _connectionString;
      
      public Startup(IHostingEnvironment env)
      {
         var builder = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .AddEnvironmentVariables();
         _configuration = builder.Build();
      }
      // public IConfigurationRoot Configuration { get; }
      /*
      public Startup(IConfiguration configuration)
      {
         _configuration = configuration;
         Console.WriteLine("Startup.cs - costruttore, configurazione: " + _configuration.ToString());
      }
      */
      public void ConfigureServices(IServiceCollection services)
      {
         // Add OpenID Connect server to produce JWT access tokens.
         // string connectionString = _configuration["ConnectionStrings:lis"];

         // La stringa di connesione viene passata solo all'istanza auth server e all EmployeeService, cosi' che le query vengano eseguite solo da li'
         _connectionString =  _configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
         Console.WriteLine("Startup.cs - ConfigureServices, stringa DB: " + _connectionString); //_configuration["ConnectionStrings:lis"]);
         // services.AddDbContext<HouserContext>(o => o.UseMySql(connectionString));
         // services.AddDbContext<ApplicationDbContext>(options =>
         // options.UseMySQL(Configuration.GetConnectionString("ConnectionStrings:lis")));
         services.AddAuthenticationServer(_connectionString, _configuration);
         services.AddMemoryCache();
         services.AddSignalR();
         services.AddDotNetify();
         services.AddTransient<ILiveDataService, MockLiveDataService>();
         // services.AddSingleton<IEmployeeService, EmployeeService>(); // _configuration );
         services.AddSingleton<IEmployeeService, EmployeeService>(serviceProvider =>
         {
            // var connectionString = _configuration["ConnectionStrings:lis"];
            return new EmployeeService(_connectionString);
         });
         /*
         public void ConfigureServices(IServiceCollection services)
         {
            // Choose Scope, Singleton or Transient method
            services.AddSingleton<IRootService, RootService>();
            services.AddSingleton<INestedService, NestedService>(serviceProvider=>
            {
                  var connectionString = Configuration["Data:ConnectionString"];
                  return new NestedService(connectionString);
            });
         }
         */

         services.AddMvc();
         /*
         services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;                
            });
         */
      }
      /*
      public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc().AddJsonOptions(options =>
               {
                   options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
               });

            services.AddDbContext<ApplicationDbContext>(options =>
            {                
                options.UseSqlServer(@"Server=SERVER1;Database=DB1;User Id=BLAHBLAH;Password=BLAHBLAHBLAH;");                
                options.UseOpenIddict();
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;                
            });

            services.AddOpenIddict(options =>
            {                
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();                
                options.AddMvcBinders();
                options.EnableTokenEndpoint("/connect/token");
                options.AllowPasswordFlow();
                options.DisableHttpsRequirement();
                options.SetAccessTokenLifetime(TimeSpan.FromMinutes(5));
            });

            services.AddAuthentication()
                .AddOAuthValidation();
        }
      */
      public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
      {
         loggerFactory.AddConsole(_configuration.GetSection("Logging"));
         loggerFactory.AddDebug();

         app.UseAuthentication();
         app.UseWebSockets();
         app.UseSignalR(routes => routes.MapDotNetifyHub());
         app.UseDotNetify(config =>
         {
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
             Console.WriteLine("Startup.cs - Configure, env: DEVELOPMENT - env.EnvironmentName: " + env.EnvironmentName);
             app.UseDeveloperExceptionPage();
             app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
             {
                 HotModuleReplacement = true
             });
         }
         else
         {
            Console.WriteLine("Startup.cs - Configure, env: PRODUCTION - env.EnvironmentName: " + env.EnvironmentName);
             //app.UseExceptionHandler("/Home/Error");
             app.UseDeveloperExceptionPage();
         }
         /*
         app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
         {
            HotModuleReplacement = true
         });
         */
         app.UseFileServer();
         app.UseStaticFiles();
         // _configuration.GetValue<string>("Paths:video_rel"), _configuration.GetValue<string>("Paths:video_dir")
         var videoPath = Path.Combine(Directory.GetCurrentDirectory(), _configuration.GetValue<string>("Paths:video_rel"), _configuration.GetValue<string>("Paths:video_dir"));
         Console.WriteLine("Startup.cs - Configure, video relative path: " + videoPath);
         Console.WriteLine("Startup.cs - Configure, video absolute path: " + Path.GetFullPath((new Uri(videoPath)).LocalPath)); // Si potrebbe usare direttamente il path assoluto senza doverne montare due relativi..

         // FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"..\..\..\..\..\", @"Videos")),
         // RequestPath = new PathString("/video_gen/mp4")

         app.UseStaticFiles(new StaticFileOptions()
         {
            FileProvider = new PhysicalFileProvider(videoPath),
            RequestPath = new PathString( _configuration.GetValue<string>("Urls:video_url")) // "/video_gen/mp4")
         });

         app.UseMvc(routes =>
         {
            routes.MapRoute(
               name: "api",
               // template: "api/{controller=Values}/{action=values}/{id?}"
               template: "api/{controller=Home}/{action=values}/{target=Index}/{id?}"
            );
         });

         app.Run(async (context) =>
         {
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