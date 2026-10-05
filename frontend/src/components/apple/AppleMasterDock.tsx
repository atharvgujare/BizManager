import React from 'react';
import { MasterViewType } from '../../types';
import { 
  LayoutDashboard, ShoppingCart, Users, Package, Layers, 
  FileSpreadsheet, PieChart, Barcode, FileCheck2, Building2, 
  Warehouse, Sparkles, Globe, Wrench, ShieldCheck, Settings
} from 'lucide-react';

interface AppleMasterDockProps {
  activeView: MasterViewType;
  onSelectView: (view: MasterViewType) => void;
}

export const AppleMasterDock: React.FC<AppleMasterDockProps> = ({
  activeView,
  onSelectView
}) => {
  const dockItems: { id: MasterViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing', label: 'POS Bill', icon: ShoppingCart },
    { id: 'customers', label: 'Khata', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'products', label: 'Catalog', icon: Package },
    { id: 'stock', label: 'Stock', icon: Layers },
    { id: 'branches', label: 'Branches', icon: Warehouse },
    { id: 'ai_reorder', label: 'AI Reorder', icon: Sparkles },
    { id: 'online_dukan', label: 'Online Store', icon: Globe },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
    { id: 'warranties', label: 'Service', icon: Wrench },
    { id: 'barcode', label: 'Labels', icon: Barcode },
    { id: 'gst', label: 'GST Tax', icon: FileCheck2 },
    { id: 'analysis', label: 'P&L / BI', icon: PieChart },
    { id: 'roles', label: 'Roles', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sticky top-16 z-40 w-full overflow-x-auto no-scrollbar py-2.5 px-4 mb-2">
      <div className="flex items-center space-x-1.5 p-1.5 apple-glass rounded-full max-w-fit mx-auto border border-black/[0.06] shadow-sm">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`apple-pill-tab px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
