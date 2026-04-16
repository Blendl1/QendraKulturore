using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NgjarjaController : ControllerBase
	{
		private readonly INgjarjaService _ngjarjaService;

		public NgjarjaController(INgjarjaService ngjarjaService)
		{
			_ngjarjaService = ngjarjaService;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Ngjarja>>> GetAll()
		{
			return Ok(await _ngjarjaService.GetAllAsync());
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Ngjarja>> GetById(int id)
		{
			var ngjarja = await _ngjarjaService.GetByIdAsync(id);

			if (ngjarja == null)
				return NotFound();

			return Ok(ngjarja);
		}

		[HttpPost]
		public async Task<ActionResult<Ngjarja>> Create([FromBody] Ngjarja ngjarja)
		{
			var created = await _ngjarjaService.CreateAsync(ngjarja);

			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] Ngjarja ngjarja)
		{
			if (id != ngjarja.Id)
				return BadRequest("ID mismatch");

			var updated = await _ngjarjaService.UpdateAsync(id, ngjarja);

			if (!updated)
				return NotFound();

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var deleted = await _ngjarjaService.DeleteAsync(id);

			if (!deleted)
				return NotFound();

			return NoContent();
		}
	}
}