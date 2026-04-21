using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public  DbSet<Artisti> Artistet { get; set; }        
        public DbSet<VepratArtit> VepratArtit { get; set; }
        public DbSet<Ekspozita> Ekspozitat { get; set; }
    }
}