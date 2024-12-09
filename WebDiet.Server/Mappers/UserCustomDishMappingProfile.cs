using AutoMapper;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class UserCustomDishMappingProfile : Profile
    {
        public UserCustomDishMappingProfile()
        {
            CreateMap<UserCustomDish, UserCustomDishDto>().ReverseMap();
        }
    }
}
