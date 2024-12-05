using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _05121 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishMenus_Dishes_DishId",
                table: "DishMenus");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenus_Menus_MenuId",
                table: "DishMenus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus");

            migrationBuilder.DropIndex(
                name: "IX_DishMenus_MenuId",
                table: "DishMenus");

            migrationBuilder.AddColumn<int>(
                name: "UserCustomDishId",
                table: "DishMenus",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus",
                columns: new[] { "MenuId", "DishId" });

            migrationBuilder.CreateTable(
                name: "UserCustomDishes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BaseDishId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCustomDishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCustomDishes_Dishes_BaseDishId",
                        column: x => x.BaseDishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCustomDishes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserDishIngredients",
                columns: table => new
                {
                    UserCustomDishId = table.Column<int>(type: "int", nullable: false),
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDishIngredients", x => new { x.UserCustomDishId, x.IngredientId });
                    table.ForeignKey(
                        name: "FK_UserDishIngredients_Ingredients_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDishIngredients_UserCustomDishes_UserCustomDishId",
                        column: x => x.UserCustomDishId,
                        principalTable: "UserCustomDishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DishMenus_DishId",
                table: "DishMenus",
                column: "DishId");

            migrationBuilder.CreateIndex(
                name: "IX_DishMenus_UserCustomDishId",
                table: "DishMenus",
                column: "UserCustomDishId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCustomDishes_BaseDishId",
                table: "UserCustomDishes",
                column: "BaseDishId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCustomDishes_UserId",
                table: "UserCustomDishes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDishIngredients_IngredientId",
                table: "UserDishIngredients",
                column: "IngredientId");

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_Dishes_DishId",
                table: "DishMenus",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_Menus_MenuId",
                table: "DishMenus",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_UserCustomDishes_UserCustomDishId",
                table: "DishMenus",
                column: "UserCustomDishId",
                principalTable: "UserCustomDishes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishMenus_Dishes_DishId",
                table: "DishMenus");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenus_Menus_MenuId",
                table: "DishMenus");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenus_UserCustomDishes_UserCustomDishId",
                table: "DishMenus");

            migrationBuilder.DropTable(
                name: "UserDishIngredients");

            migrationBuilder.DropTable(
                name: "UserCustomDishes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus");

            migrationBuilder.DropIndex(
                name: "IX_DishMenus_DishId",
                table: "DishMenus");

            migrationBuilder.DropIndex(
                name: "IX_DishMenus_UserCustomDishId",
                table: "DishMenus");

            migrationBuilder.DropColumn(
                name: "UserCustomDishId",
                table: "DishMenus");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus",
                columns: new[] { "DishId", "MenuId" });

            migrationBuilder.CreateIndex(
                name: "IX_DishMenus_MenuId",
                table: "DishMenus",
                column: "MenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_Dishes_DishId",
                table: "DishMenus",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_Menus_MenuId",
                table: "DishMenus",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
