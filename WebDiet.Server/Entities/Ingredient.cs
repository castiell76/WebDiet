using Microsoft.AspNetCore.Components;
using System.ComponentModel.DataAnnotations;

namespace WebDiet.Server.Entities
{
    [Route("api/ingredients")]
    public class Ingredient
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }
        public string? Description { get; set; }
        public ICollection<IngredientAllergen>? IngredientAllergens { get; set; } = new List<IngredientAllergen>();
        [Required]
        public double? KCal { get; set; }
        [Required]
        public double? Protein { get;set; }
        [Required]
        public double? Carbo { get; set; }
        [Required]
        public double? Fat { get; set; }
        public string? Category { get; set; }

        public ICollection<DishIngredient>? DishIngredients { get; set; }


    }
}
