﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
            menu.Kcal = updatedMenu.Kcal ?? menu.Kcal;
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
            // Mapowanie MenuDto do encji Menu
            var menu = _mapper.Map<Menu>(dto);
            menu.UserId = userId;

            // Mapowanie Dishes do Menu (jeśli zawiera je DTO)
            foreach (var dishDto in dto.Dishes)
            {
                var dish = _context.Dishes
                    .Include(d => d.DishIngredients)  
                    .ThenInclude(di => di.Ingredient) 
                    .Include(d => d.DishAllergens)   
                    .ThenInclude(da => da.Allergen)  
                    .FirstOrDefault(d => d.Id == dishDto.Id);

                if (dish != null)
                {
                    // Mapowanie DishesMenu (powiązanie dania z menu)
                    var dishMenu = new DishMenu
                    {
                        Dish = dish,
                        Menu = menu,
                        Type = "some type"  // Możesz przypisać tutaj typ dania, jeśli jest potrzebny
                    };
                    menu.DishesMenu.Add(dishMenu);

                    // Możesz również zmapować składniki (DishIngredients) i alergeny (DishAllergens),
                    // ale to może być część powiązania w samym DTO, jeśli użytkownik przekazuje je w `DishDto`
                    foreach (var ingredientDto in dishDto.Ingredients)
                    {
                        var ingredient = _context.Ingredients
                            .FirstOrDefault(i => i.Id == ingredientDto.Id);

                        if (ingredient != null)
                        {
                            var dishIngredient = new DishIngredient
                            {
                                Dish = dish,
                                Ingredient = ingredient,
                                Quantity = ingredientDto.Quantity
                            };
                            _context.DishIngredients.Add(dishIngredient);  // Dodaj do kontekstu
                        }
                    }
                }
            }

            // Dodanie nowego menu do kontekstu
            _context.Menus.Add(menu);

            // Zapisanie zmian w bazie danych
            _context.SaveChanges();

            // Zwrócenie ID nowo utworzonego menu
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
