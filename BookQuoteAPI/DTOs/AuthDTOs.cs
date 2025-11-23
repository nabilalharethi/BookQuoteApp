namespace BookQuoteAPI.DTOs;

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;

}

public class RegistrDto
{
    public string Username { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;

 }

public class AuthorResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
 }