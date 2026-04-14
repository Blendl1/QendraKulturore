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

        // GET: api/Ekspozitat
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ekspozita>>> GetEkspozitat()
        {
            return await _context.Ekspozitat.ToListAsync();
        }

        // POST: api/Ekspozitat
        [HttpPost]
        public async Task<ActionResult<Ekspozita>> PostEkspozita(Ekspozita ekspozita)
        {
            _context.Ekspozitat.Add(ekspozita);
            await _context.SaveChangesAsync();
            return Ok(ekspozita);
        }
    }
}