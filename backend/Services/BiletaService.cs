using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
	public class BiletaService : IBiletaService
	{
		private readonly ApplicationDbContext _context;

		public BiletaService(ApplicationDbContext context)
		{

			_context = context;

		}

		public async Task<List<Bileta>> GetAllAsync()
		{
			return await _context.Biletat.ToListAsync();
		}

		public async Task<Bileta> GetByIdAsync(int id)
		{
			return await _context.Biletat
				.FirstOrDefaultAsync(e => e.Id == id);
		}

		public async Task<Bileta> CreateAsync(Bileta bileta)
		{
			_context.Biletat.Add(bileta);
			await _context.SaveChangesAsync();
			return bileta;
		}

		public async Task<bool> UpdateAsync(int id, Bileta bileta)
		{
			var existingBileta = await _context.Biletat
				.FirstOrDefaultAsync(e => e.Id == id);

			if (existingBileta == null)
				return false;

			existingBileta.DataBlerjes = bileta.DataBlerjes;
			existingBileta.Cmimi = bileta.Cmimi;
			existingBileta.Lloji = bileta.Lloji;
			existingBileta.Statusi = bileta.Statusi;

			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var existingBileta = await _context.Biletat
				.FirstOrDefaultAsync(e => e.Id == id);

			if (existingBileta == null)
				return false;

			_context.Biletat.Remove(existingBileta);
			await _context.SaveChangesAsync();

			return true;
		}
	}

}
