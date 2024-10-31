using FluentValidation;
using WebDiet.Server.Entities;

namespace WebDiet.Server.Models.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        private readonly ApplicationDbContext _context;
        public LoginDtoValidator(ApplicationDbContext dbcontext)
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);


            RuleFor(x => x.Email)
                .Custom((value, context) =>
                {
                    var emailInUse = dbcontext.Users.Any(e => e.Email == value);
                    if (emailInUse)
                    {
                        context.AddFailure("Email", "Email already exists.");
                    }
                });
        }
    }
}
