using WebDiet.Server.Entities;

namespace WebDiet.Server.Models
{
    public class DishIngredientDto
    {
        public int DishId { get; set; }
        public int IngredientId { get; set; }

        public double? Quantity { get; set; }
    }
}
