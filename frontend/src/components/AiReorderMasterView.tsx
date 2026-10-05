import React, { useState } from 'react';
import { SmartReorderItem, Product } from '../types';
import { 
  Sparkles, AlertTriangle, TrendingDown, Clock, CheckCircle2, 
  ShoppingCart, RefreshCw, Percent, ArrowUpRight, ShieldAlert,
  Calendar, Layers, Tag, ExternalLink, Zap
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface AiReorderMasterViewProps {
  products: Product[];
  currency?: string;
  onAutoPoGenerated: (supplierName: string, items: { productName: string; qty: number }[]) => void;
  uiMode?: UiMode;
}

export const AiReorderMasterView: React.FC<AiReorderMasterViewProps> = ({
  products,
  currency = '₹',
  onAutoPoGenerated,
  uiMode = 'apple'
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'expiring'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Mock initial AI Intelligence feed calculated from inventory & velocity
  const [reorderItems, setReorderItems] = useState<SmartReorderItem[]>([
    {
      id: 'ai-1',
      productId: 'p4',
      productName: 'Cadbury Dairy Milk Silk 150g',
      sku: 'CNF-DRY-004',
      currentStock: 4,
      dailyVelocity: 3.2,
      daysUntilStockout: 1.2,
      suggestedOrderQty: 48,
      supplierName: 'Mondelez India Wholesalers',
      batchNumber: 'BATCH-2026-C09',
      expiryDate: '2026-10-25',
      daysToExpiry: 22,
      status: 'Critical'
    },
    {
      id: 'ai-2',
      productId: 'p2',
      productName: 'Fortune Sunlite Sunflower Oil 1L',
      sku: 'OIL-SUN-002',
      currentStock: 8,
      dailyVelocity: 4.5,
      daysUntilStockout: 1.8,
      suggestedOrderQty: 60,
      supplierName: 'Adani Wilmar Direct Dist.',
      batchNumber: 'BATCH-2026-F14',
      expiryDate: '2027-04-10',
      daysToExpiry: 189,
      status: 'Critical'
    },
    {
      id: 'ai-3',
      productId: 'p7',
      productName: 'Amul Butter Salted 500g',
      sku: 'DRY-BTR-007',
      currentStock: 6,
      dailyVelocity: 2.1,
      daysUntilStockout: 2.8,
      suggestedOrderQty: 30,
      supplierName: 'Gujarat Co-operative Milk Hub',
      batchNumber: 'BATCH-2026-A02',
      expiryDate: '2026-10-18',
      daysToExpiry: 15,
      status: 'Expiring Soon'
    },
    {
      id: 'ai-4',
      productId: 'p1',
      productName: 'Tata Tea Gold Premium 500g',
      sku: 'BEV-TEA-001',
      currentStock: 45,
      dailyVelocity: 5.0,
      daysUntilStockout: 9.0,
      suggestedOrderQty: 100,
      supplierName: 'Tata Consumer Products Ltd',
      batchNumber: 'BATCH-2026-T88',
      expiryDate: '2027-08-30',
      daysToExpiry: 331,
      status: 'Healthy'
    },
    {
      id: 'ai-5',
      productId: 'p3',
      productName: 'Aashirvaad Shudh Chakki Atta 10kg',
      sku: 'FLR-ATT-003',
      currentStock: 12,
      dailyVelocity: 3.8,
      daysUntilStockout: 3.1,
      suggestedOrderQty: 50,
      supplierName: 'ITC Agribusiness Division',
      batchNumber: 'BATCH-2026-I41',
      expiryDate: '2026-12-15',
      daysToExpiry: 73,
      status: 'Warning'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleGeneratePo = (item: SmartReorderItem) => {
    onAutoPoGenerated(item.supplierName, [{ productName: item.productName, qty: item.suggestedOrderQty }]);
    showToast(`🤖 AI Purchase Order generated for ${item.suggestedOrderQty} units to ${item.supplierName}!`);
  };

  const handleApplyClearanceMarkdown = (item: SmartReorderItem) => {
    showToast(`🏷️ Applied 20% Clearance Markdown for Batch ${item.batchNumber} (Expiring in ${item.daysToExpiry} days)!`);
  };

  const criticalStockoutCount = reorderItems.filter(i => i.status === 'Critical').length;
  const expiringSoonCount = reorderItems.filter(i => i.daysToExpiry <= 30).length;

  const filtered = reorderItems.filter(item => {
    if (activeFilter === 'critical') return item.status === 'Critical';
    if (activeFilter === 'expiring') return item.daysToExpiry <= 30;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Header */}
      <PageHeader
        title="AI Smart Re-Order & Waste Management"
        subtitle="Forecasts stockout days using live POS checkout velocity, automates vendor re-orders, and catches expiring batches before loss."
        badge="AI Predictive Replenishment & Expiry Markdown"
        icon={Sparkles}
        classicGradient="from-amber-600 via-orange-600 to-rose-700"
        uiMode={uiMode}
        stats={[
          { 
            label: 'Immediate Stockout Risk', 
            value: `${criticalStockoutCount} Items`, 
            isHighlight: criticalStockoutCount > 0 
          },
          { 
            label: 'Expiring in < 30 Days', 
            value: `${expiringSoonCount} Batches`, 
            isHighlight: expiringSoonCount > 0 
          }
        ]}
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeFilter === 'all'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          All Forecasted Items ({reorderItems.length})
        </button>

        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeFilter === 'critical'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>High Stockout Risk ({criticalStockoutCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('expiring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeFilter === 'expiring'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Expiring Batches &amp; Markdown ({expiringSoonCount})</span>
        </button>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => {
          const isCritical = item.status === 'Critical';
          const isExpiring = item.daysToExpiry <= 30;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border-2 transition shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between ${
                isCritical 
                  ? 'border-rose-200' 
                  : isExpiring 
                  ? 'border-amber-200' 
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                      isCritical ? 'bg-rose-50 text-rose-600' : isExpiring ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.productName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight truncate max-w-[170px]">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isCritical 
                      ? 'bg-rose-100 text-rose-800' 
                      : isExpiring 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* AI Depletion Countdown Meter */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Current Godown Count:</span>
                    <span className="font-bold text-slate-900">{item.currentStock} units</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Sales Velocity:</span>
                    <span className="font-bold text-indigo-600">{item.dailyVelocity} units / day</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 font-bold">
                    <span className={isCritical ? 'text-rose-600' : 'text-slate-700'}>
                      ⏳ Est. Stockout in:
                    </span>
                    <span className={`text-sm font-black ${isCritical ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                      {item.daysUntilStockout} Days
                    </span>
                  </div>
                </div>

                {/* Expiry Badge */}
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Batch: {item.batchNumber}</span>
                    <span className="font-bold text-amber-900">Expires: {new Date(item.expiryDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                    isExpiring ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.daysToExpiry}d left
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleGeneratePo(item)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-sm shadow-indigo-600/20"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>1-Tap AI Re-Order ({item.suggestedOrderQty} units)</span>
                </button>

                {isExpiring && (
                  <button
                    onClick={() => handleApplyClearanceMarkdown(item)}
                    className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center space-x-1 transition border border-amber-200"
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Apply 20% Clearance Discount</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
