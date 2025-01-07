using WebDiet.Server.Models;

public class DishMenuDto
{
    public int DishId { get; set; }
    public DishDto Dish { get; set; }
    public int? UserCustomDishId { get; set; }
    public UserCustomDishDto? UserCustomDish { get; set; }
    public string? Type { get; set; }
    public ICollection<DishDto>? AlternativeDishes { get; set; } = new List<DishDto>();
}