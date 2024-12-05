using Microsoft.AspNetCore.Mvc;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;
using WebDiet.Server.Services;

namespace WebDiet.Server.Controllers
{
    public class DishIngredientController : ControllerBase
    {
        private readonly IDishIngredientService _service;
        public DishIngredientController(IDishIngredientService service)
        {
            _service = service;
        }

        //[HttpPut("{id}")]

        //public ActionResult Replace(int oldIngredientId, int newIngredientId, DishIngredientDto dto)
        //{
        //    _service.Replace(oldIngredientId, newIngredientId, dto);
        //    return Ok();

        //}

    }
}
