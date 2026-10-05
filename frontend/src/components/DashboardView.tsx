import React from 'react';
import {
  TrendingUp,
  Receipt,
  Users,
  Package,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  CreditCard,
  Building2,
  Sparkles,
  QrCode,
  DollarSign
} from 'lucide-react';
import { DashboardSummary, MasterViewType, UiMode } from '../types';

interface DashboardViewProps {
  summary: DashboardSummary | null;
  onNavigate: (view: MasterViewType) => void;
  currency: string;
  uiMode?: UiMode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  onNavigate,
  currency,
  uiMode = 'apple',
}) => {
  const isMinimal = uiMode === 'apple';

  const todayRevenue = summary?.todayRevenue ?? 0;
  const todayProfit = summary?.todayGrossProfit ?? 0;
  const todayOrders = summary?.todayOrdersCount ?? 0;
  const totalReceivables = summary?.totalReceivables ?? 0;
  const totalPayables = summary?.totalPayables ?? 0;
  const lowStockCount = summary?.lowStockCount ?? 0;

  // ==========================================
  // 1. CLEAN MINIMAL STANDARD UI
  // ==========================================
  if (isMinimal) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 pb-12">
        {/* Top 4 Clean Minimal KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Today's Revenue
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Live
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {currency}{todayRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Month to date: <span className="font-semibold text-slate-700">{currency}{(summary?.monthRevenue ?? 0).toLocaleString('en-IN')}</span>
            </p>
          </div>

          {/* Card 2: Net Profit */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Gross Profit
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                Est. Margins
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                +{currency}{todayProfit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Margin: <span className="font-semibold text-emerald-600">{todayRevenue > 0 ? ((todayProfit / todayRevenue) * 100).toFixed(1) : '0'}%</span>
            </p>
          </div>

          {/* Card 3: Today's Orders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Bills Issued
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-slate-500">
                Today
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {todayOrders} <span className="text-sm font-normal text-slate-400">orders</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Avg ticket: <span className="font-semibold text-slate-700">{currency}{todayOrders > 0 ? (todayRevenue / todayOrders).toFixed(0) : '0'}</span>
            </p>
          </div>

          {/* Card 4: Customer Udhar (Receivables) */}
          <div 
            onClick={() => onNavigate('customers')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Customer Udhar
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
                {currency}{totalReceivables.toLocaleString('en-IN')}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              To collect from credit khata accounts
            </p>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Quick Actions:
          </span>
          <button
            onClick={() => onNavigate('billing')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Make New Bill</span>
          </button>
          <button
            onClick={() => onNavigate('customers')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Customer Khata</span>
          </button>
          <button
            onClick={() => onNavigate('stock')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Stock Inventory</span>
          </button>
          <button
            onClick={() => onNavigate('suppliers')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Suppliers</span>
          </button>
          <button
            onClick={() => onNavigate('analysis')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span>P&L Analytics</span>
          </button>
        </div>

        {/* Low Stock Attention Banner (Clean) */}
        {lowStockCount > 0 && (
          <div
            onClick={() => onNavigate('stock')}
            className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  {lowStockCount} items below safety threshold
                </p>
                <p className="text-[11px] text-amber-700">
                  Click to inspect inventory and trigger purchase orders
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-800 flex items-center">
              Review Stock <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        )}

        {/* Two-Column Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: 7-Day Performance Bar Chart */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">7-Day Sales Performance</h3>
                <p className="text-[11px] text-slate-400">Daily revenue trend across counter & online</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">Weekly Total</span>
            </div>

            <div className="flex items-end justify-between h-40 pt-4 gap-2">
              {(summary?.weeklySalesTrend || [
                { day: 'Mon', sales: 420 },
                { day: 'Tue', sales: 680 },
                { day: 'Wed', sales: 310 },
                { day: 'Thu', sales: 890 },
                { day: 'Fri', sales: 1200 },
                { day: 'Sat', sales: 950 },
                { day: 'Sun', sales: 500 },
              ]).map((item, idx) => {
                const max = 1300;
                const barPct = Math.min(100, Math.max(14, (item.sales / max) * 100));
                const isHighest = item.sales >= 1000;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-800 transition">
                      {currency}{item.sales}
                    </span>
                    <div className="w-full max-w-[32px] bg-slate-100 rounded-lg h-28 flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${barPct}%` }}
                        className={`w-full rounded-md transition-all duration-300 ${
                          isHighest ? 'bg-slate-900' : 'bg-slate-400 group-hover:bg-slate-600'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Recent Invoices & Bills */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Counter Invoices</h3>
                <p className="text-[11px] text-slate-400">Live order stream with payment methods</p>
              </div>
              <button
                onClick={() => onNavigate('invoices')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View Register →
              </button>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {(!summary?.recentSales || summary.recentSales.length === 0) ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No invoices generated yet today. Click "Make New Bill" to begin.
                </div>
              ) : (
                summary.recentSales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                        <Receipt className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{sale.customerName}</p>
                        <p className="text-[10px] text-slate-400">
                          {sale.invoiceNumber} · <span className="capitalize">{sale.paymentMode}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        +{currency}{sale.amount.toFixed(2)}
                      </p>
                      <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        Completed
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CLASSIC RICH GRADIENT UI (100% PRESERVED)
  // ==========================================
  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* PhonePe / GPay Style Hero Gradient Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-950/20 border border-blue-700/40 relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            Today's Total Collection
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Today</span>
          </div>
        </div>

        <div className="text-3xl md:text-4xl font-black tracking-tight mb-4">
          {currency}
          {(summary?.todayRevenue ?? 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div className="grid grid-cols-3 gap-2 bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
          <div>
            <div className="text-[11px] font-medium text-blue-200">Net Profit</div>
            <div className="text-sm md:text-base font-extrabold text-emerald-400">
              +{currency}{(summary?.todayGrossProfit ?? 0).toFixed(0)}
            </div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-[11px] font-medium text-blue-200">Today Bills</div>
            <div className="text-sm md:text-base font-extrabold text-white">
              {summary?.todayOrdersCount ?? 0} Orders
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-blue-200">This Month</div>
            <div className="text-sm md:text-base font-extrabold text-white">
              {currency}{(summary?.monthRevenue ?? 0).toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Circular Buttons (PhonePe / GPay style) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-4 gap-2 text-center">
        <button
          onClick={() => onNavigate('billing')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Make Bill</span>
        </button>

        <button
          onClick={() => onNavigate('customers')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Khata Book</span>
        </button>

        <button
          onClick={() => onNavigate('stock')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition shadow-sm">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Stock Master</span>
        </button>

        <button
          onClick={() => onNavigate('analysis')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Analysis &amp; BI</span>
        </button>
      </div>

      {/* Khatabook Style Dual Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => onNavigate('customers')}
          className="bg-white rounded-2xl p-4 border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="text-[11px] font-extrabold text-slate-400 uppercase">
            You Will Get (Customer Udhar)
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {currency}{(summary?.totalReceivables ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Money to receive from accounts</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 border-l-4 border-l-rose-500 shadow-sm">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase">
            You Will Pay (Suppliers)
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {currency}{(summary?.totalPayables ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Payable vendor balances</div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {(summary?.lowStockCount ?? 0) > 0 && (
        <div
          onClick={() => onNavigate('stock')}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-800 font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                {summary?.lowStockCount} items running out of stock!
              </div>
              <div className="text-[11px] text-amber-700">Tap to check stock and restock</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </div>
      )}

      {/* 7-Day Performance & Recent Bills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Trend Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-slate-900 text-sm">7-Day Sales Trend</h3>
            <span className="text-xs text-slate-500">Weekly Activity</span>
          </div>

          <div className="flex items-end justify-between h-32 pt-2 gap-2">
            {(summary?.weeklySalesTrend || [
              { day: 'Mon', sales: 420 },
              { day: 'Tue', sales: 680 },
              { day: 'Wed', sales: 310 },
              { day: 'Thu', sales: 890 },
              { day: 'Fri', sales: 1200 },
              { day: 'Sat', sales: 950 },
              { day: 'Sun', sales: 500 },
            ]).map((item, idx) => {
              const max = 1300;
              const barPct = Math.min(100, Math.max(12, (item.sales / max) * 100));
              const isHigh = barPct > 70;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-24 flex items-end overflow-hidden">
                    <div
                      style={{ height: `${barPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isHigh ? 'bg-blue-600' : 'bg-blue-300'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Recent Invoices</h3>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              + New Bill
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {(!summary?.recentSales || summary.recentSales.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No bills generated yet today.
              </div>
            ) : (
              summary.recentSales.slice(0, 4).map((sale) => (
                <div key={sale.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sale.customerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {sale.invoiceNumber} • {sale.paymentMode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-600">
                      +{currency}{sale.amount.toFixed(2)}
                    </div>
                    <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                      Paid
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
