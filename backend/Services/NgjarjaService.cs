using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
	public class NgjarjaService : INgjarjaService
	{
		private readonly ApplicationDbContext _context;

		public NgjarjaService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<Ngjarja>> GetAllAsync()
		{
			return await _context.Ngjarjet.ToListAsync();
		}

		public async Task<Ngjarja> GetByIdAsync(int id)
		{
			return await _context.Ngjarjet?
				.FirstOrDefaultAsync(e => e.Id == id);
		}
		public async Task<Ngjarja> CreateAsync(Ngjarja ngjarja)
		{
			_context.Ngjarjet.Add(ngjarja);
			await _context.SaveChangesAsync();
			return ngjarja;
		}

		public async Task<bool> UpdateAsync(int id, Ngjarja ngjarja)
		{
			var existingNgjarja = await _context.Ngjarjet
				.FirstOrDefaultAsync(e => e.Id == id);

			if (existingNgjarja == null)
				return false;

			existingNgjarja.Titulli = ngjarja.Titulli;
			existingNgjarja.Pershkrimi = ngjarja.Pershkrimi;
			existingNgjarja.Lloji = ngjarja.Lloji;
			existingNgjarja.DataFillimit = ngjarja.DataFillimit;
			existingNgjarja.DataPerfundimit = ngjarja.DataPerfundimit;
			existingNgjarja.SallaId = ngjarja.SallaId;
			existingNgjarja.OrganizatorId = ngjarja.OrganizatorId;
			existingNgjarja.Statusi = ngjarja.Statusi;
			existingNgjarja.CmimiBiletes = ngjarja.CmimiBiletes;

			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var existingNgjarja = await _context.Ngjarjet
				.FirstOrDefaultAsync(e => e.Id == id);

			if (existingNgjarja == null)
				return false;

			_context.Ngjarjet.Remove(existingNgjarja);
			await _context.SaveChangesAsync();

			return true;
		}
	}
}
