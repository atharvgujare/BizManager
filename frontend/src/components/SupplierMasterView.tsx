import React, { useState } from 'react';
import { Supplier, Product, UiMode } from '../types';
import { 
  Building2, Search, Plus, Phone, ArrowUpRight, CheckCircle2,
  FileText, IndianRupee, X, Share2, ShieldCheck, Truck, Clock
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';

interface SupplierMasterViewProps {
  suppliers: Supplier[];
  products: Product[];
  onAddSupplier: (sup: Omit<Supplier, 'id'>) => void;
  onPaySupplier: (supplierId: string, amount: number) => void;
  onPurchaseInward: (supplierId: string, items: { productId: string; qty: number; cost: number }[], billNo: string) => void;
  currency?: string;
  uiMode?: UiMode;
}

export const SupplierMasterView: React.FC<SupplierMasterViewProps> = ({
  suppliers,
  products,
  onAddSupplier,
  onPaySupplier,
  onPurchaseInward,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDue, setFilterDue] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Supplier Form
  const [newSup, setNewSup] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    gstin: '',
    category: 'Groceries & Staples',
    pendingPayment: 0,
    paymentTerms: 'Net 15 Days',
    address: ''
  });

  // Purchase Inward Form
  const [inwardBillNo, setInwardBillNo] = useState('');
  const [inwardProductId, setInwardProductId] = useState(products[0]?.id || '');
  const [inwardQty, setInwardQty] = useState(50);
  const [inwardCost, setInwardCost] = useState(products[0]?.costPrice || 200);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = suppliers.filter(s => {
    const matchesSearch = s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.phone.includes(searchTerm);
    const matchesDue = filterDue ? s.pendingPayment > 0 : true;
    return matchesSearch && matchesDue;
  });

  const totalPayables = suppliers.reduce((sum, s) => sum + s.pendingPayment, 0);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupplier(newSup);
    setShowAddModal(false);
    setNewSup({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      gstin: '',
      category: 'Groceries & Staples',
      pendingPayment: 0,
      paymentTerms: 'Net 15 Days',
      address: ''
    });
    showToast('New Supplier / Vyapari Added Successfully!');
  };

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !payAmount) return;
    onPaySupplier(selectedSupplier.id, Number(payAmount));
    setShowPayModal(false);
    setPayAmount('');
    showToast(`Payment of ${currency}${payAmount} recorded for ${selectedSupplier.companyName}`);
  };

  const handleRecordInward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    onPurchaseInward(
      selectedSupplier.id,
      [{ productId: inwardProductId, qty: Number(inwardQty), cost: Number(inwardCost) }],
      inwardBillNo || `BILL-${Date.now().toString().slice(-4)}`
    );
    setShowInwardModal(false);
    showToast(`Stock Inward & Purchase Bill Recorded from ${selectedSupplier.companyName}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Header */}
      <PageHeader
        title="Supplier & Purchase Master"
        subtitle="Track supplier Udhar (You'll Give ₹), log wholesale purchase inward bills, and manage vendor contact directories."
        badge="Vyapari & Vendor Management"
        icon={Building2}
        classicGradient="from-rose-800 via-pink-800 to-indigo-900"
        uiMode={uiMode}
        stats={[
          { 
            label: 'Total Supplier Udhar (Payables)', 
            value: `${currency}${totalPayables.toLocaleString()}`, 
            isHighlight: totalPayables > 0 
          },
          { 
            label: 'Active Suppliers', 
            value: `${suppliers.length} Vendors` 
          }
        ]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
              uiMode === 'apple'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-white text-rose-900 hover:bg-rose-50 shadow-xl'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Supplier</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, vendor name, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition"
          />
        </div>

        <button
          onClick={() => setFilterDue(!filterDue)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            filterDue
              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {filterDue ? 'Showing Pending Due Only' : 'Show All Suppliers'}
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(supplier => {
          const hasDue = supplier.pendingPayment > 0;
          return (
            <div
              key={supplier.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-50 to-pink-50 border border-rose-200 text-rose-700 flex items-center justify-center font-black text-base shadow-inner">
                      {supplier.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {supplier.companyName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{supplier.name} • {supplier.category}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {supplier.paymentTerms}
                  </span>
                </div>

                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="font-mono text-slate-700 font-bold">{supplier.gstin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="text-slate-800 font-medium">{supplier.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address:</span>
                    <span className="text-slate-600 truncate max-w-[180px]">{supplier.address}</span>
                  </div>
                </div>

                {/* Balance Status */}
                <div className="mt-4 flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div>
                    <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">
                      YOU'LL GIVE (UDHAR)
                    </span>
                    <span className="text-xl font-black text-rose-700">
                      {currency}{supplier.pendingPayment.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const text = `Namaste ${supplier.name} ji, confirming our balance of Rs.${supplier.pendingPayment} from Shree Shyam Supermart.`;
                      window.open(`https://wa.me/${supplier.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="p-2.5 bg-white text-emerald-600 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition shadow-sm"
                    title="Send WhatsApp Balance Confirmation"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setShowInwardModal(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>+ Inward Stock</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setShowPayModal(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm shadow-rose-600/20"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Pay Udhar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Add Supplier / Vyapari</h2>
                <p className="text-xs text-slate-400">Record distributor details and purchase terms</p>
              </div>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    value={newSup.companyName}
                    onChange={(e) => setNewSup({ ...newSup, companyName: e.target.value })}
                    placeholder="e.g. Hindustan Unilever Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newSup.name}
                    onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                    placeholder="e.g. Rakesh Agarwal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    value={newSup.phone}
                    onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                    placeholder="+91 98123 45678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Supplier GSTIN</label>
                  <input
                    type="text"
                    value={newSup.gstin}
                    onChange={(e) => setNewSup({ ...newSup, gstin: e.target.value })}
                    placeholder="07AAAAA0000A1Z5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
                  <select
                    value={newSup.category}
                    onChange={(e) => setNewSup({ ...newSup, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value="Groceries & Staples">Groceries &amp; Staples</option>
                    <option value="Dairy & Beverages">Dairy &amp; Beverages</option>
                    <option value="Personal & Home Care">Personal &amp; Home Care</option>
                    <option value="Electronics & Hardware">Electronics &amp; Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Initial Opening Due ({currency})</label>
                  <input
                    type="number"
                    value={newSup.pendingPayment}
                    onChange={(e) => setNewSup({ ...newSup, pendingPayment: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Supplier Godown Address</label>
                <input
                  type="text"
                  value={newSup.address}
                  onChange={(e) => setNewSup({ ...newSup, address: e.target.value })}
                  placeholder="Plot 45, Okhla Phase III, New Delhi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-600/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Supplier to Master</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Udhar Modal */}
      {showPayModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Pay Supplier Udhar</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedSupplier.companyName}</p>

            <form onSubmit={handleMakePayment} className="space-y-4">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[10px] font-bold text-rose-500 uppercase">Current Pending Due</span>
                <p className="text-xl font-black text-rose-700">{currency}{selectedSupplier.pendingPayment.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Payment Amount ({currency})</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={`Max ${selectedSupplier.pendingPayment}`}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-600/25"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirm Payment to Supplier</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stock Inward Bill Modal */}
      {showInwardModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowInwardModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Purchase Inward Bill</h3>
            <p className="text-xs text-slate-500 mb-4">Stock arrival from {selectedSupplier.companyName}</p>

            <form onSubmit={handleRecordInward} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Vendor Bill / Invoice #</label>
                <input
                  type="text"
                  value={inwardBillNo}
                  onChange={(e) => setInwardBillNo(e.target.value)}
                  placeholder="e.g. HUL-2026-981"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Select Incoming Item</label>
                <select
                  value={inwardProductId}
                  onChange={(e) => setInwardProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock ?? p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Received Quantity</label>
                  <input
                    type="number"
                    value={inwardQty}
                    onChange={(e) => setInwardQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Purchase Cost / Unit ({currency})</label>
                  <input
                    type="number"
                    value={inwardCost}
                    onChange={(e) => setInwardCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs flex justify-between font-bold">
                <span className="text-slate-500">Total Inward Bill Value:</span>
                <span className="text-slate-900">{currency}{(inwardQty * inwardCost).toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/25"
              >
                <Truck className="w-4 h-4" />
                <span>Add to Inventory &amp; Update Stock</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
