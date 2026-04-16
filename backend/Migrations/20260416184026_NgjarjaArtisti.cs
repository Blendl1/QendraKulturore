using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class NgjarjaArtisti : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ngjarjet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pershkrimi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lloji = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataFillimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataPerfundimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SallaId = table.Column<int>(type: "int", nullable: false),
                    OrganizatorId = table.Column<int>(type: "int", nullable: false),
                    Statusi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CmimiBiletes = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ngjarjet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NgjarjeArtistet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgjarjaId = table.Column<int>(type: "int", nullable: false),
                    ArtistId = table.Column<int>(type: "int", nullable: false),
                    Roli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Honorari = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Shenimet = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NgjarjeArtistet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NgjarjeArtistet_Artistet_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "Artistet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NgjarjeArtistet_Ngjarjet_NgjarjaId",
                        column: x => x.NgjarjaId,
                        principalTable: "Ngjarjet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NgjarjeArtistet_ArtistId",
                table: "NgjarjeArtistet",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_NgjarjeArtistet_NgjarjaId",
                table: "NgjarjeArtistet",
                column: "NgjarjaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NgjarjeArtistet");

            migrationBuilder.DropTable(
                name: "Ngjarjet");
        }
    }
}
