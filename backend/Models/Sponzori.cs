using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Sponzori
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Emri { get; set; }

        [Required]
        public decimal ShumaSponsoring { get; set; }

        public DateTime Data { get; set; }
    }
}