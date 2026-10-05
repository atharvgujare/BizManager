import React, { useState } from 'react';
import { Invoice, BusinessProfile } from '../types';
import { 
  FileText, Search, Printer, Share2, CheckCircle2,
  X, Eye
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface InvoiceMasterViewProps {
  invoices: Invoice[];
  business: BusinessProfile;
  currency?: string;
  uiMode?: UiMode;
}

export const InvoiceMasterView: React.FC<InvoiceMasterViewProps> = ({
  invoices,
  business,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'partial'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const getCustName = (inv: Invoice) => inv.customerName || inv.customer?.name || 'Walk-in Customer';
  const getTotal = (inv: Invoice) => inv.grandTotal ?? inv.totalAmount ?? 0;
  const getStatus = (inv: Invoice) => (inv.status || inv.paymentStatus || 'Paid').toLowerCase();
  const getPayMode = (inv: Invoice) => inv.paymentMode || inv.paymentMethod || 'Cash';
  const getDate = (inv: Invoice) => inv.createdAt || inv.issueDate || new Date().toISOString();

  const filtered = invoices.filter(inv => {
    const cust = getCustName(inv);
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cust.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || getStatus(inv) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + getTotal(inv), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount ?? 0), 0);
  const totalDue = Math.max(0, totalBilled - totalPaid);

  const handlePrintSlip = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowSlipModal(true);
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    const cust = getCustName(inv);
    const total = getTotal(inv);
    const status = getStatus(inv);
    const text = `Invoice from ${business.name}%0ANo: ${inv.invoiceNumber}%0ACustomer: ${cust}%0ATotal: Rs.${total}%0AStatus: ${status.toUpperCase()}%0AThank you for shopping with us!`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Unified Header */}
      <PageHeader
        title="Invoice Master"
        subtitle="Inspect historical invoices, tax breakdowns, download thermal receipts, and share payment reminders."
        badge="GST & Thermal Billing Records"
        icon={FileText}
        classicGradient="from-blue-700 via-indigo-700 to-indigo-900"
        uiMode={uiMode}
        stats={[
          { label: 'Total Bills', value: invoices.length },
          { label: 'Collected', value: `${currency}${totalPaid.toLocaleString()}` },
          { label: 'Pending Due', value: `${currency}${totalDue.toLocaleString()}`, isHighlight: totalDue > 0 }
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Bill No or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'paid', 'unpaid', 'partial'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                statusFilter === status 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Mode</th>
                <th className="py-4 px-4 text-right">Tax</th>
                <th className="py-4 px-4 text-right">Grand Total</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(inv => {
                const total = getTotal(inv);
                const cust = getCustName(inv);
                const status = getStatus(inv);
                const mode = getPayMode(inv);
                const dateStr = getDate(inv);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(dateStr).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {cust}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
                        {mode}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500 font-medium">
                      {currency}{inv.taxAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-slate-900 text-base">
                      {currency}{total.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : status === 'unpaid'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handlePrintSlip(inv)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition"
                          title="View Thermal Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(inv)}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thermal Receipt Preview Modal */}
      {showSlipModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowSlipModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Thermal Bill Container */}
            <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50 font-mono text-xs text-slate-800 space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <p className="font-extrabold text-base uppercase tracking-wider">{business.name}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">{business.address}</p>
                <p className="text-slate-500 text-[10px]">GSTIN: {business.gstin}</p>
                <p className="text-slate-500 text-[10px]">Tel: {business.phone}</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bill No:</span>
                  <span className="font-bold">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span>{new Date(getDate(selectedInvoice)).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold">{getCustName(selectedInvoice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="uppercase font-bold text-indigo-700">{getPayMode(selectedInvoice)}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
                  <span>Item</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[130px]">{item.itemName || item.productName || 'Item'}</span>
                    <span className="w-12 text-center">x{item.quantity}</span>
                    <span className="text-right font-medium">{currency}{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>{currency}{selectedInvoice.subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax:</span>
                  <span>{currency}{selectedInvoice.taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-slate-300 pt-1.5">
                  <span>TOTAL:</span>
                  <span>{currency}{getTotal(selectedInvoice)}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                <p>Thank you for your visit!</p>
                <p className="font-sans font-semibold text-slate-700 mt-1">Computer Generated Tax Invoice</p>
              </div>
            </div>

            <div className="mt-5 flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/25"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Slip</span>
              </button>
              <button
                onClick={() => handleShareWhatsApp(selectedInvoice)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/25"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
