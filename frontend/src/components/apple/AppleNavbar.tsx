import React from 'react';
import { UserRole, UiMode, MasterViewType } from '../../types';
import { 
  Zap, Shield, ChevronDown, Check, User, Sparkles, Store
} from 'lucide-react';

interface AppleNavbarProps {
  businessName: string;
  userName: string;
  role: UserRole;
  uiMode: UiMode;
  onToggleUiMode: (mode: UiMode) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenPos: () => void;
  onOpenAuth?: () => void;
}

export const AppleNavbar: React.FC<AppleNavbarProps> = ({
  businessName,
  userName,
  role,
  uiMode,
  onToggleUiMode,
  onSelectRole,
  onOpenPos,
  onOpenAuth
}) => {
  const roleList: UserRole[] = ['Admin', 'Manager', 'Cashier', 'Accountant'];
  const normalizedRole = role.toLowerCase();

  return (
    <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06] px-4 md:px-8 py-2.5 flex items-center justify-between transition-all duration-300">
      {/* Left: Apple Brand & Store */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-neutral-900 tracking-tight">
              {businessName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-neutral-400 font-normal">
            {userName} · <span className="capitalize text-neutral-600 font-medium">{role}</span>
          </p>
        </div>
      </div>

      {/* Middle: THE TOGGLE BUTTON (Classic vs Apple Minimal) */}
      <div className="hidden sm:flex items-center p-1 bg-neutral-200/70 backdrop-blur-md rounded-full border border-black/5 shadow-inner">
        <button
          onClick={() => onToggleUiMode('classic')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
            uiMode === 'classic'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="Switch to Original Enterprise Interface"
        >
          <span>🏛️</span>
          <span>Classic UI</span>
        </button>

        <button
          onClick={() => onToggleUiMode('apple')}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
            uiMode === 'apple'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="Switch to Apple Cupertino Minimalist Interface"
        >
          <span></span>
          <span>Apple Minimal</span>
        </button>
      </div>

      {/* Right: Minimal Actions & ⚡ Fast Bill */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => onToggleUiMode(uiMode === 'classic' ? 'apple' : 'classic')}
          className="sm:hidden px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-medium"
        >
          {uiMode === 'classic' ? ' Minimal' : '🏛️ Classic'}
        </button>

        {/* Minimal Role Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-medium transition border border-black/5">
            <span className="capitalize">{role}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:rotate-180 transition-transform duration-200" />
          </button>

          <div className="absolute right-0 mt-1.5 w-44 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/[0.08] py-1.5 hidden group-hover:block z-50 animate-in fade-in duration-150">
            <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Switch Role
            </div>
            {roleList.map((r) => {
              const isSelected = normalizedRole === r.toLowerCase();
              return (
                <button
                  key={r}
                  onClick={() => onSelectRole(r)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-neutral-50 transition ${
                    isSelected ? 'text-neutral-900 font-bold bg-neutral-100/70' : 'text-neutral-600'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ⚡ Quick POS Pill Button */}
        <button
          onClick={onOpenPos}
          className="apple-btn-primary px-4 py-1.5 text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>Quick Bill</span>
        </button>
      </div>
    </header>
  );
};
