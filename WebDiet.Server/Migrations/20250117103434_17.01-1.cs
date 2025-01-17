using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _17011 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "UserDishIngredients",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "UserDishIngredients");
        }
    }
}
