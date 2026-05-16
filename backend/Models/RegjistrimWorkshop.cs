namespace backend.Models
{
    public class RegjistrimWorkshop
    {
        public int Id { get; set; }
        public int WorkshopId { get; set; }
        public Workshop Workshop { get; set; } = null!;
        public int PjesemarresId { get; set; }
        public Pjesemarres Pjesemarres { get; set; } = null!;
        public DateTime DataRegjistrimit { get; set; } = DateTime.UtcNow;
        public string Statusi { get; set; } = "Aktiv";
        public bool EshtePaguar { get; set; } = false;
    }
}