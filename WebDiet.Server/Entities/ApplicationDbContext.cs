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
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Konfiguracja relacji wiele-do-wielu dla Dish-Ingredient
            modelBuilder.Entity<DishIngredient>()
                .HasKey(di => new { di.DishId, di.IngredientId, di.UserId });

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

            modelBuilder.Entity<DishIngredient>()
                .HasOne(di => di.User)
                .WithMany(u => u.DishIngredients)
                .HasForeignKey(di => di.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Konfiguracja relacji wiele-do-jednego dla Dish-Menu
            modelBuilder.Entity<Dish>()
                .HasOne(d => d.Menu)
                .WithMany(m => m.Dishes)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Dish>()
                .Property(d => d.Name)
                .IsRequired();

            // Konfiguracja relacji jeden-do-wielu dla User-Menu
            modelBuilder.Entity<Menu>()
                .HasOne(m => m.User)
                .WithMany(u => u.Menus)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Menu>()
                .Property(m => m.Name)
                .IsRequired();

            modelBuilder.Entity<Menu>()
                .Property(m => m.Date)
                .IsRequired();

            modelBuilder.Entity<Ingredient>()
                .Property(i => i.Name)
                .HasMaxLength(30);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }
    }
}
