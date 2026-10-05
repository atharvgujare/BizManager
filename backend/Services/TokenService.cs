using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessManager.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace BusinessManager.Api.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user, Business business);
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user, Business business)
        {
            var keyString = _config["Jwt:Key"] ?? "DefaultFallbackSecretKeyLongEnoughForHmacSha256!";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("BusinessId", user.BusinessId.ToString()),
                new Claim("BusinessName", business.Name),
                new Claim("CurrencySymbol", business.CurrencySymbol)
            };

            var expiryDays = int.TryParse(_config["Jwt:ExpiryInDays"], out var days) ? days : 30;

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "BusinessManagerApi",
                audience: _config["Jwt:Audience"] ?? "BusinessManagerMobileApp",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(expiryDays),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
