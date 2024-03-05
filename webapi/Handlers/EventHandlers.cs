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
    
    public class DetailedEvent
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string DateTime { get; set; }
        public string CreatorName { get; set; }
        public int CreatorRole { get; set; }
        public int CreatorId { get; set; }
        public List<User> Applicants { get; set; }
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
        
        // map the endpoint of a specific event
        app.MapGet("/api/event/GetEvent/{id}", (ApplicationDbContext context, int id) =>
            {
                // Get the event from the database
                var eventFromDb = context.Events.Include(e => e.Creator)
                                                .Include(e => e.Applicants).FirstOrDefault(e => e.EventId == id);

                if (eventFromDb == null)
                {
                    return Results.NotFound();
                }

                // Convert event to DetailedEvent
                var detailedEvent = new DetailedEvent
                {
                    EventId = eventFromDb.EventId,
                    Title = eventFromDb.Title,
                    Description = eventFromDb.Description,
                    DateTime = eventFromDb.Date.ToString("yyyy-MM-ddTHH:mm:ss"), // Adjust the date format as needed
                    CreatorName = eventFromDb.Creator?.Username ?? "Unknown", // Check for null before calling ToString()
                    CreatorRole = (int)eventFromDb.Creator.Role,
                    CreatorId = eventFromDb.Creator.UserId,
                    Applicants = eventFromDb.Applicants,
                };
                return Results.Ok(detailedEvent);
            })
            .WithName("GetEvent")
            .WithOpenApi();
        
        //map endpoint for deleting an event
        app.MapDelete("/api/event/DeleteEvent/{id}", (ApplicationDbContext context, int id) =>
            {
                //get the event from the database
                var eventFromDb = context.Events.FirstOrDefault(e => e.EventId == id);
                if (eventFromDb == null)
                {
                    return Results.NotFound();
                }

                //delete the event from the database
                context.Events.Remove(eventFromDb);
                context.SaveChanges();
                return Results.Ok();
            })
            .WithName("DeleteEvent")
            .WithOpenApi();
        // map endpoint for editing an event
        app.MapPut("/api/event/EditEvent/{id}", (ApplicationDbContext context, int id, CreateEvent createEvent) =>
            {
                //get the event from the database
                var eventFromDb = context.Events.FirstOrDefault(e => e.EventId == id);
                if (eventFromDb == null)
                {
                    return Results.NotFound();
                }

                //edit the event
                eventFromDb.Title = createEvent.Title;
                eventFromDb.Description = createEvent.Description;
                eventFromDb.Date = DateTime.Parse(createEvent.DateTime);

                //save the changes to the database
                context.SaveChanges();
                return Results.Ok();
            })
            .WithName("EditEvent")
            .WithOpenApi();
        
        // map endpoint for getting createevent data by id
        app.MapGet("/api/event/GetCreateEventData/{id}", (ApplicationDbContext context, int id) =>
            {
                // Get the event from the database
                var eventFromDb = context.Events.FirstOrDefault(e => e.EventId == id);

                if (eventFromDb == null)
                {
                    return Results.NotFound();
                }

                // Convert event to CreateEvent
                var createEvent = new CreateEvent
                {
                    Title = eventFromDb.Title,
                    Description = eventFromDb.Description,
                    DateTime = eventFromDb.Date.ToString("yyyy-MM-ddTHH:mm:ss") // Adjust the date format as needed
                };
                return Results.Ok(createEvent);
            })
            .WithName("GetCreateEventData")
            .WithOpenApi();
        
        // map endpoint for getting all events created by a user
        app.MapGet("/api/event/GetEventsCreatedByUser/{id}", (ApplicationDbContext context, int id) =>
            {
                //get the user from the database

                // Get the user from the database
                var user = context.Users.FirstOrDefault(u => u.UserId == id);
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                // Get all events from the database
                var events = context.Events.Include(e => e.Creator).Where(e => e.Creator.UserId == user.UserId).ToArray();

                // Convert events to DisplayEvent array
                var displayEvents = events.Select(e => new DisplayEvent
                {
                    EventId = e.EventId,
                    Title = e.Title,
                    Description = e.Description,
                    DateTime = e.Date.ToString("yyyy-MM-ddTHH:mm:ss"), // Adjust the date format as needed
                    CreatorName = e.Creator?.Username ?? "Unknown" // Check for null before calling ToString()
                }).ToArray();

                return Results.Ok(displayEvents);
            })
            .WithName("GetEventsCreatedByUser")
            .WithOpenApi();
        
        // map endpoint for getting all events a user has applied to
        app.MapGet("/api/event/GetEventsAppliedToByUser/{id}", (ApplicationDbContext context, int id) =>
            {
                //get the user from the database

                // Get the user from the database
                var user = context.Users.FirstOrDefault(u => u.UserId == id);
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                // Get all events from the database
                var events = context.Events.Include(e => e.Creator).Include(e => e.Applicants).Where(e => e.Applicants.Contains(user)).ToArray();

                // Convert events to DisplayEvent array
                var displayEvents = events.Select(e => new DisplayEvent
                {
                    EventId = e.EventId,
                    Title = e.Title,
                    Description = e.Description,
                    DateTime = e.Date.ToString("yyyy-MM-ddTHH:mm:ss"), // Adjust the date format as needed
                    CreatorName = e.Creator?.Username ?? "Unknown" // Check for null before calling ToString()
                }).ToArray();

                return Results.Ok(displayEvents);
            })
            .WithName("GetEventsAppliedToByUser")
            .WithOpenApi();
        
        // map endpoint for applying to an event
        app.MapPost("/api/event/ApplyToEvent/{id}", (ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, int id) =>
            {
                //get the user from the database
                var token = httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();

                // Get the user from the database
                var user = context.Users.FirstOrDefault(u => u.Username == TokenService.DecodeToken(token));
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                //get the event from the database
                var eventFromDb = context.Events.Include(e => e.Creator)
                                                .Include(e => e.Applicants).FirstOrDefault(e => e.EventId == id);
                if (eventFromDb == null)
                {
                    return Results.NotFound();
                }

                //add the user to the applicants list
                //check if the user is already in the applicants list
                if (eventFromDb.Applicants.Contains(user))
                {
                    return Results.BadRequest("You have already applied to this event");
                }
                eventFromDb.Applicants.Add(user);

                //save the changes to the database
                context.SaveChanges();
                return Results.Ok();
            })
            .WithName("ApplyToEvent")
            .WithOpenApi();
        
    }
    
    
}