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
    
    // public const int _userid = 689;
    // public int _userid;
    
    // LisUser _us;
    // public string _connectionString;
    // Source: https://github.com/aspnet-contrib/AspNet.Security.OpenIdConnect.Server
    public static void AddAuthenticationServer(this IServiceCollection services, string cs, IConfiguration configuration)//  IConfiguration configuration)
    {
      // string _connectionString = cs; //onfiguration["ConnectionStrings:lis"]; // configuration.GetValue<string>("ConnectionStrings:lis");
      Console.WriteLine("AuthServer.cs - costruttore, stringa DB: " + cs);
         
      var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

      services
      .AddAuthentication()
      .AddOpenIdConnectServer(options =>
      {
        options.AccessTokenHandler = new JwtSecurityTokenHandler();
        options.SigningCredentials.AddKey(signingKey);
        options.AllowInsecureHttp = true;
        options.TokenEndpointPath = "/token";

        options.Provider.OnValidateTokenRequest = context =>
        {
          Console.WriteLine("AuthService.cs - OnValidateTokenRequest");
          context.Validate();
          return Task.CompletedTask;
        };

        options.Provider.OnHandleTokenRequest = context =>
        {
          Console.WriteLine("AuthService.cs - OnHandleTokenRequest");
          // if (context.Request.Password != "dotnetify")
          // _us = new LisUserDBContext(_cs).GetLisUser();
          var IdUser = new LisUserDBContext(cs).GetLisUser(context.Request.Username, context.Request.Password).IdUser;
          if (IdUser == 0 )
          {
            Console.WriteLine("AuthService.cs - OnHandleTokenRequest IdUser 0");
            context.Reject(
              error: OpenIdConnectConstants.Errors.InvalidGrant,
              description: "Invalid user credentials.");
              return Task.CompletedTask;
          }


          try {
            Console.WriteLine("AuthService.cs - OnHandleTokenRequest - IdUser OK");
            var identity = new ClaimsIdentity(context.Scheme.Name,
              OpenIdConnectConstants.Claims.Name,
              OpenIdConnectConstants.Claims.Role);
    
              // Add the mandatory subject/user identifier claim.
              Console.WriteLine("AuthService.cs - OnHandleTokenRequest - identity.AddClaim(OpenIdConnectConstants.Claims.Subject");
              identity.AddClaim(OpenIdConnectConstants.Claims.Subject, "[unique id]");

              // By default, claims are not serialized in the access/identity tokens.
              // Use the overload taking a "destinations" parameter to make sure
              // your claims are correctly inserted in the appropriate tokens.
              Console.WriteLine("AuthService.cs - OnHandleTokenRequest - identity.AddClaim(customclaim");
              identity.AddClaim(
                "urn:customclaim",
                "value",
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);

              identity.AddClaim(ClaimTypes.NameIdentifier, IdUser.ToString(),
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);


              identity.AddClaim("username", "Pinpoint",
                  OpenIdConnectConstants.Destinations.AccessToken,
                  OpenIdConnectConstants.Destinations.IdentityToken);

              identity.AddClaim(OpenIdConnectConstants.Claims.Name, context.Request.Username);


              // identity.AddClaim(new Claim(ClaimTypes.Name, "rai"));
              identity.AddClaim(new Claim("DisplayName", "hhhhhhhhhhhhhhhhhhh"));



              identity.AddClaim(ClaimTypes.Name, context.Request.Username,
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);
              /*
              identity.AddClaim(ClaimTypes.NameIdentifier, IdUser.ToString(),
                OpenIdConnectConstants.Destinations.AccessToken,
                OpenIdConnectConstants.Destinations.IdentityToken);
              */


              // var _userRepository = new UserRepository(context.HttpContext);
              // Console.WriteLine("AuthService.cs - NetworkID -------------------------: " + _userRepository.GetUserNetworkId());



              // public class ClaimsTransformationModule : ClaimsAuthenticationManager {  
              // public override ClaimsPrincipal Authenticate(string resourceName, ClaimsPrincipal incomingPrincipal) {  
              // if (incomingPrincipal != null && incomingPrincipal.Identity.IsAuthenticated == true) {  

              Console.WriteLine("AuthService.cs - OnHandleTokenRequest - identity.IsAuthenticated: " + identity.IsAuthenticated.ToString());
              // var identity = (ClaimsIdentity)incomingPrincipal.Identity;

              identity.AddClaim(new Claim("fullname", "hythyth")); // user.GetFullName(user.UserName)));  
              identity.AddClaim(new Claim("avatarUrl", "url")); // user.AvatarUrl)); 

              var ticket = new AuthenticationTicket(
                  new ClaimsPrincipal(identity),
                  new AuthenticationProperties(),
                  context.Scheme.Name);
              // Call SetScopes with the list of scopes you want to grant
              // (specify offline_access to issue a refresh token).
              
              // ticket.SetScopes(
              //    OpenIdConnectConstants.Scopes.Profile,
              //    OpenIdConnectConstants.Scopes.OfflineAccess);

              ticket.SetScopes(
              /* openid: */ OpenIdConnectConstants.Scopes.OpenId,
              /* email: */ OpenIdConnectConstants.Scopes.Email,
              /* profile: */ OpenIdConnectConstants.Scopes.Profile,
              /* offline_access: */ OpenIdConnectConstants.Scopes.OfflineAccess);


              context.Validate(ticket);
          } catch(Exception ex) {
            Console.WriteLine("AuthService.cs Exception - " + ex.Message);
          }


          return Task.CompletedTask;
        };
        /*
        options.Provider.TokenEndpoint = context => // (OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            return Task.FromResult<object>(null);
          // });
        };
        */
      });
    }
    /*
    public override Task TokenEndpoint(OAuthTokenEndpointContext context)
    {
        foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
        {
          context.AdditionalResponseParameters.Add(property.Key, property.Value);
        }
        return Task.FromResult<object>(null);
    }
    */
  }
}
