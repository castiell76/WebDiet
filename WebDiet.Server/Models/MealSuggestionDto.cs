namespace WebDiet.Server.Models
{
    public class MealSuggestionDto
    {
        public string MealType { get; set; }  
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public DishDto SuggestedDish { get; set; }
        public ICollection<DishDto> AlternativeDishes { get; set; } = new List<DishDto>();
    }
}
