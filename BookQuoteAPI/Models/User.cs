using System.ComponentModel.DataAnnotations;

namespace BookQuoteAPI.Models;

// represnts a  user in the system

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public List<Book> Books { get; set; } = new();
    public List<Quote> Quotes { get; set; } = new();
    

}