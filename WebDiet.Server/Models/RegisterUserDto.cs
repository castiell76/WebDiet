using System.ComponentModel.DataAnnotations;

namespace WebDiet.Server.Models
{
    public class RegisterUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmedPassword { get; set; }
        public DateTime CreationDate { get; set; }
        public int RoleId { get; set; } = 1;
    }
}