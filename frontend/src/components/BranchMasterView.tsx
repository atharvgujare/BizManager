import React, { useState } from 'react';
import { Branch, StockTransfer, Product } from '../types';
import { 
  Building, Warehouse, Store, ArrowRightLeft, Plus, CheckCircle2,
  Truck, Search, MapPin, Phone, User, Calendar, ShieldCheck, X
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface BranchMasterViewProps {
  branches: Branch[];
  transfers: StockTransfer[];
  products: Product[];
  onAddBranch: (b: Omit<Branch, 'id'>) => void;
  onCreateTransfer: (t: Omit<StockTransfer, 'id'>) => void;
  currency?: string;
  uiMode?: UiMode;
}

export const BranchMasterView: React.FC<BranchMasterViewProps> = ({
  branches,
  transfers,
  products,
  onAddBranch,
  onCreateTransfer,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'transfers'>('branches');
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Branch Form
  const [newBranch, setNewBranch] = useState({
    name: '',
    code: '',
    type: 'Store' as 'Store' | 'Godown',
    address: '',
    city: 'New Delhi',
    phone: '',
    managerName: '',
    totalStockUnits: 0
  });

  // Stock Transfer Form
  const [transferForm, setTransferForm] = useState({
    fromBranch: branches[0]?.name || 'Central Godown Okhla',
    toBranch: branches[1]?.name || 'CP Flagship Supermart',
    productId: products[0]?.id || '',
    quantity: 20,
    vehicleNumber: 'DL 1AA 4421'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBranch(newBranch);
    setShowAddBranchModal(false);
    setNewBranch({
      name: '',
      code: '',
      type: 'Store',
      address: '',
      city: 'New Delhi',
      phone: '',
      managerName: '',
      totalStockUnits: 0
    });
    showToast('New Branch / Godown Registered Successfully!');
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === transferForm.productId);
    const prodName = prod ? prod.name : 'Stock Item';

    onCreateTransfer({
      transferNumber: `TRF-2026-${String(transfers.length + 1).padStart(3, '0')}`,
      fromBranch: transferForm.fromBranch,
      toBranch: transferForm.toBranch,
      date: new Date().toISOString(),
      status: 'In Transit',
      totalUnits: Number(transferForm.quantity),
      vehicleNumber: transferForm.vehicleNumber.toUpperCase(),
      items: [{ productId: transferForm.productId, productName: prodName, quantity: Number(transferForm.quantity) }]
    });

    setShowTransferModal(false);
    showToast(`Stock Transfer Challan Dispatched from ${transferForm.fromBranch}!`);
  };

  const totalLocations = branches.length;
  const storeCount = branches.filter(b => b.type === 'Store').length;
  const godownCount = branches.filter(b => b.type === 'Godown').length;

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
        title="Multi-Branch & Stock Transfer Master"
        subtitle="Manage multiple retail outlets, central warehouses, and dispatch inter-branch stock transfer challans with vehicle tracking."
        badge="Multi-Location Store & Central Godown Network"
        icon={Building}
        classicGradient="from-cyan-800 via-sky-800 to-indigo-900"
        uiMode={uiMode}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTransferModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
                uiMode === 'apple'
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
              <span>+ Stock Transfer</span>
            </button>

            <button
              onClick={() => setShowAddBranchModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition active:scale-95 ${
                uiMode === 'apple'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-white text-sky-900 hover:bg-sky-50 shadow-xl'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Branch</span>
            </button>
          </div>
        }
      />

      {/* Quick Location Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Outlets</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{totalLocations} Locations</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retail Stores</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{storeCount} Outlets</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Central Godowns / Hubs</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{godownCount} Warehouses</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Warehouse className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'branches'
              ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Branch &amp; Godown Directory ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'transfers'
              ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Inter-Branch Transfer Challans ({transfers.length})</span>
        </button>
      </div>

      {/* Tab 1: Branches */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map(branch => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    branch.type === 'Godown' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {branch.type === 'Godown' ? <Warehouse className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{branch.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Code: {branch.code}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  branch.type === 'Godown' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {branch.type}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{branch.address}, {branch.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Branch Head: <strong>{branch.managerName}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Inventory Handled:</span>
                <span className="font-black text-slate-900 text-sm">{branch.totalStockUnits.toLocaleString()} Units</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Transfers */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Inter-Branch Dispatch Register</h3>
              <p className="text-xs text-slate-400">Goods in transit between retail branches and central warehouses</p>
            </div>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Transfer Challan</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Challan #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Origin (From)</th>
                  <th className="py-3 px-4">Destination (To)</th>
                  <th className="py-3 px-4 text-center">Items Dispatched</th>
                  <th className="py-3 px-4 text-center">Vehicle #</th>
                  <th className="py-3 px-4 text-center">Transit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map(trf => (
                  <tr key={trf.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{trf.transferNumber}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{new Date(trf.date).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{trf.fromBranch}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-700">{trf.toBranch}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {trf.totalUnits} Units
                      <p className="text-[10px] text-slate-400 font-normal">{trf.items[0]?.productName}</p>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs bg-slate-50 font-bold">{trf.vehicleNumber || 'TEMPO-407'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        trf.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {trf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddBranchModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Add Branch or Godown</h2>
                <p className="text-xs text-slate-400">Configure new outlet or central hub</p>
              </div>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    placeholder="e.g. South Extension Store"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Branch Code</label>
                  <input
                    type="text"
                    value={newBranch.code}
                    onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. DEL-SE-04"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Location Type</label>
                  <select
                    value={newBranch.type}
                    onChange={(e) => setNewBranch({ ...newBranch, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Store">Retail Store</option>
                    <option value="Godown">Central Godown / Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Branch Head / Manager</label>
                  <input
                    type="text"
                    value={newBranch.managerName}
                    onChange={(e) => setNewBranch({ ...newBranch, managerName: e.target.value })}
                    placeholder="e.g. Vikram Batra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    placeholder="+91 98111 55667"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={newBranch.city}
                    onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  placeholder="Plot 18, Commercial Complex"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  required
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-sky-600/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Outlet Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transfer Challan Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowTransferModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Dispatch Stock Transfer Challan</h2>
                <p className="text-xs text-slate-400">Inter-branch goods dispatch note</p>
              </div>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">From (Origin)</label>
                  <select
                    value={transferForm.fromBranch}
                    onChange={(e) => setTransferForm({ ...transferForm, fromBranch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name} ({b.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">To (Destination)</label>
                  <select
                    value={transferForm.toBranch}
                    onChange={(e) => setTransferForm({ ...transferForm, toBranch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name} ({b.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Merchandise / Item</label>
                <select
                  value={transferForm.productId}
                  onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock ?? p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Transfer Units</label>
                  <input
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Vehicle / Tempo #</label>
                  <input
                    type="text"
                    value={transferForm.vehicleNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, vehicleNumber: e.target.value })}
                    placeholder="DL 1AA 8821"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-sky-600/25"
                >
                  <Truck className="w-4 h-4" />
                  <span>Issue &amp; Dispatch Transfer Challan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
