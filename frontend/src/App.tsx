import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserRole, UiMode, MasterViewType, Product, Customer, Invoice, Expense, BusinessProfile, CartItem, DashboardSummary,
  Supplier, Branch, StockTransfer, OnlineOrder, ServiceTicket
} from './types';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BillingPosView } from './components/BillingPosView';
import { CustomerMasterView } from './components/CustomerMasterView';
import { ProductsMasterView } from './components/ProductsMasterView';
import { StockMasterView } from './components/StockMasterView';
import { InvoiceMasterView } from './components/InvoiceMasterView';
import { AnalysisBiView } from './components/AnalysisBiView';
import { RoleBasedAccessView } from './components/RoleBasedAccessView';
import { SettingsView } from './components/SettingsView';
import { BarcodeDesignerMasterView } from './components/BarcodeDesignerMasterView';
import { GstComplianceMasterView } from './components/GstComplianceMasterView';
import { SupplierMasterView } from './components/SupplierMasterView';
import { BranchMasterView } from './components/BranchMasterView';
import { AiReorderMasterView } from './components/AiReorderMasterView';
import { OnlineDukanMasterView } from './components/OnlineDukanMasterView';
import { WarrantyServiceMasterView } from './components/WarrantyServiceMasterView';
import { HeaderBar } from './components/HeaderBar';
import { AuthModal } from './components/AuthModal';
import { api } from './api';

