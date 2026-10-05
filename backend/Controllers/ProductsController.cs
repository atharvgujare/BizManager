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
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        private Guid GetBusinessId()
        {
            var claim = User.FindFirst("BusinessId");
            return claim != null && Guid.TryParse(claim.Value, out var id) ? id : Guid.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] bool? lowStock)
        {
            var businessId = GetBusinessId();
            var query = _context.Products.Where(p => p.BusinessId == businessId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) 
                                      || (p.SKU != null && p.SKU.ToLower().Contains(term))
                                      || (p.Barcode != null && p.Barcode.ToLower().Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(category) && category != "All Items")
            {
                query = query.Where(p => p.Category == category);
            }

            if (lowStock == true)
            {
                query = query.Where(p => !p.IsService && p.CurrentStock <= p.MinStockAlert);
            }

            var products = await query.OrderBy(p => p.Name).ToListAsync();
            return Ok(products);
        }

        [HttpGet("barcode/{barcode}")]
        public async Task<ActionResult<Product>> GetByBarcode(string barcode)
        {
            var businessId = GetBusinessId();
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.BusinessId == businessId && p.Barcode == barcode);

            if (product == null)
            {
                return NotFound(new { message = $"No item found with barcode {barcode}" });
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductDto dto)
        {
            var businessId = GetBusinessId();

            var product = new Product
            {
                BusinessId = businessId,
                Name = dto.Name,
                SKU = dto.SKU,
                Barcode = dto.Barcode,
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category,
                CostPrice = dto.CostPrice,
                SellingPrice = dto.SellingPrice,
                CurrentStock = dto.CurrentStock,
                MinStockAlert = dto.MinStockAlert,
                Unit = dto.Unit,
                IsService = dto.IsService
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] CreateProductDto dto)
        {
            var businessId = GetBusinessId();
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.BusinessId == businessId);

            if (product == null)
            {
                return NotFound();
            }

            product.Name = dto.Name;
            product.SKU = dto.SKU;
            product.Barcode = dto.Barcode;
            product.Category = dto.Category;
            product.CostPrice = dto.CostPrice;
            product.SellingPrice = dto.SellingPrice;
            product.CurrentStock = dto.CurrentStock;
            product.MinStockAlert = dto.MinStockAlert;
            product.Unit = dto.Unit;
            product.IsService = dto.IsService;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/stock")]
        public async Task<IActionResult> AdjustStock(Guid id, [FromBody] UpdateStockDto dto)
        {
            var businessId = GetBusinessId();
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.BusinessId == businessId);

            if (product == null)
            {
                return NotFound();
            }

            product.CurrentStock += dto.QuantityChange;
            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { currentStock = product.CurrentStock });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var businessId = GetBusinessId();
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.BusinessId == businessId);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
