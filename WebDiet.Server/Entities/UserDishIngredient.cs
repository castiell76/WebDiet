
using WebDiet.Server.Entities;

public class UserDishIngredient
{
    public int UserCustomDishId { get; set; }
    public UserCustomDish UserCustomDish { get; set; }
    public int IngredientId { get; set; }
    public Ingredient Ingredient { get; set; }
    public double? Quantity { get; set; }
}