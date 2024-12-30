using AutoMapper;
using Humanizer;
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
            double ppm = SetPpm(dto);
            double pal = SetPal(dto);
            double additionalKcal = SetKcalFromTraining(dto);
            double kcal = (ppm * pal) + (additionalKcal/7);
            if (dto.Goal.Contains("Loose"))
            {
                kcal = kcal - (1000 * Convert.ToDouble(dto.GoalPace));
            }
            else if (dto.Goal.Contains("Put"))
            {
                kcal = kcal + (1000 * Convert.ToDouble(dto.GoalPace));
            }
            return kcal;
        }

        private double SetPpm(CalculateKcalDto dto)
        {
            double ppm;
            if (dto.Gender == "Male")
            {
                ppm = 66.473 + (13.7561 * dto.Weight) + (5.0033 * dto.Height) - (6.755 * dto.Age);
            }
            else if (dto.Gender == "Female")
            {
                ppm = 655.0955 + (9.5634 * dto.Weight) + (1.8496 * dto.Height) - (4.6756 * dto.Age);
            }
            else
            {
                ppm = (66.473 + (13.7561 * dto.Weight) + (5.0033 * dto.Height) - (6.755 * dto.Age))
                + (655.0955 + (9.5634 * dto.Weight) + (1.8496 * dto.Height) - (4.6756 * dto.Age)) / 2;
            }
            return ppm;
        }
        private double SetPal(CalculateKcalDto dto)
        {
            double pal;
            if (dto.Activity.Contains("140"))
            {
                pal = 1.4;
            }
            else if (dto.Activity.Contains("280"))
            {
                pal = 1.6;
            }
            else if (dto.Activity.Contains("420"))
            {
                pal = 1.8;
            }
            else if (dto.Activity.Contains("560"))
            {
                pal = 2;
            }
            else
            {
                pal = 1.2;
            }

            return pal;
        }
        private double SetKcalFromTraining(CalculateKcalDto dto)
        {
            double exerciseRatio;
            double additionalKcal;
            if(dto.Weight < 40)
            {
                exerciseRatio = 1;
            }
            else if(dto.Weight > 40 &&  dto.Weight < 60)
            {
                exerciseRatio = 1.075;
            }
            else if (dto.Weight > 60 && dto.Weight < 80)
            {
                exerciseRatio = 1.15;
            }
            else if (dto.Weight > 80 && dto.Weight < 100)
            {
                exerciseRatio = 1.2;
            }
            else if (dto.Weight > 100 && dto.Weight < 120)
            {
                exerciseRatio = 1.35;
            }
            else
            {
                exerciseRatio = 1.45;
            }

            if (dto.Activity.Contains("140"))
            {
                additionalKcal = 300 * 140 * exerciseRatio / 60;
            }
            else if (dto.Activity.Contains("280"))
            {
                additionalKcal = 300 * 280 * exerciseRatio / 60;
            }
            else if (dto.Activity.Contains("420"))
            {
                additionalKcal = 300 * 420 * exerciseRatio / 60;
            }
            else if (dto.Activity.Contains("560"))
            {
                additionalKcal = 300 * 560 * exerciseRatio / 60;
            }
            else
            {
                additionalKcal = 0;
            }

            return additionalKcal;
        }
    }


}
