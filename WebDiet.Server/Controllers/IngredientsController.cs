using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientsController : ControllerBase
    {
        private readonly IIngredientService _service;
        public IngredientsController(IIngredientService service)
        {
            _service = service;
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, IngredientDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                var isUpdated = _service.Update(id, dto);
                if (!isUpdated)
                {
                    return NotFound();
                }
                return Ok();
            }
           
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute]int id)
        {
            var isDeleted = _service.Delete(id);
            if (isDeleted)
            {
                return NoContent();
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult Create([FromBody] IngredientDto ingredientDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _service.Create(ingredientDto);

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

            if(ingredient == null)
            {
                return NotFound();
            }
            return Ok(ingredient);
        }

      
    }
}
