using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IMenuService
    {
        MenuDto GetById(int id);
        IEnumerable<MenuDto> GetAll();
        int Create(MenuDto menu, int userId);
        void Delete(int id);

        void Update(int id, MenuDto menu);
    }
    public class MenuService : IMenuService
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
        public void Update(int id, MenuDto updatedMenu)
        {
            var menu = _context.Menus.FirstOrDefault(x => x.Id == id);
            if (menu == null) throw new NotFoundException("Menu not found");

            menu.Description = updatedMenu.Description ?? menu.Description;
            menu.Kcal = updatedMenu.Kcal ?? menu.Kcal;
            menu.Protein = updatedMenu.Protein ?? menu.Protein;
            menu.Carbo = updatedMenu.Carbo ?? menu.Carbo;
            menu.Fat = updatedMenu.Fat ?? menu.Fat;
            menu.Date = updatedMenu.Date;

            _context.SaveChanges();

        }
        public MenuDto GetById(int id)
        {
            var menu = _context.Menus
            .Include(d => d.DishesMenu)
                .ThenInclude(di => di.Dish)
                .ThenInclude(i=>i.DishIngredients)
                .ThenInclude(di=>di.Ingredient)
            .Include(d => d.MenuAllergens)
                .ThenInclude(da => da.Allergen)
            .FirstOrDefault(d => d.Id == id);

            if (menu == null)
            {
                throw new NotFoundException("Dish not found");
            }

            var menuDto = _mapper.Map<MenuDto>(menu);
            return menuDto;
        }

        public IEnumerable<MenuDto> GetAll()
        {
            var menus = _context.Menus.ToList();
            var menusDtos = _mapper.Map<List<MenuDto>>(menus);
            return menusDtos;
        }

        public int Create(MenuDto dto, int userId)
        {
            // Mapowanie MenuDto do encji Menu
            var menu = _mapper.Map<Menu>(dto);
            menu.UserId = userId;


            foreach (var dishDto in dto.Dishes)
            {
                var dish = _context.Dishes
                    .Include(d => d.DishIngredients)  
                    .ThenInclude(di => di.Ingredient) 
                    .Include(d => d.DishAllergens)   
                    .ThenInclude(da => da.Allergen)  
                    .FirstOrDefault(d => d.Id == dishDto.DishId);


                var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
                var ingredients = _context.Ingredients
              .Include(i => i.IngredientAllergens)
                  .ThenInclude(ia => ia.Allergen)
              .Where(i => ingredientIds.Contains(i.Id))
              .ToList();

                if (dish != null)
                {

                    var dishMenu = new DishMenu
                    {
                        Dish = dish,
                        Menu = menu,
                        Type = dishDto.Type,
                        User = _context.Users.FirstOrDefault(u => u.UserId == userId)
                    };
                    menu.DishesMenu.Add(dishMenu);

                    var uniqueAllergenIds = new HashSet<int>();

                    foreach (var dishIngredient in dish.DishIngredients)
                    {
                        var ingredient = ingredients.First(i => i.Id == dishIngredient.IngredientId);

                        foreach (var ingredientAllergen in ingredient.IngredientAllergens)
                        {
                            if (uniqueAllergenIds.Add(ingredientAllergen.AllergenId))
                            {
                                menu.MenuAllergens.Add(new MenuAllergen
                                {
                                    AllergenId = ingredientAllergen.AllergenId,
                                    MenuId = menu.Id,
                                });
                            }
                        }


                        if (!_context.DishIngredients.Any(di => di.DishId == dishIngredient.DishId && di.IngredientId == dishIngredient.IngredientId))
                        {
                            _context.DishIngredients.Add(dishIngredient);
                        }
                    }
                }
            }

            _context.Menus.Add(menu);
            _context.SaveChanges();

            return menu.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Menu id:{id} DELETE action has been invoked");

            var menu = _context.Menus.FirstOrDefault(i => i.Id == id);

            if (menu is null) throw new NotFoundException("Menu not found");

            _context.Menus.Remove(menu);
            _context.SaveChanges();

        }
    }
}
