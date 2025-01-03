namespace WebDiet.Server.Models
{
    public class AutoMenuGeneratorDto
    {
        public int MealsQuantity { get; set; }
        public int[] excludedAllergensIds { get; set; }
        public int excludedIngredientsIds { get; set; }
        public double kcal { get; set; }

    }
}
