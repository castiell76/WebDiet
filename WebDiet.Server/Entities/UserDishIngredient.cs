
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

public class UserDishIngredient
{
    public int UserCustomDishId { get; set; }
    public UserCustomDish UserCustomDish { get; set; }
    public int IngredientId { get; set; }
    public IngredientDto Ingredient { get; set; }
    public double? Quantity { get; set; }
}