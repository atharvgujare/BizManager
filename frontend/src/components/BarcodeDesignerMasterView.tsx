import React, { useState } from 'react';
import { Product, BusinessProfile, LabelConfig } from '../types';
import { 
  Barcode, Printer, Sliders, Layers, Sparkles, Plus, Minus, 
  Trash2, QrCode, CheckCircle2, RotateCcw, Copy, ExternalLink,
  Tag, Download, Eye, FileText
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface BarcodeDesignerMasterViewProps {
  products: Product[];
  business: BusinessProfile;
  currency?: string;
  uiMode?: UiMode;
}

interface PrintQueueItem {
  product: Product;
  quantity: number;
}

// Deterministic SVG Barcode generator
const SvgBarcode: React.FC<{ code: string; height?: number; width?: number }> = ({ 
  code, 
  height = 36, 
  width = 180 
}) => {
  // Generate pseudo-random deterministic bar patterns based on code characters
  const bars: { x: number; w: number }[] = [];
  let currentX = 10;
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Guard bars at start
  bars.push({ x: currentX, w: 2 });
  currentX += 4;
  bars.push({ x: currentX, w: 2 });
  currentX += 4;

  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = [(charCode % 3) + 1, ((charCode * 3) % 2) + 1, ((charCode * 7) % 3) + 1];
    pattern.forEach((barWidth, pIdx) => {
      if (pIdx % 2 === 0) {
        bars.push({ x: currentX, w: barWidth });
      }
      currentX += barWidth + 1.5;
    });
  }

  // Guard bars at end
  bars.push({ x: currentX, w: 2 });
  currentX += 4;
  bars.push({ x: currentX, w: 2 });

  return (
    <div className="flex flex-col items-center">
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${Math.max(currentX + 10, width)} ${height}`}
        className="w-full max-w-[190px] h-8"
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.w}
            height={height}
            fill="#111827"
          />
        ))}
      </svg>
      <span className="text-[10px] font-mono tracking-widest text-slate-700 mt-0.5 font-bold">
        {code}
      </span>
    </div>
  );
};

// Simplified SVG QR Code mockup
const SvgQrCode: React.FC<{ value: string; size?: number }> = ({ value, size = 44 }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        style={{ width: size, height: size }} 
        className="bg-white border-2 border-slate-900 p-0.5 rounded flex flex-col justify-between"
      >
        <div className="flex justify-between">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-2 h-2 bg-slate-900"></div>
        </div>
        <div className="flex justify-between">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-slate-900"></div>
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-600 mt-0.5">SCAN QR</span>
    </div>
  );
};

export const BarcodeDesignerMasterView: React.FC<BarcodeDesignerMasterViewProps> = ({
  products,
  business,
  currency = '₹',
  uiMode = 'apple'
}) => {
  // Label Configuration
  const [config, setConfig] = useState<LabelConfig>({
    size: '50x25',
    showStoreName: true,
    showProductName: true,
    showSku: true,
    showBarcode: true,
    showMrp: true,
    showOfferPrice: true,
    showPackedDate: true,
    barcodeType: 'CODE128',
    customTagline: 'M.R.P. Incl. of all taxes'
  });

  // Selected Products for batch printing queue
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([
    { product: products[0] || {} as Product, quantity: 12 },
    { product: products[1] || {} as Product, quantity: 6 },
    { product: products[2] || {} as Product, quantity: 24 }
  ]);

  const [activePreviewProduct, setActivePreviewProduct] = useState<Product>(products[0] || {} as Product);
  const [activeTab, setActiveTab] = useState<'designer' | 'sheet_preview'>('designer');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddProductToQueue = (p: Product) => {
    const existing = printQueue.find(item => item.product.id === p.id);
    if (existing) {
      setPrintQueue(printQueue.map(item => 
        item.product.id === p.id ? { ...item, quantity: item.quantity + 6 } : item
      ));
    } else {
      setPrintQueue([...printQueue, { product: p, quantity: 12 }]);
    }
    setActivePreviewProduct(p);
    showToast(`Added ${p.name} to Print Queue`);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setPrintQueue(printQueue.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveQueueItem = (productId: string) => {
    setPrintQueue(printQueue.filter(item => item.product.id !== productId));
  };

  const totalLabelsToPrint = printQueue.reduce((acc, item) => acc + item.quantity, 0);

  // Flatten print queue for the sheet preview
  const flatLabelsList = printQueue.flatMap(item => 
    Array.from({ length: item.quantity }).map(() => item.product)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Header */}
      <PageHeader
        title="Barcode & Price Tag Designer"
        subtitle="Design professional retail barcode stickers, customize MRP discounts, and print onto thermal rolls (50×25mm) or A4 sticker sheets."
        badge="Thermal Sticker & Price Tag Engine"
        icon={Barcode}
        classicGradient="from-emerald-700 via-teal-700 to-indigo-800"
        uiMode={uiMode}
        stats={[
          { label: 'Stickers in Print Queue', value: `${totalLabelsToPrint} Labels` },
          { label: 'Label Format', value: `${config.size} mm` }
        ]}
        actions={
          <button
            onClick={handlePrint}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition active:scale-95 ${
              uiMode === 'apple'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-white text-teal-900 shadow-xl hover:bg-teal-50'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print {totalLabelsToPrint} Labels</span>
          </button>
        }
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('designer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'designer'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Label Customizer & Live Single Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('sheet_preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'sheet_preview'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Batch Sheet & Roll View ({totalLabelsToPrint} Total)</span>
        </button>
      </div>

      {/* Designer Mode */}
      {activeTab === 'designer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Customization Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Label Size & Barcode Type Selector */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-teal-600" />
                <span>Physical Sticker Dimensions & Format</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: '50x25', label: '50mm × 25mm', sub: 'Standard Retail Roll' },
                  { id: '38x25', label: '38mm × 25mm', sub: 'Jewellery / Small' },
                  { id: '100x50', label: '100mm × 50mm', sub: 'Carton / Warehouse' },
                  { id: 'a4_sheet', label: 'A4 Sheet (24-Up)', sub: '3 Cols × 8 Rows' },
                ].map(sizeOpt => (
                  <button
                    key={sizeOpt.id}
                    onClick={() => setConfig({ ...config, size: sizeOpt.id as any })}
                    className={`p-3 rounded-2xl text-left border transition ${
                      config.size === sizeOpt.id
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-sm ring-1 ring-teal-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-extrabold text-xs">{sizeOpt.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sizeOpt.sub}</p>
                  </button>
                ))}
              </div>

              {/* Barcode Encoding Format */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Barcode Encoding Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CODE128', label: 'Code 128 (Standard)', desc: 'Alphanumeric SKU' },
                    { id: 'EAN13', label: 'EAN-13 / GTIN', desc: '13-digit standard' },
                    { id: 'QR', label: '2D QR Code', desc: 'Smartphone fast-scan' },
                  ].map(bType => (
                    <button
                      key={bType.id}
                      onClick={() => setConfig({ ...config, barcodeType: bType.id as any })}
                      className={`p-3 rounded-2xl text-left border transition ${
                        config.barcodeType === bType.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs">{bType.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{bType.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Elements Visibility Toggles */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>Visible Fields & Badges on Sticker</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'showStoreName', label: 'Store Name Header', sub: business.name },
                  { key: 'showProductName', label: 'Product Name', sub: 'Large prominent title' },
                  { key: 'showBarcode', label: 'Barcode Graphic & Digits', sub: 'Scannable thermal bars' },
                  { key: 'showSku', label: 'Item SKU / Item Code', sub: 'e.g. BEV-TEA-001' },
                  { key: 'showMrp', label: 'MRP & Tax Disclaimer', sub: 'M.R.P. (Incl. Taxes)' },
                  { key: 'showOfferPrice', label: 'Special Store Offer Price', sub: 'Dukan discounted price' },
                  { key: 'showPackedDate', label: 'Packed / Batch Date', sub: 'Month/Year Stamp' },
                ].map(toggle => (
                  <label
                    key={toggle.key}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{toggle.label}</p>
                      <p className="text-[10px] text-slate-400">{toggle.sub}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(config as any)[toggle.key]}
                      onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                    />
                  </label>
                ))}
              </div>

              {/* Custom Tagline Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Bottom Footer Note / Tagline
                </label>
                <input
                  type="text"
                  value={config.customTagline}
                  onChange={(e) => setConfig({ ...config, customTagline: e.target.value })}
                  placeholder="e.g. No Exchange Without Tag"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Print Queue Manager */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800">Print Queue ({printQueue.length} Products)</h2>
                  <p className="text-xs text-slate-400">Total stickers to print: {totalLabelsToPrint}</p>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-xl text-xs font-bold">
                  {totalLabelsToPrint} Stickers Ready
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {printQueue.map(item => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {item.product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400">{item.product.sku} • MRP: {currency}{item.product.price || item.product.sellingPrice}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => handleUpdateQty(item.product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-xs font-bold text-slate-700 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveQueueItem(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More from Catalog dropdown */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-600 mb-2">Quick Add Item to Queue:</p>
                <div className="flex flex-wrap gap-2">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddProductToQueue(p)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{p.name.slice(0, 18)}...</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky Label Physical Simulation (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-100/90 rounded-3xl p-6 sm:p-8 border border-slate-200/90 sticky top-20 shadow-inner flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  Live Physical Sticker Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded-full">
                  {config.size} Format
                </span>
              </div>

              {/* Target Product Switcher */}
              <div className="w-full mb-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Preview Item:</label>
                <select
                  value={activePreviewProduct.id}
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setActivePreviewProduct(found);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({currency}{p.price || p.sellingPrice})</option>
                  ))}
                </select>
              </div>

              {/* Physical Thermal Sticker Simulation */}
              <div 
                className={`bg-white rounded-lg shadow-xl border-2 border-dashed border-slate-300 p-3.5 flex flex-col justify-between items-center text-center transition-all ${
                  config.size === '50x25' 
                    ? 'w-[280px] min-h-[160px]' 
                    : config.size === '38x25'
                    ? 'w-[230px] min-h-[140px]'
                    : config.size === '100x50'
                    ? 'w-[320px] min-h-[220px]'
                    : 'w-[280px] min-h-[160px]'
                }`}
              >
                {/* Store Header */}
                {config.showStoreName && (
                  <p className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider line-clamp-1 border-b border-slate-200 pb-1 w-full">
                    {business.name}
                  </p>
                )}

                {/* Product Name & SKU */}
                <div className="w-full my-1">
                  {config.showProductName && (
                    <p className="font-black text-xs text-slate-900 leading-tight line-clamp-2">
                      {activePreviewProduct.name}
                    </p>
                  )}
                  {config.showSku && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      SKU: {activePreviewProduct.sku || 'SKU-001'}
                    </p>
                  )}
                </div>

                {/* Barcode Graphic */}
                {config.showBarcode && (
                  <div className="my-1 w-full flex justify-center">
                    {config.barcodeType === 'QR' ? (
                      <SvgQrCode value={activePreviewProduct.barcode || activePreviewProduct.sku || 'ITEM-001'} size={42} />
                    ) : (
                      <SvgBarcode code={activePreviewProduct.barcode || activePreviewProduct.sku || '890103001'} />
                    )}
                  </div>
                )}

                {/* Price & Offer Section */}
                <div className="w-full border-t border-slate-200 pt-1 flex items-center justify-between px-1">
                  {config.showMrp && (
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">M.R.P.</span>
                      <span className={`text-xs font-black ${config.showOfferPrice ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {currency}{Math.round((activePreviewProduct.price || activePreviewProduct.sellingPrice || 100) * 1.15)}
                      </span>
                    </div>
                  )}

                  {config.showOfferPrice && (
                    <div className="text-right">
                      <span className="text-[9px] text-emerald-700 block uppercase font-extrabold">OUR PRICE</span>
                      <span className="text-sm font-black text-emerald-600">
                        {currency}{activePreviewProduct.price || activePreviewProduct.sellingPrice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Tagline & Date */}
                <div className="w-full pt-1 flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 mt-1">
                  {config.showPackedDate && (
                    <span>Pkd: {new Date().toLocaleDateString('en-IN', { month: '2-digit', year: '2-digit' })}</span>
                  )}
                  <span className="truncate max-w-[170px]">{config.customTagline}</span>
                </div>
              </div>

              {/* Physical Notes */}
              <p className="text-[11px] text-slate-500 text-center mt-4 max-w-xs leading-relaxed">
                🖨️ Directly compatible with <strong>TVS, TSC, Zebra, Xprinter & Citizen</strong> thermal direct 50×25mm sticker rolls.
              </p>

              <button
                onClick={handlePrint}
                className="mt-4 w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-teal-600/25 transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Test Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Sheet & Roll View Mode */}
      {activeTab === 'sheet_preview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Thermal Roll / A4 Sticker Sheet Simulation
              </h2>
              <p className="text-xs text-slate-500">
                Displaying all {totalLabelsToPrint} sticky labels queued for printing.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center space-x-2 transition shadow-lg shadow-teal-600/25"
              >
                <Printer className="w-4 h-4" />
                <span>Print All {totalLabelsToPrint} Labels</span>
              </button>
            </div>
          </div>

          {/* Grid of All Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-slate-100 rounded-3xl">
            {flatLabelsList.map((prod, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-lg p-3 border border-slate-300 shadow-sm flex flex-col justify-between items-center text-center text-xs"
              >
                {config.showStoreName && (
                  <p className="font-extrabold text-[10px] text-slate-800 uppercase tracking-wide truncate w-full border-b border-slate-100 pb-0.5">
                    {business.name}
                  </p>
                )}

                <p className="font-bold text-[11px] text-slate-900 my-1 truncate w-full">
                  {prod.name}
                </p>

                {config.showBarcode && (
                  <div className="my-1 scale-90">
                    <SvgBarcode code={prod.barcode || prod.sku || `ITEM-${idx}`} />
                  </div>
                )}

                <div className="w-full flex justify-between items-center border-t border-slate-100 pt-1 text-[10px]">
                  <span className="line-through text-slate-400">
                    {currency}{Math.round((prod.price || prod.sellingPrice || 100) * 1.15)}
                  </span>
                  <span className="font-black text-emerald-600">
                    {currency}{prod.price || prod.sellingPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
