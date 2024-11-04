using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _service;
        public MenuController(IMenuService service)
        {
            _service = service;
        }

        [HttpPut("{id}")]

        public ActionResult Update(int id, IngredientDto dto)
        {
            _service.Update(id, dto);
            return Ok();

        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPost]
        public ActionResult Create([FromBody] IngredientDto ingredientDto)
        {
            //DLA MENU
            //var userId = User.FindFirst(c=> c.Type == ClaimTypes.NameIdentifier).Value);

            _service.Create(ingredientDto); //, userId

            return Created($"/api/ingredients/{ingredientDto.Id}", null);
        }
        // GET: api/<ValuesController>
        [HttpGet]
        public ActionResult<IEnumerable<IngredientDto>> GetAll()
        {
            var ingredientsDtos = _service.GetAll();

            return Ok(ingredientsDtos);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<IngredientDto>> Get([FromRoute] int id)
        {
            var ingredient = _service.GetById(id);
            return Ok(ingredient);
        }
    }
}
