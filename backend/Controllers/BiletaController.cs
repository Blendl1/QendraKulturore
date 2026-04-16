using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BiletaController : ControllerBase
	{
		private readonly IBiletaService _biletaService;

		public BiletaController(IBiletaService biletaService)
		{
			_biletaService = biletaService;
		}

		
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Bileta>>> GetAll()
		{
			var biletat = await _biletaService.GetAllAsync();
			return Ok(biletat);
		}

		
		[HttpGet("{id}")]
		public async Task<ActionResult<Bileta>> GetById(int id)
		{
			var bileta = await _biletaService.GetByIdAsync(id);

			if (bileta == null)
				return NotFound();

			return Ok(bileta);
		}

		
		[HttpPost]
		public async Task<ActionResult<Bileta>> Create([FromBody] Bileta bileta)
		{
			var created = await _biletaService.CreateAsync(bileta);

			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		
		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] Bileta bileta)
		{
			if (id != bileta.Id)
				return BadRequest("ID mismatch");

			var updated = await _biletaService.UpdateAsync(id, bileta);

			if (!updated)
				return NotFound();

			return NoContent();
		}

	
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var deleted = await _biletaService.DeleteAsync(id);

			if (!deleted)
				return NotFound();

			return NoContent();
		}
	}
}