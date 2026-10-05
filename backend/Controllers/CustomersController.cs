using BusinessManager.Api.Data;
using BusinessManager.Api.DTOs;
using BusinessManager.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BusinessManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        private Guid GetBusinessId()
        {
            var claim = User.FindFirst("BusinessId");
            return claim != null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers([FromQuery] string? search)
        {
            var businessId = GetBusinessId();
            var query = _context.Customers.Where(c => c.BusinessId == businessId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(term) || (c.Phone != null && c.Phone.Contains(term)));
            }

            var customers = await query.OrderBy(c => c.Name).ToListAsync();
            return Ok(customers);
        }

        [HttpGet("{id}/statement")]
        public async Task<ActionResult> GetCustomerStatement(Guid id)
        {
            var businessId = GetBusinessId();
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id && c.BusinessId == businessId);

            if (customer == null)
            {
                return NotFound();
            }

            var entries = await _context.LedgerEntries
                .Where(l => l.CustomerId == id)
                .OrderByDescending(l => l.Date)
                .Take(50)
                .ToListAsync();

            return Ok(new
            {
                Customer = customer,
                Statement = entries
            });
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] CreateCustomerDto dto)
        {
            var businessId = GetBusinessId();

            var customer = new Customer
            {
                BusinessId = businessId,
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                OutstandingBalance = dto.OpeningBalance
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
        }

        [HttpPost("{id}/payment")]
        public async Task<IActionResult> ReceivePayment(Guid id, [FromBody] ReceivePaymentDto dto)
        {
            var businessId = GetBusinessId();
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id && c.BusinessId == businessId);

            if (customer == null)
            {
                return NotFound();
            }

            customer.OutstandingBalance += dto.Amount; // pays down debt

            var entry = new LedgerEntry
            {
                CustomerId = customer.Id,
                EntryType = "Credit",
                Amount = dto.Amount,
                BalanceAfter = customer.OutstandingBalance,
                Description = dto.Notes ?? $"Payment received via {dto.PaymentMode}",
                Date = DateTime.UtcNow
            };

            _context.LedgerEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment recorded successfully", currentBalance = customer.OutstandingBalance });
        }
    }
}
