using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Entities;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public IngredientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public ActionResult CreateIngredient([FromBody]Ingredient ingredient)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.Ingredients.Add(ingredient);
            _context.SaveChanges();

            return Created($"/api/ingredients/{ingredient.Id}", null);
        }
        // GET: api/<ValuesController>
        [HttpGet]
        public ActionResult<IEnumerable<Ingredient>> GetAll()
        {
            var ingredients = _context.Ingredients.ToList();
            return Ok(ingredients);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Ingredient>> Get([FromRoute] int id)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(i=>i.Id == id);
            if(ingredient == null)
            {
                return NotFound();
            }
            return Ok(ingredient);
        }

      
    }
}
