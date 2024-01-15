using Microsoft.AspNetCore.Cors;
using webapi.Models;
using webapi.Data;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[EnableCors("AllowAll")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    [Route("GetUsers")]
    public IActionResult GetUsers()
    {
        List<User> list = _context.Users.ToList();
        return StatusCode(StatusCodes.Status200OK, list);
    }
    
    public class SignUpUser
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
    }
    
    // sign up function
    [HttpPost]
    [Route("SignUp")]
    // sign up controller that receives a json object with the user data
    //create user class without id
    public IActionResult SignUp(SignUpUser user)
    {
        // check if the username already exists
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (existingUser != null)
        {
            return StatusCode(StatusCodes.Status409Conflict, "Username already exists");
        }
        // if the user provided a role greater than 1 return
        if (user.Role > UserRole.Volunteer)
        {
            return StatusCode(StatusCodes.Status401Unauthorized, "You are not authorized to create an account");
        }
        //create user object with id
        User newUser = new User
        {
            Username = user.Username,
            Password = user.Password,
            Role = user.Role
        };
        _context.Users.Add(newUser);
        _context.SaveChanges();
        return StatusCode(StatusCodes.Status201Created, user);
    }
    
    public class SignInUser
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    
    // sign-in function
    [HttpPost]
    [Route("SignIn")]
    public IActionResult SignIn(SignInUser user)
    {
        // check if the username exists
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (existingUser == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, "Username does not exist");
        }
        // check if the password is correct
        if (existingUser.Password != user.Password)
        {
            return StatusCode(StatusCodes.Status401Unauthorized, "Incorrect password");
        }
        return StatusCode(StatusCodes.Status200OK, existingUser);
    }
    
}