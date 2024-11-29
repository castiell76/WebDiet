using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _2911W : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "KCal",
                table: "Dishes",
                newName: "Kcal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Kcal",
                table: "Dishes",
                newName: "KCal");
        }
    }
}
