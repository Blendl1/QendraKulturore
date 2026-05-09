using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArtistetController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetArtistet()
        {
            return await _context.Artistet
                .Select(a => new
                {
                    a.Id,
                    a.Emri,
                    a.Mbiemri,
                    a.Biografia,
                    a.Specializimi,
                    a.Telefoni,
                    a.Email,
                    a.Website,
                    a.Shteti,
                    Veprat = a.Veprat.Select(v => new
                    {
                        v.Id,
                        v.Titulli,
                        v.Materiali,
                        v.Viti,
                        v.Vlera,
                        v.ArtistiID,
                        v.EkspozitaId
                    }).ToList()
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetArtisti(int id)
        {
            var artisti = await _context.Artistet
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    a.Id,
                    a.Emri,
                    a.Mbiemri,
                    a.Biografia,
                    a.Specializimi,
                    a.Telefoni,
                    a.Email,
                    a.Website,
                    a.Shteti,
                    Veprat = a.Veprat.Select(v => new
                    {
                        v.Id,
                        v.Titulli,
                        v.Materiali,
                        v.Viti,
                        v.Vlera,
                        v.ArtistiID,
                        v.EkspozitaId
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (artisti == null)
                return NotFound();

            return artisti;
        }

        [HttpPost]
        public async Task<ActionResult<Artisti>> PostArtisti(Artisti artisti)
        {
            _context.Artistet.Add(artisti);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtisti), new { id = artisti.Id }, artisti);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtisti(int id, Artisti artisti)
        {
            if (id != artisti.Id)
                return BadRequest();

            _context.Entry(artisti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var exists = await _context.Artistet.AnyAsync(a => a.Id == id);

                if (!exists)
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtisti(int id)
        {
            var artisti = await _context.Artistet.FindAsync(id);

            if (artisti == null)
                return NotFound();

            _context.Artistet.Remove(artisti);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}