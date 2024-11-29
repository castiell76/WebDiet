using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using WebDiet.Server.Models;
using WebDiet.Server.Exceptions;

namespace WebDiet.Server.Services
{
    public interface IIngredientService
    {
        IngredientDto GetById(int id);
        IEnumerable<IngredientDto> GetAll();
        int Create(IngredientDto ingredient);
        void Delete(int id);

        void Update(int id, IngredientDto ingredient);
    }

    public class IngredientService : IIngredientService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<IngredientService> _logger;
        private IMapper _mapper;
        public IngredientService(ApplicationDbContext context, IMapper mapper, ILogger<IngredientService> logger)
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
            ingredient.KCal = updatedIngredient.Kcal ?? ingredient.KCal;
            ingredient.Description = updatedIngredient.Description ?? ingredient.Description;

            _context.SaveChanges();

        }
        public IngredientDto GetById(int id)
        {
            var ingredient = _context.Ingredients
                .Include(i => i.IngredientAllergens)
                .ThenInclude(ia => ia.Allergen)
                .FirstOrDefault(i => i.Id == id);

            if (ingredient == null)
            {
                throw new NotFoundException("Ingredient not found");
            }

            var ingredientDto = _mapper.Map<IngredientDto>(ingredient);
            ingredientDto.Allergens = ingredient.IngredientAllergens
                .Select(ia => new AllergenDto
                {
                    Id = ia.Allergen.Id,
                    Name = ia.Allergen.Name
                })
                .ToList();

            return ingredientDto;
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

            if (dto.Allergens != null && dto.Allergens.Any())
            {
                foreach (var allergen in dto.Allergens)
                {
                    var item = new IngredientAllergen
                    {
                        AllergenId = allergen.Id
                    };
                    ingredient.IngredientAllergens.Add(item);
                }
            }

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
