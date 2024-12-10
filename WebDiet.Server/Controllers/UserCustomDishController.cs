using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCustomDishController : ControllerBase
    {
        private readonly IUserCustomDishService _service;
        public UserCustomDishController(IUserCustomDishService service)
        {
            _service = service;
        }
        [HttpPost]
        public ActionResult Create([FromBody] UserCustomDishDto dto)
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

            _service.Create(dto, userId); //, userId

            return Created($"/api/dishes/{dto.BaseDishId}", null);
        }
    }
}
