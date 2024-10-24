﻿namespace WebDiet.Server.Entities
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> Allergens { get; set; }
        public double? KCal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public DateTime Date { get; set; }
        public ICollection<Dish> Dishes { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
