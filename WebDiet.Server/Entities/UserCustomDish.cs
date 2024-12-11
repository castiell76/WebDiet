using WebDiet.Server.Entities;

public class UserCustomDish
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int BaseDishId { get; set; }  
    public Dish BaseDish { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public List<string>? Allergens { get; set; }
    public double? Kcal { get; set; }
    public double? Protein { get; set; }
    public double? Carbo { get; set; }
    public double? Fat { get; set; }
    public ICollection<UserDishIngredient> CustomIngredients { get; set; }
}