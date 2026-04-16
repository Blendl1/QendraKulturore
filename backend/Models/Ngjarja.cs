namespace backend.Models
{
	public class Ngjarja
	{
		public int Id { get; set; }

		public string Titulli { get; set; }
		public string Pershkrimi { get; set; }

		public string Lloji { get; set; }

		public DateTime DataFillimit { get; set; }

		public DateTime DataPerfundimit { get; set; }

		public int SallaId { get; set; }

		public int OrganizatorId { get; set; }

		public string Statusi { get; set; }

		public decimal CmimiBiletes { get; set; }
	}
}
