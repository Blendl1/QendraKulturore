using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthenticateController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly ITokenService _tokenService;

		public AuthenticateController(
			UserManager<AppUser> userManager,
			SignInManager<AppUser> signInManager,
			ITokenService tokenService)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_tokenService = tokenService;
		}

		// POST api/auth/register
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var existingUser = await _userManager.FindByEmailAsync(dto.Email);
			if (existingUser != null)
				return BadRequest(new { message = "Email është tashmë i regjistruar." });

			var user = new AppUser
			{
				FullName = dto.FullName,
				Email = dto.Email,
				UserName = dto.Email
			};

			var result = await _userManager.CreateAsync(user, dto.Password);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			// Assign default role
			await _userManager.AddToRoleAsync(user, "User");

			return Ok(new { message = "Regjistrimi u krye me sukses." });
		}

		// POST api/auth/login
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var user = await _userManager.FindByEmailAsync(dto.Email);
			if (user == null)
				return Unauthorized(new { message = "Email ose fjalëkalimi është gabim." });

			var result = await _signInManager
				.CheckPasswordSignInAsync(user, dto.Password, false);

			if (!result.Succeeded)
				return Unauthorized(new { message = "Email ose fjalëkalimi është gabim." });

			var roles = await _userManager.GetRolesAsync(user);
			var accessToken = _tokenService.GenerateAccessToken(user, roles);
			var refreshToken = _tokenService.GenerateRefreshToken();
			await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken);

			return Ok(new
			{
				accessToken,
				refreshToken,
				user = new
				{
					user.Id,
					user.FullName,
					user.Email,
					roles
				}
			});
		}

		// POST api/auth/refresh
		[HttpPost("refresh")]
		public async Task<IActionResult> Refresh([FromBody] RefreshDto dto)
		{
			var storedToken = await _tokenService.GetRefreshTokenAsync(dto.RefreshToken);

			if (storedToken == null)
				return Unauthorized(new { message = "Token i pavlefshëm." });

			if (storedToken.IsRevoked || storedToken.IsUsed)
				return Unauthorized(new { message = "Token është përdorur ose anuluar." });

			if (storedToken.ExpiresAt < DateTime.UtcNow)
				return Unauthorized(new { message = "Token ka skaduar." });

			// Revoke old token
			await _tokenService.RevokeRefreshTokenAsync(dto.RefreshToken);

			// Issue new tokens
			var user = storedToken.User;
			var roles = await _userManager.GetRolesAsync(user);
			var newAccessToken = _tokenService.GenerateAccessToken(user, roles);
			var newRefreshToken = _tokenService.GenerateRefreshToken();
			await _tokenService.SaveRefreshTokenAsync(user.Id, newRefreshToken);

			return Ok(new
			{
				accessToken = newAccessToken,
				refreshToken = newRefreshToken
			});
		}

		// POST api/auth/logout
		[HttpPost("logout")]
		[Authorize]
		public async Task<IActionResult> Logout([FromBody] RefreshDto dto)
		{
			await _tokenService.RevokeRefreshTokenAsync(dto.RefreshToken);
			return Ok(new { message = "Çkyçja u krye me sukses." });
		}
	}

	// DTOs (Data Transfer Objects) for Auth
	public record RegisterDto(string FullName, string Email, string Password);
	public record LoginDto(string Email, string Password);
	public record RefreshDto(string RefreshToken);
}