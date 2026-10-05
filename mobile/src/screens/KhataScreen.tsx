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
  Search,
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Check,
  X,
  Phone,
  Share2,
} from 'lucide-react-native';
import { useAppStore, Customer } from '../store/useAppStore';

export const KhataScreen = () => {
  const { customers, business, receiveCustomerPayment } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payType, setPayType] = useState<'received' | 'gave'>('received');

  const currency = business?.currencySymbol || '₹';

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  const totalToReceive = customers.reduce(
    (sum, c) => (c.outstandingBalance < 0 ? sum + Math.abs(c.outstandingBalance) : sum),
    0
  );

  const totalToPay = customers.reduce(
    (sum, c) => (c.outstandingBalance > 0 ? sum + c.outstandingBalance : sum),
    0
  );

  const handleRecordTransaction = async () => {
    if (!selectedCustomer || !payAmount.trim()) return;
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      Alert.alert('Required', 'Please enter a valid amount.');
      return;
    }

    // Inward payment reduces debt
    const finalAmount = payType === 'received' ? amountVal : -amountVal;
    const ok = await receiveCustomerPayment(
      selectedCustomer.id,
      finalAmount,
      payType === 'received' ? 'Received Payment (Jama)' : 'Gave Credit (Udhar)'
    );

    if (ok) {
      setIsPayModalOpen(false);
      setPayAmount('');
      Alert.alert('Khata Updated', `Recorded ${currency}${amountVal.toFixed(2)} for ${selectedCustomer.name}`);
      setSelectedCustomer(null);
    }
  };

  const shareWhatsAppReminder = (customer: Customer) => {
    const due = Math.abs(customer.outstandingBalance).toFixed(2);
    Alert.alert(
      '🟢 WhatsApp Khata Reminder',
      `Namaste ${customer.name} ji,\n\nYour pending balance at ${business?.name || 'Apex Traders'} is ${currency}${due}.\n\nPlease clear the payment via UPI / Cash.\n\nThank you!`,
      [{ text: 'Share to WhatsApp', onPress: () => {} }, { text: 'Dismiss', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Khatabook Dual Balance Summary */}
      <View style={styles.balanceHeader}>
        <View style={styles.balanceCol}>
          <Text style={styles.balanceLabel}>YOU WILL GET</Text>
          <Text style={[styles.balanceValue, { color: '#16A34A' }]}>
            {currency}{totalToReceive.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.balanceSub}>{customers.length} Customers</Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceCol}>
          <Text style={styles.balanceLabel}>YOU WILL PAY</Text>
          <Text style={[styles.balanceValue, { color: '#DC2626' }]}>
            {currency}{totalToPay.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.balanceSub}>Suppliers</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Search size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer name or mobile..."
          placeholderTextColor="#94A3B8"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Customer Khata List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((cust) => {
          const owes = cust.outstandingBalance < 0;
          const dueAmount = Math.abs(cust.outstandingBalance);

          return (
            <View key={cust.id} style={styles.customerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {cust.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customerName}>{cust.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Phone size={12} color="#94A3B8" />
                  <Text style={styles.customerPhone}>
                    {cust.phone || 'No phone'}
                  </Text>
                </View>
              </View>

              {/* Outstanding Amount */}
              <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                <Text
                  style={[
                    styles.dueAmount,
                    owes ? { color: '#DC2626' } : { color: '#16A34A' },
                  ]}
                >
                  {currency}{dueAmount.toFixed(0)}
                </Text>
                <Text style={styles.dueStatus}>
                  {owes ? 'Due (Udhar)' : 'Advance'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {owes && (
                  <TouchableOpacity
                    style={styles.waBtn}
                    onPress={() => shareWhatsAppReminder(cust)}
                    activeOpacity={0.7}
                  >
                    <MessageCircle size={16} color="#FFF" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setSelectedCustomer(cust);
                    setPayType('received');
                    setIsPayModalOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <ArrowDownLeft size={16} color="#16A34A" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Khatabook Bottom You Gave / You Got Action Buttons */}
      <View style={styles.khatabookBottomBar}>
        <TouchableOpacity
          style={[styles.bigActionBtn, { backgroundColor: '#DC2626' }]}
          onPress={() => {
            if (customers.length > 0) {
              setSelectedCustomer(customers[0]);
              setPayType('gave');
              setIsPayModalOpen(true);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowUpRight size={18} color="#FFF" />
          <Text style={styles.bigActionBtnText}>YOU GAVE (UDHAR)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigActionBtn, { backgroundColor: '#16A34A' }]}
          onPress={() => {
            if (customers.length > 0) {
              setSelectedCustomer(customers[0]);
              setPayType('received');
              setIsPayModalOpen(true);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowDownLeft size={18} color="#FFF" />
          <Text style={styles.bigActionBtnText}>YOU GOT (PAYMENT)</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Entry Modal */}
      <Modal
        visible={isPayModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPayModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {payType === 'received' ? 'Payment Received (Jama)' : 'Give Credit (Udhar)'}
              </Text>
              <TouchableOpacity onPress={() => setIsPayModalOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.customerNotice}>
              Customer: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{selectedCustomer?.name}</Text>
            </Text>

            <Text style={styles.inputLabel}>Enter Amount ({currency})</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="₹ 0.00"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={payAmount}
              onChangeText={setPayAmount}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.saveBtn,
                payType === 'received' ? { backgroundColor: '#16A34A' } : { backgroundColor: '#DC2626' },
              ]}
              onPress={handleRecordTransaction}
            >
              <Check size={18} color="#FFF" />
              <Text style={styles.saveBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  balanceHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 10,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  balanceCol: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  balanceSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
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
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerPhone: {
    fontSize: 11,
    color: '#64748B',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  dueStatus: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  waBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  khatabookBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  bigActionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bigActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerNotice: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  amountInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
