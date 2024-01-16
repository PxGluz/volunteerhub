using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Handlers;

public class EventHandlers
{
    public class CreateEvent
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string DateTime { get; set; }
    }

    public class DisplayEvent
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string DateTime { get; set; }
        public string CreatorName { get; set; }
    }
    
    public static void RunEventHandlers(WebApplication app)
    {
        // map the endpoint for getting all events from the database
        app.MapGet("/api/event/GetEvents", (ApplicationDbContext context) =>
            {
                // Get all events from the database
                var events = context.Events.Include(e => e.Creator).ToArray();

                // Convert events to DisplayEvent array
                var displayEvents = events.Select(e => new DisplayEvent
                {
                    EventId = e.EventId,
                    Title = e.Title,
                    Description = e.Description,
                    DateTime = e.Date.ToString("yyyy-MM-ddTHH:mm:ss"), // Adjust the date format as needed
                    CreatorName = e.Creator?.Username ?? "Unknown" // Check for null before calling ToString()
                }).ToArray();

                return displayEvents;
            })
            .WithName("GetEvents")
            .WithOpenApi();
        
        //map the endpoint for creating an event
        app.MapPost("/api/event/CreateEvent", (ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, CreateEvent createEvent) =>
            {
                //get the user from the database
                var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();

                // Get the user from the database
                var user = context.Users.FirstOrDefault(u => u.Username == TokenService.DecodeToken(token));
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                //create the event
                Event newEvent = new()
                {
                    Title = createEvent.Title,
                    Description = createEvent.Description,
                    Date = DateTime.Parse(createEvent.DateTime),
                    Creator = user
                };

                //add the event to the database
                context.Events.Add(newEvent);
                context.SaveChanges();
                
                return Results.Created($"/api/event/GetEvent/{newEvent.EventId}", newEvent);
            })
            .WithName("CreateEvent")
            .WithOpenApi();
        
    }
    
}