const INITIAL_BUSINESS: BusinessProfile = {
  name: 'Shree Shyam Supermart & General Stores',
  gstin: '07AAAAA0000A1Z5',
  phone: '+91 98765 43210',
  email: 'support@shreeshyam.in',
  address: 'Shop 12-14, Main Market, MG Road, New Delhi 110001',
  upiId: 'shreeshyam@okaxis',
  currency: '₹'
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tata Tea Gold Premium 500g',
    sku: 'BEV-TEA-001',
    barcode: '8901030381018',
    category: 'Beverages',
    sellingPrice: 310,
    price: 310,
    costPrice: 250,
    purchasePrice: 250,
    wholesalePrice: 280,
    currentStock: 45,
    stock: 45,
    minStockAlert: 10,
    unit: 'pkts',
    isService: false,
    gstRate: 5
  },
  {
    id: 'p2',
    name: 'Fortune Sunlite Sunflower Oil 1L',
    sku: 'OIL-SUN-002',
    barcode: '8906007281023',
    category: 'General',
    sellingPrice: 155,
    price: 155,
    costPrice: 125,
    purchasePrice: 125,
    wholesalePrice: 140,
    currentStock: 8,
    stock: 8,
    minStockAlert: 15,
    unit: 'pouches',
    isService: false,
    gstRate: 5
  },
  {
    id: 'p3',
    name: 'Aashirvaad Shudh Chakki Atta 10kg',
    sku: 'FLR-ATT-003',
    barcode: '8901030383043',
    category: 'General',
    sellingPrice: 460,
    price: 460,
    costPrice: 385,
    purchasePrice: 385,
    wholesalePrice: 420,
    currentStock: 28,
    stock: 28,
    minStockAlert: 8,
    unit: 'bags',
    isService: false,
    gstRate: 0
  },
  {
    id: 'p4',
    name: 'Cadbury Dairy Milk Silk 150g',
    sku: 'CNF-DRY-004',
    barcode: '8901233024881',
    category: 'General',
    sellingPrice: 180,
    price: 180,
    costPrice: 135,
    purchasePrice: 135,
    wholesalePrice: 160,
    currentStock: 4,
    stock: 4,
    minStockAlert: 12,
    unit: 'bars',
    isService: false,
    gstRate: 18
  },
  {
    id: 'p5',
    name: 'Surf Excel Quick Wash Detergent 2kg',
    sku: 'CLN-SRF-005',
    barcode: '8901030702110',
    category: 'General',
    sellingPrice: 395,
    price: 395,
    costPrice: 320,
    purchasePrice: 320,
    wholesalePrice: 360,
    currentStock: 35,
    stock: 35,
    minStockAlert: 10,
    unit: 'pkts',
    isService: false,
    gstRate: 18
  },
  {
    id: 'p6',
    name: 'Philips LED Bulb 9W Cool Day White',
    sku: 'ELC-LED-006',
    barcode: '8901030999011',
    category: 'Electronics',
    sellingPrice: 120,
    price: 120,
    costPrice: 85,
    purchasePrice: 85,
    wholesalePrice: 100,
    currentStock: 60,
    stock: 60,
    minStockAlert: 15,
    unit: 'pcs',
    isService: false,
    gstRate: 18
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Rajesh Sharma (Wholesale Trader)',
    phone: '+91 98111 22334',
    outstandingBalance: 12500,
    creditLimit: 50000,
    gstNumber: '07ABCDE1234F1Z5',
    gstin: '07ABCDE1234F1Z5',
    customerGroup: 'Wholesale',
    type: 'wholesale',
    lastTransactionDate: '2026-10-02T14:30:00Z'
  },
  {
    id: 'c2',
    name: 'Pooja Verma',
    phone: '+91 98222 33445',
    outstandingBalance: 0,
    creditLimit: 5000,
    customerGroup: 'Retail',
    type: 'retail',
    lastTransactionDate: '2026-10-03T11:15:00Z'
  },
  {
    id: 'c3',
    name: 'Sunil Kumar (Khatabook Regular)',
    phone: '+91 99333 44556',
    outstandingBalance: 1850,
    creditLimit: 10000,
    customerGroup: 'Retail',
    type: 'retail',
    lastTransactionDate: '2026-09-30T17:45:00Z'
  },
  {
    id: 'c4',
    name: 'Anjali Dairy & Sweets',
    phone: '+91 97444 55667',
    outstandingBalance: -4500,
    creditLimit: 80000,
    gstNumber: '07DEFGH5678J2Z9',
    gstin: '07DEFGH5678J2Z9',
    customerGroup: 'VIP',
    type: 'wholesale',
    lastTransactionDate: '2026-10-01T09:20:00Z'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    customerId: 'c1',
    customerName: 'Rajesh Sharma',
    customer: { id: 'c1', name: 'Rajesh Sharma', phone: '+91 98111 22334' },
    subTotal: 8450,
    taxAmount: 422,
    discountAmount: 200,
    grandTotal: 8672,
    totalAmount: 8672,
    paidAmount: 8672,
    paymentMode: 'UPI',
    paymentMethod: 'upi',
    status: 'Paid',
    paymentStatus: 'paid',
    createdAt: '2026-10-02T14:30:00Z',
    issueDate: '2026-10-02T14:30:00Z',
    items: [
      { id: 'item-1', itemName: 'Tata Tea Gold Premium 500g', productName: 'Tata Tea Gold Premium 500g', quantity: 15, unitPrice: 280, totalPrice: 4200, gstRate: 5 },
      { id: 'item-2', itemName: 'Aashirvaad Shudh Chakki Atta 10kg', productName: 'Aashirvaad Shudh Chakki Atta 10kg', quantity: 10, unitPrice: 420, totalPrice: 4200, gstRate: 0 }
    ]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-002',
    customerId: 'c2',
    customerName: 'Pooja Verma',
    customer: { id: 'c2', name: 'Pooja Verma', phone: '+91 98222 33445' },
    subTotal: 1245,
    taxAmount: 85,
    discountAmount: 0,
    grandTotal: 1330,
    totalAmount: 1330,
    paidAmount: 1330,
    paymentMode: 'Cash',
    paymentMethod: 'cash',
    status: 'Paid',
    paymentStatus: 'paid',
    createdAt: '2026-10-03T11:15:00Z',
    issueDate: '2026-10-03T11:15:00Z',
    items: [
      { id: 'item-3', itemName: 'Surf Excel Quick Wash 2kg', productName: 'Surf Excel Quick Wash 2kg', quantity: 2, unitPrice: 395, totalPrice: 790, gstRate: 18 }
    ]
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-003',
    customerId: 'c3',
    customerName: 'Sunil Kumar',
    customer: { id: 'c3', name: 'Sunil Kumar', phone: '+91 99333 44556' },
    subTotal: 1850,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: 1850,
    totalAmount: 1850,
    paidAmount: 0,
    paymentMode: 'Credit (Khata)',
    paymentMethod: 'credit',
    status: 'Unpaid',
    paymentStatus: 'unpaid',
    createdAt: '2026-10-03T16:20:00Z',
    issueDate: '2026-10-03T16:20:00Z',
    items: [
      { id: 'item-4', itemName: 'Aashirvaad Shudh Chakki Atta 10kg', productName: 'Aashirvaad Shudh Chakki Atta 10kg', quantity: 4, unitPrice: 460, totalPrice: 1840, gstRate: 0 }
    ]
  }
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', title: 'Shop Electricity Bill Oct', amount: 4800, category: 'Utilities', date: '2026-10-01', paymentMode: 'upi' },
  { id: 'exp-2', title: 'Commercial Shop Rent', amount: 22000, category: 'Rent', date: '2026-10-01', paymentMode: 'bank_transfer' },
  { id: 'exp-3', title: 'Godown Helper Daily Wages', amount: 850, category: 'Salary', date: '2026-10-02', paymentMode: 'cash' },
  { id: 'exp-4', title: 'Tea & Snacks for Customers (Kharcha)', amount: 240, category: 'Office Supplies', date: '2026-10-03', paymentMode: 'cash' }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Rakesh Agarwal',
    companyName: 'Hindustan Unilever Distribution',
    phone: '+91 98123 45678',
    email: 'delhi.orders@hul.com',
    gstin: '07AAACH1234F1Z1',
    category: 'Personal & Home Care',
    pendingPayment: 42500,
    paymentTerms: 'Net 15 Days',
    address: 'Plot 45, Okhla Phase III, New Delhi 110020'
  },
  {
    id: 'sup-2',
    name: 'Manish Chawla',
    companyName: 'Tata Consumer Products Ltd',
    phone: '+91 98234 56789',
    email: 'supplies@tataconsumer.com',
    gstin: '07AAACT9876K1Z3',
    category: 'Beverages',
    pendingPayment: 18000,
    paymentTerms: 'Net 7 Days',
    address: 'Godown 12, Sanjay Gandhi Transport Nagar, Delhi'
  },
  {
    id: 'sup-3',
    name: 'Deepak Singhal',
    companyName: 'Adani Wilmar Direct Wholesaler',
    phone: '+91 99345 67890',
    gstin: '07AAACA4567B1Z8',
    category: 'Groceries & Staples',
    pendingPayment: 68400,
    paymentTerms: 'Net 30 Days',
    address: 'Shop 88, Khari Baoli Spice Market, Old Delhi'
  }
];

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-1',
    name: 'CP Flagship Supermart',
    code: 'DEL-CP-01',
    type: 'Store',
    address: 'Block B, Connaught Place',
    city: 'New Delhi',
    phone: '+91 98765 11111',
    managerName: 'Vikram Batra',
    totalStockUnits: 2450
  },
  {
    id: 'br-2',
    name: 'Central Godown & Dispatch Hub',
    code: 'DEL-OKH-02',
    type: 'Godown',
    address: 'Industrial Area Phase 2, Okhla',
    city: 'New Delhi',
    phone: '+91 98765 22222',
    managerName: 'Sunil Mathur',
    totalStockUnits: 18200
  },
  {
    id: 'br-3',
    name: 'Noida Sector 18 Express',
    code: 'UP-NOI-03',
    type: 'Store',
    address: 'Atta Market, Sector 18',
    city: 'Noida',
    phone: '+91 98765 33333',
    managerName: 'Kavita Singh',
    totalStockUnits: 1840
  }
];

