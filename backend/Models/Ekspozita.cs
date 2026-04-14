namespace backend.Models
{
  public class Ekspozita
  {
    public int Id { get; set; }
    public string Titulli { get; set; } = string.Empty;
    public DateTime DataFillimit { get; set; }
    public string SallaEksponimit { get; set; } = string.Empty;

    public List<VepratArtit> Veprat { get; set; } = new();
  }
}