import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, User, Lock, ArrowRight, X, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('admin@dukan.in');
  const [role, setRole] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const handleQuickLogin = (demoRole: UserRole, demoEmail: string) => {
    onLogin(demoEmail, demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Business Manager Sign-In</h2>
          <p className="text-slate-500 text-xs mt-1">
            Choose your role or test with 1-tap quick profiles
          </p>
        </div>

        {/* Quick Demo Switcher Buttons */}
        <div className="space-y-2 mb-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant 1-Tap Role Sign-In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('admin', 'admin@dukan.in')}
              className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl text-left transition"
            >
              <p className="font-bold text-xs">👑 Admin (Malik)</p>
              <p className="text-[10px] text-amber-700">Full Access & Margins</p>
            </button>

            <button
              onClick={() => handleQuickLogin('manager', 'manager@dukan.in')}
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-2xl text-left transition"
            >
              <p className="font-bold text-xs">🏬 Store Manager</p>
              <p className="text-[10px] text-blue-700">Inventory & Sales</p>
            </button>

            <button
              onClick={() => handleQuickLogin('cashier', 'cashier@dukan.in')}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl text-left transition"
            >
              <p className="font-bold text-xs">🛒 Cashier</p>
              <p className="text-[10px] text-emerald-700">Fast Billing Only</p>
            </button>

            <button
              onClick={() => handleQuickLogin('accountant', 'accountant@dukan.in')}
              className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-2xl text-left transition"
            >
              <p className="font-bold text-xs">📒 Accountant</p>
              <p className="text-[10px] text-purple-700">Khata & GST Tax</p>
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, role); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email / Mobile</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none capitalize"
            >
              <option value="admin">Admin (Full Control)</option>
              <option value="manager">Manager (Inventory & Sales)</option>
              <option value="cashier">Cashier (POS Checkout Only)</option>
              <option value="accountant">Accountant (Khata & Taxes)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/25"
          >
            <span>Proceed to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
