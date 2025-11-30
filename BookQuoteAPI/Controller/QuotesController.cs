using BookQuoteAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace BookQuoteAPI.Controllers;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private static List<Quote> quotes = new List<Quote>
    {
        new Quote { Id = 1, Text = "The only limit is your mind.", Author = "Anonymous"},
        new Quote { Id = 2, Text = "Knowledge is power.", Author = "Francis Bacon"},
        new Quote { Id = 3, Text = "Success is not final, failure is not fatal: it is the courage to continue that counts.", Author = "Winston Churchill"},
        new Quote { Id = 4, Text = "What you think, you become. What you feel, you attract. What you imagine, you create.", Author = "Buddha"},
        new Quote { Id = 5, Text = "Do what you can, with what you have, where you are.", Author = "Theodore Roosevelt"},
    
    };

    [HttpGet]
    public IActionResult GetQuotes()
    {
        return Ok(quotes.Take(5)); // return first 5 for "My Quotes"
    }

    [HttpPost]
    public IActionResult CreateQuote([FromBody] Quote quote)
    {
        quote.Id = quotes.Any() ? quotes.Max(q => q.Id) + 1 : 1;
        quotes.Add(quote);
        return CreatedAtAction(nameof(GetQuote), new { id = quote.Id }, quote);
    }

    [HttpGet("{id}")]
    public IActionResult GetQuote(int id)
    {
        var quote = quotes.FirstOrDefault(q => q.Id == id);
        if (quote == null) return NotFound();
        return Ok(quote);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateQuote(int id, [FromBody] Quote updatedQuote)
    {
        var quote = quotes.FirstOrDefault(q => q.Id == id);
        if (quote == null) return NotFound();

        quote.Text = updatedQuote.Text;
        quote.Author = updatedQuote.Author;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteQuote(int id)
    {
        var quote = quotes.FirstOrDefault(q => q.Id == id);
        if (quote == null) return NotFound();

        quotes.Remove(quote);
        return NoContent();
    }
}
