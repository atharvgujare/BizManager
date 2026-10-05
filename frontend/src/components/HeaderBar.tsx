import React from 'react';
import { UserRole, UiMode, MasterViewType } from '../types';
import { 
  Shield, ChevronDown, Check, Zap, Menu, Sparkles
} from 'lucide-react';

interface HeaderBarProps {
  businessName: string;
  userName: string;
  role: UserRole;
  activeView: MasterViewType;
  uiMode: UiMode;
  onToggleUiMode: (mode: UiMode) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenPos: () => void;
  onToggleSidebar?: () => void;
  onOpenAuth?: () => void;
}

const VIEW_TITLES: Record<MasterViewType, string> = {
  dashboard: 'Executive Dashboard',
  billing: 'Point of Sale (POS)',
  billing_pos: 'Point of Sale (POS)',
  customers: 'Customer Khata Ledger',
  customer_master: 'Customer Khata Ledger',
  suppliers: 'Supplier & Purchase Master',
  supplier_master: 'Supplier & Purchase Master',
  products: 'Products Catalog',
  products_master: 'Products Catalog',
  stock: 'Stock & Godown Inventory',
  stock_master: 'Stock & Godown Inventory',
  branches: 'Multi-Branch & Warehouses',
  branch_master: 'Multi-Branch & Warehouses',
  ai_reorder: 'AI Smart Re-Order & Expiry',
  reorder_master: 'AI Smart Re-Order & Expiry',
  online_dukan: 'Online Storefront Web',
  dukan_storefront: 'Online Storefront Web',
  invoices: 'Invoice Records & Thermal Bills',
  invoice_master: 'Invoice Records & Thermal Bills',
  warranties: 'Warranty, IMEI & Repair Job Cards',
  service_master: 'Warranty, IMEI & Repair Job Cards',
  barcode: 'Barcode & Price Tag Designer',
  barcode_designer: 'Barcode & Price Tag Designer',
  gst: 'GST Tax Compliance & E-Way Bill',
  gst_compliance: 'GST Tax Compliance & E-Way Bill',
  analysis: 'Business Intelligence & Margins',
  analysis_bi: 'Business Intelligence & Margins',
  roles: 'Role Permissions & Access Matrix',
  role_access: 'Role Permissions & Access Matrix',
  settings: 'Store Profile & Hardware Settings',
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  businessName,
  userName,
  role,
  activeView,
  uiMode,
  onToggleUiMode,
  onSelectRole,
  onOpenPos,
  onToggleSidebar,
  onOpenAuth
}) => {
  const roleList: UserRole[] = ['Admin', 'Manager', 'Cashier', 'Accountant'];
  const normalizedRole = role.toLowerCase();
  const currentTitle = VIEW_TITLES[activeView] || 'Workspace';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Active View Title & Mobile Hamburger */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              {currentTitle}
            </h1>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {businessName} · <span className="capitalize text-slate-600 font-bold">{role}</span>
          </p>
        </div>
      </div>

      {/* Middle/Right: THE TOGGLE BUTTON (Classic vs Clean Minimal) & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Sleek Segmented Switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
          <button
            onClick={() => onToggleUiMode('classic')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              uiMode === 'classic'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Original Colorful Layout with Gradient Banners"
          >
            <span>🏛️</span>
            <span className="hidden sm:inline">Classic</span>
          </button>

          <button
            onClick={() => onToggleUiMode('apple')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              uiMode === 'apple'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Apple-style Clean Minimalist Layout with Zero Clutter"
          >
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>Clean Minimal</span>
          </button>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline capitalize">{role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
          </button>

          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50">
            <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase text-slate-400">
              Switch Role
            </div>
            {roleList.map((r) => {
              const isSelected = normalizedRole === r.toLowerCase();
              return (
                <button
                  key={r}
                  onClick={() => onSelectRole(r)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition ${
                    isSelected ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ⚡ Quick POS Make Bill Button */}
        <button
          onClick={onOpenPos}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition shadow-sm shadow-indigo-600/20"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span className="hidden sm:inline">Make Bill</span>
        </button>
      </div>
    </header>
  );
};
