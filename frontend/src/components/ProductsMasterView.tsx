import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  Barcode,
  X,
  Check,
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Product, UserRole, UiMode } from '../types';

interface ProductsMasterViewProps {
  products: Product[];
  onAddProduct: (data: Partial<Product>) => Promise<boolean>;
  role: UserRole;
  currency: string;
  uiMode?: UiMode;
}

export const ProductsMasterView: React.FC<ProductsMasterViewProps> = ({
  products,
  onAddProduct,
  role,
  currency,
  uiMode = 'apple',
}) => {
  const [search, setSearch] = useState('');
  const [isAddModal, setIsAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('General');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [unit, setUnit] = useState('pcs');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search))
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sellingPrice.trim()) return;

    const ok = await onAddProduct({
      name: name.trim(),
      sku: sku.trim() || undefined,
      barcode: barcode.trim() || undefined,
      category: category.trim() || 'General',
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currentStock: parseInt(stock, 10) || 0,
      minStockAlert: 5,
      unit,
      isService: false,
    });

    if (ok) {
      setIsAddModal(false);
      setName('');
      setSku('');
      setBarcode('');
      setCostPrice('');
      setSellingPrice('');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Unified Header */}
      <PageHeader
        title="Products Catalog"
        subtitle="Multi-pricing, SKU, Barcodes & Stock Triggers"
        badge="Inventory & Items Master"
        icon={Package}
        classicGradient="from-indigo-600 via-blue-600 to-indigo-800"
        uiMode={uiMode}
        stats={[
          { label: 'Total Cataloged', value: `${products.length} Items` },
          { label: 'In Stock', value: `${products.filter(p => (p.currentStock ?? p.stock ?? 0) > 0).length} Items` },
          { 
            label: 'Low Stock Alerts', 
            value: `${products.filter(p => (p.currentStock ?? p.stock ?? 0) <= p.minStockAlert).length} Items`,
            isHighlight: products.some(p => (p.currentStock ?? p.stock ?? 0) <= p.minStockAlert)
          }
        ]}
        actions={
          role !== 'Cashier' && (
            <button
              onClick={() => setIsAddModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                uiMode === 'apple'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-md'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )
        }
      />

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by title, SKU or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
        />
      </div>

      {/* Products Master Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const isLow = !item.isService && item.currentStock <= item.minStockAlert;
          const margin = item.sellingPrice - item.costPrice;
          const marginPct = item.costPrice > 0 ? ((margin / item.costPrice) * 100).toFixed(0) : '100';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.isService ? 'Service' : `${item.currentStock} ${item.unit} in stock`}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-1">
                  <span>SKU: {item.sku || 'N/A'}</span>
                  {item.barcode && <span>• Barcode: {item.barcode}</span>}
                </div>
              </div>

              {/* Pricing & Margins */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Sell Price</div>
                  <div className="text-base font-black text-slate-900">
                    {currency}{item.sellingPrice.toFixed(2)}
                  </div>
                </div>

                {role !== 'Cashier' && (
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Cost / Margin</div>
                    <div className="text-xs font-extrabold text-emerald-600">
                      {currency}{item.costPrice.toFixed(0)} (+{marginPct}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-lg">Add Product Master</h3>
              <button
                type="button"
                onClick={() => setIsAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1">
                  Item / Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati Rice 5kg, Wireless Mouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="SKU-1001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Groceries, Hardware"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">
                    Selling Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">
                    Cost Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="pcs, kg, box"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/20 transition"
            >
              Add Product to Master
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
