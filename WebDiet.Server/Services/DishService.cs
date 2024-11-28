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
            var dish = _context.Dishes.FirstOrDefault(x => x.Id == id);
            if (dish == null) throw new NotFoundException("Dish not found");


            //TODO CALCULATE NUTRITION VALUES
            dish.Name = updatedDish.Name ?? dish.Name;

            //dish.Protein = updatedDish.Protein ?? dish.Protein;
            //dish.Carbo = updatedDish.Carbo ?? dish.Carbo;
            //dish.Fat = updatedDish.Fat ?? dish.Fat;
            //dish.KCal = updatedDish.KCal ?? dish.KCal;
            dish.Description = updatedDish.Description ?? dish.Description;

            _context.SaveChanges();

        }
        public DishDto GetById(int id)
        {
            var dish = _context.Dishes
                .Include(d => d.DishIngredients)
                    .ThenInclude(di => di.Ingredient)
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

            };
            dish.KCal = 0;
            dish.Protein = 0;
            dish.Fat = 0;
            dish.Carbo = 0;


            foreach (var ingredientdish in dish.DishIngredients)
            {
                var ingredient = _context.Ingredients.Where(i => i.Id == ingredientdish.IngredientId).FirstOrDefault();
                dish.KCal = dish.KCal + (ingredientdish.Quantity * ingredient.KCal/100);
                dish.Protein = dish.Protein + (ingredientdish.Quantity * ingredient.Protein / 100);
                dish.Carbo = dish.Carbo + (ingredientdish.Quantity * ingredient.Carbo / 100);
                dish.Fat = dish.Fat + (ingredientdish.Quantity * ingredient.Fat / 100);
                foreach(var ingredientAllergen in ingredient.IngredientAllergens)
                {
                    var allergen = _context.Allergens.Where(a=>a.Id == ingredientAllergen.AllergenId).FirstOrDefault();
                    dish.DishAllergens.Add(new DishAllergen
                    {
                        DishId =dish.Id,
                        AllergenId = allergen.Id,
                    });
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
