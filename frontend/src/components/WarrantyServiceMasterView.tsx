import React, { useState } from 'react';
import { ServiceTicket } from '../types';
import { 
  Wrench, ShieldCheck, Search, Plus, CheckCircle2, Phone,
  Clock, IndianRupee, Key, X, Smartphone, AlertCircle, FileCheck
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface WarrantyServiceMasterViewProps {
  tickets: ServiceTicket[];
  onAddTicket: (ticket: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'deliveryOtp' | 'createdAt'>) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: ServiceTicket['status']) => void;
  currency?: string;
  uiMode?: UiMode;
}

export const WarrantyServiceMasterView: React.FC<WarrantyServiceMasterViewProps> = ({
  tickets,
  onAddTicket,
  onUpdateTicketStatus,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Ticket Form State
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    productName: '',
    brand: '',
    serialNumber: '',
    issueDescription: '',
    warrantyStatus: 'In Warranty' as ServiceTicket['warrantyStatus'],
    estimatedCost: 800,
    advancePaid: 200,
    status: 'Received' as ServiceTicket['status']
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTicket(form);
    setShowAddModal(false);
    setForm({
      customerName: '',
      customerPhone: '',
      productName: '',
      brand: '',
      serialNumber: '',
      issueDescription: '',
      warrantyStatus: 'In Warranty',
      estimatedCost: 800,
      advancePaid: 200,
      status: 'Received'
    });
    showToast('New Service Job Card & Repair Ticket Registered!');
  };

  const filteredTickets = tickets.filter(t => 
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="Warranty & Service Ticket Master"
        subtitle="Track serial number warranties, AMC contracts, issue repair job cards, and verify customer delivery with secure OTP."
        badge="Electronics Warranty, IMEI & Repair Job Cards"
        icon={Wrench}
        classicGradient="from-purple-800 via-violet-800 to-indigo-900"
        uiMode={uiMode}
        stats={[
          { label: 'Active Service Tickets', value: `${tickets.length} Jobs` },
          { 
            label: 'Pending Repairs', 
            value: `${tickets.filter(t => t.status !== 'Delivered').length} Units`, 
            isHighlight: tickets.some(t => t.status !== 'Delivered') 
          }
        ]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
              uiMode === 'apple'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-white text-purple-900 hover:bg-purple-50 shadow-xl'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ New Job Card</span>
          </button>
        }
      />

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Ticket #, Serial Number / IMEI, or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none"
          />
        </div>

        <span className="text-xs font-bold text-slate-500">
          Total Service Tickets: <strong>{tickets.length}</strong>
        </span>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Card #</span>
                  <h3 className="font-mono font-black text-purple-700 text-base">{ticket.ticketNumber}</h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  ticket.warrantyStatus === 'In Warranty'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ticket.warrantyStatus === 'AMC Active'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {ticket.warrantyStatus}
                </span>
              </div>

              {/* Device and Serial No */}
              <div className="mt-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1 text-xs">
                <p className="font-black text-slate-900 text-sm">{ticket.productName} ({ticket.brand})</p>
                <p className="font-mono text-slate-600 font-bold">Serial / IMEI: {ticket.serialNumber}</p>
                <p className="text-slate-500 text-[11px] pt-1 border-t border-purple-100">
                  Problem: <strong className="text-slate-700">{ticket.issueDescription}</strong>
                </p>
              </div>

              {/* Customer and Charges */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-slate-900">{ticket.customerName} ({ticket.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="font-black text-slate-900">{currency}{ticket.estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Advance Paid:</span>
                  <span className="font-bold text-emerald-600">{currency}{ticket.advancePaid}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-400">Delivery Secret OTP:</span>
                  <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{ticket.deliveryOtp}</span>
                </div>
              </div>
            </div>

            {/* Status and Action */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Service Status</label>
              <select
                value={ticket.status}
                onChange={(e) => onUpdateTicketStatus(ticket.id, e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-purple-700 outline-none"
              >
                <option value="Received">Received</option>
                <option value="Inspecting">Inspecting</option>
                <option value="Repairing">Repairing</option>
                <option value="Ready for Delivery">Ready for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Ticket Modal */}
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
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">New Service Job Card</h2>
                <p className="text-xs text-slate-400">Intake electronic item for warranty or repair</p>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="e.g. Aman Gupta"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+91 98999 11223"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Device / Product</label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="e.g. Smart LED TV 43-Inch"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Samsung / Philips"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Serial Number / IMEI</label>
                  <input
                    type="text"
                    value={form.serialNumber}
                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value.toUpperCase() })}
                    placeholder="SN-8921-X992"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Warranty Status</label>
                  <select
                    value={form.warrantyStatus}
                    onChange={(e) => setForm({ ...form, warrantyStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="In Warranty">In Warranty (Free Service)</option>
                    <option value="Out of Warranty">Out of Warranty (Chargeable)</option>
                    <option value="AMC Active">AMC Contract Active</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fault / Issue Description</label>
                <textarea
                  value={form.issueDescription}
                  onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
                  placeholder="e.g. Display backlight blinking and intermittent audio crackle"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Estimated Cost ({currency})</label>
                  <input
                    type="number"
                    value={form.estimatedCost}
                    onChange={(e) => setForm({ ...form, estimatedCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Advance Deposit ({currency})</label>
                  <input
                    type="number"
                    value={form.advancePaid}
                    onChange={(e) => setForm({ ...form, advancePaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-purple-600/25"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Issue Official Job Card &amp; Generate OTP</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
