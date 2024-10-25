using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WebDiet.Server;
using WebDiet.Server.Entities;
using WebDiet.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IIngredientService, IngredientsService>();

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
