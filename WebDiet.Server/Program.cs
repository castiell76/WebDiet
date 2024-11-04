using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WebDiet.Server;
using WebDiet.Server.Entities;
using WebDiet.Server.Services;
using NLog.Web;
using WebDiet.Server.Middleware;
using static WebDiet.Server.Services.IAllergenService;
using Microsoft.AspNetCore.Identity;
using FluentValidation;
using WebDiet.Server.Models;
using WebDiet.Server.Models.Validators;
using FluentValidation.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using WebDiet.Server.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(LogLevel.Trace);
builder.Host.UseNLog();

// Add services to the container.
var authenticationSettings = new AuthenticationSettings();
builder.Configuration.GetSection("Authentication").Bind(authenticationSettings);
builder.Services.AddSingleton(authenticationSettings);
builder.Services.AddAuthentication(option =>
{
option.DefaultAuthenticateScheme = "Bearer";
option.DefaultScheme = "Bearer";
option.DefaultChallengeScheme = "Bearer"; 
}).AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.SaveToken = true;
    cfg.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidIssuer = authenticationSettings.JwtIssuer,
        ValidAudience = authenticationSettings.JwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey))
    };
});


builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthorizationHandler, ResourceOperationRequirementHandler>();
builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IAllergenService, AllergenService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ErrorHandlingMiddleware>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
builder.Services.AddScoped<RequestTimeMiddleware>();

//mappers
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

//adding dbcontext 

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddScoped<Seeder>();


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//config

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestTimeMiddleware>();

app.UseAuthentication();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//run before start app few database test logs

using( var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetService<Seeder>();
    seeder.Seed();
}

app.MapFallbackToFile("/index.html");

app.Run();
