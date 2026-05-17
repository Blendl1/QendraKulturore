using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
	[Authorize(Roles = "Admin")]
	[ApiController]
	[Route("api/[controller]")]
	public class UsersController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;

		public UsersController(UserManager<AppUser> userManager)
		{
			_userManager = userManager;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var users = _userManager.Users.ToList();
			var result = new List<object>();

			foreach (var user in users)
			{
				var roles = await _userManager.GetRolesAsync(user);
				result.Add(new
				{
					user.Id,
					user.FullName,
					user.Email,
					roles
				});
			}

			return Ok(result);
		}
	}
}