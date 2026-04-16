using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Bileta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Biletat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgjarjeId = table.Column<int>(type: "int", nullable: false),
                    PjesemarresId = table.Column<int>(type: "int", nullable: false),
                    DataBlerjes = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Cmimi = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Lloji = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statusi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Biletat", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Biletat");
        }
    }
}
