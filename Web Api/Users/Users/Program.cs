using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Users.Repository;
using Users.Migrations;
using Users.Extensions;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<Database>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MigrateDatabase();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();