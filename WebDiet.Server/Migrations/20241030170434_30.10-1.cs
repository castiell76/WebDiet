using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _30101 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Allergens_Dishes_DishId",
                table: "Allergens");

            migrationBuilder.DropForeignKey(
                name: "FK_Allergens_Ingredients_IngredientId",
                table: "Allergens");

            migrationBuilder.DropForeignKey(
                name: "FK_Allergens_Menus_MenuId",
                table: "Allergens");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenu_Dishes_DishId",
                table: "DishMenu");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenu_Menus_MenuId",
                table: "DishMenu");

            migrationBuilder.DropForeignKey(
                name: "FK_DishMenu_Users_UserId",
                table: "DishMenu");

            migrationBuilder.DropIndex(
                name: "IX_Allergens_DishId",
                table: "Allergens");

            migrationBuilder.DropIndex(
                name: "IX_Allergens_IngredientId",
                table: "Allergens");

            migrationBuilder.DropIndex(
                name: "IX_Allergens_MenuId",
                table: "Allergens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishMenu",
                table: "DishMenu");

            migrationBuilder.DropColumn(
                name: "DishId",
                table: "Allergens");

            migrationBuilder.DropColumn(
                name: "IngredientId",
                table: "Allergens");

            migrationBuilder.DropColumn(
                name: "MenuId",
                table: "Allergens");

            migrationBuilder.RenameTable(
                name: "DishMenu",
                newName: "DishMenus");

            migrationBuilder.RenameIndex(
                name: "IX_DishMenu_UserId",
                table: "DishMenus",
                newName: "IX_DishMenus_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DishMenu_MenuId",
                table: "DishMenus",
                newName: "IX_DishMenus_MenuId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationDate",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus",
                columns: new[] { "DishId", "MenuId" });

            migrationBuilder.CreateTable(
                name: "DishAllergens",
                columns: table => new
                {
                    DishId = table.Column<int>(type: "int", nullable: false),
                    AllergenId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DishAllergens", x => new { x.DishId, x.AllergenId });
                    table.ForeignKey(
                        name: "FK_DishAllergens_Allergens_AllergenId",
                        column: x => x.AllergenId,
                        principalTable: "Allergens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DishAllergens_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IngredientAllergens",
                columns: table => new
                {
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    AllergenId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientAllergens", x => new { x.IngredientId, x.AllergenId });
                    table.ForeignKey(
                        name: "FK_IngredientAllergens_Allergens_AllergenId",
                        column: x => x.AllergenId,
                        principalTable: "Allergens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IngredientAllergens_Ingredients_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuAllergens",
                columns: table => new
                {
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    AllergenId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuAllergens", x => new { x.MenuId, x.AllergenId });
                    table.ForeignKey(
                        name: "FK_MenuAllergens_Allergens_AllergenId",
                        column: x => x.AllergenId,
                        principalTable: "Allergens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuAllergens_Menus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_DishAllergens_AllergenId",
                table: "DishAllergens",
                column: "AllergenId");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientAllergens_AllergenId",
                table: "IngredientAllergens",
                column: "AllergenId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAllergens_AllergenId",
                table: "MenuAllergens",
                column: "AllergenId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenus_Users_UserId",
                table: "DishMenus",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
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
                name: "FK_DishMenus_Users_UserId",
                table: "DishMenus");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "DishAllergens");

            migrationBuilder.DropTable(
                name: "IngredientAllergens");

            migrationBuilder.DropTable(
                name: "MenuAllergens");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishMenus",
                table: "DishMenus");

            migrationBuilder.DropColumn(
                name: "CreationDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "DishMenus",
                newName: "DishMenu");

            migrationBuilder.RenameIndex(
                name: "IX_DishMenus_UserId",
                table: "DishMenu",
                newName: "IX_DishMenu_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DishMenus_MenuId",
                table: "DishMenu",
                newName: "IX_DishMenu_MenuId");

            migrationBuilder.AddColumn<int>(
                name: "DishId",
                table: "Allergens",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IngredientId",
                table: "Allergens",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MenuId",
                table: "Allergens",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishMenu",
                table: "DishMenu",
                columns: new[] { "DishId", "MenuId" });

            migrationBuilder.CreateIndex(
                name: "IX_Allergens_DishId",
                table: "Allergens",
                column: "DishId");

            migrationBuilder.CreateIndex(
                name: "IX_Allergens_IngredientId",
                table: "Allergens",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_Allergens_MenuId",
                table: "Allergens",
                column: "MenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Allergens_Dishes_DishId",
                table: "Allergens",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Allergens_Ingredients_IngredientId",
                table: "Allergens",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Allergens_Menus_MenuId",
                table: "Allergens",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenu_Dishes_DishId",
                table: "DishMenu",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenu_Menus_MenuId",
                table: "DishMenu",
                column: "MenuId",
                principalTable: "Menus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DishMenu_Users_UserId",
                table: "DishMenu",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
