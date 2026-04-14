using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FinalTableFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VepratArtit_Artistes_ArtistiID",
                table: "VepratArtit");

            migrationBuilder.DropTable(
                name: "Concerts");

            migrationBuilder.DropTable(
                name: "Sallas");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Artistes",
                table: "Artistes");

            migrationBuilder.RenameTable(
                name: "Artistes",
                newName: "Artistet");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Artistet",
                table: "Artistet",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VepratArtit_Artistet_ArtistiID",
                table: "VepratArtit",
                column: "ArtistiID",
                principalTable: "Artistet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VepratArtit_Artistet_ArtistiID",
                table: "VepratArtit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Artistet",
                table: "Artistet");

            migrationBuilder.RenameTable(
                name: "Artistet",
                newName: "Artistes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Artistes",
                table: "Artistes",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Concerts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Concerts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sallas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kati = table.Column<int>(type: "int", nullable: false),
                    Pajisjet = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pershkrimi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statusi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sallas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_VepratArtit_Artistes_ArtistiID",
                table: "VepratArtit",
                column: "ArtistiID",
                principalTable: "Artistes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
