namespace WebDiet.Server.Models
{
    public class MenuSuggestionResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public ICollection<MealSuggestionDto> Meals { get; set; } = new List<MealSuggestionDto>();
        public double TotalKcal { get; set; }
        public double TotalProtein { get; set; }
        public double TotalCarbo { get; set; }
        public double TotalFat { get; set; }
    }
}
