using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class UserCustomDishMappingProfile : Profile
    {
        public UserCustomDishMappingProfile()
        {
            //CreateMap<UserCustomDish, UserCustomDishDto>()
            //.ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            //.ForMember(dest => dest.BaseDish, opt => opt.MapFrom(src => src.BaseDish))
            //.ForMember(dest => dest.CustomIngredients, opt => opt.MapFrom(src => src.CustomIngredients));

        }
    }
}
