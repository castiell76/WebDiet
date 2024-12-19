using AutoMapper;
using WebDiet.Server.Entities;

namespace WebDiet.Server.Mappers
{
    public class MenuAllergenMappingProfile : Profile
    {
        public MenuAllergenMappingProfile()
        {
            CreateMap<MenuAllergen, MenuAllergenDto>()
            .ForMember(dest => dest.Name,
                      opt => opt.MapFrom(src => src.Allergen.Name))
            .ReverseMap();

        }
    }
}
