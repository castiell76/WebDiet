using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class DishMappingProfile : Profile
    {
        public DishMappingProfile()
        {
            CreateMap<Dish, DishDto>()
                .ForMember(d => d.Ingredients, opt => opt.MapFrom(src =>
                  src.DishIngredients.Select(di => new IngredientDto
                  {
                      Id = di.Ingredient.Id,
                      Name = di.Ingredient.Name,
                      Description = di.Ingredient.Description,
                      Kcal = di.Ingredient.KCal,
                      Protein = di.Ingredient.Protein,
                      Carbo = di.Ingredient.Carbo,
                      Fat = di.Ingredient.Fat,
                      Quantity = di.Quantity 
                  })))
                 .ForMember(d => d.Allergens, opt => opt.MapFrom(src =>
                    src.DishAllergens.Select(da => da.Allergen.Name)))
              .ReverseMap();
        }
    }
}
