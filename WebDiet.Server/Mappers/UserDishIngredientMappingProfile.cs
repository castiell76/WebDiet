using AutoMapper;

namespace WebDiet.Server.Mappers
{
    public class UserDishIngredientMappingProfile : Profile
    {
        public UserDishIngredientMappingProfile()
        {
            CreateMap<UserDishIngredient, CustomIngredientDto>()
                .ForMember(dest => dest.IngredientId, opt => opt.MapFrom(src => src.Ingredient.Id));
        }
    }
}
