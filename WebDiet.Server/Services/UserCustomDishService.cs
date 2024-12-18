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
        UserCustomDishDto GetById(int dto);
        UserCustomDishDto GetByBaseDishAndUser(int baseDishId, int userId);
        void Update(int id, UserCustomDishDto dto, int userId);
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
        public void Update(int id, UserCustomDishDto updatedDish, int userId)
        {
            var userCustomDish = _context.UserCustomDishes
                .Include(ucd => ucd.CustomIngredients)
                .FirstOrDefault(ucd => ucd.Id == id && ucd.UserId == userId);

            if (userCustomDish == null)
            {
                throw new NotFoundException("User custom dish not found");
            }


            userCustomDish.Name = updatedDish.Name ?? userCustomDish.Name;
            userCustomDish.BaseDishId = updatedDish.BaseDishId ?? userCustomDish.BaseDishId;


            userCustomDish.Protein = 0;
            userCustomDish.Kcal = 0;
            userCustomDish.Fat = 0;
            userCustomDish.Carbo = 0;


            _context.UserDishIngredients.RemoveRange(userCustomDish.CustomIngredients);


            if (updatedDish.CustomIngredients != null && updatedDish.CustomIngredients.Any())
            {
                foreach (var ingredient in updatedDish.CustomIngredients)
                {
                    var ingredientEntity = _context.Set<Ingredient>().Find(ingredient.IngredientId);

                    if (ingredientEntity == null)
                    {
                        throw new NotFoundException($"Ingredient with ID {ingredient.IngredientId} not found");
                    }

                    var userDishIngredient = new UserDishIngredient
                    {
                        UserCustomDishId = userCustomDish.Id,
                        IngredientId = ingredient.IngredientId,
                        Ingredient = ingredientEntity,
                        Quantity = ingredient.Quantity
                    };


                    userCustomDish.Kcal += (ingredient.Quantity * ingredientEntity.KCal / 100);
                    userCustomDish.Protein += (ingredient.Quantity * ingredientEntity.Protein / 100);
                    userCustomDish.Carbo += (ingredient.Quantity * ingredientEntity.Carbo / 100);
                    userCustomDish.Fat += (ingredient.Quantity * ingredientEntity.Fat / 100);


                    _context.UserDishIngredients.Add(userDishIngredient);
                }
            }

            // Zapis zmian
            _context.SaveChanges();
        }
        public UserCustomDishDto GetById(int id)
        {
            var userCustomDish = _context.UserCustomDishes
                .Include(ci => ci.CustomIngredients)
                .ThenInclude(i => i.Ingredient)
                 .FirstOrDefault(d => d.Id == id);

            if (userCustomDish == null)
            {
                throw new NotFoundException("Dish not found");
            }

            var userCustomDishDto = _mapper.Map<UserCustomDishDto>(userCustomDish);
            return userCustomDishDto;
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
                UserId = userId,
                Protein = 0,
                Kcal = 0,
                Fat = 0,
                Carbo = 0
                
            };

            _context.UserCustomDishes.Add(userCustomDish);
            _context.SaveChanges();

            if (dto.CustomIngredients != null && dto.CustomIngredients.Any())
            {
                foreach (var ingredient in dto.CustomIngredients)
                {

                    var ingredientEntity = _context.Set<Ingredient>().Find(ingredient.IngredientId);


                    var userDishIngredient = new UserDishIngredient
                    {
                        UserCustomDishId = userCustomDish.Id,
                        IngredientId = ingredient.IngredientId,
                        Ingredient = ingredientEntity, 
                        Quantity = ingredient.Quantity
                    };

                    userCustomDish.Kcal += (ingredient.Quantity * ingredientEntity.KCal / 100);
                    userCustomDish.Protein += (ingredient.Quantity * ingredientEntity.Protein / 100);
                    userCustomDish.Carbo += (ingredient.Quantity * ingredientEntity.Carbo / 100);
                    userCustomDish.Fat += (ingredient.Quantity * ingredientEntity.Fat / 100);

                    _context.Set<UserDishIngredient>().Add(userDishIngredient);
                }

                _context.SaveChanges();
            }

            return userCustomDish.Id;
        }
    }
}
