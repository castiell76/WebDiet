using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IAllergenService
    {
        int Create(Allergen allergen);
        IEnumerable<Allergen> GetAll();

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

        public IEnumerable<Allergen> GetAll()
        {
            var allergens = _context.Allergens.ToList();
            return allergens;
        }
    }
}
