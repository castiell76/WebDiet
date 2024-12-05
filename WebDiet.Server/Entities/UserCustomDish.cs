using WebDiet.Server.Entities;

public class UserCustomDish
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int BaseDishId { get; set; }  
    public Dish BaseDish { get; set; }
    public string? Name { get; set; }   
    public ICollection<UserDishIngredient> CustomIngredients { get; set; }
}