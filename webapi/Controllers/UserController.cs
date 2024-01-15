using webapi.Models;
using webapi.Data;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

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
}