using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BookQuoteAPI.Data;
using BookQuoteAPI.DTOs;
using BookQuoteAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BookQuoteAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        ApplicationDbContext context,
        IConfiguration configuration)

    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto >> Register(
        RegistrDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Username already exist");

        }

        var user = new User
        {
            Username = request.Username,
            PasswordHash = HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = CreateToken(user);

        return Ok(new AuthResponseDto 
        {
            Token = token,
            Username = user.Username
        });
    }

  

    private string HashPassword(string Password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(
            Encoding.UTF8.GetBytes(Password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string Password, string hash)
    {
        var hashOfInput = HashPassword(Password);
        return hashOfInput == hash;
    }

    [HttpGet("login")]
    public IActionResult LoginInfo()
    {
        return Ok("Login endpoint requires POST. Use POST /api/auth/login with username and password.");
    }



       [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
    {
        // Find user by username
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        // Verify user exists and password is correct
        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
        {
            return NotFound(new {messge = "User Not found"});
        }
        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid password" });
        }

        // Generate JWT token
        var token = CreateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = user.Username
        });
    }









    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? 
            "ThisIsASecretKeyForJWTTokenGenerationThatIsLongEnoughForHS512Algorithm123456789"));

        var creds = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "BookQuoteAPI",
            audience: _configuration["Jwt:Audience"] ?? "BookQuoteApp",
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}


