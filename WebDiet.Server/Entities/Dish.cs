namespace WebDiet.Server.Entities
{
    public class Dish
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public double? Kcal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public ICollection<DishIngredient>? DishIngredients{ get; set; }
        public ICollection<DishAllergen>? DishAllergens { get; set; }

        public ICollection<DishMenu>? DishMenus { get; set; }
        public string[]? Types {  get; set; }
    }
}
