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
    public class PjesemarresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PjesemarresController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pjesemarres>>> GetAll()
        {
            return Ok(await _context.Pjesemarresit.ToListAsync());
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Pjesemarres>> GetById(int id)
        {
            var p = await _context.Pjesemarresit.FindAsync(id);
            if (p == null) return NotFound();
            return Ok(p);
        }

        [HttpPost]
        public async Task<ActionResult<Pjesemarres>> Create([FromBody] Pjesemarres pjesemarres)
        {
            var exists = await _context.Pjesemarresit.AnyAsync(p => p.Email == pjesemarres.Email);
            if (exists) return BadRequest("Ky email është i regjistruar tashmë.");
            _context.Pjesemarresit.Add(pjesemarres);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pjesemarres.Id }, pjesemarres);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pjesemarres pjesemarres)
        {
            if (id != pjesemarres.Id) return BadRequest("ID mismatch");
            _context.Entry(pjesemarres).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _context.Pjesemarresit.FindAsync(id);
            if (p == null) return NotFound();
            _context.Pjesemarresit.Remove(p);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}