using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Entities;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    [Route("api/ingredients/[controller]")]
    [ApiController]
    public class AllergenController : ControllerBase
    {
        private readonly IAllergenService _allergenService;
        public AllergenController(IAllergenService allergenService)
        {
            _allergenService = allergenService;
        }
        [HttpPost]
        public ActionResult Post(Allergen allergen)
        {
            var allergenId = _allergenService.Create(allergen);
            return Created($"api/ingredients/allergen/{allergenId}", null);
        }

    }
}
