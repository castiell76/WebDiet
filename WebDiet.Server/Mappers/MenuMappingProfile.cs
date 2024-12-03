using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class MenuMappingProfile : Profile
    {
        public MenuMappingProfile()
        {
            CreateMap<Menu, MenuDto>()
             .ForMember(d => d.Dishes, opt => opt.MapFrom(src =>
               src.DishesMenu.Select(di => new DishDto
               {
                   Id = di.Dish.Id,
                   Name = di.Dish.Name,
                   Description = di.Dish.Description,
                   Kcal = di.Dish.Kcal,
                   Protein = di.Dish.Protein,
                   Carbo = di.Dish.Carbo,
                   Fat = di.Dish.Fat,
               })))
              .ForMember(d => d.Allergens, opt => opt.MapFrom(src =>
                 src.MenuAllergens.Select(da => da.Allergen.Name)))
           .ReverseMap();
                }
    }
}
