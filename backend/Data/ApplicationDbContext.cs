using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // This MUST be plural "Artistet" to match your Controller
        public  DbSet<Artisti> Artistet { get; set; }        
        public DbSet<VepratArtit> VepratArtit { get; set; }
        public DbSet<Ekspozita> Ekspozitat { get; set; }

		public DbSet<Ngjarja> Ngjarjet { get; set; }
		public DbSet<NgjarjeArtist> NgjarjeArtistet { get; set; }
        
        public DbSet<Bileta> Biletat { get; set; }

	}
}