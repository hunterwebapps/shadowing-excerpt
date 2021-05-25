using System;
using System.Linq;
using System.Security.Claims;

namespace Shadowing.Business.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal
                .Claims
                .SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                ?.Value;
        }

        public static DateTime GetTokenExpiration(this ClaimsPrincipal claimsPrincipal)
        {
            var expirationStr = claimsPrincipal
                .Claims
                .SingleOrDefault(c => c.Type == ClaimTypes.Expiration)
                ?.Value;

            var expiration = DateTime.Parse(expirationStr);

            return expiration;
        }
    }
}
