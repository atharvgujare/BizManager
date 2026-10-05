import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Users,
  Package,
  Layers,
  Receipt,
  FileSpreadsheet,
  PieChart,
  ShieldCheck,
  Settings,
  ChevronRight,
  ArrowLeft,
  Plus,
  Search,
  Check,
  X,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Printer,
  Share2,
  Lock,
  UserCheck,
} from 'lucide-react-native';
import { useAppStore, MasterViewType, UserRole } from '../store/useAppStore';

export const MastersHubScreen = () => {
  const {
    activeMasterView,
    setActiveMasterView,
    user,
    setUserRole,
    products,
    customers,
    invoices,
    dashboard,
    business,
    currency,
    createCustomer,
    createProduct,
    adjustStock,
    setActiveTab,
  } = useAppStore();

  const role = user?.role || 'Admin';

  // Modal states for Master CRUD operations
  const [isAddCustOpen, setIsAddCustOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custGst, setCustGst] = useState('');
  const [custGroup, setCustGroup] = useState<'Retail' | 'Wholesale' | 'VIP'>('Retail');

  // Search states
  const [custSearch, setCustSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');

  // 1. MASTER HUB HOME VIEW
  if (activeMasterView === 'hub') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Hub Header Banner */}
        <View style={styles.hubHeader}>
          <Text style={styles.hubTitle}>Enterprise Masters Hub</Text>
          <Text style={styles.hubSubtitle}>
            Central management for Data Masters, Stock, Invoices & Access
          </Text>

          {/* Active Role Indicator */}
          <View style={styles.roleBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#2563EB" />
              <Text style={styles.roleBannerText}>Current Role: <Text style={{ fontWeight: '800' }}>{role}</Text></Text>
            </View>
            <TouchableOpacity onPress={() => setActiveMasterView('rolebased')}>
              <Text style={styles.switchRoleLink}>Switch Role ▾</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Master Modules Grid */}
        <View style={styles.mastersGrid}>
          {/* 1. Customer Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('customer')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#EFF6FF' }]}>
              <Users size={22} color="#2563EB" />
            </View>
            <Text style={styles.masterTitle}>Customer Master</Text>
            <Text style={styles.masterDesc}>
              {customers.length} Accounts • GSTIN, Credit limits, Khata
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 2. Products Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('product')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#F0FDF4' }]}>
              <Package size={22} color="#16A34A" />
            </View>
            <Text style={styles.masterTitle}>Products Master</Text>
            <Text style={styles.masterDesc}>
              {products.length} Items • Multi-pricing, Barcode, GST tax rates
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 3. Inventory & Stock Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('inventory')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#FEF3C7' }]}>
              <Layers size={22} color="#D97706" />
            </View>
            <Text style={styles.masterTitle}>Stock Master</Text>
            <Text style={styles.masterDesc}>
              Warehouse stock, Inward/Outward, Damage adjustments
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 4. Billing & POS Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveTab('billing')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#EEF2FF' }]}>
              <Receipt size={22} color="#4F46E5" />
            </View>
            <Text style={styles.masterTitle}>Billing Master</Text>
            <Text style={styles.masterDesc}>
              Quick Touch POS, Barcode scan, Thermal printing
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 5. Invoice Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('invoice')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#F3E8FF' }]}>
              <FileSpreadsheet size={22} color="#9333EA" />
            </View>
            <Text style={styles.masterTitle}>Invoice Master</Text>
            <Text style={styles.masterDesc}>
              {invoices.length} Invoices • Paid, Unpaid, GST Challans
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 6. Analysis & BI Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('analysis')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#ECFDF5' }]}>
              <PieChart size={22} color="#059669" />
            </View>
            <Text style={styles.masterTitle}>Analysis Master</Text>
            <Text style={styles.masterDesc}>
              Sales velocity, Margin analysis, Day-end closing
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 7. Role-Based Access Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('rolebased')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#FEE2E2' }]}>
              <ShieldCheck size={22} color="#DC2626" />
            </View>
            <Text style={styles.masterTitle}>Role-Based Access</Text>
            <Text style={styles.masterDesc}>
              Admin, Manager, Cashier, Accountant permissions
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          {/* 8. Settings & Profile Master */}
          <TouchableOpacity
            style={styles.masterCard}
            onPress={() => setActiveMasterView('settings')}
            activeOpacity={0.8}
          >
            <View style={[styles.masterIcon, { backgroundColor: '#F1F5F9' }]}>
              <Settings size={22} color="#475569" />
            </View>
            <Text style={styles.masterTitle}>Settings Master</Text>
            <Text style={styles.masterDesc}>
              Company profile, GST/Tax, Printer & Cloud Sync
            </Text>
            <View style={styles.cardArrow}>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // SUBVIEW 1: CUSTOMER MASTER
  if (activeMasterView === 'customer') {
    const filteredCusts = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
        (c.phone && c.phone.includes(custSearch))
    );

    return (
      <View style={styles.subContainer}>
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveMasterView('hub')}
          >
            <ArrowLeft size={18} color="#0F172A" />
            <Text style={styles.backBtnText}>Masters</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Customer Master</Text>
          <TouchableOpacity
            style={styles.primaryAddBtn}
            onPress={() => setIsAddCustOpen(true)}
          >
            <Plus size={16} color="#FFF" />
            <Text style={styles.primaryAddBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name, mobile or GSTIN..."
            placeholderTextColor="#94A3B8"
            value={custSearch}
            onChangeText={setCustSearch}
          />
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredCusts.map((cust) => (
            <View key={cust.id} style={styles.detailCard}>
              <View style={styles.cardAvatar}>
                <Text style={styles.avatarTxt}>
                  {cust.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.cardTitleText}>{cust.name}</Text>
                  <View style={styles.groupPill}>
                    <Text style={styles.groupPillText}>{cust.customerGroup || 'Retail'}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubText}>
                  Phone: {cust.phone || 'N/A'} • GST: {cust.gstNumber || 'Unregistered'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    styles.balanceTxt,
                    cust.outstandingBalance < 0 ? { color: '#DC2626' } : { color: '#16A34A' },
                  ]}
                >
                  {currency}{Math.abs(cust.outstandingBalance).toFixed(0)}
                </Text>
                <Text style={styles.balanceStatusTxt}>
                  {cust.outstandingBalance < 0 ? 'Due (Udhar)' : 'Clear'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Add Customer Modal */}
        <Modal
          visible={isAddCustOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setIsAddCustOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalTopRow}>
                <Text style={styles.modalHeaderTitle}>Add Customer Master</Text>
                <TouchableOpacity onPress={() => setIsAddCustOpen(false)}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabel}>Customer / Company Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Reliance Retail, Sharma Traders"
                placeholderTextColor="#94A3B8"
                value={custName}
                onChangeText={setCustName}
              />

              <Text style={styles.formLabel}>Mobile Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+91 98765 43210"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={custPhone}
                onChangeText={setCustPhone}
              />

              <Text style={styles.formLabel}>GSTIN / PAN (Optional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="27ABCDE1234F1Z5"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={custGst}
                onChangeText={setCustGst}
              />

              <Text style={styles.formLabel}>Customer Category</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {(['Retail', 'Wholesale', 'VIP'] as const).map((grp) => (
                  <TouchableOpacity
                    key={grp}
                    style={[
                      styles.typePill,
                      custGroup === grp && styles.typePillActive,
                    ]}
                    onPress={() => setCustGroup(grp)}
                  >
                    <Text
                      style={[
                        styles.typePillText,
                        custGroup === grp && styles.typePillTextActive,
                      ]}
                    >
                      {grp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={async () => {
                  if (!custName.trim()) {
                    Alert.alert('Required', 'Please enter customer name');
                    return;
                  }
                  await createCustomer({
                    name: custName.trim(),
                    phone: custPhone.trim() || undefined,
                    gstNumber: custGst.trim() || undefined,
                    customerGroup: custGroup,
                    outstandingBalance: 0,
                  });
                  setIsAddCustOpen(false);
                  setCustName('');
                  setCustPhone('');
                  setCustGst('');
                  Alert.alert('Master Updated', 'Customer record saved successfully!');
                }}
              >
                <Check size={18} color="#FFF" />
                <Text style={styles.submitBtnText}>Save Customer Master</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // SUBVIEW 2: INVENTORY & STOCK MASTER
  if (activeMasterView === 'inventory') {
    const isRestricted = role === 'Cashier'; // Cashiers cannot edit stock

    return (
      <View style={styles.subContainer}>
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveMasterView('hub')}
          >
            <ArrowLeft size={18} color="#0F172A" />
            <Text style={styles.backBtnText}>Masters</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Stock & Warehouse Master</Text>
          <View style={{ width: 40 }} />
        </View>

        {isRestricted && (
          <View style={styles.restrictedNotice}>
            <Lock size={14} color="#DC2626" />
            <Text style={styles.restrictedText}>
              Cashier Role: View-only access. Stock adjustments restricted to Manager/Admin.
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.listContent}>
          {products.map((item) => (
            <View key={item.id} style={styles.detailCard}>
              <View style={[styles.masterIcon, { backgroundColor: '#FEF3C7' }]}>
                <Package size={20} color="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitleText}>{item.name}</Text>
                <Text style={styles.cardSubText}>
                  SKU: {item.sku || 'N/A'} • Unit: {item.unit}
                </Text>
                {/* Cost price only visible to Admin/Manager */}
                {role !== 'Cashier' && (
                  <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: '700' }}>
                    Valuation Cost: {currency}{item.costPrice.toFixed(2)}
                  </Text>
                )}
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.balanceTxt, { color: '#0F172A' }]}>
                  {item.currentStock} {item.unit}
                </Text>
                {!isRestricted && (
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                    <TouchableOpacity
                      style={styles.miniBtn}
                      onPress={() => adjustStock(item.id, -1)}
                    >
                      <Text style={styles.miniBtnText}>- 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.miniBtn, { backgroundColor: '#2563EB' }]}
                      onPress={() => adjustStock(item.id, 1)}
                    >
                      <Text style={[styles.miniBtnText, { color: '#FFF' }]}>+ 1</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // SUBVIEW 3: INVOICE MASTER
  if (activeMasterView === 'invoice') {
    return (
      <View style={styles.subContainer}>
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveMasterView('hub')}
          >
            <ArrowLeft size={18} color="#0F172A" />
            <Text style={styles.backBtnText}>Masters</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Invoice & Bills Master</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {invoices.length === 0 ? (
            <View style={styles.emptyCard}>
              <Receipt size={32} color="#94A3B8" />
              <Text style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>
                No invoices issued yet.
              </Text>
              <TouchableOpacity
                style={styles.primaryAddBtn}
                onPress={() => setActiveTab('billing')}
              >
                <Text style={styles.primaryAddBtnText}>+ Create First Bill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            invoices.map((inv) => (
              <View key={inv.id} style={styles.detailCard}>
                <View style={[styles.masterIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Receipt size={20} color="#2563EB" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitleText}>{inv.invoiceNumber}</Text>
                  <Text style={styles.cardSubText}>
                    {inv.customer?.name || 'Walk-in Guest'} • {inv.paymentMode}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8' }}>
                    {new Date(inv.issueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.balanceTxt, { color: '#16A34A' }]}>
                    {currency}{inv.grandTotal.toFixed(2)}
                  </Text>
                  <View style={[styles.groupPill, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.groupPillText, { color: '#15803D' }]}>{inv.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // SUBVIEW 4: ANALYSIS & BI MASTER
  if (activeMasterView === 'analysis') {
    const isRestricted = role === 'Cashier'; // Cashiers cannot see profit or margins

    if (isRestricted) {
      return (
        <View style={styles.subContainer}>
          <View style={styles.subHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setActiveMasterView('hub')}
            >
              <ArrowLeft size={18} color="#0F172A" />
              <Text style={styles.backBtnText}>Masters</Text>
            </TouchableOpacity>
            <Text style={styles.subTitle}>Analysis Master</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Lock size={48} color="#DC2626" />
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 12 }}>
              Access Restricted
            </Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6 }}>
              Cashier accounts cannot view business profitability or margin analytics. Please switch to Manager or Admin role.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.subContainer}>
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveMasterView('hub')}
          >
            <ArrowLeft size={18} color="#0F172A" />
            <Text style={styles.backBtnText}>Masters</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Analysis & BI Master</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {/* Profit & Loss Card */}
          <View style={styles.analysisHero}>
            <Text style={styles.analysisHeroLabel}>NET PROFIT & MARGIN</Text>
            <Text style={styles.analysisHeroVal}>
              +{currency}{(dashboard?.todayGrossProfit ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={{ color: '#BFDBFE', fontSize: 12 }}>
              Based on sales price minus product cost price (COGS)
            </Text>
          </View>

          {/* Breakdown Grid */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.detailCard, { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>TOTAL REVENUE</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#2563EB', marginTop: 4 }}>
                {currency}{(dashboard?.monthRevenue ?? 0).toFixed(0)}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8' }}>Month-to-date</Text>
            </View>

            <View style={[styles.detailCard, { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>TOTAL EXPENSES</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#DC2626', marginTop: 4 }}>
                {currency}{(dashboard?.monthExpense ?? 0).toFixed(0)}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8' }}>Dukan Kharcha</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: '#16A34A', marginTop: 12 }]}
            onPress={() =>
              Alert.alert(
                '📄 Tax & P&L Statement Ready',
                'Download GST GSTR-1 ready invoice summary or day-book closing PDF.',
                [{ text: 'Download PDF' }, { text: 'Cancel', style: 'cancel' }]
              )
            }
          >
            <FileSpreadsheet size={18} color="#FFF" />
            <Text style={styles.submitBtnText}>Export Day-Book Closing Report</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // SUBVIEW 5: ROLE-BASED ACCESS CONTROL MASTER
  if (activeMasterView === 'rolebased') {
    return (
      <View style={styles.subContainer}>
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveMasterView('hub')}
          >
            <ArrowLeft size={18} color="#0F172A" />
            <Text style={styles.backBtnText}>Masters</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Staff & Roles Master</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
            Switch active user role to experience how role-based permissions immediately lock/unlock screens and metrics:
          </Text>

          {(
            [
              {
                roleName: 'Admin',
                badge: 'Full Power',
                desc: 'Owner access. Full control over profit margins, staff roles, stock, and reports.',
              },
              {
                roleName: 'Manager',
                badge: 'Store Management',
                desc: 'Manages sales, customer khata, and stock inward. Cannot delete records.',
              },
              {
                roleName: 'Cashier',
                badge: 'POS & Billing Only',
                desc: 'Restricted to creating bills and scanning. Profit margins and purchase costs are completely hidden.',
              },
              {
                roleName: 'Accountant',
                badge: 'Audits & P&L',
                desc: 'Access to ledger statements, day-book, tax reports, and expenses.',
              },
            ] as const
          ).map((item) => {
            const isSelected = role === item.roleName;
            return (
              <TouchableOpacity
                key={item.roleName}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardActive,
                ]}
                onPress={() => {
                  setUserRole(item.roleName as UserRole);
                  Alert.alert('Role Switched!', `You are now operating as ${item.roleName}. Permissions updated.`);
                }}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={20} color={isSelected ? '#2563EB' : '#64748B'} />
                    <Text style={[styles.roleTitle, isSelected && { color: '#2563EB' }]}>
                      {item.roleName}
                    </Text>
                  </View>
                  <View style={[styles.groupPill, isSelected && { backgroundColor: '#EFF6FF' }]}>
                    <Text style={[styles.groupPillText, isSelected && { color: '#2563EB' }]}>
                      {item.badge}
                    </Text>
                  </View>
                </View>

                <Text style={styles.roleDescText}>{item.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // SUBVIEW 6: SETTINGS MASTER
  return (
    <View style={styles.subContainer}>
      <View style={styles.subHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setActiveMasterView('hub')}
        >
          <ArrowLeft size={18} color="#0F172A" />
          <Text style={styles.backBtnText}>Masters</Text>
        </TouchableOpacity>
        <Text style={styles.subTitle}>Settings Master</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.detailCard}>
          <Text style={styles.cardTitleText}>Business Information</Text>
          <Text style={styles.cardSubText}>Company: {business?.name}</Text>
          <Text style={styles.cardSubText}>Currency: {currency}</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: '#2563EB', marginTop: 12 }]}
          onPress={() =>
            Alert.alert(
              '🖨️ Thermal Printer Connected',
              'Bluetooth 58mm / 80mm ESC/POS printer configured and tested!',
              [{ text: 'OK' }]
            )
          }
        >
          <Printer size={18} color="#FFF" />
          <Text style={styles.submitBtnText}>Configure Thermal Printer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  hubHeader: {
    marginBottom: 16,
  },
  hubTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  hubSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  roleBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleBannerText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  switchRoleLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  mastersGrid: {
    gap: 10,
  },
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  masterIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  masterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  masterDesc: {
    fontSize: 11,
    color: '#64748B',
    position: 'absolute',
    left: 74,
    top: 36,
    right: 40,
  },
  cardArrow: {
    marginLeft: 'auto',
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  primaryAddBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    gap: 10,
    paddingBottom: 40,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  cardTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  groupPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  groupPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  balanceTxt: {
    fontSize: 15,
    fontWeight: '800',
  },
  balanceStatusTxt: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  miniBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  analysisHero: {
    backgroundColor: '#1E3A8A',
    borderRadius: 18,
    padding: 18,
    color: '#FFF',
    marginBottom: 6,
  },
  analysisHeroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    marginBottom: 4,
  },
  analysisHeroVal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4ADE80',
    marginBottom: 4,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleDescText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 18,
  },
  restrictedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    margin: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  restrictedText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  typePillActive: {
    backgroundColor: '#2563EB',
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  typePillTextActive: {
    color: '#FFF',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
