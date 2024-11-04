using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IMenuService
    {
        IngredientDto GetById(int id);
        IEnumerable<IngredientDto> GetAll();
        int Create(IngredientDto ingredient);
        void Delete(int id);

        void Update(int id, IngredientDto ingredient);
    }
    public class MenuService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<MenuService> _logger;
        private IMapper _mapper;
        public MenuService(ApplicationDbContext context, IMapper mapper, ILogger<MenuService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        public void Update(int id, IngredientDto updatedIngredient)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(x => x.Id == id);
            if (ingredient == null) throw new NotFoundException("Ingredient not found");

            ingredient.Name = updatedIngredient.Name ?? ingredient.Name;
            ingredient.Protein = updatedIngredient.Protein ?? ingredient.Protein;
            ingredient.Carbo = updatedIngredient.Carbo ?? ingredient.Carbo;
            ingredient.Fat = updatedIngredient.Fat ?? ingredient.Fat;
            ingredient.KCal = updatedIngredient.KCal ?? ingredient.KCal;
            ingredient.Description = updatedIngredient.Description ?? ingredient.Description;

            _context.SaveChanges();

        }
        public IngredientDto GetById(int id)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);
            var ingredientDto = _mapper.Map<IngredientDto>(ingredient);
            if (ingredient == null)
            {
                throw new NotFoundException("Ingredient not found");
            }

            return ingredientDto;
        }

        public IEnumerable<IngredientDto> GetAll()
        {
            var ingredients = _context.Ingredients.ToList();
            var ingredientsDtos = _mapper.Map<List<IngredientDto>>(ingredients);
            return ingredientsDtos;
        }

        public int Create(MenuDto dto)
        {
            var ingredient = _mapper.Map<Ingredient>(dto);
            _context.Ingredients.Add(ingredient);

            //DLA MENU
            //menu.userId = userId przekazanego w konstruktorze jako int userId
            _context.SaveChanges();
            return ingredient.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Ingredient id:{id} DELETE action has been invoked");

            var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);

            if (ingredient is null) throw new NotFoundException("Ingredient not found");

            _context.Ingredients.Remove(ingredient);
            _context.SaveChanges();

        }
    }
}
