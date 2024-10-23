namespace WebDiet.Server.Entities
{
    public class Dish : Ingredient
    {
        public ICollection<DishIngredient> DishIngredients{ get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
    }
}
