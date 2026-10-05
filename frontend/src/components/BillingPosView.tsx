import React, { useState } from 'react';
import {
  Search,
  ScanBarcode,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle,
  QrCode,
  CreditCard,
  Banknote,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, CartItem, Customer } from '../types';

interface BillingPosViewProps {
  products: Product[];
  customers: Customer[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onClearCart: () => void;
  onCompleteSale: (
    customerId: string | null,
    paymentMode: string,
    discount: number,
    tax: number
  ) => Promise<boolean>;
  currency: string;
}

const CATEGORIES = ['All Items', 'Electronics', 'Beverages', 'Services', 'General'];

export const BillingPosView: React.FC<BillingPosViewProps> = ({
  products,
  customers,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onClearCart,
  onCompleteSale,
  currency,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Items');
  const [isCheckoutModal, setIsCheckoutModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState('UPI / QR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search));
    const matchesCat = selectedCat === 'All Items' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const gstAmount = +(cartSubtotal * 0.05).toFixed(2);
  const grandTotal = +(cartSubtotal + gstAmount).toFixed(2);

  const handleChargeAndPrint = async () => {
    setIsSubmitting(true);
    const success = await onCompleteSale(selectedCustomerId, paymentMode, 0, gstAmount);
    setIsSubmitting(false);

    if (success) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
      setIsCheckoutModal(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 animate-in fade-in duration-200">
      {/* Product Catalog & Search Column */}
      <div className="flex-1 space-y-4">
        {/* Search & Barcode Bar */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 px-3.5 py-2.5 flex items-center gap-2.5 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items by name, barcode or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs md:text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (products.length > 0) {
                onAddToCart(products[0]);
              }
            }}
            title="Simulate Barcode Scan"
            className="w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center transition shadow-sm shadow-blue-500/20"
          >
            <ScanBarcode className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid (Blinkit / Flipkart Grocery style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const inCart = cart.find((c) => c.product.id === item.id);
            const isLow = !item.isService && item.currentStock <= item.minStockAlert;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between card-hover"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.isService ? 'Service' : `${item.currentStock} ${item.unit} left`}
                    </span>
                    {isLow && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Low
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs md:text-sm line-clamp-2 min-h-[34px]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                  <div className="font-black text-slate-900 text-sm md:text-base">
                    {currency}{item.sellingPrice.toFixed(0)}
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-1 py-0.5">
                      <button
                        onClick={() => onUpdateCartQty(item.id, inCart.quantity - 1)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-blue-600 px-1">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartQty(item.id, inCart.quantity + 1)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 text-xs font-extrabold transition"
                    >
                      + ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary Panel (Side panel on Desktop, Floating Bottom Bar on Mobile) */}
      <div className="w-full lg:w-80 lg:sticky lg:top-20 h-fit bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-sm">Current Bill</h3>
            <span className="text-xs text-slate-400 font-medium">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          {cartCount > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-rose-500 font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Cart Items Scroll */}
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto my-3 pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              Cart is empty. Tap <strong className="text-blue-600">+ ADD</strong> on items!
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.product.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {item.quantity} x {currency}{item.product.sellingPrice.toFixed(0)}
                  </div>
                </div>
                <div className="font-extrabold text-slate-900 text-xs">
                  {currency}{(item.quantity * item.product.sellingPrice).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Total Calculations */}
        <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">{currency}{cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>GST / Tax (5%)</span>
            <span className="font-bold text-slate-800">+{currency}{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Grand Total</span>
            <span className="text-emerald-600 text-base">{currency}{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => setIsCheckoutModal(true)}
          disabled={cartCount === 0}
          className={`w-full mt-4 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition ${
            cartCount > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Pay {currency}{grandTotal.toFixed(2)} &amp; Print</span>
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-lg">Complete Bill Checkout</h3>
              <button
                onClick={() => setIsCheckoutModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Pill */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center mb-4">
              <div className="text-xs font-bold text-blue-600 uppercase">Amount to Charge</div>
              <div className="text-3xl font-black text-blue-900 mt-1">
                {currency}{grandTotal.toFixed(2)}
              </div>
            </div>

            {/* Customer Account Picker */}
            <div className="mb-4">
              <label className="block text-xs font-extrabold text-slate-500 mb-1.5">
                Customer Account:
              </label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(e.target.value || null)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="">Walk-in Cash Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} — Balance: {currency}
                    {Math.abs(c.outstandingBalance).toFixed(0)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-slate-500 mb-1.5">
                Payment Tender:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'UPI / QR', icon: QrCode },
                  { name: 'Cash', icon: Banknote },
                  { name: 'Card', icon: CreditCard },
                  { name: 'Credit', icon: BookOpen },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMode === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setPaymentMode(m.name)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Print & Charge Button */}
            <button
              onClick={handleChargeAndPrint}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition"
            >
              {isSubmitting ? (
                <span>Generating Bill...</span>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Charge &amp; Print Bill ({currency}{grandTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
