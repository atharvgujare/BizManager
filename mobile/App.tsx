import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {
  Home,
  ShoppingCart,
  Layers,
  BookOpen,
  User,
  Bell,
  ScanBarcode,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from './src/store/useAppStore';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PosScreen } from './src/screens/PosScreen';
import { MastersHubScreen } from './src/screens/MastersHubScreen';
import { KhataScreen } from './src/screens/KhataScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { AuthScreen } from './src/screens/AuthScreen';

export default function App() {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    business,
    user,
    setActiveMasterView,
  } = useAppStore();

  const role = user?.role || 'Admin';

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Centered Mobile Phone Frame (Prevents wide-screen stretching) */}
      <View style={styles.mobileFrame}>
        {!isAuthenticated ? (
          <AuthScreen />
        ) : (
          <>
            {/* Top Navigation Bar */}
            <View style={styles.topHeader}>
              <View style={styles.brandRow}>
                <View style={styles.storeLogo}>
                  <Text style={styles.storeLogoText}>
                    {(business?.name || 'A').substring(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.storeTitle} numberOfLines={1}>
                      {business?.name || 'Apex Traders'}
                    </Text>
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓ Verified</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <ShieldCheck size={11} color="#2563EB" />
                    <Text style={styles.storeSubtitle}>
                      {user?.fullName || 'Owner'} •{' '}
                      <Text style={{ color: '#2563EB', fontWeight: '800' }}>{role}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => setActiveTab('billing')}
                  activeOpacity={0.7}
                >
                  <ScanBarcode size={18} color="#1E293B" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => {
                    setActiveMasterView('rolebased');
                    setActiveTab('masters');
                  }}
                  activeOpacity={0.7}
                >
                  <ShieldCheck size={18} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Screen Content Body */}
            <View style={styles.body}>
              {activeTab === 'dashboard' && <DashboardScreen />}
              {(activeTab === 'billing' || activeTab === 'pos') && <PosScreen />}
              {(activeTab === 'masters' || activeTab === 'inventory') && <MastersHubScreen />}
              {activeTab === 'khata' && <KhataScreen />}
              {activeTab === 'more' && <MoreScreen />}
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.navTab}
                onPress={() => setActiveTab('dashboard')}
                activeOpacity={0.7}
              >
                <Home
                  size={22}
                  color={activeTab === 'dashboard' ? '#2563EB' : '#64748B'}
                  strokeWidth={activeTab === 'dashboard' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.navLabel,
                    activeTab === 'dashboard' && styles.navLabelActive,
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navTab}
                onPress={() => setActiveTab('billing')}
                activeOpacity={0.7}
              >
                <ShoppingCart
                  size={22}
                  color={activeTab === 'billing' || activeTab === 'pos' ? '#2563EB' : '#64748B'}
                  strokeWidth={activeTab === 'billing' || activeTab === 'pos' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.navLabel,
                    (activeTab === 'billing' || activeTab === 'pos') && styles.navLabelActive,
                  ]}
                >
                  Billing (POS)
                </Text>
              </TouchableOpacity>

              {/* Central Elevated Masters Hub Tab */}
              <TouchableOpacity
                style={styles.navTab}
                onPress={() => {
                  setActiveMasterView('hub');
                  setActiveTab('masters');
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.mastersTabIcon,
                    (activeTab === 'masters' || activeTab === 'inventory') && styles.mastersTabIconActive,
                  ]}
                >
                  <Layers
                    size={20}
                    color={activeTab === 'masters' || activeTab === 'inventory' ? '#FFF' : '#2563EB'}
                    strokeWidth={2.5}
                  />
                </View>
                <Text
                  style={[
                    styles.navLabel,
                    (activeTab === 'masters' || activeTab === 'inventory') && styles.navLabelActive,
                    { marginTop: 2 },
                  ]}
                >
                  Masters Hub
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navTab}
                onPress={() => setActiveTab('khata')}
                activeOpacity={0.7}
              >
                <BookOpen
                  size={22}
                  color={activeTab === 'khata' ? '#2563EB' : '#64748B'}
                  strokeWidth={activeTab === 'khata' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.navLabel,
                    activeTab === 'khata' && styles.navLabelActive,
                  ]}
                >
                  Khata
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navTab}
                onPress={() => setActiveTab('more')}
                activeOpacity={0.7}
              >
                <User
                  size={22}
                  color={activeTab === 'more' ? '#2563EB' : '#64748B'}
                  strokeWidth={activeTab === 'more' ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.navLabel,
                    activeTab === 'more' && styles.navLabelActive,
                  ]}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark elegant outer backdrop
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    width: '100%',
    maxWidth: 440, // Exact standard mobile phone proportions
    height: '100%',
    maxHeight: Platform.OS === 'web' ? 880 : undefined,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 10,
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeLogoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  storeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 9,
    color: '#15803D',
    fontWeight: '800',
  },
  storeSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 62,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  mastersTabIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mastersTabIconActive: {
    backgroundColor: '#2563EB',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
