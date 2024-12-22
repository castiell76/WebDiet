using AutoMapper;
using Humanizer;
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

        void Update(int id, MenuDto menu, int userId);
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
        public void Update(int id, MenuDto updatedMenu, int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId)
                ?? throw new Exception("User not found");

            var menu = _context.Menus
                .Include(m => m.DishesMenu)
                .Include(m => m.MenuAllergens)
                .FirstOrDefault(i => i.Id == id)
                ?? throw new Exception("Menu not found");

            // Reset wartości w menu
            menu.Protein = 0;
            menu.Carbo = 0;
            menu.Fat = 0;
            menu.Kcal = 0;
            menu.Description = updatedMenu.Description;

            // Usuwanie istniejących rekordów
            _context.DishMenus.RemoveRange(menu.DishesMenu);
            _context.MenuAllergens.RemoveRange(menu.MenuAllergens);

            var processedAllergens = new HashSet<int>(); // Zbiór do śledzenia już dodanych alergenów

            foreach (var dishDto in updatedMenu.Dishes)
            {
                var dish = _context.Dishes
                    .Include(d => d.DishIngredients)
                    .ThenInclude(di => di.Ingredient)
                    .Include(d => d.DishAllergens)
                    .ThenInclude(da => da.Allergen)
                    .FirstOrDefault(d => d.Id == dishDto.DishId);

                if (dish != null)
                {
                    // Aktualizacja wartości menu
                    menu.Kcal += dish.Kcal;
                    menu.Protein += dish.Protein;
                    menu.Carbo += dish.Carbo;
                    menu.Fat += dish.Fat;

                    // Dodanie DishMenu
                    var dishMenu = new DishMenu
                    {
                        MenuId = menu.Id,
                        DishId = dish.Id,
                        Type = dishDto.Type,
                        UserId = userId,
                        User = user
                    };
                    _context.DishMenus.Add(dishMenu);

                    // Przetwarzanie alergenów
                    var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
                    var ingredients = _context.Ingredients
                        .Include(i => i.IngredientAllergens)
                        .Where(i => ingredientIds.Contains(i.Id))
                        .ToList();

                    foreach (var ingredient in ingredients)
                    {
                        foreach (var allergen in ingredient.IngredientAllergens)
                        {
                            if (processedAllergens.Add(allergen.AllergenId))
                            {
                                var menuAllergen = new MenuAllergen
                                {
                                    MenuId = menu.Id,
                                    AllergenId = allergen.AllergenId
                                };
                                _context.MenuAllergens.Add(menuAllergen);
                            }
                        }
                    }
                }
            }

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
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId)
                ?? throw new Exception("User not found");

            var menu = new Menu
            {
                UserId = userId,
                Description = dto.Description,
                Date = dto.Date,
                Kcal =0,
                Carbo =0,
                Protein =0,
                Fat =0,
            };

            _context.Menus.Add(menu);
            _context.SaveChanges();

            var processedAllergens = new HashSet<int>(); // Zbiór do śledzenia już dodanych alergenów

            foreach (var dishDto in dto.Dishes)
            {
                var dish = _context.Dishes
                    .Include(d => d.DishIngredients)
                    .ThenInclude(di => di.Ingredient)
                    .Include(d => d.DishAllergens)
                    .ThenInclude(da => da.Allergen)
                    .FirstOrDefault(d => d.Id == dishDto.DishId);

                menu.Kcal += dish.Kcal;
                menu.Protein += dish.Protein;
                menu.Carbo += dish.Carbo;
                menu.Fat += dish.Fat;

                if (dish != null)
                {
                    var dishMenu = new DishMenu
                    {
                        MenuId = menu.Id,
                        DishId = dish.Id,
                        Type = dishDto.Type,
                        UserId = userId,
                        User = user
                    };

                    _context.DishMenus.Add(dishMenu);

                    // Pobieramy składniki
                    var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
                    var ingredients = _context.Ingredients
                        .Include(i => i.IngredientAllergens)
                        .Where(i => ingredientIds.Contains(i.Id))
                        .ToList();

                    // Zbieramy alergeny ze składników
                    foreach (var ingredient in ingredients)
                    {
                        foreach (var allergen in ingredient.IngredientAllergens)
                        {

                            if (processedAllergens.Add(allergen.AllergenId))
                            {
                                var menuAllergen = new MenuAllergen
                                {
                                    MenuId = menu.Id,
                                    AllergenId = allergen.AllergenId
                                };
                                _context.MenuAllergens.Add(menuAllergen);
                            }
                        }
                    }
                }
            }

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
