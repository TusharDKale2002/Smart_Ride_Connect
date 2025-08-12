using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Smart_Ride.Models;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Smart_Ride.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SmartRideDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(SmartRideDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            Console.WriteLine($"Login attempt for email: {request.Email}");

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                Console.WriteLine("User not found");
                return Unauthorized("Invalid email or password");
            }

            // ✅ Verify hashed password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                Console.WriteLine("Password mismatch");
                return Unauthorized("Invalid email or password");
            }

            Console.WriteLine($"User found: {user.Name}");
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    user.Phone,
                    user.EmergencyEmail
                }
            });
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest("User already exists");

            var newUser = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                EmergencyEmail = request.EmergencyEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password) // 🔐 Secure hash
            };

            _context.Users.Add(newUser);

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }

            var token = GenerateJwtToken(newUser);
            return Ok(new
            {
                token,
                user = new
                {
                    newUser.UserId,
                    newUser.Name,
                    newUser.Email,
                    newUser.Phone,
                    newUser.EmergencyEmail
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim("UserId", user.UserId.ToString())

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ✅ DTOs
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string EmergencyEmail { get; set; }
    }
}