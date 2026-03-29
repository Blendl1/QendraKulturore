namespace backend.Models
{
	public class Salla
	{
		public int Id { get; set; }
		public string Emri { get; set; } = string.Empty;
		public int Kati { get; set; }
		public string Pajisjet { get; set; } = string.Empty;
		public string Statusi { get; set; } = string.Empty;
		public string Pershkrimi { get; set; } = string.Empty;
	}
}