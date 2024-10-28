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
                if (!_context.Ingredients.Any())
                {
                    _context.Ingredients.AddRange(GetIngredients());
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

    }
}
