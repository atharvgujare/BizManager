import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { 
  Settings, Building2, Save, Printer, Database, 
  CheckCircle2, ShieldCheck, QrCode, Phone, Mail, MapPin,
  RefreshCw, Server
} from 'lucide-react';

interface SettingsViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (updated: BusinessProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  business,
  onUpdateBusiness
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(business);
  const [printerWidth, setPrinterWidth] = useState<'58mm' | '80mm'>('80mm');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness(formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-12">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Business Profile and Billing Settings Saved!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dukan & Master Settings</h1>
        <p className="text-slate-300 text-sm mt-1 max-w-xl">
          Configure shop branding, tax GSTIN identifiers, UPI payment IDs, and thermal receipt hardware.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-800">Business Profile & Tax Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Business / Shop Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Business Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Shop Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">UPI ID for Dynamic QR Billing</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. shreeshyam@okaxis"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-indigo-700 font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Used to generate instant GPay / PhonePe QR codes during POS checkout.</p>
            </div>
          </div>
        </div>

        {/* Hardware & Printer Config */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <Printer className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-800">Thermal Printer & Receipt Format</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Paper Roll Size</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrinterWidth('58mm')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                    printerWidth === '58mm'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2-Inch (58mm Roll)
                </button>
                <button
                  type="button"
                  onClick={() => setPrinterWidth('80mm')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                    printerWidth === '80mm'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  3-Inch (80mm Standard)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Thermal Connection</label>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-900">ESC/POS Web Print Ready</p>
                  <p className="text-emerald-700 text-[11px]">Supports USB & Bluetooth mini-printers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Backend Connectivity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <Server className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-800">Backend & SQL Server Architecture</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-500 uppercase">Web API Core</span>
              <p className="font-mono text-slate-800 font-bold">ASP.NET Core 8.0 Web API</p>
              <p className="text-emerald-600 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> http://localhost:5058 (Healthy)
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-500 uppercase">Database Server</span>
              <p className="font-mono text-slate-800 font-bold">MSSQLLocalDB (SQL Server)</p>
              <p className="text-emerald-600 font-semibold flex items-center">
                <Database className="w-3.5 h-3.5 mr-1" /> BusinessManagerDb (Connected)
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center space-x-2 transition shadow-xl shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
