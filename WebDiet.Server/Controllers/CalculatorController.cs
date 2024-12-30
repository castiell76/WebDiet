using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculatorController : ControllerBase
    {
        private readonly ICalculatorService _service;
        public CalculatorController(ICalculatorService service)
        {
            _service = service;
        }

        [HttpPost("kcal")]
        public ActionResult CalculateKcal([FromBody] CalculateKcalDto dto)
        {
            var result = _service.CalculateKcal(dto); 

            return Ok(result);
        }
    }
}
