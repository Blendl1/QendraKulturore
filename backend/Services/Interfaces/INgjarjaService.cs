using backend.Models;

namespace backend.Services.Interfaces
{
	public interface INgjarjaService
	{

		Task<List<Ngjarja>> GetAllAsync();
		Task<Ngjarja> GetByIdAsync(int id);
		Task<Ngjarja> CreateAsync(Ngjarja ngjarja);
		Task<bool> UpdateAsync(int id, Ngjarja ngjarja);
		Task<bool> DeleteAsync(int id);
	}
}
