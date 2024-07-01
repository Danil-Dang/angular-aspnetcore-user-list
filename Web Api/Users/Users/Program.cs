using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Stripe;
using Microsoft.AspNetCore.Mvc;

using Users.Repository;
using Users.Contracts;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IHotelsRepository, HotelsRepository>();

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:4201",
            ValidAudience = "https://localhost:4201",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ultraSuperPuperExtraSecretKey@369963"))
        };
    });
// builder.Services.AddScoped<Users.Helpers.JwtUtils>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAngularOrigin",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});

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

app.UseCors("AllowAngularOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
    RequestPath = new PathString("/Resources")
});

StripeConfiguration.ApiKey = "YOUR_STRIPE_SECRET_KEY";

app.MapPost("/api/payments", async ([FromBody] PaymentRequest request) =>
{
    try
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = request.Amount,
            Currency = request.Currency,
            PaymentMethod = request.PaymentMethodId,
            Confirm = true,
            ErrorOnRequiresAction = true
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);

        return Results.Ok(new { success = true });
    }
    catch (StripeException e)
    {
        return Results.BadRequest(new { error = e.Message });
    }
});


app.Run();

public class PaymentRequest
{
    public string PaymentMethodId { get; set; }
    public int Amount { get; set; }
    public string Currency { get; set; }
}