using AutoMapper;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface ICalculatorService
    {
        double CalculateKcal(CalculateKcalDto dto);
    }
    public class CalculatorService : ICalculatorService
    {
        private ApplicationDbContext _context;
        public CalculatorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public double CalculateKcal(CalculateKcalDto dto)
        {
            
            return 0;
        }
    }


}
