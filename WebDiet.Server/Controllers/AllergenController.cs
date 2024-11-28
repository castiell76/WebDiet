using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    [Route("api/ingredients/[controller]")]
    [ApiController]
    //[Authorize]
    public class AllergenController : ControllerBase
    {
        private readonly IAllergenService _allergenService;
        public AllergenController(IAllergenService allergenService)
        {
            _allergenService = allergenService;
        }
        [HttpPost]
        //[Authorize(Roles = "Admin,Moderator")]
        public ActionResult Post(Allergen allergen)
        {
            var allergenId = _allergenService.Create(allergen);
            return Created($"api/ingredients/allergen/{allergenId}", null);
        }
        [HttpGet]
        public ActionResult<IEnumerable<Allergen>> GetAll()
        {
            var allergens = _allergenService.GetAll();

            return Ok(allergens);
        }

    }
}
