using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IDishService
    {
        DishDto GetById(int id);
        IEnumerable<DishDto> GetAll();
        int Create(DishDto dish);
        void Delete(int id);

        void Update(int id, DishDto dish);
    }

    public class DishService : IDishService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<DishService> _logger;
        private IMapper _mapper;
        public DishService(ApplicationDbContext context, IMapper mapper, ILogger<DishService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        public void Update(int id, DishDto updatedDish)
        {
            var dish = _context.Dishes.FirstOrDefault(x => x.Id == id);
            if (dish == null) throw new NotFoundException("Dish not found");

            dish.Name = updatedDish.Name ?? dish.Name;
            dish.Protein = updatedDish.Protein ?? dish.Protein;
            dish.Carbo = updatedDish.Carbo ?? dish.Carbo;
            dish.Fat = updatedDish.Fat ?? dish.Fat;
            dish.KCal = updatedDish.KCal ?? dish.KCal;
            dish.Description = updatedDish.Description ?? dish.Description;

            _context.SaveChanges();

        }
        public DishDto GetById(int id)
        {
            var dish = _context.Dishes.FirstOrDefault(i => i.Id == id);
            var dishDto = _mapper.Map<DishDto>(dish);
            if (dish == null)
            {
                throw new NotFoundException("Dish not found");
            }

            return dishDto;
        }

        public IEnumerable<DishDto> GetAll()
        {
            var dishes = _context.Dishes.ToList();
            var dishesDtos = _mapper.Map<List<DishDto>>(dishes);
            return dishesDtos;
        }

        public int Create(DishDto dto)
        {
            var dish = _mapper.Map<Dish>(dto);
            _context.Dishes.Add(dish);

            _context.SaveChanges();
            return dish.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Dish id:{id} DELETE action has been invoked");

            var dish = _context.Dishes.FirstOrDefault(i => i.Id == id);

            if (dish is null) throw new NotFoundException("Dish not found");

            _context.Dishes.Remove(dish);
            _context.SaveChanges();

        }
    }
}
