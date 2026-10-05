import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Layers,
  FileSpreadsheet,
  PieChart,
  ShieldCheck,
  Settings,
  Barcode,
  FileCheck2,
  Building2,
  Warehouse,
  Globe,
  Wrench,
  X,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MasterViewType, UiMode } from '../types';

interface SidebarProps {
  activeView: MasterViewType;
  onSelectView: (view: MasterViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  uiMode?: UiMode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  uiMode = 'apple'
}) => {
  const isMinimal = uiMode === 'apple';

  const menuSections = [
    {
      title: 'Counter & Sales',
      items: [
        { id: 'dashboard' as MasterViewType, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'billing' as MasterViewType, label: 'POS Billing', icon: ShoppingCart, badge: 'Fast' },
        { id: 'invoices' as MasterViewType, label: 'Invoice Register', icon: FileSpreadsheet, badge: null },
      ]
    },
    {
      title: 'Parties & Khata',
      items: [
        { id: 'customers' as MasterViewType, label: 'Customer Khata', icon: Users, badge: 'Udhar' },
        { id: 'suppliers' as MasterViewType, label: 'Supplier Master', icon: Building2, badge: null },
      ]
    },
    {
      title: 'Stock & Multi-Store',
      items: [
        { id: 'products' as MasterViewType, label: 'Products Master', icon: Package, badge: null },
        { id: 'stock' as MasterViewType, label: 'Stock & Godown', icon: Layers, badge: null },
        { id: 'branches' as MasterViewType, label: 'Multi-Branch Hubs', icon: Warehouse, badge: 'Hubs' },
      ]
    },
    {
      title: 'AI & Growth',
      items: [
        { id: 'ai_reorder' as MasterViewType, label: 'AI Smart Re-Order', icon: Sparkles, badge: 'AI' },
        { id: 'online_dukan' as MasterViewType, label: 'Online Store Web', icon: Globe, badge: 'Live' },
        { id: 'barcode' as MasterViewType, label: 'Barcode & Labels', icon: Barcode, badge: null },
      ]
    },
    {
      title: 'Tax & Compliance',
      items: [
        { id: 'gst' as MasterViewType, label: 'GST & E-Way Bill', icon: FileCheck2, badge: 'Tax' },
        { id: 'analysis' as MasterViewType, label: 'P&L & Analytics', icon: PieChart, badge: null },
        { id: 'warranties' as MasterViewType, label: 'Service & Warranty', icon: Wrench, badge: null },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'roles' as MasterViewType, label: 'Role Permissions', icon: ShieldCheck, badge: null },
        { id: 'settings' as MasterViewType, label: 'Settings Master', icon: Settings, badge: null },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 ${
          isMinimal ? 'bg-white border-r border-slate-200/80 shadow-[1px_0_12px_rgba(0,0,0,0.02)]' : 'bg-white border-r border-slate-200'
        } flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header: Brand & Identity */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
              isMinimal ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
            }`}>
              B
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">
                  BizManager
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Enterprise Suite</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 group ${
                      isActive
                        ? isMinimal
                          ? 'bg-slate-900 text-white font-semibold shadow-sm'
                          : 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive 
                            ? 'text-white' 
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div className="text-left text-[11px] leading-tight">
              <p className="font-bold text-slate-800">Shree Shyam</p>
              <p className="text-slate-400 text-[10px]">Verified Store</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden flex justify-around items-center h-14 px-2">
        <button
          onClick={() => onSelectView('dashboard')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onSelectView('billing')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'billing' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[10px]">Billing</span>
        </button>

        <button
          onClick={() => onSelectView('customers')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'customers' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px]">Khata</span>
        </button>

        <button
          onClick={() => onSelectView('stock')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'stock' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Stock</span>
        </button>

        <button
          onClick={() => onSelectView('analysis')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'analysis' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span className="text-[10px]">Reports</span>
        </button>
      </div>
    </>
  );
};
