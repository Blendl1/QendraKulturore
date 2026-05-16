namespace backend.Models
{
    public class Workshop
    {
        public int Id { get; set; }
        public string Titulli { get; set; } = string.Empty;
        public string Pershkrimi { get; set; } = string.Empty;
        public DateTime DataFillimit { get; set; }
        public DateTime DataPerfundimit { get; set; }
        public int Kapaciteti { get; set; }
        public string Statusi { get; set; } = "Planifikuar";
        public decimal Cmimi { get; set; }
        public int SallaId { get; set; }
        public ICollection<RegjistrimWorkshop> Regjistrimet { get; set; } = new List<RegjistrimWorkshop>();
    }
}