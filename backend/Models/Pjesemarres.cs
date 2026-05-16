namespace backend.Models
{
    public class Pjesemarres
    {
        public int Id { get; set; }
        public string Emri { get; set; } = string.Empty;
        public string Mbiemri { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefoni { get; set; } = string.Empty;
        public DateTime DataRegjistrimit { get; set; } = DateTime.UtcNow;
        public ICollection<RegjistrimWorkshop> Regjistrimet { get; set; } = new List<RegjistrimWorkshop>();
    }
}