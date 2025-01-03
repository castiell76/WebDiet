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
    //[Authorize]
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var newMenuDto = _service.Update(id, dto, userId);
            return Ok(newMenuDto);

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            _service.Create(menuDto, userId); //, userId

            return Created($"/api/menus/{menuDto.Id}", null);
        }

        [HttpPost("menusuggestion")]
        public ActionResult MenuSuggestion([FromBody] MealSuggestionUserCondition dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var menuDto = _service.MenuSuggestion(dto, userId); 

            return Ok(menuDto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<MenuDto>> GetAll()
        {
            var menusDtos = _service.GetAll();

            return Ok(menusDtos);
        }

        
        [HttpGet("{id}")]
        public ActionResult<MenuDto> Get([FromRoute] int id)
        {
            var menu = _service.GetById(id);
            return Ok(menu);
        }

    }
}
