using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Exceptions;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IMenuService
    {
        MenuDto GetById(int id);
        IEnumerable<MenuDto> GetAll();
        int Create(MenuDto menu, int userId);
        void Delete(int id);

        void Update(int id, MenuDto menu);
    }
    public class MenuService : IMenuService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<MenuService> _logger;
        private IMapper _mapper;
        public MenuService(ApplicationDbContext context, IMapper mapper, ILogger<MenuService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        public void Update(int id, MenuDto updatedMenu)
        {
            var menu = _context.Menus.FirstOrDefault(x => x.Id == id);
            if (menu == null) throw new NotFoundException("Menu not found");

            menu.Description = updatedMenu.Description ?? menu.Description;
            menu.KCal = updatedMenu.KCal ?? menu.KCal;
            menu.Protein = updatedMenu.Protein ?? menu.Protein;
            menu.Carbo = updatedMenu.Carbo ?? menu.Carbo;
            menu.Fat = updatedMenu.Fat ?? menu.Fat;
            menu.Date = updatedMenu.Date;

            _context.SaveChanges();

        }
        public MenuDto GetById(int id)
        {
            var menu = _context.Menus.FirstOrDefault(i => i.Id == id);
            var menuDto = _mapper.Map<MenuDto>(menu);
            if (menu == null)
            {
                throw new NotFoundException("Menu not found");
            }

            return menuDto;
        }

        public IEnumerable<MenuDto> GetAll()
        {
            var menus = _context.Menus.ToList();
            var menusDtos = _mapper.Map<List<MenuDto>>(menus);
            return menusDtos;
        }

        public int Create(MenuDto dto, int userId)
        {
            var menu = _mapper.Map<Menu>(dto);
            menu.UserId = userId;
            _context.Menus.Add(menu);
            _context.SaveChanges();

            return menu.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Menu id:{id} DELETE action has been invoked");

            var menu = _context.Menus.FirstOrDefault(i => i.Id == id);

            if (menu is null) throw new NotFoundException("Menu not found");

            _context.Menus.Remove(menu);
            _context.SaveChanges();

        }
    }
}
