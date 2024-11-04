using WebDiet.Server.Entities;

namespace WebDiet.Server.Models
{
    public class MenuDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public ICollection<MenuAllergen> MenuAllergens { get; set; }
        public double? KCal { get; set; }
        public double? Protein { get; set; }
        public double? Carbo { get; set; }
        public double? Fat { get; set; }
        public DateTime Date { get; set; }
    }
}
