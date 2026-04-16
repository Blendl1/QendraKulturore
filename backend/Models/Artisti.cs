using System;
using System.Collections.Generic;
namespace backend.Models
{
	public class Artisti
	{
		public int Id { get; set; }
		public string Emri { get; set; } = string.Empty;
		public string Mbiemri { get; set; } = string.Empty;
		public string Biografia { get; set; } = string.Empty;
		public string Specializimi { get; set; } = string.Empty;
		public string Telefoni { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Website { get; set; } = string.Empty;
		public string Shteti { get; set; } = string.Empty;

		public List<VepratArtit> Veprat { get; set; } = new();

		public List<NgjarjeArtist> NgjarjeArtistet { get; set; } = new();
	}
}