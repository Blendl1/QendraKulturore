using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Punetori
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Emri { get; set; }

        [Required]
        public string Mbiemri { get; set; }

        public string Pozita { get; set; }

        public decimal Paga { get; set; }
    }
}
