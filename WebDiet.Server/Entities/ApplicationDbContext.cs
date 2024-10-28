using Microsoft.EntityFrameworkCore;

namespace WebDiet.Server.Entities
{
    public class ApplicationDbContext : DbContext
    {
        private string _connectionString = "Server=(LocalDb)\\MSSQLLocalDB;Database=ApplicationDb;Trusted_Connection=True;";
        public DbSet<User> Users { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<DishIngredient> DishIngredients { get; set; }

        public DbSet<Allergen> Allergens { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

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
