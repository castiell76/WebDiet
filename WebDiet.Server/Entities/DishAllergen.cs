﻿namespace WebDiet.Server.Entities
{
    public class DishAllergen
    {
        public int Id {  get; set; }
        public int DishId { get; set; }
        public Dish Dish { get; set; }

        public int AllergenId { get; set; }
        public Allergen Allergen { get; set; }
    }
}
