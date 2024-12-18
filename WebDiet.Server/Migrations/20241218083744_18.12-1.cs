using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _18121 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCustomDishes_Dishes_BaseDishId",
                table: "UserCustomDishes");

            migrationBuilder.AlterColumn<int>(
                name: "BaseDishId",
                table: "UserCustomDishes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCustomDishes_Dishes_BaseDishId",
                table: "UserCustomDishes",
                column: "BaseDishId",
                principalTable: "Dishes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCustomDishes_Dishes_BaseDishId",
                table: "UserCustomDishes");

            migrationBuilder.AlterColumn<int>(
                name: "BaseDishId",
                table: "UserCustomDishes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCustomDishes_Dishes_BaseDishId",
                table: "UserCustomDishes",
                column: "BaseDishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