const INITIAL_TRANSFERS: StockTransfer[] = [
  {
    id: 'trf-1',
    transferNumber: 'TRF-2026-001',
    fromBranch: 'Central Godown & Dispatch Hub',
    toBranch: 'CP Flagship Supermart',
    date: '2026-10-02T16:00:00Z',
    status: 'Received',
    totalUnits: 150,
    vehicleNumber: 'DL 1AA 8821',
    items: [{ productId: 'p1', productName: 'Tata Tea Gold Premium 500g', quantity: 150 }]
  },
  {
    id: 'trf-2',
    transferNumber: 'TRF-2026-002',
    fromBranch: 'Central Godown & Dispatch Hub',
    toBranch: 'Noida Sector 18 Express',
    date: '2026-10-03T11:30:00Z',
    status: 'In Transit',
    totalUnits: 80,
    vehicleNumber: 'UP 16 BT 9920',
    items: [{ productId: 'p5', productName: 'Surf Excel Quick Wash 2kg', quantity: 80 }]
  }
];

const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'DKN-2026-881',
    customerName: 'Anil Kapoor',
    customerPhone: '+91 98111 88990',
    deliveryAddress: 'Flat 402, Royal Residency, Barakhamba Road',
    totalAmount: 930,
    paymentMode: 'UPI Online',
    paymentStatus: 'Paid',
    orderStatus: 'Packing',
    createdAt: '2026-10-03T17:15:00Z',
    items: [
      { productName: 'Tata Tea Gold Premium 500g', quantity: 1, price: 310 },
      { productName: 'Aashirvaad Shudh Chakki Atta 10kg', quantity: 1, price: 460 },
      { productName: 'Amul Butter Salted 500g', quantity: 1, price: 275 }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'DKN-2026-882',
    customerName: 'Meenakshi Iyer',
    customerPhone: '+91 98222 77889',
    deliveryAddress: 'House 14, Sector 15A, Noida',
    totalAmount: 550,
    paymentMode: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'New',
    createdAt: '2026-10-03T18:05:00Z',
    items: [
      { productName: 'Cadbury Dairy Milk Silk 150g', quantity: 2, price: 180 },
      { productName: 'Philips LED Bulb 9W', quantity: 1, price: 120 }
    ]
  }
];

