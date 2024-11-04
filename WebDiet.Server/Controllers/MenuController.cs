using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

        public ActionResult Update(int id, MenuDto dto)
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
        public ActionResult Create([FromBody] MenuDto menuDto)
        {
            var userId = Int32.Parse(User.FindFirst(c=> c.Type == ClaimTypes.NameIdentifier).Value);

            _service.Create(menuDto, userId); //, userId

            return Created($"/api/menus/{menuDto.Id}", null);
        }
        // GET: api/<ValuesController>
        [HttpGet]
        public ActionResult<IEnumerable<MenuDto>> GetAll()
        {
            var menusDtos = _service.GetAll();

            return Ok(menusDtos);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<MenuDto>> Get([FromRoute] int id)
        {
            var menu = _service.GetById(id);
            return Ok(menu);
        }

        //public ActionResult Test()
        //{
        //    var userId = Int32.Parse(User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value);

        //    _service.Create(menuDto, userId); //, userId

        //    return Created($"/api/menus/{menuDto.Id}", null);
        //}
    }
}
