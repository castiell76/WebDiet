using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class IngredientController : ControllerBase
    {
        private readonly IIngredientService _service;
        public IngredientController(IIngredientService service)
        {
            _service = service;
        }


        [HttpPost("add-from-xls")]
        public async Task<IActionResult> AddFromXls()
        {
            
            string filePath = "C:\\Users\\ebabs\\Downloads\\Nowy Arkusz kalkulacyjny OpenDocument.xlsx";
            string extension = Path.GetExtension(filePath);
            using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            _service.AddFromXls(fileStream, extension);

            return Ok("Ingredients has been added.");
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin,Moderator")]

        public ActionResult Update(int id, IngredientDto dto)
        {
            _service.Update(id, dto);
            return Ok();

        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin,Moderator")]
        public ActionResult Delete([FromRoute]int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPost]
        //[Authorize(Roles = "Admin,Moderator")]
        public ActionResult Create([FromBody] IngredientDto ingredientDto)
        {

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
        public ActionResult<IngredientDto> Get([FromRoute] int id)
        {
            var ingredient = _service.GetById(id);
            if (ingredient == null)
            {
                return NotFound();
            }
            return Ok(ingredient);
        }

    }
}
