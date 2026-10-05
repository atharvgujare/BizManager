import React, { useState } from 'react';
import { Product, UserRole, UiMode } from '../types';
import { 
  AlertTriangle, Search, Warehouse, CheckCircle2, ShieldAlert,
  Plus, Minus
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';

interface StockMasterViewProps {
  products: Product[];
  currentRole: UserRole;
  onUpdateStock: (id: string, newStock: number) => void;
  currency?: string;
  uiMode?: UiMode;
}

export const StockMasterView: React.FC<StockMasterViewProps> = ({
  products,
  currentRole,
  onUpdateStock,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const normalizedRole = currentRole.toLowerCase();
  const canEditStock = normalizedRole === 'admin' || normalizedRole === 'manager';

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getProductStock = (p: Product) => p.currentStock ?? p.stock ?? 0;
  const getProductCost = (p: Product) => p.costPrice ?? p.purchasePrice ?? 0;

  const filtered = products.filter(p => {
    const stockVal = getProductStock(p);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLow = filterLowStock ? stockVal <= p.minStockAlert : true;
    return matchesSearch && matchesLow;
  });

  const totalUnits = products.reduce((acc, p) => acc + getProductStock(p), 0);
  const totalValuation = products.reduce((acc, p) => acc + (getProductStock(p) * getProductCost(p)), 0);
  const lowStockCount = products.filter(p => getProductStock(p) <= p.minStockAlert).length;

  const handleStockDelta = (product: Product, delta: number) => {
    if (!canEditStock) {
      showNotification('Access Denied: Only Admin & Manager can adjust inventory.');
      return;
    }
    const current = getProductStock(product);
    const newQty = Math.max(0, current + delta);
    onUpdateStock(product.id, newQty);
    showNotification(`Updated ${product.name} stock to ${newQty} ${product.unit}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Header (Clean Minimal or Classic) */}
      <PageHeader
        title="Stock & Inventory Master"
        subtitle="Track warehouse counts, safety stock levels, and instant stock adjustments."
        badge="Warehouse & Godown Tracker"
        icon={Warehouse}
        classicGradient="from-amber-600 via-orange-600 to-amber-700"
        uiMode={uiMode}
        stats={[
          { label: 'Total Stock Units', value: totalUnits.toLocaleString() },
          { 
            label: 'Asset Value (Cost)', 
            value: normalizedRole === 'cashier' ? '••••••' : `${currency}${totalValuation.toLocaleString()}` 
          },
          { 
            label: 'Low Stock Warnings', 
            value: `${lowStockCount} Items`, 
            isHighlight: lowStockCount > 0 
          }
        ]}
      />

      {/* Cashier Protection Notice */}
      {!canEditStock && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center space-x-3 text-amber-800 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            <strong>Role Restriction:</strong> You are viewing as <strong>{currentRole}</strong>. 
            Direct warehouse stock adjustment is restricted to <strong>Admin</strong> and <strong>Manager</strong>.
          </p>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border ${
              filterLowStock 
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${filterLowStock ? 'text-rose-600' : 'text-slate-500'}`} />
            <span>Show Low Stock Only ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Stock Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product / SKU</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-right">In Stock</th>
                <th className="py-4 px-4 text-right">Safety Limit</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Stock Valuation</th>
                <th className="py-4 px-6 text-center">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => {
                const stockQty = getProductStock(product);
                const cost = getProductCost(product);
                const isLow = stockQty <= product.minStockAlert;
                const isCritical = stockQty <= 5;
                const stockVal = stockQty * cost;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-400 font-mono">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-base">
                      <span className={isCritical ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'}>
                        {stockQty} <span className="text-xs font-normal text-slate-500">{product.unit}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right text-xs text-slate-500">
                      {product.minStockAlert} {product.unit}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Critical
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right font-medium text-slate-700">
                      {normalizedRole === 'cashier' ? '••••••' : `${currency}${stockVal.toLocaleString()}`}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          disabled={!canEditStock || stockQty === 0}
                          onClick={() => handleStockDelta(product, -1)}
                          title="Reduce stock by 1"
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-xs font-bold text-slate-700 text-center">{stockQty}</span>
                        <button
                          disabled={!canEditStock}
                          onClick={() => handleStockDelta(product, 1)}
                          title="Increase stock by 1"
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
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
    </div>
  );
};
