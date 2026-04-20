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
        public async Task<ActionResult<IEnumerable<Artisti>>> GetArtistet()
        {
            return await _context.Artistet
                .Include(a => a.Veprat)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Artisti>> PostArtisti(Artisti artisti)
        {
            _context.Artistet.Add(artisti);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArtistet), new { id = artisti.Id }, artisti);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtisti(int id, Artisti artisti)
        {
            if (id != artisti.Id)
            {
                return BadRequest("ID e kërkesës nuk përputhet me ID e artistit.");
            }

            _context.Entry(artisti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Artistet.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtisti(int id)
        {
            var artisti = await _context.Artistet.FindAsync(id);
            if (artisti == null)
            {
                return NotFound();
            }

            _context.Artistet.Remove(artisti);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}