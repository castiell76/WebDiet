using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IUserCustomDishService
    {
        int Create(UserCustomDishDto dto, int userId);
    }
    public class UserCustomDishService : IUserCustomDishService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        public UserCustomDishService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public int Create(UserCustomDishDto dto, int userId)
        {
            // Mapowanie MenuDto do encji Menu
            var menu = _mapper.Map<Menu>(dto);
            menu.UserId = userId;


            //foreach (var dishDto in dto.Dishes)
            //{
            //    var dish = _context.Dishes
            //        .Include(d => d.DishIngredients)
            //        .ThenInclude(di => di.Ingredient)
            //        .Include(d => d.DishAllergens)
            //        .ThenInclude(da => da.Allergen)
            //        .FirstOrDefault(d => d.Id == dishDto.DishId);


            //    var ingredientIds = dish.DishIngredients.Select(di => di.IngredientId).ToList();
            //    var ingredients = _context.Ingredients
            //  .Include(i => i.IngredientAllergens)
            //      .ThenInclude(ia => ia.Allergen)
            //  .Where(i => ingredientIds.Contains(i.Id))
            //  .ToList();

            //    if (dish != null)
            //    {

            //        var dishMenu = new DishMenu
            //        {
            //            Dish = dish,
            //            Menu = menu,
            //            Type = "some type",
            //            User = _context.Users.FirstOrDefault(u => u.UserId == userId)
            //        };
            //        menu.DishesMenu.Add(dishMenu);

            //        var uniqueAllergenIds = new HashSet<int>();
            //        //????
            //        foreach (var dishIngredient in dish.DishIngredients)
            //        {
            //            var ingredient = ingredients.First(i => i.Id == dishIngredient.IngredientId);

            //            foreach (var ingredientAllergen in ingredient.IngredientAllergens)
            //            {
            //                if (uniqueAllergenIds.Add(ingredientAllergen.AllergenId))
            //                {
            //                    menu.MenuAllergens.Add(new MenuAllergen
            //                    {
            //                        AllergenId = ingredientAllergen.AllergenId,
            //                        MenuId = menu.Id,
            //                    });
            //                }
            //            }


            //            if (!_context.DishIngredients.Any(di => di.DishId == dishIngredient.DishId && di.IngredientId == dishIngredient.IngredientId))
            //            {
            //                _context.DishIngredients.Add(dishIngredient);
            //            }
            //        }
            //    }
            //}

            //_context.Menus.Add(menu);
            //_context.SaveChanges();

            return menu.Id;
        }
    }
}
