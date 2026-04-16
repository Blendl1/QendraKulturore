namespace backend.Models
{
	public class NgjarjeArtist
	{
		public int Id { get; set; }  

		public int NgjarjaId { get; set; } 
		public Ngjarja Ngjarja { get; set; }

		public int ArtistId { get; set; } 
		public Artisti Artist { get; set; }

		public string Roli { get; set; }
		public decimal Honorari { get; set; }
		public string Shenimet { get; set; }
	}
}
