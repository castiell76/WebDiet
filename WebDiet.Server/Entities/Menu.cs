namespace WebDiet.Server.Entities
{
    public class Menu : Ingredient
    {
        public DateTime Date { get; set; }
        public ICollection<Dish> Dishes { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
