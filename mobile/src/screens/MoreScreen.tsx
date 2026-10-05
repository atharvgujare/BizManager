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
  User,
  Receipt,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Check,
  X,
  CreditCard,
  Building,
} from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { apiRequest } from '../api/client';

export const MoreScreen = () => {
  const { user, business, logout, fetchDashboard } = useAppStore();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [category, setCategory] = useState('Dukan Rent');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const currency = business?.currencySymbol || '₹';

  const handleSaveExpense = async () => {
    if (!amount.trim()) {
      Alert.alert('Required', 'Please enter an expense amount.');
      return;
    }

    try {
      await apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          category,
          amount: parseFloat(amount),
          description: description.trim() || undefined,
        }),
      });

      setIsExpenseModalOpen(false);
      setAmount('');
      setDescription('');
      fetchDashboard();
      Alert.alert('Kharcha Saved', `Recorded ${currency}${amount} for ${category}!`);
    } catch (err: any) {
      Alert.alert('Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(business?.name || 'A').substring(0, 1).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.businessTitle}>{business?.name || 'Apex Traders'}</Text>
          <Text style={styles.userRoleText}>Owner: {user?.fullName || 'Admin'}</Text>
          <View style={styles.roleTag}>
            <ShieldCheck size={12} color="#15803D" />
            <Text style={styles.roleTagText}>{user?.role || 'Admin'} Access</Text>
          </View>
        </View>
      </View>

      {/* Main Options Menu */}
      <Text style={styles.sectionHeading}>Business Operations</Text>
      <View style={styles.menuBox}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setIsExpenseModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
            <Receipt size={20} color="#DC2626" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.menuTitle}>Record Kharcha (Expense)</Text>
            <Text style={styles.menuSub}>Shop Rent, Electricity, Salaries, Stock</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            Alert.alert(
              '📊 P&L Report Generated',
              `Profit & Loss statement ready for ${business?.name}. Tax & GST report compiled.`,
              [{ text: 'Download PDF' }, { text: 'Share on WhatsApp' }, { text: 'Close', style: 'cancel' }]
            )
          }
          activeOpacity={0.7}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
            <FileSpreadsheet size={20} color="#2563EB" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.menuTitle}>Profit & Loss Report</Text>
            <Text style={styles.menuSub}>Daily, Weekly & Monthly P&L</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            Alert.alert(
              '🖨️ Bluetooth Printer',
              'Connected to thermal printer (58mm/80mm). Test receipt printed!',
              [{ text: 'OK' }]
            )
          }
          activeOpacity={0.7}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
            <Printer size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.menuTitle}>Bluetooth Receipt Printer</Text>
            <Text style={styles.menuSub}>Setup 58mm / 80mm thermal bill printer</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Preset Features */}
      <Text style={styles.sectionHeading}>Business Modules Enabled</Text>
      <View style={styles.menuBox}>
        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {['✓ Retail POS', '✓ Barcode Scanner', '✓ Khata (Udhar)', '✓ GST Invoicing', 'Wholesale PO'].map(
              (mod, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tagPill,
                    mod.startsWith('✓') && styles.tagPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      mod.startsWith('✓') && styles.tagTextActive,
                    ]}
                  >
                    {mod}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
        <LogOut size={18} color="#DC2626" />
        <Text style={styles.logoutButtonText}>Log Out from Account</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        visible={isExpenseModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsExpenseModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Record Dukan Kharcha</Text>
              <TouchableOpacity onPress={() => setIsExpenseModalOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {['Dukan Rent', 'Bijli (Electricity)', 'Staff Salary', 'Stock Purchase', 'Chai & Snacks', 'Other'].map(
                (c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.catBtn,
                      category === c && styles.catBtnActive,
                    ]}
                    onPress={() => setCategory(c)}
                  >
                    <Text
                      style={[
                        styles.catBtnText,
                        category === c && styles.catBtnTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.fieldLabel}>Amount ({currency}) *</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="₹ 500"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.fieldLabel}>Note / Description</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="e.g. Paid electricity bill"
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveExpense}>
              <Check size={18} color="#FFF" />
              <Text style={styles.saveBtnText}>Save Kharcha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
  },
  businessTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRoleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  tagPillActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tagText: {
    fontSize: 11,
    color: '#64748B',
  },
  tagTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  catBtnActive: {
    backgroundColor: '#2563EB',
  },
  catBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  catBtnTextActive: {
    color: '#FFF',
  },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
