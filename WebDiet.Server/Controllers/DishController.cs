using Microsoft.AspNetCore.Mvc;


namespace WebDiet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : ControllerBase
    {
        // GET: api/<DishController>
        [HttpGet]
        public IEnumerable<string> GetAll()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DishController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DishController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<DishController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DishController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
