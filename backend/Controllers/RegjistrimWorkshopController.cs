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
    public class RegjistrimWorkshopController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RegjistrimWorkshopController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegjistrimWorkshop>>> GetAll()
        {
            return Ok(await _context.RegjistrimetWorkshop
                .Include(r => r.Workshop)
                .Include(r => r.Pjesemarres)
                .ToListAsync());
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<RegjistrimWorkshop>> GetById(int id)
        {
            var r = await _context.RegjistrimetWorkshop
                .Include(r => r.Workshop)
                .Include(r => r.Pjesemarres)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost]
        public async Task<ActionResult<RegjistrimWorkshop>> Create([FromBody] RegjistrimWorkshop regjistrim)
        {
            var workshop = await _context.Workshopet.FindAsync(regjistrim.WorkshopId);
            if (workshop == null) return BadRequest("Workshop nuk ekziston.");

            var count = await _context.RegjistrimetWorkshop
                .CountAsync(r => r.WorkshopId == regjistrim.WorkshopId && r.Statusi == "Aktiv");

            if (count >= workshop.Kapaciteti)
                return BadRequest("Workshop-u ka arritur kapacitetin maksimal.");

            var duplikat = await _context.RegjistrimetWorkshop.AnyAsync(r =>
                r.WorkshopId == regjistrim.WorkshopId &&
                r.PjesemarresId == regjistrim.PjesemarresId);

            if (duplikat) return BadRequest("Ky pjesëmarrës është i regjistruar tashmë.");

            regjistrim.DataRegjistrimit = DateTime.UtcNow;
            _context.RegjistrimetWorkshop.Add(regjistrim);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = regjistrim.Id }, regjistrim);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RegjistrimWorkshop regjistrim)
        {
            if (id != regjistrim.Id) return BadRequest("ID mismatch");
            _context.Entry(regjistrim).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var r = await _context.RegjistrimetWorkshop.FindAsync(id);
            if (r == null) return NotFound();
            _context.RegjistrimetWorkshop.Remove(r);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}