public class Event
{
    public int EventId { get; set; }
    
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }

    // Foreign key
    public User Creator { get; set; }

    public List<User> Applicants { get; set; }
    public List<User> RejectedUsers { get; set; }
    public List<User> AcceptedUsers { get; set; }
}