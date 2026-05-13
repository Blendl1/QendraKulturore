using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
	public class ApplicationDbContext : IdentityDbContext<AppUser>
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options) { }

		public DbSet<Artisti> Artistet { get; set; }
		public DbSet<VepratArtit> VepratArtit { get; set; }
		public DbSet<Ekspozita> Ekspozitat { get; set; }
		public DbSet<Ngjarja> Ngjarjet { get; set; }
		public DbSet<NgjarjeArtist> NgjarjeArtistet { get; set; }
		public DbSet<Bileta> Biletat { get; set; }
		public DbSet<RefreshToken> RefreshTokens { get; set; }
		public DbSet<Salla> Sallat { get; set; }
		public DbSet<Sponzori> Sponzoret { get; set; }
		public DbSet<Punetori> Punetoret { get; set; }
		

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<Bileta>()
		.Property(b => b.Cmimi)
		.HasPrecision(18, 2);

			builder.Entity<Ngjarja>()
				.Property(n => n.CmimiBiletes)
				.HasPrecision(18, 2);

			builder.Entity<NgjarjeArtist>()
				.Property(na => na.Honorari)
				.HasPrecision(18, 2);

			builder.Entity<Punetori>()
				.Property(p => p.Paga)
				.HasPrecision(18, 2);

			builder.Entity<Sponzori>()
				.Property(s => s.ShumaSponsoring)
				.HasPrecision(18, 2);

			builder.Entity<VepratArtit>()
				.Property(v => v.Vlera)
				.HasPrecision(18, 2);

			builder.Entity<NgjarjeArtist>()
				.HasOne(na => na.Ngjarja)
				.WithMany(n => n.NgjarjeArtistet)
				.HasForeignKey(na => na.NgjarjaId);

			builder.Entity<NgjarjeArtist>()
				.HasOne(na => na.Artist)
				.WithMany(a => a.NgjarjeArtistet)
				.HasForeignKey(na => na.ArtistId);

			builder.Entity<RefreshToken>()
				.HasOne(rt => rt.User)
				.WithMany()
				.HasForeignKey(rt => rt.UserId);

			foreach (var property in builder.Model.GetEntityTypes()
				.SelectMany(t => t.GetProperties())
				.Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
			{
				property.SetPrecision(18);
				property.SetScale(2);
			}
		}
	}
}