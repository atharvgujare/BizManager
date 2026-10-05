using BusinessManager.Api.Data;
using BusinessManager.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BusinessManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        private Guid GetBusinessId()
        {
            var claim = User.FindFirst("BusinessId");
            return claim != null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var businessId = GetBusinessId();
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            // Today metrics
            var todayInvoices = await _context.Invoices
                .Include(i => i.Items)
                .ThenInclude(it => it.Product)
                .Where(i => i.BusinessId == businessId && i.IssueDate >= today)
                .ToListAsync();

            var todayRevenue = todayInvoices.Sum(i => i.GrandTotal);
            var todayOrdersCount = todayInvoices.Count;

            // Today COGS for profit calculation
            decimal todayCogs = 0;
            foreach (var inv in todayInvoices)
            {
                foreach (var item in inv.Items)
                {
                    var cost = item.Product?.CostPrice ?? 0;
                    todayCogs += (cost * item.Quantity);
                }
            }
            var todayGrossProfit = Math.Max(0, todayRevenue - todayCogs);

            // Monthly metrics
            var monthRevenue = await _context.Invoices
                .Where(i => i.BusinessId == businessId && i.IssueDate >= startOfMonth)
                .SumAsync(i => (decimal?)i.GrandTotal) ?? 0;

            var monthExpense = await _context.Expenses
                .Where(e => e.BusinessId == businessId && e.Date >= startOfMonth)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            // Receivables (customers with negative balance)
            var customerBalances = await _context.Customers
                .Where(c => c.BusinessId == businessId)
                .Select(c => c.OutstandingBalance)
                .ToListAsync();

            var totalReceivables = Math.Abs(customerBalances.Where(b => b < 0).Sum());
            var totalPayables = customerBalances.Where(b => b > 0).Sum();

            // Low stock count
            var lowStockCount = await _context.Products
                .CountAsync(p => p.BusinessId == businessId && !p.IsService && p.CurrentStock <= p.MinStockAlert);

            // 7-day sales curve
            var weeklyTrend = new List<DailySalesPointDto>();
            for (int i = 6; i >= 0; i--)
            {
                var dayDate = today.AddDays(-i);
                var nextDate = dayDate.AddDays(1);
                var daySales = await _context.Invoices
                    .Where(inv => inv.BusinessId == businessId && inv.IssueDate >= dayDate && inv.IssueDate < nextDate)
                    .SumAsync(inv => (decimal?)inv.GrandTotal) ?? 0;

                weeklyTrend.Add(new DailySalesPointDto(dayDate.ToString("ddd"), daySales));
            }

            // Recent sales
            var recentSales = await _context.Invoices
                .Include(i => i.Customer)
                .Where(i => i.BusinessId == businessId)
                .OrderByDescending(i => i.IssueDate)
                .Take(5)
                .Select(i => new RecentSaleDto(
                    i.Id,
                    i.InvoiceNumber,
                    i.Customer != null ? i.Customer.Name : "Walk-in Guest",
                    i.GrandTotal,
                    i.PaymentMode,
                    i.IssueDate
                ))
                .ToListAsync();

            return Ok(new DashboardSummaryDto(
                todayRevenue,
                todayGrossProfit,
                monthRevenue,
                monthExpense,
                totalReceivables,
                totalPayables,
                lowStockCount,
                todayOrdersCount,
                weeklyTrend,
                recentSales
            ));
        }
    }
}
