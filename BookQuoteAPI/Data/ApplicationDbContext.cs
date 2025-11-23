using BookQuoteAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookQuoteAPI.Data;

// Data context for the application

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Quote> Quotes { get; set; }
}
