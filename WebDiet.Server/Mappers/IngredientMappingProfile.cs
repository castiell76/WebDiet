using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Mappers
{
    public class IngredientMappingProfile : Profile
    {
        public IngredientMappingProfile()
        {
            CreateMap<Ingredient, IngredientDto>();
                //.ForMember(i => i.Name, c => c.MapFrom(s => s.Name))
                //.ForMember(i => i.Protein, c => c.MapFrom(s => s.Protein))
                //.ForMember(i => i.Carbo, c => c.MapFrom(s => s.Carbo))
                //.ForMember(i => i.Fat, c => c.MapFrom(s => s.Fat))
                //.ForMember(i => i.KCal, c => c.MapFrom(s => s.KCal))
                //.ForMember(i => i.Allergens, c => c.MapFrom(s => s.Allergens))
                //.ForMember(i => i.Description, c => c.MapFrom(s => s.Description));
        }
    }
}
