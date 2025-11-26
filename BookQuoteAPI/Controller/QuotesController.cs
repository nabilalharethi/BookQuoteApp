using BookQuoteAPI.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private static List<Quote> quotes = new List<Quote>
    {
        new Quote { Id = 1, Text = "The only limit is your mind.", Author = "Anonymous", UserId = 1 },
        new Quote { Id = 2, Text = "Knowledge is power.", Author = "Francis Bacon", UserId = 1 }
        // Add more if needed
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
