using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using DotNetify;
using DotNetify.Security;

namespace dotnetify_react_template
{
   public class Startup
   {


      private IConfiguration Configuration { get; }
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }


      public void ConfigureServices(IServiceCollection services)
      {
         // Add OpenID Connect server to produce JWT access tokens.
         services.AddAuthenticationServer();

         services.AddMemoryCache();
         services.AddSignalR();
         services.AddDotNetify();

         services.AddTransient<ILiveDataService, MockLiveDataService>();
         services.AddSingleton<IEmployeeService, EmployeeService>();
         services.AddMvc();
      }

      public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
      {
         loggerFactory.AddConsole(Configuration.GetSection("Logging"));
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

         app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
         {
            HotModuleReplacement = true
         });

         app.UseFileServer();

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