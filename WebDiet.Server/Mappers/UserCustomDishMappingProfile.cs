using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class UserCustomDishMappingProfile : Profile
    {
        public UserCustomDishMappingProfile()
        {
            CreateMap<UserCustomDish, UserCustomDishDto>()
            .ForMember(dest => dest.BaseDishId, opt => opt.MapFrom(src => src.BaseDishId))
            .ForMember(dest => dest.CustomIngredients, opt => opt.MapFrom(src => src.CustomIngredients));

        }
    }
}
