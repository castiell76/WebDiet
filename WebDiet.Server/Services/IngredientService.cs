using Microsoft.EntityFrameworkCore;
using WebDiet.Server.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using WebDiet.Server.Models;
using WebDiet.Server.Exceptions;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NuGet.Packaging.Signing;
using System.Threading.Tasks;
namespace WebDiet.Server.Services
{
    public interface IIngredientService
    {
        IngredientDto GetById(int id);
        IEnumerable<IngredientDto> GetAll();
        int Create(IngredientDto ingredient);
        void Delete(int id);

        void Update(int id, IngredientDto ingredient);

        ICollection<Ingredient> AddFromXls(Stream? stream, string extension);
    }

    public class IngredientService : IIngredientService
    {
        private ApplicationDbContext _context;
        private readonly ILogger<IngredientService> _logger;
        private IMapper _mapper;
        public IngredientService(ApplicationDbContext context, IMapper mapper, ILogger<IngredientService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public ICollection<Ingredient> AddFromXls(Stream? stream, string extension)
        {
            ICollection<Ingredient> newIngredients = new List<Ingredient>();

            IWorkbook workbook;
            Ingredient currentIngredient;

            if (extension.Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                workbook = new XSSFWorkbook(stream); // XLSX
            }
            else if (extension.Equals(".xls", StringComparison.OrdinalIgnoreCase))
            {
                workbook = new HSSFWorkbook(stream); // XLS
            }
            else
            {
                throw new InvalidDataException("Nieobsługiwany format pliku.");
            }
            var existingAllergens = _context.Allergens.ToList();

            var sheet = workbook.GetSheetAt(0);


            var headerRow = sheet.GetRow(0);
            var headers = new Dictionary<string, int>();
            for (int cellIndex = 0; cellIndex < headerRow.LastCellNum; cellIndex++)
            {
                var header = headerRow.GetCell(cellIndex)?.ToString()?.ToLower();
                if (!string.IsNullOrWhiteSpace(header))
                {
                    headers[header] = cellIndex;
                }
            }

            for (int rowIndex = 1; rowIndex <= sheet.LastRowNum; rowIndex++) 
            {
                var row = sheet.GetRow(rowIndex);
                if (row == null) continue;


                currentIngredient = new Ingredient
                {
                    Name = GetCellValue(row, headers, "name"),
                    KCal = int.TryParse(GetCellValue(row, headers, "kcal"), out var kcal) ? kcal : 0,
                    Protein = double.TryParse(GetCellValue(row, headers, "protein"), out var protein) ? protein : 0,
                    Carbo = double.TryParse(GetCellValue(row, headers, "carbo"), out var carbo) ? carbo : 0,
                    Fat = double.TryParse(GetCellValue(row, headers, "fat"), out var fat) ? fat : 0,
                    Category = GetCellValue(row, headers, "category"),
                    IngredientAllergens = ProcessAllergens(GetCellValue(row, headers, "allergen"), existingAllergens)
                };

                if(!_context.Ingredients.Any(x=>x.Name == currentIngredient.Name))
                {
                    newIngredients.Add(currentIngredient);
                }
            }

            _context.Ingredients.AddRange(newIngredients);
            _context.SaveChanges();

            return newIngredients;
        }
        public void Update(int id, IngredientDto updatedIngredient)
        {
            var ingredient = _context.Ingredients.FirstOrDefault(x => x.Id == id);
            if (ingredient == null) throw new NotFoundException("Ingredient not found");

            ingredient.Name = updatedIngredient.Name ?? ingredient.Name;
            ingredient.Protein = updatedIngredient.Protein ?? ingredient.Protein;
            ingredient.Carbo = updatedIngredient.Carbo ?? ingredient.Carbo;
            ingredient.Fat = updatedIngredient.Fat ?? ingredient.Fat;
            ingredient.KCal = updatedIngredient.Kcal ?? ingredient.KCal;
            ingredient.Description = updatedIngredient.Description ?? ingredient.Description;

            _context.SaveChanges();

        }
        public IngredientDto GetById(int id)
        {
            var ingredient = _context.Ingredients
                .Include(i => i.IngredientAllergens)
                .ThenInclude(ia => ia.Allergen)
                .FirstOrDefault(i => i.Id == id);

            if (ingredient == null)
            {
                throw new NotFoundException("Ingredient not found");
            }

            var ingredientDto = _mapper.Map<IngredientDto>(ingredient);
            ingredientDto.Allergens = ingredient.IngredientAllergens
                .Select(ia => new AllergenDto
                {
                    Id = ia.Allergen.Id,
                    Name = ia.Allergen.Name
                })
                .ToList();

            return ingredientDto;
        }

        public IEnumerable<IngredientDto> GetAll()
        {
            var ingredients = _context.Ingredients.ToList();
            var ingredientsDtos = _mapper.Map<List<IngredientDto>>(ingredients);
            return ingredientsDtos;
        }

        public int Create(IngredientDto dto)
        {
            var ingredient = _mapper.Map<Ingredient>(dto);

            _context.Ingredients.Add(ingredient);

            if (dto.Allergens != null && dto.Allergens.Any())
            {
                foreach (var allergen in dto.Allergens)
                {
                    var item = new IngredientAllergen
                    {
                        AllergenId = allergen.Id
                    };
                    ingredient.IngredientAllergens.Add(item);
                }
            }

            _context.SaveChanges();
            return ingredient.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"Ingredient id:{id} DELETE action has been invoked");

           var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);

            if (ingredient is null) throw new NotFoundException("Ingredient not found");

            _context.Ingredients.Remove(ingredient);
            _context.SaveChanges();

        }

        private string GetCellValue(IRow row, Dictionary<string, int> headers, string columnName)
        {
            if (headers.TryGetValue(columnName.ToLower(), out var cellIndex))
            {
                var cell = row.GetCell(cellIndex);
                return cell?.ToString() ?? string.Empty;
            }

            return string.Empty;
        }
        private ICollection<IngredientAllergen> ProcessAllergens(string allergensColumn, List<Allergen> existingAllergens)
        {
            var ingredientAllergens = new List<IngredientAllergen>();

            if (!string.IsNullOrEmpty(allergensColumn))
            {
                var allergens = allergensColumn.Split(',', StringSplitOptions.RemoveEmptyEntries);

                foreach (var allergenName in allergens)
                {
                    var trimmedName = allergenName.Trim();
                    var allergen = existingAllergens.FirstOrDefault(a => a.Name.Equals(trimmedName, StringComparison.OrdinalIgnoreCase));

                    if (allergen == null)
                    {
                        allergen = new Allergen { Name = trimmedName };
                        existingAllergens.Add(allergen);
                    }

                    ingredientAllergens.Add(new IngredientAllergen { Allergen = allergen });
                }
            }

            return ingredientAllergens;
        }
    }
}
