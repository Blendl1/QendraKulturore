using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EkspozitatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EkspozitatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ekspozita>>> GetEkspozitat()
        {
            return await _context.Ekspozitat.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ekspozita>> GetEkspozita(int id)
        {
            var ekspozita = await _context.Ekspozitat.FindAsync(id);

            if (ekspozita == null)
                return NotFound();

            return ekspozita;
        }

        [HttpPost]
        public async Task<ActionResult<Ekspozita>> PostEkspozita(Ekspozita ekspozita)
        {
            _context.Ekspozitat.Add(ekspozita);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEkspozita), new { id = ekspozita.Id }, ekspozita);
        }

       [HttpPut("{id}")]
public async Task<IActionResult> PutEkspozita(int id, Ekspozita ekspozita)
{
    if (id != ekspozita.Id)
        return BadRequest();

    _context.Entry(ekspozita).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent();
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEkspozita(int id)
        {
            var ekspozita = await _context.Ekspozitat.FindAsync(id);

            if (ekspozita == null)
                return NotFound();

            _context.Ekspozitat.Remove(ekspozita);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}