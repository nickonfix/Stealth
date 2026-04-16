using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Extensions
{
    public static class ClaimsExtentsions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname")?.Value 
                ?? user.Claims.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value 
                ?? user.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.GivenName)?.Value;
        }
    }
}





