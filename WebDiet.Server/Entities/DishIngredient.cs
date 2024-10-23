namespace WebDiet.Server.Entities
{
    public class DishIngredient
    {
        public int DishId { get; set; }
        public Dish Dish { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public double Quantity { get; set; }
    }
}
