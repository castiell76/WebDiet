namespace WebDiet.Server.Models
{
    public class CalculateKcalDto
    {
        public string Gender { get; set; }
        public int Age { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string Activity{ get; set; }
        public string JobActivity { get; set; }
        public string Goal {  get; set; }
        public double? GoalPace { get; set; }

    }
}
