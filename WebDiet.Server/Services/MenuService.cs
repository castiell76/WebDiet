using AutoMapper;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
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

        MenuDto Update(int id, MenuDto menu, int userId);
        MenuDto MenuSuggestion(DishSuggestionUserCondition dto, int userId);
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

        public MenuDto MenuSuggestion(DishSuggestionUserCondition dto, int userId)
        {
            Random random = new Random();
            var menuSuggestion = new MenuDto
            {
                Dishes = new List<DishMenuDto>(),
                Kcal = 0,
                Carbo = 0,
                Protein = 0,
                Fat = 0,
            };
            var dishes = _context.Dishes
                .Include(di=>di.DishIngredients)
                .ThenInclude(i=>i.Ingredient)
                .Include(da=>da.DishAllergens)
                .ThenInclude(a=>a.Allergen)
                .Include(dm=>dm.DishMenus)
                .ToList();

            dishes.RemoveAll(dish =>
                dish.DishAllergens.Any(da => dto.ExcludedAllergensIds.Contains(da.AllergenId)) ||
                dish.DishIngredients.Any(di => dto.ExcludedIngredientsIds.Contains(di.IngredientId)));

            var breakfastDishes = dishes
                .Where(p => p.Types != null && p.Types.Contains("Breakfast"))
                .ToList();
            var lunchDishes = dishes
                .Where(p => p.Types != null && p.Types.Contains("Lunch"))
                .ToList();
            var dinnerDishes = dishes
                .Where(p => p.Types != null && p.Types.Contains("Dinner"))
                .ToList();
            var supperDishes = dishes
                .Where(p => p.Types != null && p.Types.Contains("Supper"))
                .ToList();
            var snackDishes = dishes
                .Where(p => p.Types != null && p.Types.Contains("Snack"))
                .ToList();

            var breakfastDishesDto = _mapper.Map<List<DishDto>>(breakfastDishes);
            var lunchDishesDto = _mapper.Map<List<DishDto>>(lunchDishes);
            var dinnerDishesDto = _mapper.Map<List<DishDto>>(dinnerDishes);
            var supperDishesDto = _mapper.Map<List<DishDto>>(supperDishes);
            var snackDishesDto = _mapper.Map<List<DishDto>>(snackDishes);

            double breakfastKcal=0, dinnerKcal=0, supperKcal=0, snackKcal=0, lunchKcal = 0;

            if(dto.MealsQuantity == 3)
            {
                 breakfastKcal = dto.Kcal * 0.3;
                 dinnerKcal = dto.Kcal *0.4;
                 supperKcal = dto.Kcal *0.3;
            }
            else if(dto.MealsQuantity == 4)
            {

                breakfastKcal = dto.Kcal * 0.25;
                lunchKcal = dto.Kcal * 0.15;
                dinnerKcal = dto.Kcal* 0.35;
                supperKcal = dto.Kcal * 0.25;
            }
            else
            {
                 breakfastKcal = dto.Kcal * 0.25 ;
                 lunchKcal = dto.Kcal * 0.1;
                 snackKcal = dto.Kcal  * 0.1;
                 dinnerKcal = dto.Kcal * 0.3;
                 supperKcal = dto.Kcal  *0.25;
            }
            

            var breakfastSuggestionDto = AssignSuggestedDish("breakfast", breakfastDishesDto, userId, breakfastKcal);
            var dinnerSuggestionDto = AssignSuggestedDish("dinner", dinnerDishesDto, userId, dinnerKcal);
            var supperSuggestionDto = AssignSuggestedDish("supper", supperDishesDto, userId, supperKcal);
            var lunchSuggestionDto = AssignSuggestedDish("lunch", lunchDishesDto, userId, lunchKcal);
            var snackSuggestionDto = AssignSuggestedDish("snack", snackDishesDto, userId, snackKcal);

            if (breakfastSuggestionDto != null) menuSuggestion.Dishes.Add(breakfastSuggestionDto);
            if (lunchSuggestionDto != null) menuSuggestion.Dishes.Add(lunchSuggestionDto);
            if (dinnerSuggestionDto != null) menuSuggestion.Dishes.Add(dinnerSuggestionDto);
            if (supperSuggestionDto != null) menuSuggestion.Dishes.Add(supperSuggestionDto);
            if (snackSuggestionDto != null) menuSuggestion.Dishes.Add(snackSuggestionDto);

            return menuSuggestion;
        }
        private int[] GetRandomIndexes(int arrayLength)
        {
            Random random = new Random();
            int[] indexes = new int[5];
            HashSet<int> uniqueIndexes = new HashSet<int>();

            if (arrayLength < 5)
            {
                throw new InvalidOperationException("List too short.");
            }

            int i = 0;
            while (uniqueIndexes.Count < 5)
            {
                int currentIndex = random.Next(0, arrayLength);
                if (uniqueIndexes.Add(currentIndex))
                {
                    indexes[i] = currentIndex;
                    i++;
                }
            }
            return indexes;
        }
        private DishMenuDto AssignSuggestedDish(string type, List<DishDto> dishes, int userId, double totalDishKcal)
        {
            if(totalDishKcal == 0)
            {
                return null;
            }
            var randomIndexes = GetRandomIndexes(dishes.Count);
            DishDto suggestedDishDto = dishes[randomIndexes[0]];
            var suggestedDish = _mapper.Map<Dish>(suggestedDishDto);
            List<DishDto> alternativeDishes = new List<DishDto>();
            List<UserDishIngredient> customIngredients = new List<UserDishIngredient>();
            double factor = totalDishKcal / (suggestedDishDto.Kcal ?? 1.0);
            for (int i =1; i<randomIndexes.Length; i++)
            {
                alternativeDishes.Add(dishes[randomIndexes[i]]);
            }

            foreach(var ingredientDto in suggestedDishDto.Ingredients)
            {
                var ingredient = _mapper.Map<Ingredient>(ingredientDto);
                double quantity = Math.Round(Convert.ToDouble(ingredientDto.Quantity) * factor,1);
                UserDishIngredient dishIngredient = new UserDishIngredient
                {
                    IngredientId = ingredient.Id,
                    Quantity = quantity,
                    Name = ingredient.Name,
                    
                };

                customIngredients.Add(dishIngredient);
            }


            UserCustomDish customDish = new UserCustomDish
            {
                Name = $"Custom {suggestedDishDto.Name}",
                BaseDishId = suggestedDish.Id,
                Description = suggestedDishDto.Description,
                Kcal = 0,
                Fat = 0,
                Carbo = 0,
                Protein = 0,
                UserId = userId,
                CustomIngredients = customIngredients,
                Allergens = suggestedDishDto.Allergens,
            };
            foreach(var userDishIngredient in customDish.CustomIngredients)
            {
                var ingredient = _context.Ingredients.Where(i => i.Id == userDishIngredient.IngredientId).FirstOrDefault();
                if (ingredient != null)
                {
                    customDish.Protein += ingredient.Protein * userDishIngredient.Quantity / 100;
                    customDish.Carbo += ingredient.Carbo * userDishIngredient.Quantity / 100;
                    customDish.Fat += ingredient.Fat * userDishIngredient.Quantity / 100;
                    customDish.Kcal += ingredient.KCal * userDishIngredient.Quantity / 100;
                }
                    
            }

            _context.UserCustomDishes.Add(customDish);
            _context.SaveChanges();

            var customDishDto = _mapper.Map<UserCustomDishDto>(customDish);
            
            var dishMenu = new DishMenuDto()
            {
                Type = type,
                Dish = suggestedDishDto,
                DishId = suggestedDish.Id,
                AlternativeDishes = alternativeDishes,
                UserCustomDish = customDishDto,
            };

            return dishMenu;
        }
        public MenuDto Update(int id, MenuDto updatedMenu, int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId)
                ?? throw new Exception("User not found");

            var menu = _context.Menus
                .Include(m => m.DishesMenu)
                .Include(m => m.MenuAllergens)
                .FirstOrDefault(i => i.Id == id)
                ?? throw new Exception("Menu not found");


            menu.Protein = 0;
            menu.Carbo = 0;
            menu.Fat = 0;
            menu.Kcal = 0;
            menu.Description = updatedMenu.Description;


            _context.DishMenus.RemoveRange(menu.DishesMenu);
            _context.MenuAllergens.RemoveRange(menu.MenuAllergens);
            _context.SaveChanges();

            _context.Entry(menu).Reload();
            menu.DishesMenu = new List<DishMenu>();
            menu.MenuAllergens = new List<MenuAllergen>();


            var processedAllergens = new HashSet<int>(); 

            foreach (var dishDto in updatedMenu.Dishes)
            {
                var dish = dishDto.Dish;

                var basedish = _context.Dishes
                    .Include(d => d.DishIngredients)
                    .ThenInclude(di => di.Ingredient)
                    .Include(d => d.DishAllergens)
                    .ThenInclude(da => da.Allergen)
                    .FirstOrDefault(d => d.Id == dishDto.DishId);

                dish.Id = basedish.Id;

                if (dish != null)
                {
                
                    menu.Kcal += dish.Kcal;
                    menu.Protein += dish.Protein;
                    menu.Carbo += dish.Carbo;
                    menu.Fat += dish.Fat;

                 
                    var dishMenu = new DishMenu
                    {
                        MenuId = menu.Id,
                        DishId = dish.Id,
                        Type = dishDto.Type,
                        UserId = userId,
                        User = user
                    };
                    _context.DishMenus.Add(dishMenu);

            

                    var ingredientIds = dish.Ingredients.Select(di => di.Id).ToList();
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
            var menuDto = _mapper.Map<MenuDto>(menu);
            return menuDto;
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
                Kcal = 0,
                Carbo = 0,
                Protein = 0,
                Fat = 0,
            };

            _context.Menus.Add(menu);
            _context.SaveChanges();

            var processedAllergens = new HashSet<int>();

            foreach (var dishDto in dto.Dishes)
            {
                var dish = _context.Dishes
                    .Include(d => d.DishIngredients)
                    .ThenInclude(di => di.Ingredient)
                    .Include(d => d.DishAllergens)
                    .ThenInclude(da => da.Allergen)
                    .FirstOrDefault(d => d.Id == dishDto.DishId);

                if (dish == null) continue;

                var dishMenu = new DishMenu
                {
                    MenuId = menu.Id,
                    DishId = dish.Id,
                    Type = dishDto.Type,
                    UserId = userId,
                    User = user,
                    UserCustomDishId = dishDto.UserCustomDishId,
                };

                _context.DishMenus.Add(dishMenu);

                // Handle ingredients and nutrition values based on whether it's a custom dish or not
                if (dishDto.UserCustomDishId.HasValue)
                {
                    var userCustomDish = _context.UserCustomDishes
                        .Include(ucd => ucd.CustomIngredients)
                        .ThenInclude(ci => ci.Ingredient)
                        .ThenInclude(i => i.IngredientAllergens)
                        .FirstOrDefault(i => i.Id == dishDto.UserCustomDishId);

                    if (userCustomDish != null)
                    {
                        // Add nutrition values from custom dish
                        menu.Kcal += userCustomDish.Kcal ?? 0;
                        menu.Protein += userCustomDish.Protein ?? 0;
                        menu.Carbo += userCustomDish.Carbo ?? 0;
                        menu.Fat += userCustomDish.Fat ?? 0;

                        // Process allergens from custom ingredients
                        foreach (var customIngredient in userCustomDish.CustomIngredients)
                        {
                            foreach (var allergen in customIngredient.Ingredient.IngredientAllergens)
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
                else
                {
                    // Add nutrition values from default dish
                    menu.Kcal += dish.Kcal ?? 0;
                    menu.Protein += dish.Protein ?? 0;
                    menu.Carbo += dish.Carbo ?? 0;
                    menu.Fat += dish.Fat ?? 0;

                    // Process allergens from default ingredients
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
