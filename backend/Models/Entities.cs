using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BusinessManager.Api.Models
{
    public class Business
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(60)]
        public string BusinessType { get; set; } = "General"; // Retail, Wholesale, Service, Freelance

        [MaxLength(10)]
        public string CurrencySymbol { get; set; } = "$";

        [MaxLength(50)]
        public string? TaxRegistrationNumber { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore]
        public ICollection<User> Users { get; set; } = new List<User>();
        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
        [JsonIgnore]
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
        [JsonIgnore]
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
        [JsonIgnore]
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }

    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BusinessId { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, MaxLength(120), EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Role { get; set; } = "Admin"; // Admin, Manager, Cashier, Accountant

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(BusinessId))]
        public Business? Business { get; set; }
    }

    public class Product
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BusinessId { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? SKU { get; set; }

        [MaxLength(60)]
        public string? Barcode { get; set; }

        [MaxLength(80)]
        public string Category { get; set; } = "General";

        [Column(TypeName = "decimal(18,2)")]
        public decimal CostPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SellingPrice { get; set; }

        public int CurrentStock { get; set; }
        public int MinStockAlert { get; set; } = 5;

        [MaxLength(20)]
        public string Unit { get; set; } = "pcs"; // pcs, kg, ltr, box, hr

        public bool IsService { get; set; } = false;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(BusinessId))]
        [JsonIgnore]
        public Business? Business { get; set; }
    }

    public class Customer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BusinessId { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(25)]
        public string? Phone { get; set; }

        [MaxLength(120)]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        // Negative = customer owes business, Positive = customer has credit balance
        [Column(TypeName = "decimal(18,2)")]
        public decimal OutstandingBalance { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(BusinessId))]
        [JsonIgnore]
        public Business? Business { get; set; }

        [JsonIgnore]
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
        [JsonIgnore]
        public ICollection<LedgerEntry> LedgerEntries { get; set; } = new List<LedgerEntry>();
    }

    public class Invoice
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BusinessId { get; set; }

        public Guid? CustomerId { get; set; }

        [Required, MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal GrandTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PaidAmount { get; set; }

        [MaxLength(30)]
        public string PaymentMode { get; set; } = "Cash"; // Cash, Card, UPI, Credit, Split

        [MaxLength(20)]
        public string Status { get; set; } = "Paid"; // Paid, Partial, Unpaid

        [MaxLength(250)]
        public string? Notes { get; set; }

        [ForeignKey(nameof(BusinessId))]
        [JsonIgnore]
        public Business? Business { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public Customer? Customer { get; set; }

        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    }

    public class InvoiceItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid InvoiceId { get; set; }

        public Guid? ProductId { get; set; }

        [Required, MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [ForeignKey(nameof(InvoiceId))]
        [JsonIgnore]
        public Invoice? Invoice { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
    }

    public class Expense
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid BusinessId { get; set; }

        [Required, MaxLength(80)]
        public string Category { get; set; } = "General"; // Rent, Utilities, Salaries, Stock, Transport, Marketing

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [MaxLength(250)]
        public string? Description { get; set; }

        [MaxLength(30)]
        public string PaymentMode { get; set; } = "Cash";

        [MaxLength(300)]
        public string? ReceiptImageUrl { get; set; }

        [ForeignKey(nameof(BusinessId))]
        [JsonIgnore]
        public Business? Business { get; set; }
    }

    public class LedgerEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid CustomerId { get; set; }

        public Guid? InvoiceId { get; set; }

        [Required, MaxLength(20)]
        public string EntryType { get; set; } = "Debit"; // Debit (Sale/Owed), Credit (Payment Received)

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BalanceAfter { get; set; }

        [MaxLength(250)]
        public string? Description { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(CustomerId))]
        [JsonIgnore]
        public Customer? Customer { get; set; }
    }
}
