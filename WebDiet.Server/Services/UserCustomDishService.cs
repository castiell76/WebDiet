using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IUserCustomDishService
    {
        int Create(UserCustomDishDto dto, int userId);
        DishDto GetById(int dto);
        UserCustomDishDto GetByBaseDishAndUser(int baseDishId, int userId);
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

        public DishDto GetById(int id)
        {
            var userCustomDish = _context.UserCustomDishes
                .Include(ci => ci.CustomIngredients)
                .ThenInclude(i => i.Ingredient)
                 .FirstOrDefault(d => d.Id == id);
            var ingredients = _context.Ingredients.ToList();
            if (userCustomDish == null)
            {
                throw new NotFoundException("Dish not found");
            }

            var userCustomDishDto = _mapper.Map<UserCustomDishDto>(userCustomDish);


            var dishDto = new DishDto
            {
                Id = id,
                Name = userCustomDish.Name,
                Description = userCustomDish.Description,
                Ingredients = userCustomDish.CustomIngredients.Select(ci => new IngredientDto
                {
                    Id = ci.IngredientId,
                    Quantity = ci.Quantity,
                    Name = ingredients.FirstOrDefault(i=> i.Id == ci.IngredientId).Name,
                }).ToList(),
            };

            return dishDto;
        }

        public UserCustomDishDto GetByBaseDishAndUser(int baseDishId, int userId)
        {
            var userCustomDish = _context.UserCustomDishes
                .Include(ucd => ucd.CustomIngredients)
                .ThenInclude(ci => ci.Ingredient)
                .FirstOrDefault(ucd => ucd.BaseDishId == baseDishId && ucd.UserId == userId);

            if (userCustomDish == null)
            {
                return null;
            }

            return _mapper.Map<UserCustomDishDto>(userCustomDish);
        }
        public int Create(UserCustomDishDto dto, int userId)
        {
            var userCustomDish = new UserCustomDish
            {
                Name = dto.Name,
                BaseDishId = dto.BaseDishId,
                UserId = userId
            };

            _context.UserCustomDishes.Add(userCustomDish);
            _context.SaveChanges();

            if (dto.CustomIngredients != null && dto.CustomIngredients.Any())
            {
                foreach (var ingredient in dto.CustomIngredients)
                {
                    // Attach or load the ingredient
                    var ingredientEntity = _context.Set<Ingredient>().Find(ingredient.IngredientId);
                    // or
                    // _context.Entry(new Ingredient { Id = ingredient.IngredientId }).State = EntityState.Unchanged;

                    var userDishIngredient = new UserDishIngredient
                    {
                        UserCustomDishId = userCustomDish.Id,
                        IngredientId = ingredient.IngredientId,
                        Ingredient = ingredientEntity, // Add this line
                        Quantity = ingredient.Quantity,


                    };

                    _context.Set<UserDishIngredient>().Add(userDishIngredient);
                }

                _context.SaveChanges();
            }

            return userCustomDish.Id;
        }
    }
}
