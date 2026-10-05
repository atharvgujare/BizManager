using BusinessManager.Api.Data;
using BusinessManager.Api.DTOs;
using BusinessManager.Api.Models;
using BusinessManager.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusinessManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (emailExists)
            {
                return BadRequest(new { message = "Email already registered." });
            }

            // Create Business
            var business = new Business
            {
                Name = dto.BusinessName,
                BusinessType = dto.BusinessType,
                CurrencySymbol = dto.CurrencySymbol
            };
            _context.Businesses.Add(business);

            // Create Owner User
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = passwordHash,
                Role = "Admin",
                BusinessId = business.Id
            };
            _context.Users.Add(user);

            // Seed demo category products for instant testing
            var demoProducts = new List<Product>
            {
                new Product { BusinessId = business.Id, Name = "Wireless Keyboard", SKU = "TECH-001", Barcode = "8901234001", Category = "Electronics", CostPrice = 25m, SellingPrice = 45m, CurrentStock = 20, MinStockAlert = 5, Unit = "pcs" },
                new Product { BusinessId = business.Id, Name = "Arabica Coffee Beans 500g", SKU = "BEV-002", Barcode = "8901234002", Category = "Beverages", CostPrice = 9.5m, SellingPrice = 18m, CurrentStock = 4, MinStockAlert = 5, Unit = "pcs" },
                new Product { BusinessId = business.Id, Name = "Consulting & Support (Hourly)", SKU = "SRV-003", Barcode = "8901234003", Category = "Services", CostPrice = 0m, SellingPrice = 60m, CurrentStock = 999, MinStockAlert = 0, Unit = "hr", IsService = true }
            };
            _context.Products.AddRange(demoProducts);

            // Seed sample customer
            var demoCustomer = new Customer
            {
                BusinessId = business.Id,
                Name = "Sarah Jenkins",
                Phone = "+15553492819",
                Email = "sarah@example.com",
                OutstandingBalance = -450m
            };
            _context.Customers.Add(demoCustomer);

            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user, business);

            return Ok(new AuthResponseDto(
                token,
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                business.Id,
                business.Name,
                business.CurrencySymbol
            ));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Business)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            if (user.Business == null)
            {
                return StatusCode(500, new { message = "Business profile missing." });
            }

            var token = _tokenService.GenerateToken(user, user.Business);

            return Ok(new AuthResponseDto(
                token,
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Business.Id,
                user.Business.Name,
                user.Business.CurrencySymbol
            ));
        }
    }
}
