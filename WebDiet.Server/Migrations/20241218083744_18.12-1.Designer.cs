﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebDiet.Server.Entities;

#nullable disable

namespace WebDiet.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241218083744_18.12-1")]
    partial class _18121
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("UserCustomDish", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Allergens")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("BaseDishId")
                        .HasColumnType("int");

                    b.Property<double?>("Carbo")
                        .HasColumnType("float");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Fat")
                        .HasColumnType("float");

                    b.Property<double?>("Kcal")
                        .HasColumnType("float");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Protein")
                        .HasColumnType("float");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BaseDishId");

                    b.HasIndex("UserId");

                    b.ToTable("UserCustomDishes");
                });

            modelBuilder.Entity("UserDishIngredient", b =>
                {
                    b.Property<int>("UserCustomDishId")
                        .HasColumnType("int");

                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<double?>("Quantity")
                        .HasColumnType("float");

                    b.HasKey("UserCustomDishId", "IngredientId");

                    b.HasIndex("IngredientId");

                    b.ToTable("UserDishIngredients");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Allergen", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("Id");

                    b.ToTable("Allergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Dish", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double?>("Carbo")
                        .HasColumnType("float");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Fat")
                        .HasColumnType("float");

                    b.Property<double?>("Kcal")
                        .HasColumnType("float");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Protein")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.ToTable("Dishes");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishAllergen", b =>
                {
                    b.Property<int>("DishId")
                        .HasColumnType("int");

                    b.Property<int>("AllergenId")
                        .HasColumnType("int");

                    b.HasKey("DishId", "AllergenId");

                    b.HasIndex("AllergenId");

                    b.ToTable("DishAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishIngredient", b =>
                {
                    b.Property<int>("DishId")
                        .HasColumnType("int");

                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<double?>("Quantity")
                        .HasColumnType("float");

                    b.HasKey("DishId", "IngredientId");

                    b.HasIndex("IngredientId");

                    b.ToTable("DishIngredients");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishMenu", b =>
                {
                    b.Property<int>("MenuId")
                        .HasColumnType("int");

                    b.Property<int>("DishId")
                        .HasColumnType("int");

                    b.Property<string>("Type")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("UserCustomDishId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("MenuId", "DishId");

                    b.HasIndex("DishId");

                    b.HasIndex("UserCustomDishId");

                    b.HasIndex("UserId");

                    b.ToTable("DishMenus");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Ingredient", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double?>("Carbo")
                        .IsRequired()
                        .HasColumnType("float");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Fat")
                        .IsRequired()
                        .HasColumnType("float");

                    b.Property<double?>("KCal")
                        .IsRequired()
                        .HasColumnType("float");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<double?>("Protein")
                        .IsRequired()
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.ToTable("Ingredients");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.IngredientAllergen", b =>
                {
                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<int>("AllergenId")
                        .HasColumnType("int");

                    b.HasKey("IngredientId", "AllergenId");

                    b.HasIndex("AllergenId");

                    b.ToTable("IngredientAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Menu", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double?>("Carbo")
                        .HasColumnType("float");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Fat")
                        .HasColumnType("float");

                    b.Property<double?>("Kcal")
                        .HasColumnType("float");

                    b.Property<double?>("Protein")
                        .HasColumnType("float");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Menus");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.MenuAllergen", b =>
                {
                    b.Property<int>("MenuId")
                        .HasColumnType("int");

                    b.Property<int>("AllergenId")
                        .HasColumnType("int");

                    b.HasKey("MenuId", "AllergenId");

                    b.HasIndex("AllergenId");

                    b.ToTable("MenuAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("UserCustomDish", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Dish", "BaseDish")
                        .WithMany()
                        .HasForeignKey("BaseDishId");

                    b.HasOne("WebDiet.Server.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BaseDish");

                    b.Navigation("User");
                });

            modelBuilder.Entity("UserDishIngredient", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Ingredient", "Ingredient")
                        .WithMany()
                        .HasForeignKey("IngredientId")
                        .IsRequired();

                    b.HasOne("UserCustomDish", "UserCustomDish")
                        .WithMany("CustomIngredients")
                        .HasForeignKey("UserCustomDishId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ingredient");

                    b.Navigation("UserCustomDish");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishAllergen", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Allergen", "Allergen")
                        .WithMany("DishAllergens")
                        .HasForeignKey("AllergenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebDiet.Server.Entities.Dish", "Dish")
                        .WithMany("DishAllergens")
                        .HasForeignKey("DishId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Allergen");

                    b.Navigation("Dish");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishIngredient", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Dish", "Dish")
                        .WithMany("DishIngredients")
                        .HasForeignKey("DishId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebDiet.Server.Entities.Ingredient", "Ingredient")
                        .WithMany("DishIngredients")
                        .HasForeignKey("IngredientId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Dish");

                    b.Navigation("Ingredient");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.DishMenu", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Dish", "Dish")
                        .WithMany("DishMenus")
                        .HasForeignKey("DishId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebDiet.Server.Entities.Menu", "Menu")
                        .WithMany("DishesMenu")
                        .HasForeignKey("MenuId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("UserCustomDish", "UserCustomDish")
                        .WithMany()
                        .HasForeignKey("UserCustomDishId");

                    b.HasOne("WebDiet.Server.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Dish");

                    b.Navigation("Menu");

                    b.Navigation("User");

                    b.Navigation("UserCustomDish");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.IngredientAllergen", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Allergen", "Allergen")
                        .WithMany("IngredientAllergens")
                        .HasForeignKey("AllergenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebDiet.Server.Entities.Ingredient", "Ingredient")
                        .WithMany("IngredientAllergens")
                        .HasForeignKey("IngredientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Allergen");

                    b.Navigation("Ingredient");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Menu", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.User", "User")
                        .WithMany("Menus")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.MenuAllergen", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Allergen", "Allergen")
                        .WithMany("MenuAllergens")
                        .HasForeignKey("AllergenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebDiet.Server.Entities.Menu", "Menu")
                        .WithMany("MenuAllergens")
                        .HasForeignKey("MenuId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Allergen");

                    b.Navigation("Menu");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.User", b =>
                {
                    b.HasOne("WebDiet.Server.Entities.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("UserCustomDish", b =>
                {
                    b.Navigation("CustomIngredients");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Allergen", b =>
                {
                    b.Navigation("DishAllergens");

                    b.Navigation("IngredientAllergens");

                    b.Navigation("MenuAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Dish", b =>
                {
                    b.Navigation("DishAllergens");

                    b.Navigation("DishIngredients");

                    b.Navigation("DishMenus");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Ingredient", b =>
                {
                    b.Navigation("DishIngredients");

                    b.Navigation("IngredientAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.Menu", b =>
                {
                    b.Navigation("DishesMenu");

                    b.Navigation("MenuAllergens");
                });

            modelBuilder.Entity("WebDiet.Server.Entities.User", b =>
                {
                    b.Navigation("Menus");
                });
#pragma warning restore 612, 618
        }
    }
}
