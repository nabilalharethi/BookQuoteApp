
using System.ComponentModel.DataAnnotations;

namespace BookQuoteAPI.Models;



//represent a favorite quote saved by a user

public class Quote
{
    public int Id { get; set; }

     [Required]
    public string Text { get; set; } = string.Empty;

     [MaxLength(200)]
    public string Author { get; set; } = string.Empty;
    
    public int UserId { get; set; }
    public User? User { get; set; }
}