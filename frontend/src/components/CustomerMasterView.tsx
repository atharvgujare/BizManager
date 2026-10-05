import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  MessageCircle,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
} from 'lucide-react';
import { Customer } from '../types';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface CustomerMasterViewProps {
  customers: Customer[];
  onAddCustomer: (data: Partial<Customer>) => Promise<boolean>;
  onReceivePayment: (customerId: string, amount: number, notes?: string) => Promise<boolean>;
  currency: string;
  uiMode?: UiMode;
}

export const CustomerMasterView: React.FC<CustomerMasterViewProps> = ({
  customers,
  onAddCustomer,
  onReceivePayment,
  currency,
  uiMode = 'apple',
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'due' | 'clear'>('all');
  const [isAddModal, setIsAddModal] = useState(false);
  const [isPayModal, setIsPayModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [payType, setPayType] = useState<'got' | 'gave'>('got');
  const [payAmount, setPayAmount] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [group, setGroup] = useState<'Retail' | 'Wholesale' | 'VIP'>('Retail');

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.gstNumber && c.gstNumber.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === 'due') return c.outstandingBalance < 0;
    if (filter === 'clear') return c.outstandingBalance >= 0;
    return true;
  });

  const totalToReceive = customers.reduce(
    (sum, c) => (c.outstandingBalance < 0 ? sum + Math.abs(c.outstandingBalance) : sum),
    0
  );

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ok = await onAddCustomer({
      name: name.trim(),
      phone: phone.trim() || undefined,
      gstNumber: gstin.trim() || undefined,
      customerGroup: group,
      outstandingBalance: 0,
    });

    if (ok) {
      setIsAddModal(false);
      setName('');
      setPhone('');
      setGstin('');
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || !payAmount.trim()) return;
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    // Inward payment reduces debt
    const finalAmount = payType === 'got' ? amountVal : -amountVal;
    const ok = await onReceivePayment(
      activeCustomer.id,
      finalAmount,
      payType === 'got' ? 'Payment Inward (Jama)' : 'Credit Given (Udhar)'
    );

    if (ok) {
      setIsPayModal(false);
      setPayAmount('');
      setActiveCustomer(null);
    }
  };

  const handleShareWhatsApp = (c: Customer) => {
    const due = Math.abs(c.outstandingBalance).toFixed(2);
    const text = encodeURIComponent(
      `Namaste ${c.name} ji,\n\nThis is a polite reminder from Apex Traders regarding your pending balance of ${currency}${due}.\n\nPlease clear the payment via UPI / Cash.\n\nThank you!`
    );
    window.open(`https://wa.me/${c.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Unified Header */}
      <PageHeader
        title="Customer Khata Ledger"
        subtitle="Manage credit limits, payment reminders, WhatsApp balances, and receipts."
        badge="Khata & Outstanding Tracker"
        icon={Users}
        classicGradient="from-emerald-700 via-teal-700 to-cyan-900"
        uiMode={uiMode}
        stats={[
          { 
            label: 'Total Outstanding (Udhar)', 
            value: `${currency}${totalToReceive.toLocaleString('en-IN')}`,
            subtext: 'Pending money to collect',
            isHighlight: totalToReceive > 0 
          },
          { 
            label: 'Total Registered Accounts', 
            value: `${customers.length} Parties`,
            subtext: 'Verified ledger contacts' 
          }
        ]}
        actions={
          <button
            onClick={() => setIsAddModal(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              uiMode === 'apple'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-md'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name, mobile or GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto">
          {(['all', 'due', 'clear'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-extrabold capitalize transition ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'due' ? 'Udhar (Due)' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              No matching customers found.
            </div>
          ) : (
            filtered.map((c) => {
              const owes = c.outstandingBalance < 0;
              const due = Math.abs(c.outstandingBalance);

              return (
                <div
                  key={c.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-extrabold text-sm shadow-sm">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{c.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600">
                          {c.customerGroup || 'Retail'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-3 mt-0.5">
                        <span>Phone: {c.phone || 'N/A'}</span>
                        {c.gstNumber && <span>GST: {c.gstNumber}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-base font-black ${
                          owes ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {currency}{due.toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {owes ? 'Due (Udhar)' : 'Clear Balance'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {owes && (
                        <button
                          onClick={() => handleShareWhatsApp(c)}
                          title="Send WhatsApp Reminder"
                          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveCustomer(c);
                          setPayType('got');
                          setIsPayModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold hover:bg-emerald-100 transition"
                      >
                        + Got Pay
                      </button>

                      <button
                        onClick={() => {
                          setActiveCustomer(c);
                          setPayType('gave');
                          setIsPayModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold hover:bg-rose-100 transition"
                      >
                        + Gave Udhar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomer}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-lg">Add Customer Master</h3>
              <button
                type="button"
                onClick={() => setIsAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1">
                  Customer / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Traders, Ananya Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1">
                  GSTIN / PAN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="27ABCDE1234F1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1">
                  Customer Category
                </label>
                <div className="flex gap-2">
                  {(['Retail', 'Wholesale', 'VIP'] as const).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setGroup(grp)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        group === grp
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/20 transition"
            >
              Save Customer Master
            </button>
          </form>
        </div>
      )}

      {/* Record Payment / Khata Entry Modal */}
      {isPayModal && activeCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPayment}
            className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-slate-900 text-base">
                {payType === 'got' ? 'Payment Inward (Jama)' : 'Give Credit (Udhar)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPayModal(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Party: <strong className="text-slate-900">{activeCustomer.name}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-xs font-extrabold text-slate-500 mb-1">
                Amount ({currency}) *
              </label>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0.00"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full text-xl font-black bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition ${
                payType === 'got'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              }`}
            >
              Record {payType === 'got' ? 'Payment (Jama)' : 'Credit (Udhar)'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
