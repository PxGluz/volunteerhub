using webapi.Data;
using webapi.Models;

namespace webapi.Handlers;

public class UserHandlers
{
    public class ProfileUser
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public UserRole Role { get; set; }
    }
    
    public class SignInUser
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    
    public class SignUpUser
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
    }
    
    public static void RunUserHandlers(WebApplication app)
    {
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
        app.MapPost("/api/user/SignUp", (ApplicationDbContext context, SignUpUser user) =>
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
        app.MapPost("/api/user/SignIn", (ApplicationDbContext context, SignInUser user) =>
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
                ProfileUser profileUser = new()
                {
                    UserID = user.UserId,
                    Username = user.Username,
                    Role = user.Role
                };
                return Results.Ok(profileUser);
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
                ProfileUser profileUser = new()
                {
                    UserID = user.UserId,
                    Username = user.Username,
                    Role = user.Role
                };
                return Results.Ok(profileUser);
            })
        .WithName("GetUserByToken")
        .WithOpenApi();
    }
}