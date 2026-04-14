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

        // GET: api/Artistet (Për Portfolion)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artisti>>> GetArtistet()
        {
            return await _context.Artistet.Include(a => a.Veprat).ToListAsync();
        }

        // POST: api/Artistet (Për Menaxhimin e Profilit)
        [HttpPost]
        public async Task<ActionResult<Artisti>> PostArtisti(Artisti artisti)
        {
            _context.Artistet.Add(artisti);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArtistet), new { id = artisti.Id }, artisti);
        }
    }
}