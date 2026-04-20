using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PunetoretController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PunetoretController(ApplicationDbContext context)
        {
            _context = context;
        }

        // MERR TË GJITHË (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Punetori>>> GetPunetoret()
        {
            return await _context.Punetoret.ToListAsync();
        }

        // MERR NJË SIPAS ID (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Punetori>> GetPunetori(int id)
        {
            var punetori = await _context.Punetoret.FindAsync(id);
            if (punetori == null) return NotFound();
            return punetori;
        }

        // SHTO (POST)
        [HttpPost]
        public async Task<ActionResult<Punetori>> PostPunetori(Punetori punetori)
        {
            _context.Punetoret.Add(punetori);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPunetori), new { id = punetori.Id }, punetori);
        }

        // MODIFIKO (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPunetori(int id, Punetori punetori)
        {
            if (id != punetori.Id) return BadRequest();

            _context.Entry(punetori).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!_context.Punetoret.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // FSHIJ (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePunetori(int id)
        {
            var punetori = await _context.Punetoret.FindAsync(id);
            if (punetori == null) return NotFound();

            _context.Punetoret.Remove(punetori);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}