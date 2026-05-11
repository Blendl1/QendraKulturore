using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VepratArtitController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VepratArtitController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetVepratArtit()
        {
            return await _context.VepratArtit
                .Select(v => new
                {
                    v.Id,
                    v.Titulli,
                    v.Materiali,
                    v.Viti,
                    v.Vlera,
                    v.ArtistiID,
                    Artisti = v.Artisti == null ? null : new
                    {
                        v.Artisti.Id,
                        v.Artisti.Emri,
                        v.Artisti.Mbiemri
                    },
                    v.EkspozitaId
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetVepra(int id)
        {
            var vepra = await _context.VepratArtit
                .Where(v => v.Id == id)
                .Select(v => new
                {
                    v.Id,
                    v.Titulli,
                    v.Materiali,
                    v.Viti,
                    v.Vlera,
                    v.ArtistiID,
                    Artisti = v.Artisti == null ? null : new
                    {
                        v.Artisti.Id,
                        v.Artisti.Emri,
                        v.Artisti.Mbiemri
                    },
                    v.EkspozitaId
                })
                .FirstOrDefaultAsync();

            if (vepra == null)
                return NotFound();

            return vepra;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalValue = await _context.VepratArtit.SumAsync(v => v.Vlera);
            var totalCount = await _context.VepratArtit.CountAsync();

            return Ok(new { totalValue, totalCount });
        }
        [HttpPut("{id}")]
public async Task<IActionResult> PutVepra(int id, VepratArtit vepra)
{
    if (id != vepra.Id)
        return BadRequest();

    _context.Entry(vepra).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent();
}
        [HttpPost]
        public async Task<ActionResult<VepratArtit>> PostVepra(VepratArtit vepra)
        {
            _context.VepratArtit.Add(vepra);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVepra), new { id = vepra.Id }, vepra);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVepra(int id)
        {
            var vepra = await _context.VepratArtit.FindAsync(id);

            if (vepra == null)
                return NotFound();

            _context.VepratArtit.Remove(vepra);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}