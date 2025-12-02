
using System.ComponentModel.DataAnnotations;


namespace BookQuoteAPI.Models;
public class Book
{
    public int Id { get; set; }
    
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string Author { get; set; } = string.Empty;
    public DateTime? PublicationDate { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    

}