using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SponzoretController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SponzoretController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LISTA E TË GJITHË SPONZORËVE
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sponzori>>> GetSponzoret()
        {
            return await _context.Sponzoret.ToListAsync();
        }

        // 2. MERR NJË SPONZOR SIPAS ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Sponzori>> GetSponzori(int id)
        {
            var sponzori = await _context.Sponzoret.FindAsync(id);
            if (sponzori == null) return NotFound();
            return sponzori;
        }

        // 3. SHTO SPONZOR TË RI
        [HttpPost]
        public async Task<ActionResult<Sponzori>> PostSponzori(Sponzori sponzori)
        {
            _context.Sponzoret.Add(sponzori);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSponzori), new { id = sponzori.Id }, sponzori);
        }

        // 4. MODIFIKO TË DHËNAT E NJË SPONZORI
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSponzori(int id, Sponzori sponzori)
        {
            if (id != sponzori.Id) return BadRequest();

            _context.Entry(sponzori).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!_context.Sponzoret.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 5. FSHIJ NJË SPONZOR
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSponzori(int id)
        {
            var sponzori = await _context.Sponzoret.FindAsync(id);
            if (sponzori == null) return NotFound();

            _context.Sponzoret.Remove(sponzori);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}