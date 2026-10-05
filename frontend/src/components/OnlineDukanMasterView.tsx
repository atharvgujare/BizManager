import React, { useState } from 'react';
import { OnlineOrder, Product, BusinessProfile } from '../types';
import { 
  Globe, ShoppingBag, Share2, Copy, CheckCircle2, Clock, 
  Bike, Phone, MapPin, Eye, ExternalLink, QrCode, 
  Check, ArrowRight, Sparkles
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface OnlineDukanMasterViewProps {
  orders: OnlineOrder[];
  products: Product[];
  business: BusinessProfile;
  onUpdateOrderStatus: (orderId: string, newStatus: OnlineOrder['orderStatus']) => void;
  currency?: string;
  uiMode?: UiMode;
}

export const OnlineDukanMasterView: React.FC<OnlineDukanMasterViewProps> = ({
  orders,
  products,
  business,
  onUpdateOrderStatus,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'storefront_preview'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'Packing' | 'Out for Delivery' | 'Delivered'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const storefrontUrl = `https://dukan.in/${business.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopiedLink(true);
    showToast('Online Dukan Storefront Link Copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Order fresh groceries & daily essentials online from ${business.name}! Click link to browse our WhatsApp catalog: ${storefrontUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAdvanceStatus = (order: OnlineOrder) => {
    const nextMap: Record<OnlineOrder['orderStatus'], OnlineOrder['orderStatus']> = {
      'New': 'Accepted',
      'Accepted': 'Packing',
      'Packing': 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      'Delivered': 'Delivered'
    };
    const nextStatus = nextMap[order.orderStatus];
    onUpdateOrderStatus(order.id, nextStatus);
    showToast(`Order #${order.orderNumber} updated to ${nextStatus}!`);
  };

  const filteredOrders = orders.filter(o => 
    statusFilter === 'all' ? true : o.orderStatus === statusFilter
  );

  const pendingOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered').length;
  const totalOnlineSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Header */}
      <PageHeader
        title="Online Dukan & Digital Storefront"
        subtitle="Accept digital orders directly from nearby customers, share your live catalog link on WhatsApp, and track home deliveries."
        badge="Digital Storefront & WhatsApp E-Commerce"
        icon={Globe}
        classicGradient="from-emerald-600 via-teal-600 to-indigo-800"
        uiMode={uiMode}
        stats={[
          { label: 'Pending Web Orders', value: `${pendingOrdersCount} Orders`, isHighlight: pendingOrdersCount > 0 },
          { label: 'Online Sales Volume', value: `${currency}${totalOnlineSales.toLocaleString()}` }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                uiMode === 'apple'
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Live Digital Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('storefront_preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'storefront_preview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Mobile Customer Storefront Preview</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* Order Status Badges Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {(['all', 'New', 'Packing', 'Out for Delivery', 'Delivered'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                  statusFilter === status
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order No</span>
                      <h3 className="font-mono font-black text-indigo-700 text-base">{order.orderNumber}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      order.orderStatus === 'New' 
                        ? 'bg-rose-100 text-rose-800 animate-pulse' 
                        : order.orderStatus === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-start space-x-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="mt-3 divide-y divide-slate-100 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between">
                        <span className="text-slate-700">{item.productName} × {item.quantity}</span>
                        <span className="font-bold text-slate-900">{currency}{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">{order.paymentMode} ({order.paymentStatus})</span>
                    <span className="text-base font-black text-slate-900">{currency}{order.totalAmount}</span>
                  </div>
                </div>

                {/* Status Advance Button */}
                {order.orderStatus !== 'Delivered' ? (
                  <button
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-sm shadow-emerald-600/20"
                  >
                    <span>Advance to Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-emerald-600 flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Order Successfully Delivered</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Storefront Mockup Preview */}
      {activeTab === 'storefront_preview' && (
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-12 border border-slate-200 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Live Customer Mobile View (What your buyers see on smartphone)
          </p>

          {/* Smartphone Frame Mockup */}
          <div className="w-[340px] bg-white rounded-[40px] shadow-2xl border-8 border-slate-800 overflow-hidden text-slate-900 flex flex-col">
            {/* Phone Notch */}
            <div className="h-5 bg-slate-800 rounded-b-xl w-36 mx-auto flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900"></div>
            </div>

            {/* Storefront Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">Open for delivery</span>
              <h3 className="font-extrabold text-base mt-1 leading-tight">{business.name}</h3>
              <p className="text-[11px] text-emerald-100 mt-0.5">Free 30-min express home delivery in your area</p>
            </div>

            {/* Products Feed */}
            <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
              <p className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Fresh Grocery Items</p>
              {products.slice(0, 4).map(prod => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-emerald-700 text-xs">
                      {prod.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800 truncate max-w-[130px]">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold text-emerald-600">{currency}{prod.price || prod.sellingPrice}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm">
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {/* View Cart Bar */}
            <div className="p-3 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">3 Items in Cart</span>
              <button className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
                Checkout (UPI)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
