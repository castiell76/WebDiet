using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IDishIngredientService
    {
        //void Replace(int oldIngredientId, int newIngredientId, DishIngredientDto updatedDish);
    }
    public class DishIngredientService : IDishIngredientService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<DishIngredientService> _logger;
        private IMapper _mapper;
        public DishIngredientService(ApplicationDbContext context, IMapper mapper, ILogger<DishIngredientService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        //public void Replace(int oldIngredientId, int newIngredientId, DishIngredientDto updatedDish)
        //{
        //    var dishIngredient = _context.DishIngredients.FirstOrDefault(x => x.DishId == id);
        //    if (dish == null) throw new NotFoundException("Dish not found");


        //    //TODO CALCULATE NUTRITION VALUES
        //    dish.Name = updatedDish.Name ?? dish.Name;

        //    //dish.Protein = updatedDish.Protein ?? dish.Protein;
        //    //dish.Carbo = updatedDish.Carbo ?? dish.Carbo;
        //    //dish.Fat = updatedDish.Fat ?? dish.Fat;
        //    //dish.KCal = updatedDish.KCal ?? dish.KCal;
        //    dish.Description = updatedDish.Description ?? dish.Description;

        //    _context.SaveChanges();

        //}
    }
}
