﻿namespace WebDiet.Server.Entities
{
    public class IngredientAllergen
    {
        public int Id { get; set; }
        public int IngredientId { get; set; }
        public Ingredient? Ingredient { get; set; }

        public int AllergenId { get; set; }
        public Allergen? Allergen { get; set; }
    }
}
