namespace WebDiet.Server.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> Allergen { get; set; }
        public double KCal { get; set; }
        public double Protein { get;set; }
        public double Carbo { get; set; }
        public double Fat { get; set; }

        public ICollection<DishIngredient> DishIngredients { get; set; }


    }
}