const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  {
    id: 'srv-1',
    ticketNumber: 'SRV-2026-001',
    customerName: 'Rohan Mehra',
    customerPhone: '+91 98111 44556',
    productName: 'Philips Mixer Grinder 750W',
    brand: 'Philips',
    serialNumber: 'SN-MXG-88219',
    issueDescription: 'Motor vibrating excessively and burning smell on speed 3',
    warrantyStatus: 'In Warranty',
    estimatedCost: 0,
    advancePaid: 0,
    status: 'Repairing',
    createdAt: '2026-10-02T10:00:00Z',
    deliveryOtp: '4892'
  },
  {
    id: 'srv-2',
    ticketNumber: 'SRV-2026-002',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98222 55667',
    productName: 'Samsung Microwave Oven 28L',
    brand: 'Samsung',
    serialNumber: 'IMEI-SVO-99120',
    issueDescription: 'Heating plate not rotating, display panel buttons sticky',
    warrantyStatus: 'Out of Warranty',
    estimatedCost: 1200,
    advancePaid: 400,
    status: 'Ready for Delivery',
    createdAt: '2026-10-01T15:30:00Z',
    deliveryOtp: '7103'
  }
];

export const App: React.FC = () => {
  const [uiMode, setUiMode] = useState<UiMode>(() => {
    return (localStorage.getItem('biz_ui_mode') as UiMode) || 'apple';
  });
  const [activeView, setActiveView] = useState<MasterViewType>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('biz_role') as UserRole) || 'Admin';
  });
  const [userEmail, setUserEmail] = useState<string>('admin@dukan.in');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('biz_ui_mode', uiMode);
  }, [uiMode]);

  useEffect(() => {
    localStorage.setItem('biz_role', currentRole);
  }, [currentRole]);

  // Core Data Stores
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 5 New Enterprise Modules Stores
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [transfers, setTransfers] = useState<StockTransfer[]>(INITIAL_TRANSFERS);
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>(INITIAL_ONLINE_ORDERS);
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(INITIAL_SERVICE_TICKETS);

  // Fetch initial data from C# ASP.NET Core API
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const [apiProds, apiCusts] = await Promise.all([
          api.getProducts().catch(() => null),
          api.getCustomers().catch(() => null)
        ]);

        if (apiProds && Array.isArray(apiProds) && apiProds.length > 0) {
          const mappedProds: Product[] = apiProds.map((p: any) => ({
            id: p.id || p.productId || `p-${Math.random()}`,
            name: p.name || 'Product',
            sku: p.sku || 'SKU-001',
            barcode: p.barcode || '',
            category: p.category || 'General',
            sellingPrice: Number(p.price || p.sellingPrice || 100),
            price: Number(p.price || p.sellingPrice || 100),
            costPrice: Number(p.costPrice || p.purchasePrice || 80),
            purchasePrice: Number(p.costPrice || p.purchasePrice || 80),
            wholesalePrice: Number(p.wholesalePrice || (p.price || 100) * 0.9),
            currentStock: Number(p.stockQuantity ?? p.stock ?? p.currentStock ?? 10),
            stock: Number(p.stockQuantity ?? p.stock ?? p.currentStock ?? 10),
            minStockAlert: Number(p.minStockAlert || 5),
            unit: p.unit || 'pcs',
            isService: Boolean(p.isService),
            gstRate: Number(p.gstRate || 0)
          }));
          setProducts(mappedProds);
        }

        if (apiCusts && Array.isArray(apiCusts) && apiCusts.length > 0) {
          const mappedCusts: Customer[] = apiCusts.map((c: any) => ({
            id: c.id || c.customerId || `c-${Math.random()}`,
            name: c.name || 'Customer',
            phone: c.phone || '',
            outstandingBalance: Number(c.outstandingBalance || 0),
            creditLimit: Number(c.creditLimit || 20000),
            gstin: c.gstin || '',
            gstNumber: c.gstin || '',
            customerGroup: c.customerType === 'wholesale' ? 'Wholesale' : 'Retail',
            type: c.customerType === 'wholesale' ? 'wholesale' : 'retail',
            lastTransactionDate: c.lastTransactionDate || new Date().toISOString()
          }));
          setCustomers(mappedCusts);
        }
      } catch (err) {
        console.warn('API Seed check:', err);
      }
    };
    syncBackend();
  }, []);

  // Live Summary for Dashboard
  const summary: DashboardSummary = useMemo(() => {
    const todayRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal ?? inv.totalAmount ?? 0), 0);
    const todayGrossProfit = Math.round(todayRevenue * 0.32);
    const lowStockCount = products.filter(p => (p.currentStock ?? p.stock ?? 0) <= p.minStockAlert).length;
    const totalReceivables = customers.reduce((sum, c) => c.outstandingBalance > 0 ? sum + c.outstandingBalance : sum, 0);
    const totalPayables = customers.reduce((sum, c) => c.outstandingBalance < 0 ? sum + Math.abs(c.outstandingBalance) : sum, 0);

    return {
      todayRevenue,
      todayGrossProfit,
      monthRevenue: todayRevenue * 12.5,
      monthExpense: 27890,
      totalReceivables,
      totalPayables,
      lowStockCount,
      todayOrdersCount: invoices.length,
      weeklySalesTrend: [
        { day: 'Mon', sales: 12400 },
        { day: 'Tue', sales: 18200 },
        { day: 'Wed', sales: 14500 },
        { day: 'Thu', sales: 22100 },
        { day: 'Fri', sales: 19800 },
        { day: 'Sat', sales: 31200 },
        { day: 'Sun', sales: 28400 }
      ],
      recentSales: invoices.slice(0, 5).map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName || inv.customer?.name || 'Walk-in',
        amount: inv.grandTotal ?? inv.totalAmount ?? 0,
        paymentMode: inv.paymentMode || inv.paymentMethod || 'Cash',
        date: inv.createdAt || inv.issueDate || 'Today'
      }))
    };
  }, [invoices, products, customers]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const handleClearCart = () => setCart([]);

  const handleCompleteSale = async (
    customerId: string | null,
    paymentMode: string,
    discount: number,
    tax: number
  ): Promise<boolean> => {
    const subTotal = cart.reduce(
      (sum, item) => sum + (item.product.sellingPrice ?? item.product.price ?? 0) * item.quantity,
      0
    );
    const grandTotal = Math.max(0, subTotal + tax - discount);
    const selectedCust = customers.find(c => c.id === customerId);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      customerId: customerId || undefined,
      customerName: selectedCust ? selectedCust.name : 'Walk-in Customer',
      customer: selectedCust ? { id: selectedCust.id, name: selectedCust.name, phone: selectedCust.phone } : undefined,
      subTotal,
      taxAmount: tax,
      discountAmount: discount,
      grandTotal,
      totalAmount: grandTotal,
      paidAmount: paymentMode === 'credit' ? 0 : grandTotal,
      paymentMode,
      paymentMethod: paymentMode,
      status: paymentMode === 'credit' ? 'Unpaid' : 'Paid',
      paymentStatus: paymentMode === 'credit' ? 'unpaid' : 'paid',
      createdAt: new Date().toISOString(),
      issueDate: new Date().toISOString(),
      items: cart.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: item.product.id,
        itemName: item.product.name,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice ?? item.product.price ?? 0,
        totalPrice: (item.product.sellingPrice ?? item.product.price ?? 0) * item.quantity,
        gstRate: item.product.gstRate || 0
      }))
    };

    // Update invoices
    setInvoices(prev => [newInvoice, ...prev]);

    // Deduct stock
    setProducts(prev => {
      const updated = [...prev];
      cart.forEach(c => {
        const p = updated.find(x => x.id === c.product.id);
        if (p) {
          const current = p.currentStock ?? p.stock ?? 0;
          p.currentStock = Math.max(0, current - c.quantity);
          p.stock = p.currentStock;
        }
      });
      return updated;
    });

    // If Khata credit, increase customer balance
    if (customerId && paymentMode.toLowerCase().includes('credit')) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === customerId ? { ...c, outstandingBalance: c.outstandingBalance + grandTotal } : c
        )
      );
    }

    handleClearCart();
    return true;
  };

  // Product Add / Stock Update
  const handleAddProduct = async (data: Partial<Product>): Promise<boolean> => {
    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: data.name || 'New Product',
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: data.barcode || '',
      category: data.category || 'General',
      sellingPrice: Number(data.sellingPrice || data.price || 0),
      price: Number(data.sellingPrice || data.price || 0),
      costPrice: Number(data.costPrice || data.purchasePrice || 0),
      purchasePrice: Number(data.costPrice || data.purchasePrice || 0),
      wholesalePrice: Number(data.wholesalePrice || (data.sellingPrice || 0) * 0.9),
      currentStock: Number(data.currentStock || data.stock || 10),
      stock: Number(data.currentStock || data.stock || 10),
      minStockAlert: Number(data.minStockAlert || 5),
      unit: data.unit || 'pcs',
      isService: Boolean(data.isService),
      gstRate: Number(data.gstRate || 0)
    };
    setProducts(prev => [newProd, ...prev]);
    return true;
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, currentStock: newStock, stock: newStock } : p
      )
    );
  };

  // Customer Add / Balance Update
  const handleAddCustomer = async (data: Partial<Customer>): Promise<boolean> => {
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name: data.name || 'New Customer',
      phone: data.phone || '',
      email: data.email || '',
      outstandingBalance: Number(data.outstandingBalance || 0),
      creditLimit: Number(data.creditLimit || 20000),
      gstin: data.gstin || data.gstNumber || '',
      gstNumber: data.gstin || data.gstNumber || '',
      customerGroup: data.customerGroup || 'Retail',
      type: data.customerGroup === 'Wholesale' ? 'wholesale' : 'retail',
      lastTransactionDate: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    return true;
  };

  const handleReceivePayment = async (customerId: string, amount: number): Promise<boolean> => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId ? { ...c, outstandingBalance: c.outstandingBalance - amount } : c
      )
    );
    return true;
  };

  // Supplier & Inward Handlers
  const handleAddSupplier = (sup: Omit<Supplier, 'id'>) => {
    const created: Supplier = { ...sup, id: `sup-${Date.now()}` };
    setSuppliers(prev => [created, ...prev]);
  };

  const handlePaySupplier = (supplierId: string, amount: number) => {
    setSuppliers(prev =>
      prev.map(s =>
        s.id === supplierId ? { ...s, pendingPayment: Math.max(0, s.pendingPayment - amount) } : s
      )
    );
  };

  const handlePurchaseInward = (
    supplierId: string,
    items: { productId: string; qty: number; cost: number }[],
    _billNo: string
  ) => {
    const totalBill = items.reduce((sum, i) => sum + i.qty * i.cost, 0);
    // Increase supplier due
    setSuppliers(prev =>
      prev.map(s =>
        s.id === supplierId ? { ...s, pendingPayment: s.pendingPayment + totalBill } : s
      )
    );
    // Increase stock for items
    setProducts(prev => {
      const updated = [...prev];
      items.forEach(item => {
        const prod = updated.find(p => p.id === item.productId);
        if (prod) {
          const current = prod.currentStock ?? prod.stock ?? 0;
          prod.currentStock = current + item.qty;
          prod.stock = prod.currentStock;
          prod.costPrice = item.cost;
        }
      });
      return updated;
    });
  };

  // Branch & Transfer Handlers
  const handleAddBranch = (b: Omit<Branch, 'id'>) => {
    const created: Branch = { ...b, id: `br-${Date.now()}` };
    setBranches(prev => [...prev, created]);
  };

  const handleCreateTransfer = (t: Omit<StockTransfer, 'id'>) => {
    const created: StockTransfer = { ...t, id: `trf-${Date.now()}` };
    setTransfers(prev => [created, ...prev]);
  };

  // Online Orders Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OnlineOrder['orderStatus']) => {
    setOnlineOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  // Warranty / Service Ticket Handlers
  const handleAddServiceTicket = (
    ticket: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'deliveryOtp' | 'createdAt'>
  ) => {
    const created: ServiceTicket = {
      ...ticket,
      id: `srv-${Date.now()}`,
      ticketNumber: `SRV-2026-${String(serviceTickets.length + 1).padStart(3, '0')}`,
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      createdAt: new Date().toISOString()
    };
    setServiceTickets(prev => [created, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: ServiceTicket['status']) => {
    setServiceTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex ${
      uiMode === 'apple' ? 'bg-[#f8fafc] text-slate-900' : 'bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white'
    }`}>
      {/* Permanent Left Sidebar (in BOTH Classic and Clean Minimal modes) */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={() => setShowAuthModal(true)}
        uiMode={uiMode}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top HeaderBar with Mode Switcher [🏛️ Classic | ✨ Clean Minimal], Breadcrumb Title, Role Switcher, Quick Make Bill */}
        <HeaderBar
          businessName={business.name}
          userName={userEmail}
          role={currentRole}
          activeView={activeView}
          uiMode={uiMode}
          onToggleUiMode={setUiMode}
          onSelectRole={setCurrentRole}
          onOpenPos={() => setActiveView('billing')}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* View Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              summary={summary}
              onNavigate={setActiveView}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'billing' && (
            <BillingPosView
              products={products}
              customers={customers}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onClearCart={handleClearCart}
              onCompleteSale={handleCompleteSale}
              currency={business.currency}
            />
          )}

          {activeView === 'customers' && (
            <CustomerMasterView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onReceivePayment={handleReceivePayment}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'products' && (
            <ProductsMasterView
              products={products}
              onAddProduct={handleAddProduct}
              role={currentRole}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'stock' && (
            <StockMasterView
              products={products}
              currentRole={currentRole}
              onUpdateStock={handleUpdateStock}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'invoices' && (
            <InvoiceMasterView
              invoices={invoices}
              business={business}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'analysis' && (
            <AnalysisBiView
              currentRole={currentRole}
              invoices={invoices}
              expenses={expenses}
              products={products}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'barcode' || activeView === 'barcode_designer') && (
            <BarcodeDesignerMasterView
              products={products}
              business={business}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'gst' || activeView === 'gst_compliance') && (
            <GstComplianceMasterView
              invoices={invoices}
              business={business}
              customers={customers}
              products={products}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'suppliers' || activeView === 'supplier_master') && (
            <SupplierMasterView
              suppliers={suppliers}
              products={products}
              onAddSupplier={handleAddSupplier}
              onPaySupplier={handlePaySupplier}
              onPurchaseInward={handlePurchaseInward}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'branches' || activeView === 'branch_master') && (
            <BranchMasterView
              branches={branches}
              transfers={transfers}
              products={products}
              onAddBranch={handleAddBranch}
              onCreateTransfer={handleCreateTransfer}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'ai_reorder' || activeView === 'reorder_master') && (
            <AiReorderMasterView
              products={products}
              currency={business.currency}
              onAutoPoGenerated={(supplierName, items) => {
                alert(`Generated PO for ${items[0].qty}x ${items[0].productName} to ${supplierName}`);
              }}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'online_dukan' || activeView === 'dukan_storefront') && (
            <OnlineDukanMasterView
              orders={onlineOrders}
              products={products}
              business={business}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {(activeView === 'warranties' || activeView === 'service_master') && (
            <WarrantyServiceMasterView
              tickets={serviceTickets}
              onAddTicket={handleAddServiceTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              currency={business.currency}
              uiMode={uiMode}
            />
          )}

          {activeView === 'roles' && (
            <RoleBasedAccessView
              currentRole={currentRole}
              onSelectRole={setCurrentRole}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              business={business}
              onUpdateBusiness={setBusiness}
            />
          )}
        </main>
      </div>

      {/* 1-Tap Sign-In Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(email, role) => {
          setUserEmail(email);
          setCurrentRole(role);
        }}
      />
    </div>
  );
};

export default App;
