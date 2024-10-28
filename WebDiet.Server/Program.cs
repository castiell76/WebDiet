using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WebDiet.Server;
using WebDiet.Server.Entities;
using WebDiet.Server.Services;
using NLog.Web;
using WebDiet.Server.Middleware;
using static WebDiet.Server.Services.IAllergenService;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(LogLevel.Trace);
builder.Host.UseNLog();

// Add services to the container.

builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IAllergenService, AllergenService>();
builder.Services.AddScoped<ErrorHandlingMiddleware>();
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
