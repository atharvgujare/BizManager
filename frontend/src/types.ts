export type UserRole = 'Admin' | 'Manager' | 'Cashier' | 'Accountant' | 'admin' | 'manager' | 'cashier' | 'accountant';
export type UiMode = 'classic' | 'apple';

export type MasterViewType = 
  | 'dashboard'
  | 'billing'
  | 'billing_pos'
  | 'customers'
  | 'customer_master'
  | 'products'
  | 'products_master'
  | 'stock'
  | 'stock_master'
  | 'invoices'
  | 'invoice_master'
  | 'analysis'
  | 'analysis_bi'
  | 'roles'
  | 'role_access'
  | 'barcode'
  | 'barcode_designer'
  | 'gst'
  | 'gst_compliance'
  | 'suppliers'
  | 'supplier_master'
  | 'branches'
  | 'branch_master'
  | 'ai_reorder'
  | 'reorder_master'
  | 'online_dukan'
  | 'dukan_storefront'
  | 'warranties'
  | 'service_master'
  | 'settings';

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  gstin: string;
  category: string;
  pendingPayment: number; // You'll Give (Udhar)
  paymentTerms: string;
  address: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: 'Store' | 'Godown';
  address: string;
  city: string;
  phone: string;
  managerName: string;
  totalStockUnits: number;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromBranch: string;
  toBranch: string;
  date: string;
  status: 'In Transit' | 'Received' | 'Draft';
  totalUnits: number;
  vehicleNumber?: string;
  items: { productId: string; productName: string; quantity: number }[];
}

export interface SmartReorderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  dailyVelocity: number; // units sold per day
  daysUntilStockout: number;
  suggestedOrderQty: number;
  supplierName: string;
  batchNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  status: 'Critical' | 'Warning' | 'Healthy' | 'Expiring Soon';
}

export interface OnlineOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentMode: 'UPI Online' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: 'New' | 'Accepted' | 'Packing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  brand: string;
  serialNumber: string;
  issueDescription: string;
  warrantyStatus: 'In Warranty' | 'Out of Warranty' | 'AMC Active';
  estimatedCost: number;
  advancePaid: number;
  status: 'Received' | 'Inspecting' | 'Repairing' | 'Ready for Delivery' | 'Delivered';
  createdAt: string;
  deliveryOtp: string;
}

export interface EWayBill {
  id: string;
  ewayBillNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerGstin: string;
  destinationPincode: string;
  vehicleNumber: string;
  transporterName: string;
  approxDistanceKm: number;
  consignmentValue: number;
  generatedDate: string;
  validUpto: string;
  status: 'Active' | 'Cancelled' | 'Expired';
}

export interface LabelConfig {
  size: '50x25' | '38x25' | '100x50' | 'a4_sheet';
  showStoreName: boolean;
  showProductName: boolean;
  showSku: boolean;
  showBarcode: boolean;
  showMrp: boolean;
  showOfferPrice: boolean;
  showPackedDate: boolean;
  barcodeType: 'CODE128' | 'EAN13' | 'QR';
  customTagline: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  costPrice: number;
  purchasePrice?: number;
  sellingPrice: number;
  price?: number;
  wholesalePrice?: number;
  currentStock: number;
  stock?: number;
  minStockAlert: number;
  unit: string;
  isService?: boolean;
  gstRate?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  outstandingBalance: number;
  creditLimit?: number;
  gstin?: string;
  gstNumber?: string;
  type?: 'retail' | 'wholesale';
  customerGroup?: 'Retail' | 'Wholesale' | 'VIP';
  lastTransactionDate?: string;
}

export interface InvoiceItem {
  id?: string;
  productId?: string;
  productName?: string;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  gstRate?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate?: string;
  createdAt?: string;
  customerId?: string;
  customerName?: string;
  customer?: { id: string; name: string; phone?: string };
  subTotal: number;
  taxAmount: number;
  discountAmount?: number;
  grandTotal?: number;
  totalAmount?: number;
  paidAmount: number;
  paymentMode?: string;
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'partial' | 'Paid' | 'Unpaid' | 'Partial';
  status?: 'Paid' | 'Partial' | 'Unpaid' | 'paid' | 'unpaid' | 'partial';
  items: InvoiceItem[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMode: string;
}

export interface BusinessProfile {
  name: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  upiId: string;
  currency: string;
}

export interface DashboardSummary {
  todayRevenue: number;
  todayGrossProfit: number;
  monthRevenue: number;
  monthExpense: number;
  totalReceivables: number;
  totalPayables: number;
  lowStockCount: number;
  todayOrdersCount: number;
  weeklySalesTrend: { day: string; sales: number }[];
  recentSales: { id: string; invoiceNumber: string; customerName: string; amount: number; paymentMode: string; date: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
