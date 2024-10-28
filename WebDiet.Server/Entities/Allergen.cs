using System.ComponentModel.DataAnnotations;

namespace WebDiet.Server.Entities
{
    public class Allergen
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
