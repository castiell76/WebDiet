namespace WebDiet.Server.Models
{
    public class DishSuggestionUserCondition
    {
        public int MealsQuantity { get; set; }
        public int[] ExcludedAllergensIds { get; set; }
        public int[] ExcludedIngredientsIds { get; set; }
        public double Kcal { get; set; }

    }
}
