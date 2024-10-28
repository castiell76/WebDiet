using WebDiet.Server.Entities;

namespace WebDiet.Server.Services
{
    public interface IAllergenService
    {
        int Create(Allergen allergen);

    }
    public class AllergenService : IAllergenService
    {
        private readonly ApplicationDbContext _context;
        public AllergenService(ApplicationDbContext context)
        {
            _context = context;
        }
        public int Create(Allergen allergen)
        {
            _context.Allergens.Add(allergen);
            _context.SaveChanges();
            return allergen.Id;
        }
    }
}
