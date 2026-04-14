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

        // GET: api/VepratArtit/stats (Për Dashboard Widget)
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalValue = await _context.VepratArtit.SumAsync(v => v.Vlera);
            var totalCount = await _context.VepratArtit.CountAsync();
            return Ok(new { totalValue, totalCount });
        }

        // POST: api/VepratArtit (Shto vepër)
        [HttpPost]
        public async Task<ActionResult<VepratArtit>> PostVepra(VepratArtit vepra)
        {
            _context.VepratArtit.Add(vepra);
            await _context.SaveChangesAsync();
            return Ok(vepra);
        }
    }
}