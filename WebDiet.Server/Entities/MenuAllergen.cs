namespace WebDiet.Server.Entities
{
    public class MenuAllergen
    {
        public int MenuId { get; set; }
        public Menu Menu { get; set; }

        public int AllergenId { get; set; }
        public Allergen Allergen { get; set; }
    }
}
