using WebDiet.Server.Entities;

namespace WebDiet.Server.Models
{
    public class MenuDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public ICollection<MenuAllergenDto>? MenuAllergens { get; set; } = new List<MenuAllergenDto>();
        public double? Kcal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public DateTime Date { get; set; }
        public ICollection<DishMenuDto>? Dishes { get; set; } = new List<DishMenuDto>();
    }
}
