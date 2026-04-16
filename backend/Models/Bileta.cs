namespace backend.Models
{
	public class Bileta
	{
		public int Id{ get; set; }

		public int	NgjarjeId { get; set; }

		public int PjesemarresId { get; set; }

		public DateTime DataBlerjes	{ get; set; }

		public decimal Cmimi { get; set; }

		public String Lloji { get; set; }

		public String Statusi { get; set; }

	}
}
