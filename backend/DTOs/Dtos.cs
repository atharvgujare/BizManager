using System.ComponentModel.DataAnnotations;

namespace BusinessManager.Api.DTOs
{
    // Auth DTOs
    public record RegisterDto(
        [Required] string FullName,
        [Required, EmailAddress] string Email,
        [Required, MinLength(6)] string Password,
        [Required] string BusinessName,
        string BusinessType = "Retail & General",
        string CurrencySymbol = "₹"
    );

    public record LoginDto(
        [Required, EmailAddress] string Email,
        [Required] string Password
    );

    public record AuthResponseDto(
        string Token,
        Guid UserId,
        string FullName,
        string Email,
        string Role,
        Guid BusinessId,
        string BusinessName,
        string CurrencySymbol
    );

    // Product DTOs
    public record CreateProductDto(
        [Required] string Name,
        string? SKU,
        string? Barcode,
        string Category,
        decimal CostPrice,
        decimal SellingPrice,
        int CurrentStock,
        int MinStockAlert,
        string Unit = "pcs",
        bool IsService = false
    );

    public record UpdateStockDto(
        int QuantityChange,
        string Reason = "Manual Adjustment"
    );

    // Sale / Invoice DTOs
    public record InvoiceItemInputDto(
        Guid? ProductId,
        [Required] string ItemName,
        int Quantity,
        decimal UnitPrice
    );

    public record CreateInvoiceDto(
        Guid? CustomerId,
        decimal DiscountAmount,
        decimal TaxAmount,
        decimal PaidAmount,
        string PaymentMode,
        string? Notes,
        List<InvoiceItemInputDto> Items
    );

    // Customer DTOs
    public record CreateCustomerDto(
        [Required] string Name,
        string? Phone,
        string? Email,
        string? Address,
        decimal OpeningBalance = 0
    );

    public record ReceivePaymentDto(
        [Required] decimal Amount,
        string PaymentMode = "Cash",
        string? Notes = null
    );

    // Expense DTOs
    public record CreateExpenseDto(
        [Required] string Category,
        [Required] decimal Amount,
        string PaymentMode = "Cash",
        string? Description = null,
        DateTime? Date = null
    );

    // Dashboard DTOs
    public record DashboardSummaryDto(
        decimal TodayRevenue,
        decimal TodayGrossProfit,
        decimal MonthRevenue,
        decimal MonthExpense,
        decimal TotalReceivables,
        decimal TotalPayables,
        int LowStockCount,
        int TodayOrdersCount,
        List<DailySalesPointDto> WeeklySalesTrend,
        List<RecentSaleDto> RecentSales
    );

    public record DailySalesPointDto(string Day, decimal Sales);
    public record RecentSaleDto(Guid Id, string InvoiceNumber, string CustomerName, decimal Amount, string PaymentMode, DateTime Date);
}
