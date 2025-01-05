namespace WebDiet.Server.Models
{
    public class MenuSuggestionResponseDto
    {
        public ICollection<DishSuggestionDto> Meals { get; set; } = new List<DishSuggestionDto>();
        public double TotalKcal { get; set; }
        public double TotalProtein { get; set; }
        public double TotalCarbo { get; set; }
        public double TotalFat { get; set; }
    }
}
