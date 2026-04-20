using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SallatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SallatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. MERR TË GJITHA SALLAT (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Salla>>> GetSallat()
        {
            return await _context.Sallat.ToListAsync();
        }

        // 2. MERR NJË SALLË SIPAS ID-së (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Salla>> GetSalla(int id)
        {
            var salla = await _context.Sallat.FindAsync(id);
            if (salla == null) return NotFound();
            return salla;
        }

        // 3. SHTO NJË SALLË TË RE (POST)
        [HttpPost]
        public async Task<ActionResult<Salla>> PostSalla(Salla salla)
        {
            _context.Sallat.Add(salla);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSalla), new { id = salla.Id }, salla);
        }

        // 4. MODIFIKO NJË SALLË (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalla(int id, Salla salla)
        {
            if (id != salla.Id) return BadRequest();

            _context.Entry(salla).State = EntityState.Modified;
            
            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!SallaExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 5. FSHIJ NJË SALLË (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalla(int id)
        {
            var salla = await _context.Sallat.FindAsync(id);
            if (salla == null) return NotFound();

            _context.Sallat.Remove(salla);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool SallaExists(int id)
        {
            return _context.Sallat.Any(e => e.Id == id);
        }
    }
}