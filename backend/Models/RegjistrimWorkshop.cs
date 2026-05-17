using System.Text.Json.Serialization;

namespace backend.Models
{
    public class RegjistrimWorkshop
    {
        public int Id { get; set; }
        public int WorkshopId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Workshop? Workshop { get; set; }
        public int PjesemarresId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Pjesemarres? Pjesemarres { get; set; }
        public DateTime DataRegjistrimit { get; set; } = DateTime.UtcNow;
        public string Statusi { get; set; } = "Aktiv";
        public bool EshtePaguar { get; set; } = false;
    }
}