
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

public class UserDishIngredient
{
    public int Id { get; set; }
    public int UserCustomDishId { get; set; }
    public UserCustomDish UserCustomDish { get; set; }
    public int IngredientId { get; set; }
    public virtual Ingredient Ingredient { get; set; }
    public double? Quantity { get; set; }
    public string? Name { get; set; }
}