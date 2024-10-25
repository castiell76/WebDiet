using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IIngredientService
    {
        Ingredient GetById(int id);
        IEnumerable<IngredientDto> GetAll();
        int Create(IngredientDto ingredient);
        bool Delete(int id);

        bool Update(int id, IngredientDto ingredient);
    }

    public class IngredientsService : IIngredientService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        public IngredientsService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public bool Update(int id, IngredientDto updatedIngredient)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(x => x.Id == id);
            if (ingredient == null) return false;

            ingredient.Name = updatedIngredient.Name ?? ingredient.Name;
            ingredient.Protein = updatedIngredient.Protein ?? ingredient.Protein;
            ingredient.Carbo = updatedIngredient.Carbo ?? ingredient.Carbo;
            ingredient.Fat = updatedIngredient.Fat ?? ingredient.Fat;
            ingredient.KCal = updatedIngredient.KCal ?? ingredient.KCal;
            ingredient.Description = updatedIngredient.Description ?? ingredient.Description;

            _context.SaveChanges();

            return true; 

        }
        public Ingredient GetById(int id)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);
            var ingredientDto = _mapper.Map<IngredientDto>(ingredient);
            if (ingredient == null)
            {
                return null;
            }
            return ingredient;
        }

        public IEnumerable<IngredientDto> GetAll()
        {
            var ingredients = _context.Ingredients.ToList();
            var ingredientsDtos = _mapper.Map<List<IngredientDto>>(ingredients);
            return ingredientsDtos;
        }

        public int Create(IngredientDto dto)
        {
           var ingredient = _mapper.Map<Ingredient>(dto);
            _context.Ingredients.Add(ingredient);
            _context.SaveChanges();
            return ingredient.Id;
        }

        public bool Delete(int id)
        {
           var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);

            if (ingredient is null) return false;

            _context.Ingredients.Remove(ingredient);
            _context.SaveChanges();
            return true;

        }
    }
}
