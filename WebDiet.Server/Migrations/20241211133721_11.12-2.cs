using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _11122 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Allergens",
                table: "UserCustomDishes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Carbo",
                table: "UserCustomDishes",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "UserCustomDishes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Fat",
                table: "UserCustomDishes",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Kcal",
                table: "UserCustomDishes",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Protein",
                table: "UserCustomDishes",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allergens",
                table: "UserCustomDishes");

            migrationBuilder.DropColumn(
                name: "Carbo",
                table: "UserCustomDishes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "UserCustomDishes");

            migrationBuilder.DropColumn(
                name: "Fat",
                table: "UserCustomDishes");

            migrationBuilder.DropColumn(
                name: "Kcal",
                table: "UserCustomDishes");

            migrationBuilder.DropColumn(
                name: "Protein",
                table: "UserCustomDishes");
        }
    }
}
