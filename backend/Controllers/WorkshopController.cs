using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkshopController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkshopController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workshop>>> GetAll()
        {
            return Ok(await _context.Workshopet.ToListAsync());
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Workshop>> GetById(int id)
        {
            var workshop = await _context.Workshopet.FindAsync(id);
            if (workshop == null) return NotFound();
            return Ok(workshop);
        }

        [HttpPost]
        public async Task<ActionResult<Workshop>> Create([FromBody] Workshop workshop)
        {
            if (workshop.DataPerfundimit <= workshop.DataFillimit)
                return BadRequest("Data e perfundimit duhet të jetë pas datës së fillimit.");

            var konflikti = await _context.Workshopet.AnyAsync(w =>
                w.SallaId == workshop.SallaId &&
                w.DataFillimit < workshop.DataPerfundimit &&
                w.DataPerfundimit > workshop.DataFillimit);

            if (konflikti)
                return BadRequest("Salla është e zënë në këtë interval kohor.");

            _context.Workshopet.Add(workshop);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = workshop.Id }, workshop);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Workshop workshop)
        {
            if (id != workshop.Id) return BadRequest("ID mismatch");

            if (workshop.DataPerfundimit <= workshop.DataFillimit)
                return BadRequest("Data e perfundimit duhet të jetë pas datës së fillimit.");

            _context.Entry(workshop).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var workshop = await _context.Workshopet.FindAsync(id);
            if (workshop == null) return NotFound();
            _context.Workshopet.Remove(workshop);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}