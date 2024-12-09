﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDiet.Server.Migrations
{
    /// <inheritdoc />
    public partial class _09121 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDishIngredients_Ingredients_IngredientId",
                table: "UserDishIngredients");

            migrationBuilder.CreateTable(
                name: "IngredientDto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kcal = table.Column<double>(type: "float", nullable: true),
                    Protein = table.Column<double>(type: "float", nullable: true),
                    Carbo = table.Column<double>(type: "float", nullable: true),
                    Fat = table.Column<double>(type: "float", nullable: true),
                    Quantity = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientDto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AllergenDto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IngredientDtoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllergenDto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AllergenDto_IngredientDto_IngredientDtoId",
                        column: x => x.IngredientDtoId,
                        principalTable: "IngredientDto",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AllergenDto_IngredientDtoId",
                table: "AllergenDto",
                column: "IngredientDtoId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDishIngredients_IngredientDto_IngredientId",
                table: "UserDishIngredients",
                column: "IngredientId",
                principalTable: "IngredientDto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDishIngredients_IngredientDto_IngredientId",
                table: "UserDishIngredients");

            migrationBuilder.DropTable(
                name: "AllergenDto");

            migrationBuilder.DropTable(
                name: "IngredientDto");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDishIngredients_Ingredients_IngredientId",
                table: "UserDishIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}