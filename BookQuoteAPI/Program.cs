using System.Text;
using BookQuoteAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

//services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase("BookQuoteDb"));

//jwt authentication

var jwtkey = builder.Configuration["Jwt:key"] ??
"ThisIsASecretKeyForJWTTokenGenerationThatIsLongEnoughForHS512Algorithm123456789";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "BookQioteAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "BookQuteAPP";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtkey))
    };
});

// CORS

builder.Services.AddCors(Options =>
{
    Options.AddPolicy("AllowAngularAPP",
    policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
                "http://localhost:4201")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


var app = builder.Build();

app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

