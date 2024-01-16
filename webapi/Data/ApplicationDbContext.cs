using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore;
using webapi.Models;
namespace webapi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=volunteerhub.db");
        }
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Creator)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Event>()
            .HasMany(e => e.Applicants)
            .WithMany()
            .UsingEntity(j => j.ToTable("EventApplicants"));

        modelBuilder.Entity<Event>()
            .HasMany(e => e.RejectedUsers)
            .WithMany()
            .UsingEntity(j => j.ToTable("EventRejectedUsers"));

        modelBuilder.Entity<Event>()
            .HasMany(e => e.AcceptedUsers)
            .WithMany()
            .UsingEntity(j => j.ToTable("EventAcceptedUsers"));
    }
}