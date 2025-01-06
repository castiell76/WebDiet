using System.ComponentModel.DataAnnotations;
using WebDiet.Server.Entities;

namespace WebDiet.Server.Models
{
    public class IngredientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public ICollection<AllergenDto>? Allergens { get; set; } = new List<AllergenDto>();
        public double? Kcal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public double? Quantity { get; set; }
        public string? Category { get; set; }
    }
}
