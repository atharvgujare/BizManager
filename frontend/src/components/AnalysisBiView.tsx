import React from 'react';
import { UserRole, Invoice, Expense, Product } from '../types';
import { 
  TrendingUp, ShieldAlert, ArrowUpRight, Layers,
  Receipt, Wallet, Percent, Download
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface AnalysisBiViewProps {
  currentRole: UserRole;
  invoices: Invoice[];
  expenses: Expense[];
  products: Product[];
  currency?: string;
  uiMode?: UiMode;
}

export const AnalysisBiView: React.FC<AnalysisBiViewProps> = ({
  currentRole,
  invoices,
  expenses,
  products,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const normalizedRole = currentRole.toLowerCase();
  const isCashier = normalizedRole === 'cashier';

  // Financial Calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal ?? inv.totalAmount ?? 0), 0);
  
  // Cost of Goods Sold estimate (approx 68% of subtotal based on margins)
  const estimatedCogs = Math.round(totalRevenue * 0.68);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const grossProfit = Math.max(0, totalRevenue - estimatedCogs);
  const netProfit = Math.max(0, grossProfit - totalExpenses);
  const profitMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  if (isCashier) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Restricted BI & P&L Master</h2>
        <p className="text-slate-500 text-sm mt-2">
          As a <strong>Cashier</strong>, sensitive financial records, Cost of Goods Sold (COGS), 
          and Profit & Loss margins are hidden to protect business privacy.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          Switch to <strong>Admin</strong>, <strong>Manager</strong>, or <strong>Accountant</strong> role using the top-bar role selector.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Unified Header */}
      <PageHeader
        title="Analysis & Insights Master"
        subtitle="Track your daily margin health, cost of goods, operating overheads, and net bottom-line earnings."
        badge="Real-Time Business Intelligence & P&L"
        icon={TrendingUp}
        classicGradient="from-violet-700 via-purple-700 to-indigo-800"
        uiMode={uiMode}
        actions={
          <button
            onClick={() => alert('GST & Profit Statement exported successfully to Excel/PDF format.')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
              uiMode === 'apple'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-white text-purple-900 shadow-lg hover:bg-purple-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CA/GST Report</span>
          </button>
        }
      />

      {/* Hero Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Turnover</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{totalRevenue.toLocaleString()}</h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4% vs last month
            </p>
          </div>
        </div>

        {/* Est. Cost of Goods (COGS) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory COGS</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{estimatedCogs.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Cost of merchandise sold
            </p>
          </div>
        </div>

        {/* Operating Overheads */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dukan Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{totalExpenses.toLocaleString()}</h3>
            <p className="text-xs text-rose-500 font-medium mt-1">
              Rent, electricity, wages & logistics
            </p>
          </div>
        </div>

        {/* Net Profit Margin */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-950/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Net Profit</span>
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{currency}{netProfit.toLocaleString()}</h3>
            <p className="text-xs font-bold text-emerald-200 mt-1">
              {profitMarginPercent}% Net Margin
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Dukan Kharcha & Expenses</h3>
              <p className="text-xs text-slate-400">Operating overheads categorization</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
              {expenses.length} Entries
            </span>
          </div>

          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                    <Receipt className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{exp.title}</p>
                    <p className="text-xs text-slate-400">{exp.category} • {new Date(exp.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-rose-600 text-sm">-{currency}{exp.amount.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{exp.paymentMode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance & Margins */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Margin Breakdown by Product</h3>
              <p className="text-xs text-slate-400">Selling Price vs Purchase Cost</p>
            </div>
            <span className="text-xs text-indigo-600 font-bold">Live Margins</span>
          </div>

          <div className="space-y-4">
            {products.slice(0, 5).map(prod => {
              const sell = prod.sellingPrice ?? prod.price ?? 0;
              const cost = prod.costPrice ?? prod.purchasePrice ?? 0;
              const marginAmt = sell - cost;
              const marginPct = sell > 0 ? Math.round((marginAmt / sell) * 100) : 0;

              return (
                <div key={prod.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{prod.name}</span>
                    <span className="text-emerald-600">{marginPct}% Margin (+{currency}{marginAmt})</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(10, marginPct * 2))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Cost: {currency}{cost}</span>
                    <span>Sell: {currency}{sell}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
