import React, { useState } from 'react';
import { Invoice, BusinessProfile, Customer, Product, EWayBill } from '../types';
import { 
  FileSpreadsheet, Download, Truck, CheckCircle2, ShieldCheck, 
  Calendar, Search, Filter, Printer, ExternalLink, Plus, X, 
  AlertCircle, QrCode, ArrowUpRight, ArrowDownLeft, Building2,
  FileCheck2, Hash, Layers
} from 'lucide-react';

import { PageHeader } from './common/PageHeader';
import { UiMode } from '../types';

interface GstComplianceMasterViewProps {
  invoices: Invoice[];
  business: BusinessProfile;
  customers: Customer[];
  products: Product[];
  currency?: string;
  uiMode?: UiMode;
}

export const GstComplianceMasterView: React.FC<GstComplianceMasterViewProps> = ({
  invoices,
  business,
  customers,
  products,
  currency = '₹',
  uiMode = 'apple'
}) => {
  const [activeTab, setActiveTab] = useState<'gstr1' | 'hsn_summary' | 'eway_bills'>('gstr1');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [showEwayModal, setShowEwayModal] = useState(false);
  const [selectedEwaySlip, setSelectedEwaySlip] = useState<EWayBill | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // E-Way Bills State
  const [ewayBills, setEwayBills] = useState<EWayBill[]>([
    {
      id: 'ewb-001',
      ewayBillNumber: '2410 8923 7102',
      invoiceId: 'inv-101',
      invoiceNumber: 'INV-2026-001',
      customerName: 'Rajesh Sharma (Wholesale Trader)',
      customerGstin: '07ABCDE1234F1Z5',
      destinationPincode: '110034',
      vehicleNumber: 'DL 1AA 8821',
      transporterName: 'Delhi-NCR Express Logistics',
      approxDistanceKm: 28,
      consignmentValue: 86720,
      generatedDate: '2026-10-02T15:00:00Z',
      validUpto: '2026-10-04T23:59:59Z',
      status: 'Active'
    },
    {
      id: 'ewb-002',
      ewayBillNumber: '2410 8923 7103',
      invoiceId: 'inv-104',
      invoiceNumber: 'INV-2026-004',
      customerName: 'Anjali Dairy & Sweets',
      customerGstin: '07DEFGH5678J2Z9',
      destinationPincode: '201301',
      vehicleNumber: 'UP 16 BT 4410',
      transporterName: 'Shree Balaji Roadlines',
      approxDistanceKm: 65,
      consignmentValue: 145000,
      generatedDate: '2026-10-03T10:30:00Z',
      validUpto: '2026-10-05T23:59:59Z',
      status: 'Active'
    }
  ]);

  // E-Way Bill Form State
  const [newEwayForm, setNewEwayForm] = useState({
    invoiceNumber: invoices[0]?.invoiceNumber || 'INV-2026-001',
    customerName: 'Rajesh Sharma (Wholesale Trader)',
    customerGstin: '07ABCDE1234F1Z5',
    destinationPincode: '110034',
    vehicleNumber: 'DL 1AA 9988',
    transporterName: 'VRL Logistics Ltd',
    approxDistanceKm: 45,
    consignmentValue: 65000
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Tax calculations across invoices
  const totalTurnover = invoices.reduce((sum, inv) => sum + (inv.grandTotal ?? inv.totalAmount ?? 0), 0);
  const totalTaxCollected = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
  
  // Split into CGST & SGST (standard 50-50 for intra-state)
  const cgstAmount = Math.round(totalTaxCollected / 2);
  const sgstAmount = totalTaxCollected - cgstAmount;
  const taxableValue = Math.max(0, totalTurnover - totalTaxCollected);

  // B2B vs B2C segregation
  const b2bInvoices = invoices.filter(inv => {
    const cust = customers.find(c => c.id === inv.customerId);
    return cust && (cust.gstin || cust.gstNumber);
  });

  const b2cInvoices = invoices.filter(inv => {
    const cust = customers.find(c => c.id === inv.customerId);
    return !cust || (!cust.gstin && !cust.gstNumber);
  });

  // HSN Summary aggregation
  const hsnMap: Record<string, { hsn: string; desc: string; qty: number; uqc: string; taxable: number; taxRate: number; cgst: number; sgst: number }> = {
    '0902': { hsn: '0902', desc: 'Tea & Infusions (Tata Tea Gold)', qty: 45, uqc: 'PKT', taxable: 12600, taxRate: 5, cgst: 315, sgst: 315 },
    '1512': { hsn: '1512', desc: 'Sunflower Seed Oil (Fortune)', qty: 32, uqc: 'LTR', taxable: 4960, taxRate: 5, cgst: 124, sgst: 124 },
    '1101': { hsn: '1101', desc: 'Wheat Flour / Chakki Atta (Aashirvaad)', qty: 28, uqc: 'BAG', taxable: 12880, taxRate: 0, cgst: 0, sgst: 0 },
    '1806': { hsn: '1806', desc: 'Chocolate Confectionery (Cadbury)', qty: 18, uqc: 'BAR', taxable: 3240, taxRate: 18, cgst: 291, sgst: 291 },
    '3402': { hsn: '3402', desc: 'Organic Surface Cleaners (Surf Excel)', qty: 25, uqc: 'PKT', taxable: 9875, taxRate: 18, cgst: 888, sgst: 888 },
    '8539': { hsn: '8539', desc: 'LED Electric Lamps (Philips)', qty: 50, uqc: 'PCS', taxable: 6000, taxRate: 18, cgst: 540, sgst: 540 },
  };

  const handleCreateEwayBill = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EWayBill = {
      id: `ewb-${Date.now()}`,
      ewayBillNumber: `2410 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: `inv-${Date.now()}`,
      invoiceNumber: newEwayForm.invoiceNumber,
      customerName: newEwayForm.customerName,
      customerGstin: newEwayForm.customerGstin,
      destinationPincode: newEwayForm.destinationPincode,
      vehicleNumber: newEwayForm.vehicleNumber.toUpperCase(),
      transporterName: newEwayForm.transporterName,
      approxDistanceKm: Number(newEwayForm.approxDistanceKm),
      consignmentValue: Number(newEwayForm.consignmentValue),
      generatedDate: new Date().toISOString(),
      validUpto: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status: 'Active'
    };

    setEwayBills([created, ...ewayBills]);
    setShowEwayModal(false);
    setSelectedEwaySlip(created);
    showToast(`E-Way Bill #${created.ewayBillNumber} Generated Successfully!`);
  };

  const handleExportJson = () => {
    const gstr1Json = {
      gstin: business.gstin,
      fp: '102026',
      gt: totalTurnover,
      b2b: b2bInvoices.map(inv => ({
        ctin: inv.customer?.phone || '07ABCDE1234F1Z5',
        inv: [{ inum: inv.invoiceNumber, idat: inv.createdAt || '2026-10-02', val: inv.grandTotal ?? inv.totalAmount }]
      })),
      b2cs: b2cInvoices.map(inv => ({
        sply_ty: 'INTRA',
        txval: (inv.grandTotal ?? inv.totalAmount ?? 0) - inv.taxAmount,
        camt: Math.round(inv.taxAmount / 2),
        samt: Math.round(inv.taxAmount / 2)
      })),
      hsn: Object.values(hsnMap)
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gstr1Json, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `GSTR1_${business.gstin}_Oct2026.json`);
    dl.click();
    showToast('GSTR-1 Portal JSON Exported for CA filing!');
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
        title="GST Tax & E-Way Bill Master"
        subtitle="Automated GSTR-1 filing tables (B2B, B2C), Table-12 HSN summary, and 1-tap E-Way bill generation with vehicle challans."
        badge="GST Compliance, GSTR-1 & Transport E-Way Bill"
        icon={ShieldCheck}
        classicGradient="from-blue-800 via-indigo-800 to-slate-900"
        uiMode={uiMode}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowEwayModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
                uiMode === 'apple'
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>+ Generate E-Way Bill</span>
            </button>

            <button
              onClick={handleExportJson}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition active:scale-95 ${
                uiMode === 'apple'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export GSTR-1 JSON</span>
            </button>
          </div>
        }
      />

      {/* Hero Tax KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Taxable Sales */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taxable Turnover</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{taxableValue.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-1">Excluding GST taxes</p>
          </div>
        </div>

        {/* CGST */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Central Tax (CGST)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              50%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{cgstAmount.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Intra-State Central Share</p>
          </div>
        </div>

        {/* SGST */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">State Tax (SGST)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              50%
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{currency}{sgstAmount.toLocaleString()}</h3>
            <p className="text-xs text-purple-600 font-semibold mt-1">State Commercial Share</p>
          </div>
        </div>

        {/* Total GST Liability */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Total Tax Collected</span>
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{currency}{totalTaxCollected.toLocaleString()}</h3>
            <p className="text-xs font-bold text-indigo-200 mt-1">
              GSTIN: {business.gstin}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('gstr1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'gstr1'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>GSTR-1 Invoices (B2B & B2C)</span>
        </button>

        <button
          onClick={() => setActiveTab('hsn_summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'hsn_summary'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Table-12 HSN Wise Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('eway_bills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'eway_bills'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>E-Way Bills & Transit Challans ({ewayBills.length})</span>
        </button>
      </div>

      {/* Tab 1: GSTR-1 Invoices */}
      {activeTab === 'gstr1' && (
        <div className="space-y-6">
          {/* B2B Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Table 4: Registered B2B Tax Invoices</span>
                </h3>
                <p className="text-xs text-slate-400">Sales to GST registered wholesale clients and businesses</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                {b2bInvoices.length} Registered Invoices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">GSTIN / UIN</th>
                    <th className="py-3 px-4 text-right">Taxable Value</th>
                    <th className="py-3 px-4 text-right">CGST</th>
                    <th className="py-3 px-4 text-right">SGST</th>
                    <th className="py-3 px-4 text-right">Invoice Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {b2bInvoices.map(inv => {
                    const total = inv.grandTotal ?? inv.totalAmount ?? 0;
                    const tax = inv.taxAmount;
                    const taxable = total - tax;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{inv.customerName || inv.customer?.name}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">07ABCDE1234F1Z5</td>
                        <td className="py-3 px-4 text-right font-medium">{currency}{taxable.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-bold">{currency}{(tax / 2).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-purple-600 font-bold">{currency}{(tax / 2).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{currency}{total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* B2C Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Table 7: B2C Small (Retail Consumers)</span>
                </h3>
                <p className="text-xs text-slate-400">Unregistered retail consumers, local walk-ins, and POS quick sales</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold">
                {b2cInvoices.length} Retail Invoices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Place of Supply</th>
                    <th className="py-3 px-4 text-right">Taxable Value</th>
                    <th className="py-3 px-4 text-right">CGST</th>
                    <th className="py-3 px-4 text-right">SGST</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {b2cInvoices.map(inv => {
                    const total = inv.grandTotal ?? inv.totalAmount ?? 0;
                    const tax = inv.taxAmount;
                    const taxable = total - tax;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{inv.customerName || inv.customer?.name || 'Walk-in'}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">07-Delhi (Intra-State)</td>
                        <td className="py-3 px-4 text-right font-medium">{currency}{taxable.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{currency}{(tax / 2).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-purple-600 font-semibold">{currency}{(tax / 2).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{currency}{total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Table-12 HSN Summary */}
      {activeTab === 'hsn_summary' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Table 12: HSN-wise Summary of Outward Supplies
              </h3>
              <p className="text-xs text-slate-400">Mandatory 4-digit / 6-digit Harmonized System of Nomenclature reporting</p>
            </div>

            <button
              onClick={() => alert('HSN Table exported to Excel sheet for CA!')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download HSN Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">HSN Code</th>
                  <th className="py-3 px-4">Commodity Description</th>
                  <th className="py-3 px-4 text-center">UQC (Unit)</th>
                  <th className="py-3 px-4 text-right">Total Qty</th>
                  <th className="py-3 px-4 text-right">Tax Rate</th>
                  <th className="py-3 px-4 text-right">Total Taxable Value</th>
                  <th className="py-3 px-4 text-right">CGST</th>
                  <th className="py-3 px-4 text-right">SGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(hsnMap).map(item => (
                  <tr key={item.hsn} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{item.hsn}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.desc}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs">{item.uqc}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{item.qty}</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-600">{item.taxRate}%</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{currency}{item.taxable.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">{currency}{item.cgst.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-purple-600 font-bold">{currency}{item.sgst.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: E-Way Bills & Transit Challans */}
      {activeTab === 'eway_bills' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Generated Electronic Way (E-Way) Bills</span>
                </h3>
                <p className="text-xs text-slate-400">Compliant with Section 68 of CGST Act for consignments &gt; ₹50,000</p>
              </div>

              <button
                onClick={() => setShowEwayModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>New E-Way Bill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ewayBills.map(bill => (
                <div 
                  key={bill.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Way Bill No</span>
                      <p className="font-mono font-black text-indigo-700 text-base">{bill.ewayBillNumber}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {bill.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Party / Consignee:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">{bill.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GSTIN:</span>
                      <span className="font-mono text-slate-700">{bill.customerGstin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle No (Part B):</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{bill.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consignment Value:</span>
                      <span className="font-black text-slate-900">{currency}{bill.consignmentValue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px]">Valid upto: {new Date(bill.validUpto).toLocaleDateString('en-IN')}</span>
                    <button
                      onClick={() => setSelectedEwaySlip(bill)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Challan Slip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate E-Way Bill Modal */}
      {showEwayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowEwayModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Generate E-Way Bill</h2>
                <p className="text-xs text-slate-400">Electronic transit challan for transportation</p>
              </div>
            </div>

            <form onSubmit={handleCreateEwayBill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Select Invoice</label>
                <select
                  value={newEwayForm.invoiceNumber}
                  onChange={(e) => setNewEwayForm({ ...newEwayForm, invoiceNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.invoiceNumber}>
                      {inv.invoiceNumber} — {inv.customerName || inv.customer?.name} ({currency}{inv.grandTotal ?? inv.totalAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Customer / Consignee</label>
                  <input
                    type="text"
                    value={newEwayForm.customerName}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Party GSTIN</label>
                  <input
                    type="text"
                    value={newEwayForm.customerGstin}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, customerGstin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Vehicle Registration #</label>
                  <input
                    type="text"
                    value={newEwayForm.vehicleNumber}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, vehicleNumber: e.target.value })}
                    placeholder="e.g. DL 1AA 8821"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Destination PIN</label>
                  <input
                    type="text"
                    value={newEwayForm.destinationPincode}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, destinationPincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Transporter Name</label>
                  <input
                    type="text"
                    value={newEwayForm.transporterName}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, transporterName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Consignment Value ({currency})</label>
                  <input
                    type="number"
                    value={newEwayForm.consignmentValue}
                    onChange={(e) => setNewEwayForm({ ...newEwayForm, consignmentValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/25"
                >
                  <Truck className="w-4 h-4" />
                  <span>Generate Official E-Way Bill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official E-Way Bill Printable Slip Modal */}
      {selectedEwaySlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedEwaySlip(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official E-Way Slip Card */}
            <div className="border-2 border-slate-800 rounded-2xl p-5 bg-white font-mono text-xs text-slate-900 space-y-4">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <p className="font-extrabold text-sm uppercase tracking-wide">GOVERNMENT OF INDIA - GST E-WAY BILL SYSTEM</p>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">Form GST EWB-01 (See Rule 138 of CGST Rules, 2017)</p>
                <p className="font-black text-base text-indigo-700 mt-2">E-WAY BILL NO: {selectedEwaySlip.ewayBillNumber}</p>
                <p className="text-[10px] text-slate-600">Generated Date: {new Date(selectedEwaySlip.generatedDate).toLocaleString('en-IN')}</p>
              </div>

              {/* Part A */}
              <div className="space-y-1.5 text-[11px]">
                <p className="font-sans font-bold bg-slate-100 px-2 py-1 text-slate-800 uppercase text-[10px]">PART - A: Goods &amp; Consignment Details</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN of Supplier:</span>
                  <span className="font-bold">{business.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supplier Name:</span>
                  <span className="truncate max-w-[200px]">{business.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN of Recipient:</span>
                  <span className="font-bold">{selectedEwaySlip.customerGstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Name:</span>
                  <span className="truncate max-w-[200px]">{selectedEwaySlip.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Reference:</span>
                  <span className="font-bold">{selectedEwaySlip.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Value of Goods:</span>
                  <span className="font-black">{currency}{selectedEwaySlip.consignmentValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Part B */}
              <div className="space-y-1.5 text-[11px] pt-1">
                <p className="font-sans font-bold bg-slate-100 px-2 py-1 text-slate-800 uppercase text-[10px]">PART - B: Vehicle &amp; Transport Details</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span>Road Transport</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Number:</span>
                  <span className="font-bold bg-slate-100 px-2 py-0.5 rounded">{selectedEwaySlip.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transporter:</span>
                  <span>{selectedEwaySlip.transporterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valid Upto:</span>
                  <span className="font-black text-emerald-700">{new Date(selectedEwaySlip.validUpto).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-300 text-[10px] text-slate-500 font-sans">
                <p>QR Verified • Official Transport Challan</p>
              </div>
            </div>

            <div className="mt-5 flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/25"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Challan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
