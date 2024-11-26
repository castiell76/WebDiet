using Microsoft.EntityFrameworkCore;

namespace WebDiet.Server.Entities
{
    public class ApplicationDbContext : DbContext
    {
        private string _connectionString = "Server=(LocalDb)\\MSSQLLocalDB;Database=ApplicationDb;Trusted_Connection=True;";

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<DishIngredient> DishIngredients { get; set; }
        public DbSet<DishAllergen> DishAllergens { get; set; }
        public DbSet<DishMenu> DishMenus { get; set; }
        public DbSet<IngredientAllergen> IngredientAllergens { get; set; }
        public DbSet<MenuAllergen> MenuAllergens { get; set; }

        public DbSet<Allergen> Allergens { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.Entity<MenuAllergen>()
                .HasKey(ma => new { ma.MenuId, ma.AllergenId });

            modelBuilder.Entity<MenuAllergen>()
                .HasOne(ma => ma.Menu)
                .WithMany(m => m.MenuAllergens)
                .HasForeignKey(ma => ma.MenuId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuAllergen>()
                .HasOne(ma => ma.Allergen)
                .WithMany(a => a.MenuAllergens)
                .HasForeignKey(ma => ma.AllergenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IngredientAllergen>()
                .HasKey(ia => new { ia.IngredientId, ia.AllergenId });

            modelBuilder.Entity<IngredientAllergen>()
                .HasOne(ia => ia.Ingredient)
                .WithMany(i => i.IngredientAllergens)
                .HasForeignKey(ia => ia.IngredientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IngredientAllergen>()
                .HasOne(ia => ia.Allergen)
                .WithMany(a => a.IngredientAllergens)
                .HasForeignKey(ia => ia.AllergenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DishAllergen>()
                .HasKey(di => new { di.DishId, di.AllergenId });

            modelBuilder.Entity<DishAllergen>()
                .HasOne(da => da.Dish)
                .WithMany(d => d.DishAllergens)
                .HasForeignKey(da => da.DishId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DishAllergen>()
                .HasOne(da => da.Allergen)
                .WithMany(a => a.DishAllergens)
                .HasForeignKey(da => da.AllergenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DishIngredient>()
                .HasKey(di => new { di.DishId, di.IngredientId });

            modelBuilder.Entity<DishIngredient>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.DishIngredients)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Restrict); //cascade delete off

            modelBuilder.Entity<DishIngredient>()
                .HasOne(di => di.Ingredient)
                .WithMany(i => i.DishIngredients)
                .HasForeignKey(di => di.IngredientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DishMenu>()
                .HasKey(di => new { di.DishId, di.MenuId });

            modelBuilder.Entity<DishMenu>()
                .HasOne(di => di.Dish)
                .WithMany(d => d.DishMenus)
                .HasForeignKey(di => di.DishId)
                .OnDelete(DeleteBehavior.Restrict); //cascade delete off

            modelBuilder.Entity<DishMenu>()
                .HasOne(di => di.Menu)
                .WithMany(i => i.DishesMenu)
                .HasForeignKey(di => di.MenuId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .Property(d => d.Email)
                .IsRequired();

            modelBuilder.Entity<Role>()
                .Property(d => d.Name)
                .IsRequired();

            modelBuilder.Entity<Dish>()
                .Property(d => d.Name)
                .IsRequired();

            modelBuilder.Entity<Menu>()
                .HasOne(m => m.User)
                .WithMany(u => u.Menus)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Menu>()
                .Property(m => m.Date)
                .IsRequired();

            modelBuilder.Entity<Ingredient>()
                .Property(i => i.Name)
                .HasMaxLength(30);

            modelBuilder.Entity<Allergen>()
                .Property(i => i.Name)
                .HasMaxLength(30)
                .IsRequired();

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }
    }
}
