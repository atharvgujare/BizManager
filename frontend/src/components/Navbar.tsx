import React from 'react';
import { 
  Shield, Sparkles, User, LogIn, ChevronDown, Check, Store, Zap, Menu
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  businessName: string;
  userName: string;
  role: UserRole;
  uiMode?: 'classic' | 'apple';
  onToggleUiMode?: (mode: 'classic' | 'apple') => void;
  onSelectRole: (role: UserRole) => void;
  onOpenPos: () => void;
  onToggleSidebar?: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessName,
  userName,
  role,
  uiMode = 'classic',
  onToggleUiMode,
  onSelectRole,
  onOpenPos,
  onToggleSidebar,
  onOpenAuth
}) => {
  const roleList: UserRole[] = ['Admin', 'Manager', 'Cashier', 'Accountant'];

  const normalizedRole = role.toLowerCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand & Store Name */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20">
            {businessName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
                {businessName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                ✓ Verified Store
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center space-x-1.5 mt-0.5">
              <span>{userName}</span>
              <span>•</span>
              <span className="font-bold capitalize text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded text-[11px]">
                {role}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions, Quick Role Selector & Make Bill */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* UI Switcher Toggle Button */}
        {onToggleUiMode && (
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => onToggleUiMode('classic')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 ${
                uiMode === 'classic'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🏛️</span>
              <span>Classic</span>
            </button>
            <button
              onClick={() => onToggleUiMode('apple')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 ${
                uiMode === 'apple'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span></span>
              <span>Apple Minimal</span>
            </button>
          </div>
        )}

        {/* Role Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline text-slate-500 font-normal">Role:</span>
            <span className="capitalize">{role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
          </button>

          <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 hidden group-hover:block z-50 animate-fade-in">
            <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Simulate Role Permissions
            </div>
            {roleList.map((r) => {
              const isSelected = normalizedRole === r.toLowerCase();
              return (
                <button
                  key={r}
                  onClick={() => onSelectRole(r)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-600 transition ${
                    isSelected ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Tap Sign-In / Demo Account */}
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center space-x-1.5"
            title="Switch User / 1-Tap Demo Account"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Account</span>
          </button>
        )}

        {/* ⚡ Quick New Bill POS Button */}
        <button
          onClick={onOpenPos}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-indigo-500/25"
        >
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>⚡ Fast Bill</span>
        </button>
      </div>
    </header>
  );
};
