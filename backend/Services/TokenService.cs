using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
	public interface ITokenService
	{
		string GenerateAccessToken(AppUser user, IList<string> roles);
		string GenerateRefreshToken();
		Task<RefreshToken> SaveRefreshTokenAsync(string userId, string token);
		Task<RefreshToken?> GetRefreshTokenAsync(string token);
		Task RevokeRefreshTokenAsync(string token);
	}

	public class TokenService : ITokenService
	{
		private readonly IConfiguration _config;
		private readonly ApplicationDbContext _db;

		public TokenService(IConfiguration config, ApplicationDbContext db)
		{
			_config = config;
			_db = db;
		}

		// Generates a short-lived JWT access token (60 min)
		public string GenerateAccessToken(AppUser user, IList<string> roles)
		{
			var jwtSettings = _config.GetSection("JwtSettings");
			var secretKey = jwtSettings["SecretKey"]!;
			var issuer = jwtSettings["Issuer"]!;
			var audience = jwtSettings["Audience"]!;
			var expiryMinutes = int.Parse(jwtSettings["AccessTokenExpiryMinutes"]!);

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			// Claims are pieces of info stored inside the token
			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id),
				new Claim(ClaimTypes.Email, user.Email ?? ""),
				new Claim(ClaimTypes.Name, user.FullName),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			// Add each role as a claim
			foreach (var role in roles)
				claims.Add(new Claim(ClaimTypes.Role, role));

			var token = new JwtSecurityToken(
				issuer: issuer,
				audience: audience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		// Generates a secure random refresh token (long-lived, 7 days)
		public string GenerateRefreshToken()
		{
			var randomBytes = new byte[64];
			using var rng = RandomNumberGenerator.Create();
			rng.GetBytes(randomBytes);
			return Convert.ToBase64String(randomBytes);
		}

		// Saves refresh token to DB linked to the user
		public async Task<RefreshToken> SaveRefreshTokenAsync(string userId, string token)
		{
			var expiryDays = int.Parse(
				_config.GetSection("JwtSettings")["RefreshTokenExpiryDays"]!);

			var refreshToken = new RefreshToken
			{
				Token = token,
				UserId = userId,
				ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
				CreatedAt = DateTime.UtcNow,
				IsRevoked = false,
				IsUsed = false
			};

			_db.RefreshTokens.Add(refreshToken);
			await _db.SaveChangesAsync();
			return refreshToken;
		}

		// Finds a refresh token in DB
		public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
		{
			return await _db.RefreshTokens
				.Include(rt => rt.User)
				.FirstOrDefaultAsync(rt => rt.Token == token);
		}

		// Marks token as revoked so it cannot be reused
		public async Task RevokeRefreshTokenAsync(string token)
		{
			var refreshToken = await _db.RefreshTokens
				.FirstOrDefaultAsync(rt => rt.Token == token);

			if (refreshToken != null)
			{
				refreshToken.IsRevoked = true;
				refreshToken.IsUsed = true;
				await _db.SaveChangesAsync();
			}
		}
	}
}