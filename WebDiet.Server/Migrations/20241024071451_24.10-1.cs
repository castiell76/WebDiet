using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _24101 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Allergen",
                table: "Menus",
                newName: "Allergens");

            migrationBuilder.RenameColumn(
                name: "Allergen",
                table: "Ingredients",
                newName: "Allergens");

            migrationBuilder.RenameColumn(
                name: "Allergen",
                table: "Dishes",
                newName: "Allergens");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Allergens",
                table: "Menus",
                newName: "Allergen");

            migrationBuilder.RenameColumn(
                name: "Allergens",
                table: "Ingredients",
                newName: "Allergen");

            migrationBuilder.RenameColumn(
                name: "Allergens",
                table: "Dishes",
                newName: "Allergen");
        }
    }
}
