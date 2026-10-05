import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  PlusCircle,
  TrendingUp,
  Receipt,
  Users,
  Package,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  CreditCard,
  QrCode,
} from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';

export const DashboardScreen = () => {
  const { dashboard, currency, fetchDashboard, setActiveTab, isLoading } = useAppStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchDashboard}
          tintColor="#2563EB"
        />
      }
    >
      {/* PhonePe / GPay Style Hero Gradient Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>TODAY'S TOTAL SALES</Text>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Today Live</Text>
          </View>
        </View>

        <Text style={styles.heroAmount}>
          {currency}
          {(dashboard?.todayRevenue ?? 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <View style={styles.heroMetricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Net Profit</Text>
            <Text style={[styles.metricVal, { color: '#16A34A' }]}>
              +{currency}{(dashboard?.todayGrossProfit ?? 0).toFixed(0)}
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Bills</Text>
            <Text style={styles.metricVal}>
              {dashboard?.todayOrdersCount ?? 0} Orders
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>This Month</Text>
            <Text style={styles.metricVal}>
              {currency}{(dashboard?.monthRevenue ?? 0).toFixed(0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Action Circular Icons (Like PhonePe / Paytm / GPay) */}
      <View style={styles.quickActionCard}>
        <TouchableOpacity
          style={styles.actionCol}
          onPress={() => setActiveTab('pos')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionCircle, { backgroundColor: '#EFF6FF' }]}>
            <Receipt size={24} color="#2563EB" />
          </View>
          <Text style={styles.actionText}>Make Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCol}
          onPress={() => setActiveTab('khata')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionCircle, { backgroundColor: '#F0FDF4' }]}>
            <Users size={24} color="#16A34A" />
          </View>
          <Text style={styles.actionText}>Khata Book</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCol}
          onPress={() => setActiveTab('inventory')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionCircle, { backgroundColor: '#FEF3C7' }]}>
            <Package size={24} color="#D97706" />
          </View>
          <Text style={styles.actionText}>Add Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCol}
          onPress={() => setActiveTab('more')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionCircle, { backgroundColor: '#FFF1F2' }]}>
            <PlusCircle size={24} color="#E11D48" />
          </View>
          <Text style={styles.actionText}>Add Kharcha</Text>
        </TouchableOpacity>
      </View>

      {/* Khatabook Style Udhar Summary Cards */}
      <View style={styles.khataOverview}>
        <View style={[styles.khataCard, { borderLeftColor: '#16A34A' }]}>
          <Text style={styles.khataCardLabel}>YOU WILL GET (UDHAR)</Text>
          <Text style={[styles.khataCardValue, { color: '#16A34A' }]}>
            {currency}{(dashboard?.totalReceivables ?? 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.khataCardSub}>From customers</Text>
        </View>

        <View style={[styles.khataCard, { borderLeftColor: '#DC2626' }]}>
          <Text style={styles.khataCardLabel}>YOU WILL PAY</Text>
          <Text style={[styles.khataCardValue, { color: '#DC2626' }]}>
            {currency}{(dashboard?.totalPayables ?? 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.khataCardSub}>To suppliers</Text>
        </View>
      </View>

      {/* Low Stock Alert Banner */}
      {(dashboard?.lowStockCount ?? 0) > 0 && (
        <TouchableOpacity
          style={styles.warningBanner}
          onPress={() => setActiveTab('inventory')}
          activeOpacity={0.8}
        >
          <View style={styles.warningIcon}>
            <AlertTriangle size={18} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.warningTitle}>
              {dashboard?.lowStockCount} items running out of stock!
            </Text>
            <Text style={styles.warningSubtitle}>
              Tap to check stock and restock
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
      )}

      {/* Weekly Sales Chart */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>7-Day Sales Performance</Text>
          <Text style={styles.sectionSub}>This week</Text>
        </View>

        <View style={styles.chartRow}>
          {(dashboard?.weeklySalesTrend || [
            { day: 'Mon', sales: 420 },
            { day: 'Tue', sales: 680 },
            { day: 'Wed', sales: 310 },
            { day: 'Thu', sales: 890 },
            { day: 'Fri', sales: 1200 },
            { day: 'Sat', sales: 950 },
            { day: 'Sun', sales: 500 },
          ]).map((item, idx) => {
            const max = 1300;
            const barPct = Math.min(100, Math.max(12, (item.sales / max) * 100));
            const isHighest = barPct > 75;
            return (
              <View key={idx} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${barPct}%`,
                        backgroundColor: isHighest ? '#2563EB' : '#93C5FD',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barDayText}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Recent Bills */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bills</Text>
          <TouchableOpacity onPress={() => setActiveTab('pos')}>
            <Text style={styles.seeAllText}>+ New Bill</Text>
          </TouchableOpacity>
        </View>

        {(!dashboard?.recentSales || dashboard.recentSales.length === 0) ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No bills generated yet today.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setActiveTab('pos')}
            >
              <Text style={styles.emptyBtnText}>Create First Bill</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dashboard.recentSales.map((sale) => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleAvatar}>
                <Receipt size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.saleName}>{sale.customerName}</Text>
                <Text style={styles.saleMeta}>
                  {sale.invoiceNumber} • {sale.paymentMode}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.salePrice}>
                  +{currency}{sale.amount.toFixed(2)}
                </Text>
                <Text style={styles.saleTag}>Paid</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
  heroCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroLabel: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroMetricsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  metricLabel: {
    fontSize: 11,
    color: '#BFDBFE',
    fontWeight: '600',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionCol: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  khataOverview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  khataCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  khataCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
  },
  khataCardValue: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 2,
  },
  khataCardSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  warningSubtitle: {
    fontSize: 11,
    color: '#B45309',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    height: 75,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  emptyBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  saleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  saleMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  salePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
  },
  saleTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
});
