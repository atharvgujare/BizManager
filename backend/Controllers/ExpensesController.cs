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
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

        private Guid GetBusinessId()
        {
            var claim = User.FindFirst("BusinessId");
            return claim != null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses([FromQuery] string? category)
        {
            var businessId = GetBusinessId();
            var query = _context.Expenses.Where(e => e.BusinessId == businessId);

            if (!string.IsNullOrWhiteSpace(category) && category != "All")
            {
                query = query.Where(e => e.Category == category);
            }

            var expenses = await query.OrderByDescending(e => e.Date).ToListAsync();
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense([FromBody] CreateExpenseDto dto)
        {
            var businessId = GetBusinessId();

            var expense = new Expense
            {
                BusinessId = businessId,
                Category = dto.Category,
                Amount = dto.Amount,
                PaymentMode = dto.PaymentMode,
                Description = dto.Description,
                Date = dto.Date ?? DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(expense);
        }
    }
}
