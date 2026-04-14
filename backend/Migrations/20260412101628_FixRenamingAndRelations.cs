using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixRenamingAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ekspozitat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataFillimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SallaEksponimit = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ekspozitat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VepratArtit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Materiali = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Viti = table.Column<int>(type: "int", nullable: false),
                    Vlera = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ArtistiID = table.Column<int>(type: "int", nullable: false),
                    EkspozitaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VepratArtit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VepratArtit_Artistes_ArtistiID",
                        column: x => x.ArtistiID,
                        principalTable: "Artistes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VepratArtit_Ekspozitat_EkspozitaId",
                        column: x => x.EkspozitaId,
                        principalTable: "Ekspozitat",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_VepratArtit_ArtistiID",
                table: "VepratArtit",
                column: "ArtistiID");

            migrationBuilder.CreateIndex(
                name: "IX_VepratArtit_EkspozitaId",
                table: "VepratArtit",
                column: "EkspozitaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VepratArtit");

            migrationBuilder.DropTable(
                name: "Ekspozitat");
        }
    }
}
