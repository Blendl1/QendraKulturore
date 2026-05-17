using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkshopModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pjesemarresit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefoni = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataRegjistrimit = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pjesemarresit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Workshopet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pershkrimi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataFillimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataPerfundimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Kapaciteti = table.Column<int>(type: "int", nullable: false),
                    Statusi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cmimi = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SallaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workshopet", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegjistrimetWorkshop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkshopId = table.Column<int>(type: "int", nullable: false),
                    PjesemarresId = table.Column<int>(type: "int", nullable: false),
                    DataRegjistrimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Statusi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EshtePaguar = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegjistrimetWorkshop", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegjistrimetWorkshop_Pjesemarresit_PjesemarresId",
                        column: x => x.PjesemarresId,
                        principalTable: "Pjesemarresit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegjistrimetWorkshop_Workshopet_WorkshopId",
                        column: x => x.WorkshopId,
                        principalTable: "Workshopet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegjistrimetWorkshop_PjesemarresId",
                table: "RegjistrimetWorkshop",
                column: "PjesemarresId");

            migrationBuilder.CreateIndex(
                name: "IX_RegjistrimetWorkshop_WorkshopId",
                table: "RegjistrimetWorkshop",
                column: "WorkshopId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegjistrimetWorkshop");

            migrationBuilder.DropTable(
                name: "Pjesemarresit");

            migrationBuilder.DropTable(
                name: "Workshopet");
        }
    }
}
