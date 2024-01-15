namespace webapi.Models;
public class User
{
    public int UserId { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string Photo { get; set; }

    public UserRole Role { get; set; }
}

public enum UserRole
{
    Admin,
    EventPlanner,
    Volunteer
}
