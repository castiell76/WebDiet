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
            .ForMember(dest => dest.Dishes,
                      opt => opt.MapFrom(src => src.DishesMenu))
            .ReverseMap();

            CreateMap<DishMenu, DishMenuDto>()
                .ForMember(dest => dest.DishId,
                          opt => opt.MapFrom(src => src.DishId))
                .ForMember(dest => dest.Dish,
                          opt => opt.MapFrom(src => src.Dish))
                .ForMember(dest => dest.UserCustomDishId,
                          opt => opt.MapFrom(src => src.UserCustomDishId))
                .ForMember(dest => dest.UserCustomDish,
                          opt => opt.MapFrom(src => src.UserCustomDish))
                .ReverseMap();

        }
    }
}
