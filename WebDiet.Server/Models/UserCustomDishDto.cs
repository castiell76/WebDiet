using WebDiet.Server.Entities;

namespace WebDiet.Server.Models
{
    public class UserCustomDishDto
    {
        public string? Name { get; set; }
        public int BaseDishId { get; set; }
        public ICollection<CustomIngredientDto> CustomIngredients { get; set; }
    }
}
