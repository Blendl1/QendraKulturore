using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}

		public DbSet<Concert> Concerts { get; set; } = null!;
		public DbSet<User> Users { get; set; } = null!;
		public DbSet<Artisti> Artistes { get; set; } = null!;
		public DbSet<Salla> Sallas { get; set; } = null!;
	}
}