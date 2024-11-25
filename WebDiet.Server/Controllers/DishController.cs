using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Models;
using WebDiet.Server.Services;


namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class DishController : ControllerBase
    {
        private readonly IDishService _service;
        public DishController(IDishService service)
        {
            _service = service;
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin,Moderator")]

        public ActionResult Update(int id, DishDto dto)
        {
            _service.Update(id, dto);
            return Ok();

        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin,Moderator")]
        public ActionResult Delete([FromRoute] int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPost]
        //[Authorize(Roles = "Admin,Moderator")]
        public ActionResult Create([FromBody] DishDto dishDto)
        {

            _service.Create(dishDto); //, userId

            return Created($"/api/dishes/{dishDto.Id}", null);
        }
        // GET: api/<ValuesController>
        [HttpGet]
        public ActionResult<IEnumerable<DishDto>> GetAll()
        {
            var dishesDtos = _service.GetAll();

            return Ok(dishesDtos);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<DishDto>> Get([FromRoute] int id)
        {
            var dish = _service.GetById(id);
            return Ok(dish);
        }
    }
}
