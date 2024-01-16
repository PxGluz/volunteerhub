using Microsoft.EntityFrameworkCore;
using webapi.Controllers;
using webapi.Data;
using webapi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddHttpContextAccessor();

// enable cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// map the endpoint for getting all users from the database

app.MapGet("/api/user/GetUsers", (ApplicationDbContext context) =>
    {
        // Set the culture to the invariant culture before retrieving data

        // Get all users from the database
        var users = context.Users.ToArray();

        return users;
    })
    .WithName("GetUsers")
    .WithOpenApi();

// map the signup endpoint
app.MapPost("/api/user/SignUp", (ApplicationDbContext context, UserController.SignUpUser user) =>
    {
        // check if the username already exists
        var existingUser = context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (existingUser != null)
        {
            return Results.Conflict("Username already exists");
        }

        // if the user provided a role greater than 1 return
        if (user.Role > UserRole.Volunteer)
        {
            return Results.Unauthorized();
        }

        //create user object with id
        User newUser = new()
        {
            Username = user.Username,
            Password = user.Password,
            Role = user.Role
        };
        
        context.Users.Add(newUser);
        context.SaveChanges();
        
        var token = TokenService.GenerateToken(newUser.Username);
        return Results.Created($"/api/user/SignUp/{newUser.UserId}", token);
    })
    .WithName("SignUp")
    .WithOpenApi();

// map the signin endpoint
app.MapPost("/api/user/SignIn", (ApplicationDbContext context, UserController.SignInUser user) =>
    {
        // check if the username exists
        var existingUser = context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (existingUser == null)
        {
            return Results.NotFound("Username does not exist");
        }

        // check if the password is correct
        if (existingUser.Password != user.Password)
        {
            return Results.Unauthorized();
        }

        
        var token = TokenService.GenerateToken(existingUser.Username);
        return Results.Ok(token);
    })
    .WithName("SignIn")
    .WithOpenApi();

// map the endpoint for getting an user by their id
app.MapGet("/api/user/GetUserById/{id}", (ApplicationDbContext context, int id) =>
    {
        // Set the culture to the invariant culture before retrieving data

        // Get the user from the database
        var user = context.Users.FirstOrDefault(u => u.UserId == id);

        if (user == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(user);
    })
    .WithName("GetUserById")
    .WithOpenApi();

// map GetUserByToken endpoint
app.MapGet("/api/user/GetUserByToken", (ApplicationDbContext context, IHttpContextAccessor httpContextAccessor) =>
    {
        //Get token from header
        var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();

        // Get the user from the database
        var user = context.Users.FirstOrDefault(u => u.Username == TokenService.DecodeToken(token));

        if (user == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(user);
    })
.WithName("GetUserByToken")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
