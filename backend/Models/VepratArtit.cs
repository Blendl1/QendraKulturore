using System;
using System.Collections.Generic;

namespace backend.Models
{
  public class VepratArtit
  {
    public int Id { get; set; }
    public string Titulli { get; set; } = string.Empty;
    public string Materiali {get; set; } = string.Empty;
    public int Viti{ get; set; }
    public decimal Vlera { get; set; }

    public int ArtistiID { get; set; }
    public Artisti ? Artisti { get; set; }

    public int? EkspozitaId { get; set; }
    public Ekspozita? Ekspozita { get; set; }
  }
}