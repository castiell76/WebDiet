using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _03011 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Types",
                table: "Dishes",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Types",
                table: "Dishes");
        }
    }
}
