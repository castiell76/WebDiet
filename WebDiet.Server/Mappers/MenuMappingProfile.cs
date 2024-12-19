using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class MenuMappingProfile : Profile
    {
        public MenuMappingProfile()
        {
            CreateMap<Menu, MenuDto>();
            CreateMap<DishMenu, DishMenuDto>();
            CreateMap<MenuAllergen, MenuAllergenDto>()
                .ForMember(dest => dest.Name,
                          opt => opt.MapFrom(src => src.Allergen.Name));
        }
    }
}
