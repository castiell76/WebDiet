using Microsoft.AspNetCore.Identity;
using WebDiet.Server.Entities;
using WebDiet.Server.Models;

namespace WebDiet.Server.Services
{
    public interface IAccountService
    {
        void RegisterUser(RegisterUserDto dto);
    }
    public class AccountService : IAccountService
    {

        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _hasher;
        public AccountService(ApplicationDbContext context, IPasswordHasher<User> hasher)
        {
            _context = context;
            _hasher = hasher;
        }
        public void RegisterUser(RegisterUserDto dto)
        {
            var newUser = new User()
            {
                Email = dto.Email,
                Username = dto.Email,
                CreationDate = DateTime.Now,
                RoleId = dto.RoleId,

            };
            var hashPassword =  _hasher.HashPassword(newUser, dto.Password);
            newUser.PasswordHash = hashPassword;
            _context.Users.Add(newUser);
            _context.SaveChanges();
        }
    }
}
