using System.ComponentModel.DataAnnotations;

namespace WebDiet.Server.Entities
{
    public class Allergen
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<DishAllergen> DishAllergens { get; set; }
        public ICollection<IngredientAllergen> IngredientAllergens { get; set; }
        public ICollection<MenuAllergen> MenuAllergens { get; set; }
    }
}
