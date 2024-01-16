using System.Diagnostics;
using Azure.Identity;
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
        var token = TokenService.GenerateToken(newUser.Username);
        return StatusCode(StatusCodes.Status200OK, token);
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
        // also provide session token in response
        var token = TokenService.GenerateToken(existingUser.Username);
        //log the token in the console
        return StatusCode(StatusCodes.Status200OK, token);
    }
    
    public class ProfileUser
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public UserRole Role { get; set; }
    }
    
    // get user by id function
    [HttpGet]
    [Route("GetUserById/{id}")]
    public IActionResult GetUserById(int id)
    {
        // check if the user exists
        var temp = _context.Users.FirstOrDefault(u => u.UserId == id);
        if (temp == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, "User does not exist");
        }
        // send just the username and role
        ProfileUser user = new ProfileUser
        {
            Username = temp.Username,
            Role = temp.Role
        };
        return StatusCode(StatusCodes.Status200OK, user);
    }
    
    // get user by token function
    [HttpGet]
    [Route("GetUserByToken")]
    public IActionResult GetUserByToken()
    {
        // get the token from the header
        var token = Request.Headers["Authorization"].ToString();
        // decode the token
        var username = TokenService.DecodeToken(token);
        // check if the user exists
        var temp = _context.Users.FirstOrDefault(u => u.Username == username);
        if (temp == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, "User does not exist");
        }
        // send just the username and role
        ProfileUser user = new ProfileUser
        {
            UserID = temp.UserId,
            Username = temp.Username,
            Role = temp.Role
        };
        return StatusCode(StatusCodes.Status200OK, user);
    }
    
}