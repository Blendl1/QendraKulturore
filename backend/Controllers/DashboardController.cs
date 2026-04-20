using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            // Statistikat nga tabelat tua (Studenti 4)
            var totalPunetore = await _context.Punetoret.CountAsync();
            var totalSponzore = await _context.Sponzoret.CountAsync();
            var totalSalla = await _context.Sallat.CountAsync();
            var shumaSponzorimeve = await _context.Sponzoret.SumAsync(s => s.ShumaSponsoring);

            // Statistikat nga tabelat e kolegeve (Studentet 1, 2, 3)
            // Kjo funksionon vetem nese ata i kane krijuar tabelat ne DB
            var totalNgjarje = await _context.Ngjarjet.CountAsync();
            var totalVepraArtit = await _context.VepratArtit.CountAsync();

            return Ok(new
            {
                punetoretCount = totalPunetore,
                sponzoretCount = totalSponzore,
                sallatCount = totalSalla,
                totalRevenue = shumaSponzorimeve,
                ngjarjetCount = totalNgjarje,
                artworksCount = totalVepraArtit
            });
        }
    }
}