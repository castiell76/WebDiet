namespace WebDiet.Server.Models
{
    public class DishSuggestionDto
    {
        public string Type { get; set; }  
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public DishDto SuggestedDish { get; set; }
        public ICollection<DishDto>? AlternativeDishes { get; set; } = new List<DishDto>();
    }
}
