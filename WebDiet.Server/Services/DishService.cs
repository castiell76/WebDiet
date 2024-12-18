using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IDishService
    {
        DishDto GetById(int id);
        IEnumerable<DishDto> GetAll();
        int Create(DishDto dish);
        void Delete(int id);
        void Update(int id, DishDto dish);
    }

    public class DishService : IDishService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<DishService> _logger;
        private IMapper _mapper;
        public DishService(ApplicationDbContext context, IMapper mapper, ILogger<DishService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        public void Update(int id, DishDto updatedDish)
        {
            var dish = _context.Dishes
                .Include(d=>d.DishIngredients)
                .Include(d=>d.DishAllergens)
                .FirstOrDefault(x => x.Id == id);
            if (dish == null) throw new NotFoundException("Dish not found");

            dish.Name = updatedDish.Name ?? dish.Name;
            dish.Description = updatedDish.Description ?? dish.Description;
            dish.Protein = 0;
            dish.Carbo = 0;
            dish.Fat = 0;
            dish.Kcal = 0;
            dish.DishIngredients = null;
            _context.DishIngredients.RemoveRange(dish.DishIngredients);
            _context.DishAllergens.RemoveRange(dish.DishAllergens);

            dish.DishIngredients = updatedDish.Ingredients.Select(ingredient => new DishIngredient
            {
                IngredientId = ingredient.Id,
                Quantity = ingredient.Quantity
            }).ToList();

            var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
            var ingredients = _context.Ingredients
                .Include(i => i.IngredientAllergens)
                    .ThenInclude(ia => ia.Allergen)
                .Where(i => ingredientIds.Contains(i.Id))
                .ToList();

            var uniqueAllergenIds = new HashSet<int>();

            foreach (var dishIngredient in dish.DishIngredients)
            {
                var ingredient = ingredients.First(i => i.Id == dishIngredient.IngredientId);


                dish.Kcal += (dishIngredient.Quantity * ingredient.KCal / 100);
                dish.Protein += (dishIngredient.Quantity * ingredient.Protein / 100);
                dish.Carbo += (dishIngredient.Quantity * ingredient.Carbo / 100);
                dish.Fat += (dishIngredient.Quantity * ingredient.Fat / 100);

                foreach (var ingredientAllergen in ingredient.IngredientAllergens)
                {
                    if (uniqueAllergenIds.Add(ingredientAllergen.AllergenId))
                    {
                        dish.DishAllergens.Add(new DishAllergen
                        {
                            AllergenId = ingredientAllergen.AllergenId
                        });
                    }
                }
            }


            _context.SaveChanges();

        }
        public DishDto GetById(int id)
        {
            var dish = _context.Dishes
                .Include(d => d.DishIngredients) 
                    .ThenInclude(di => di.Ingredient) 
                .Include(d => d.DishAllergens) 
                    .ThenInclude(da => da.Allergen) 
                .FirstOrDefault(d => d.Id == id);

            if (dish == null)
            {
                throw new NotFoundException("Dish not found");
            }

            var dishDto = _mapper.Map<DishDto>(dish);
            return dishDto;
        }

        public IEnumerable<DishDto> GetAll()
        {
            var dishes = _context.Dishes.ToList();
            var dishesDtos = _mapper.Map<List<DishDto>>(dishes);
            return dishesDtos;
        }

        public int Create(DishDto dto)
        {
            var dish = new Dish
            {
                Name = dto.Name,
                Description = dto.Description,
                DishIngredients = dto.Ingredients.Select(ingredient => new DishIngredient
                {
                    IngredientId = ingredient.Id,
                    Quantity = ingredient.Quantity,
                }).ToList(),
                DishAllergens = new List<DishAllergen>(), 
                Kcal = 0,
                Protein = 0,
                Fat = 0,
                Carbo = 0
            };


            var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
            var ingredients = _context.Ingredients
                .Include(i => i.IngredientAllergens)
                    .ThenInclude(ia => ia.Allergen)
                .Where(i => ingredientIds.Contains(i.Id))
                .ToList();


            var uniqueAllergenIds = new HashSet<int>();

            foreach (var dishIngredient in dish.DishIngredients)
            {
                var ingredient = ingredients.First(i => i.Id == dishIngredient.IngredientId);


                dish.Kcal += (dishIngredient.Quantity * ingredient.KCal / 100);
                dish.Protein += (dishIngredient.Quantity * ingredient.Protein / 100);
                dish.Carbo += (dishIngredient.Quantity * ingredient.Carbo / 100);
                dish.Fat += (dishIngredient.Quantity * ingredient.Fat / 100);


                foreach (var ingredientAllergen in ingredient.IngredientAllergens)
                {
                    if (uniqueAllergenIds.Add(ingredientAllergen.AllergenId))
                    {
                        dish.DishAllergens.Add(new DishAllergen
                        {
                            AllergenId = ingredientAllergen.AllergenId
                        });
                    }
                }
            }

            _context.Dishes.Add(dish);
            _context.SaveChanges();
            return dish.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Dish id:{id} DELETE action has been invoked");

            var dish = _context.Dishes.FirstOrDefault(i => i.Id == id);

            if (dish is null) throw new NotFoundException("Dish not found");

            _context.Dishes.Remove(dish);
            _context.SaveChanges();

        }
    }
}
