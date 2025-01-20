namespace WebDiet.Server.Entities
{
    public class DishMenu
    {
        public int Id { get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; }

        public int DishId { get; set; }
        public Dish Dish { get; set; }

        public int? UserCustomDishId { get; set; } 
        public UserCustomDish UserCustomDish { get; set; }

        public User User { get; set; }
        public int UserId { get; set; } 
        public string? Type { get; set; }
    }
}
