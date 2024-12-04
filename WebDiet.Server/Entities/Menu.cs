namespace WebDiet.Server.Entities
{
    public class Menu
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public ICollection<MenuAllergen>? MenuAllergens { get; set; }
        public double? Kcal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public DateTime Date { get; set; }
        public ICollection<DishMenu>? DishesMenu { get; set; } = new List<DishMenu>();
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
