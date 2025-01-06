using WebDiet.Server.Entities;

namespace WebDiet.Server
{
    public class Seeder
    {
        private readonly ApplicationDbContext _context;

        public Seeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            if (_context.Database.CanConnect())
            {
                //if (!_context.Ingredients.Any())
                //{
                //    _context.Ingredients.AddRange(GetIngredients());

                //    _context.SaveChanges();
                //}
                if (!_context.Roles.Any())
                {
                    _context.Roles.AddRange(GetRoles());

                    _context.SaveChanges();
                }
                //if (!_context.Dishes.Any())
                //{
                //    _context.Dishes.AddRange(GetDishes());
                //    _context.SaveChanges();
                //}
                if (!_context.Allergens.Any())
                {
                    _context.Allergens.AddRange(GetAllergens());
                    _context.SaveChanges();
                }
            }
        }

        private IEnumerable<Ingredient> GetIngredients()
        {
            return new List<Ingredient>()
            {
                new Ingredient()
                {
                    Name = "Test1",
                    Protein = 21,
                    Carbo = 37,
                    Fat = 22,
                    KCal = 38,
                    Description = "testowy opis 1",
                    

                },
                new Ingredient()
                {
                    Name = "Test2",
                    Protein = 210,
                    Carbo = 370,
                    Fat = 220,
                    KCal = 380,
                    Description = "testowy opis 2",
                 

                },
            };
        }

        private IEnumerable<Dish> GetDishes()
        {
            return new List<Dish>()
            {
                new Dish()
                {
                    Name = "test",
                    Description = "testdesc",
                }
            };
        }

        private IEnumerable<Role> GetRoles()
        {
            return new List<Role>()
            {
                new Role()
                {
                    Name = "User",
                },
                new Role()
                {
                    Name = "Moderator",
                },
                new Role()
                {
                    Name = "Admin",
                }

            };
        }
        private IEnumerable<Allergen> GetAllergens()
        {
            return new List<Allergen>()
            {
                new Allergen()
                {
                    Name = "Orzech",
                },
                new Allergen()
                {
                    Name = "Gluten",
                },
                new Allergen()
                {
                    Name = "Laktoza",
                },
                 new Allergen()
                {
                    Name = "Mięso",
                }

            };
        }
    }
}
