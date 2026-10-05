import React from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, Check, X, Sparkles, 
  Crown, Store, ShoppingCart, BookOpen
} from 'lucide-react';

interface RoleBasedAccessViewProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleBasedAccessView: React.FC<RoleBasedAccessViewProps> = ({
  currentRole,
  onSelectRole
}) => {
  const normalizedCurrent = currentRole.toLowerCase();

  const rolesInfo = [
    {
      id: 'Admin' as UserRole,
      normId: 'admin',
      title: 'Administrator / Dukan Malik',
      icon: Crown,
      color: 'from-amber-500 to-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800',
      desc: 'Owner access. Unrestricted control over pricing, profit margins, settings, employee accounts, and data backup.',
      permissions: [
        'View Cost Prices & Net P&L Margins',
        'Create & Delete Products & Customers',
        'Adjust Warehouse Stock Levels',
        'Change GSTIN & Business Profile',
        'Direct POS Quick Billing'
      ]
    },
    {
      id: 'Manager' as UserRole,
      normId: 'manager',
      title: 'Store Manager',
      icon: Store,
      color: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-100 text-blue-800',
      desc: 'Operational supervisor. Oversees daily stock in/out, manages supplier inventory, issues customer credit, and reviews daily turnover.',
      permissions: [
        'Product & Category Catalog Management',
        'Warehouse Inventory Stock Adjustments',
        'Customer Khata / Ledger Credit Limits',
        'View Gross Turnover & Daily Sales',
        'Restricted from deleting business profile'
      ]
    },
    {
      id: 'Cashier' as UserRole,
      normId: 'cashier',
      title: 'Counter Cashier',
      icon: ShoppingCart,
      color: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      desc: 'High-speed POS billing operator. Scans items, generates bills, accepts UPI/Cash/Card payments, and prints thermal receipts.',
      permissions: [
        'Instant 1-Tap POS Quick Checkout',
        'Thermal Slip Printing & WhatsApp Share',
        'Apply predefined flat discounts',
        'HIDDEN: Cost Prices & Profit Margins',
        'LOCKED: Warehouse Stock Override'
      ]
    },
    {
      id: 'Accountant' as UserRole,
      normId: 'accountant',
      title: 'Munimji / Accountant',
      icon: BookOpen,
      color: 'from-purple-600 to-violet-800',
      badgeBg: 'bg-purple-100 text-purple-800',
      desc: 'Financial bookkeeper. Records daily shop expenses, tracks Udhar-Jama khata balances, and prepares GST compliance statements.',
      permissions: [
        'Customer Khata Udhar-Jama Balance Entry',
        'Dukan Kharcha & Operating Expense Tracking',
        'GST & CA Tax Report Export',
        'Cash-in-hand Day Book Reconciliation',
        'View Comprehensive Financial Statements'
      ]
    }
  ];

  const permissionMatrix = [
    { module: 'POS Quick Billing', admin: true, manager: true, cashier: true, accountant: false },
    { module: 'Stock / Warehouse Adjustments', admin: true, manager: true, cashier: false, accountant: false },
    { module: 'Customer Khata (You Gave/Got)', admin: true, manager: true, cashier: false, accountant: true },
    { module: 'Products Master Add/Edit', admin: true, manager: true, cashier: false, accountant: false },
    { module: 'View Profit Margins & Cost Prices', admin: true, manager: true, cashier: false, accountant: true },
    { module: 'Dukan Kharcha Expense Logging', admin: true, manager: true, cashier: false, accountant: true },
    { module: 'Business Settings & GSTIN Config', admin: true, manager: false, cashier: false, accountant: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-User Role-Based Access Control (RBAC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Role & Permissions Master</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Switch roles to experience how the interface automatically locks or unlocks sensitive modules, margins, and actions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 flex items-center space-x-3">
            <span className="text-xs text-slate-300">Active Simulation:</span>
            <span className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-black text-xs uppercase tracking-wider">
              {currentRole}
            </span>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {rolesInfo.map(role => {
          const Icon = role.icon;
          const isActive = normalizedCurrent === role.normId;

          return (
            <div 
              key={role.normId}
              className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-indigo-600 shadow-xl shadow-indigo-600/10 scale-[1.02]' 
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" /> Active
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-800">{role.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{role.desc}</p>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Core Permissions</p>
                  {role.permissions.map((p, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectRole(role.id)}
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                {isActive ? 'Current Active Role' : `Switch to ${role.title}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Live Permission Matrix</h3>
        <p className="text-xs text-slate-400 mb-6">Granular feature matrix across all roles</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Feature / Module</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Manager</th>
                <th className="py-3 px-4 text-center">Cashier</th>
                <th className="py-3 px-4 text-center">Accountant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-800 text-xs sm:text-sm">
                    {item.module}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.cashier ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.accountant ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
