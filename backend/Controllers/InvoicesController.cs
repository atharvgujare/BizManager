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
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        private Guid GetBusinessId()
        {
            var claim = User.FindFirst("BusinessId");
            return claim != null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices([FromQuery] int limit = 50)
        {
            var businessId = GetBusinessId();
            var invoices = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .Where(i => i.BusinessId == businessId)
                .OrderByDescending(i => i.IssueDate)
                .Take(limit)
                .ToListAsync();

            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(Guid id)
        {
            var businessId = GetBusinessId();
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id && i.BusinessId == businessId);

            if (invoice == null)
            {
                return NotFound();
            }

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice([FromBody] CreateInvoiceDto dto)
        {
            var businessId = GetBusinessId();

            if (dto.Items == null || !dto.Items.Any())
            {
                return BadRequest(new { message = "Invoice must contain at least one item." });
            }

            // Generate sequential invoice number
            var countToday = await _context.Invoices
                .CountAsync(i => i.BusinessId == businessId && i.IssueDate.Date == DateTime.UtcNow.Date);
            var invoiceNum = $"INV-{DateTime.UtcNow:yyMMdd}-{(countToday + 1):D3}";

            decimal subTotal = 0;
            var invoiceItems = new List<InvoiceItem>();

            foreach (var itemDto in dto.Items)
            {
                var lineTotal = itemDto.Quantity * itemDto.UnitPrice;
                subTotal += lineTotal;

                invoiceItems.Add(new InvoiceItem
                {
                    ProductId = itemDto.ProductId,
                    ItemName = itemDto.ItemName,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    TotalPrice = lineTotal
                });

                // Auto-deduct stock if linked to a physical product
                if (itemDto.ProductId.HasValue)
                {
                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == itemDto.ProductId && p.BusinessId == businessId);
                    if (product != null && !product.IsService)
                    {
                        product.CurrentStock -= itemDto.Quantity;
                    }
                }
            }

            var grandTotal = Math.Max(0, subTotal + dto.TaxAmount - dto.DiscountAmount);
            var status = dto.PaidAmount >= grandTotal ? "Paid" : (dto.PaidAmount > 0 ? "Partial" : "Unpaid");

            var invoice = new Invoice
            {
                BusinessId = businessId,
                CustomerId = dto.CustomerId,
                InvoiceNumber = invoiceNum,
                IssueDate = DateTime.UtcNow,
                SubTotal = subTotal,
                TaxAmount = dto.TaxAmount,
                DiscountAmount = dto.DiscountAmount,
                GrandTotal = grandTotal,
                PaidAmount = dto.PaidAmount,
                PaymentMode = dto.PaymentMode,
                Status = status,
                Notes = dto.Notes,
                Items = invoiceItems
            };

            _context.Invoices.Add(invoice);

            // If Customer has unpaid credit, update customer debt balance & ledger
            var unpaidBalance = grandTotal - dto.PaidAmount;
            if (dto.CustomerId.HasValue && unpaidBalance > 0)
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Id == dto.CustomerId && c.BusinessId == businessId);

                if (customer != null)
                {
                    customer.OutstandingBalance -= unpaidBalance; // increases debt
                    _context.LedgerEntries.Add(new LedgerEntry
                    {
                        CustomerId = customer.Id,
                        InvoiceId = invoice.Id,
                        EntryType = "Debit",
                        Amount = unpaidBalance,
                        BalanceAfter = customer.OutstandingBalance,
                        Description = $"Invoice {invoiceNum} credit balance",
                        Date = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }
    }
}
