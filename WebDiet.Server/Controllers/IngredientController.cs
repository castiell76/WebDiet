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
    public class IngredientController : ControllerBase
    {
        private readonly IIngredientService _service;
        public IngredientController(IIngredientService service)
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
        public ActionResult Delete([FromRoute]int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPost]
        public ActionResult Create([FromBody] IngredientDto ingredientDto)
        {
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
            return Ok(ingredient);
        }
      
    }
}
