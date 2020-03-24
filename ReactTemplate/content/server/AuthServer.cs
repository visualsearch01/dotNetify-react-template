using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;

using dotnetify_react_template.server.Models;

using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics;

namespace dotnetify_react_template
{
   public static class AuthServer
   {
      public const string SecretKey = "my_secretkey_123!";
      // public const string _cs = @"server=localhost;port=3306;database=lis2;user=root;password=root";
      public const int _userid = 689;
      // LisUser _us;
      // public string _connectionString;
      // Source: https://github.com/aspnet-contrib/AspNet.Security.OpenIdConnect.Server
      public static void AddAuthenticationServer(this IServiceCollection services, string cs)//  IConfiguration configuration)
      {
         // string _connectionString = cs; //onfiguration["ConnectionStrings:lis"]; // configuration.GetValue<string>("ConnectionStrings:lis");
         Console.WriteLine("AuthServer.cs - costruttore, stringa DB: " + cs);
         
         var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

         services.AddAuthentication().AddOpenIdConnectServer(options =>
         {
            options.AccessTokenHandler = new JwtSecurityTokenHandler();
            options.SigningCredentials.AddKey(signingKey);

            options.AllowInsecureHttp = true;
            options.TokenEndpointPath = "/token";

            options.Provider.OnValidateTokenRequest = context =>
            {
               context.Validate();
               return Task.CompletedTask;
            };

            options.Provider.OnHandleTokenRequest = context =>
            {
               // if (context.Request.Password != "dotnetify")
               // _us = new LisUserDBContext(_cs).GetLisUser();
               var id_user = new LisUserDBContext(cs).GetLisUser(context.Request.Username, context.Request.Password).IdUser;
               if (id_user == 0 )
               {
                  context.Reject(
                      error: OpenIdConnectConstants.Errors.InvalidGrant,
                      description: "Invalid user credentials.");
                  return Task.CompletedTask;
               }
/*
               var Claims = new Claim[]
               {
                  OpenIdConnectConstants.Claims.Name,
                  // OpenIdConnectConstants.Claims.NameIdentifier,
                  new Claim(JwtRegisteredClaimNames.Sub,userId),
                  OpenIdConnectConstants.Claims.Role
               };
*/
               var identity = new ClaimsIdentity(context.Scheme.Name,
                  // Claims);
                  OpenIdConnectConstants.Claims.Name,
                  // OpenIdConnectConstants.Claims.NameIdentifier,
                  // new Claim(JwtRegisteredClaimNames.Sub,userId),
                  OpenIdConnectConstants.Claims.Role);

               identity.AddClaim(OpenIdConnectConstants.Claims.Name, context.Request.Username);
               // identity.AddClaim(OpenIdConnectConstants.Claims.IdUser, id_user);
               identity.AddClaim(OpenIdConnectConstants.Claims.Subject, context.Request.Username);
               

               identity.AddClaim(ClaimTypes.Name, context.Request.Username,
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);

               identity.AddClaim(ClaimTypes.NameIdentifier, id_user.ToString(),
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);
/*
               identity.AddClaim(ClaimTypes.sub, id_user.ToString(),
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);
*/
               // "../images/rai_teche.png",
               identity.AddClaim(ClaimTypes.Uri, "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);
                  IDictionary<string, string> userdata = new Dictionary<string, string>
                  {
                     { "userName", context.Request.Username }, { "UserId", id_user.ToString() }
                  };
               var ticket = new AuthenticationTicket(
                  new ClaimsPrincipal(identity),
                  new AuthenticationProperties(userdata), // ),
                  // "provaaa");
                  context.Scheme.Name);

               ticket.SetScopes(
                        OpenIdConnectConstants.Scopes.Profile,
                        OpenIdConnectConstants.Scopes.OfflineAccess);

               context.Validate(ticket);
               return Task.CompletedTask;
            };
         });
      }
   }
}
