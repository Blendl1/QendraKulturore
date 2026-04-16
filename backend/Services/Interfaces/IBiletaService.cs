using System.Net.Sockets;
using backend.Models;

namespace backend.Services.Interfaces
{
	public interface IBiletaService
	{
		Task<List<Bileta>> GetAllAsync();
		Task<Bileta> GetByIdAsync(int eventId);
		Task<Bileta> CreateAsync(Bileta bileta);
		Task<bool> UpdateAsync(int id, Bileta bileta);
		Task<bool> DeleteAsync(int id);
	}
}
