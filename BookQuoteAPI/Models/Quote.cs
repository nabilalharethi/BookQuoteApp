namespace BookQuoteAPI.Models;

//represent a favorite quote saved by a user

public class Quote
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int UserId { get; set; }
}