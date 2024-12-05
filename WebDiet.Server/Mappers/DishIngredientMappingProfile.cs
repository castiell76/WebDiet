using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class DishIngredientMappingProfile : Profile
    {
        public DishIngredientMappingProfile()
        {
            CreateMap<DishIngredient, DishIngredientDto>().ReverseMap();
        }
    }
}
