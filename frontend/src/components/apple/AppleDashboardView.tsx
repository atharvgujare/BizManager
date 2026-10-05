import React from 'react';
import { DashboardSummary, MasterViewType, BusinessProfile } from '../../types';
import { 
  ArrowUpRight, ArrowDownLeft, Zap, Users, Package, 
  Sparkles, FileText, ChevronRight, TrendingUp, Store
} from 'lucide-react';

interface AppleDashboardViewProps {
  business: BusinessProfile;
  summary: DashboardSummary | null;
  onNavigate: (view: MasterViewType) => void;
  currency?: string;
}

export const AppleDashboardView: React.FC<AppleDashboardViewProps> = ({
  business,
  summary,
  onNavigate,
  currency = '₹'
}) => {
  const todayRevenue = summary?.todayRevenue ?? 42850;
  const netMarginPercent = summary?.todayRevenue ? Math.round(((summary?.todayGrossProfit ?? 12000) / summary.todayRevenue) * 100) : 32;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-16">
      {/* Apple Trio Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Today Turnover */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Turnover
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>

          <div className="my-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {currency}{todayRevenue.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Today's total gross sales</p>
          </div>

          <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
            <span>Net Profit</span>
            <span className="font-semibold text-neutral-800">
              +{currency}{(summary?.todayGrossProfit ?? 13700).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Card 2: Today Orders */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Bills &amp; Orders
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>

          <div className="my-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {summary?.todayOrdersCount ?? 14}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Completed checkouts today</p>
          </div>

          <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
            <span>Average Ticket</span>
            <span className="font-semibold text-neutral-800">
              {currency}{Math.round(todayRevenue / Math.max(1, summary?.todayOrdersCount ?? 14)).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Card 3: Khata Receivables */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Khata Udhar
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
              To Receive
            </span>
          </div>

          <div className="my-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {currency}{(summary?.totalReceivables ?? 14350).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Outstanding customer balance</p>
          </div>

          <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
            <span>Supplier Payables</span>
            <span className="font-semibold text-rose-600">
              {currency}{(summary?.totalPayables ?? 4500).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid: Quick Focus Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Quick POS Trigger Tile */}
        <div 
          onClick={() => onNavigate('billing')}
          className="apple-card p-5 cursor-pointer hover:border-black/20 group flex flex-col justify-between md:col-span-2 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-lg shadow-neutral-900/10"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-white text-white" />
            </span>
            <span className="text-xs font-medium text-neutral-400 flex items-center group-hover:translate-x-0.5 transition-transform">
              Launch POS <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold tracking-tight">Point of Sale &amp; Quick Billing</h3>
            <p className="text-xs text-neutral-300 mt-1">Tap items to bill, accept UPI QR or Cash, and print 50mm receipts.</p>
          </div>
        </div>

        {/* Khata Tile */}
        <div 
          onClick={() => onNavigate('customers')}
          className="apple-card p-5 cursor-pointer hover:border-blue-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-6">
            <h3 className="text-base font-bold text-neutral-900">Customer Khata</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Track Udhar &amp; Jama ledger</p>
          </div>
        </div>

        {/* Inventory Tile */}
        <div 
          onClick={() => onNavigate('stock')}
          className="apple-card p-5 cursor-pointer hover:border-amber-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-6">
            <h3 className="text-base font-bold text-neutral-900">Inventory</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{summary?.lowStockCount ?? 2} items near minimum</p>
          </div>
        </div>
      </div>

      {/* Recent Activity: Minimal Table */}
      <div className="apple-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Recent Transactions</h3>
            <p className="text-xs text-neutral-400">Latest counter &amp; online sales</p>
          </div>

          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            <span>All Invoices</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="divide-y divide-black/[0.04]">
          {(summary?.recentSales ?? []).map((sale) => (
            <div key={sale.id} className="py-3 flex items-center justify-between hover:bg-neutral-50/50 px-2 rounded-xl transition">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-xs">
                  {sale.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{sale.customerName}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{sale.invoiceNumber} · {sale.paymentMode}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-neutral-900">{currency}{sale.amount.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-emerald-600 font-medium">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
