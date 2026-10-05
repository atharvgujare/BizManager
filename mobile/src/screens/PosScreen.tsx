import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  Search,
  ScanBarcode,
  Plus,
  Minus,
  ArrowRight,
  Printer,
  CheckCircle,
  X,
  CreditCard,
  QrCode,
  Banknote,
  BookOpen,
} from 'lucide-react-native';
import { useAppStore, Product } from '../store/useAppStore';

const CATEGORIES = ['All Items', 'Electronics', 'Beverages', 'Services', 'General'];

export const PosScreen = () => {
  const {
    products,
    cart,
    customers,
    currency,
    addToCart,
    updateCartQuantity,
    completeSale,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState('UPI / QR');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All Items' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const gstAmount = +(cartSubtotal * 0.05).toFixed(2);
  const grandTotal = +(cartSubtotal + gstAmount).toFixed(2);

  const handleCheckout = async () => {
    const success = await completeSale(
      selectedCustomerId,
      paymentMode,
      0,
      gstAmount
    );
    if (success) {
      setIsCheckoutOpen(false);
      Alert.alert(
        '🧾 Bill Generated!',
        `Total: ${currency}${grandTotal.toLocaleString('en-IN')}\nPayment: ${paymentMode}\n\nInvoice printed to Bluetooth printer and sent to customer.`,
        [{ text: 'Done' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Search & Barcode Header */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, scan barcode..."
            placeholderTextColor="#94A3B8"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <TouchableOpacity
          style={styles.scannerBtn}
          onPress={() => {
            if (products.length > 0) {
              addToCart(products[0]);
              Alert.alert('📷 Barcode Scanned', `Added: ${products[0].name}`);
            }
          }}
          activeOpacity={0.8}
        >
          <ScanBarcode size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Categories Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, isActive && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[styles.catText, isActive && styles.catTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Blinkit / Flipkart Style Product Grid */}
      <ScrollView
        style={styles.gridScroll}
        contentContainerStyle={styles.gridContent}
      >
        <View style={styles.productGrid}>
          {filteredProducts.map((item) => {
            const inCart = cart.find((c) => c.product.id === item.id);
            const isLow = !item.isService && item.currentStock <= item.minStockAlert;

            return (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.unitBadge}>
                    {item.isService ? 'Service' : `${item.currentStock} ${item.unit} left`}
                  </Text>
                  {isLow && <Text style={styles.lowStockBadge}>Low</Text>}
                </View>

                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productCat}>{item.category}</Text>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.price}>
                      {currency}
                      {item.sellingPrice.toFixed(0)}
                    </Text>
                  </View>

                  {inCart ? (
                    <View style={styles.stepperWrap}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateCartQuantity(item.id, inCart.quantity - 1)}
                      >
                        <Minus size={14} color="#2563EB" />
                      </TouchableOpacity>
                      <Text style={styles.stepperCount}>{inCart.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                      >
                        <Plus size={14} color="#2563EB" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addButtonText}>+ ADD</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Swiggy / Blinkit Floating Cart Pill */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => setIsCheckoutOpen(true)}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.cartBarCount}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in bill
            </Text>
            <Text style={styles.cartBarTotal}>
              {currency}{grandTotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cartBarAction}>
            <Text style={styles.cartBarActionText}>View Bill & Pay</Text>
            <ArrowRight size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
      )}

      {/* Bill Checkout Modal */}
      <Modal
        visible={isCheckoutOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsCheckoutOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalTop}>
              <Text style={styles.modalHeading}>Bill Summary</Text>
              <TouchableOpacity onPress={() => setIsCheckoutOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            <ScrollView style={{ maxHeight: 150, marginBottom: 12 }}>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.billItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.billItemName}>{item.product.name}</Text>
                    <Text style={styles.billItemSub}>
                      {item.quantity} x {currency}{item.product.sellingPrice.toFixed(0)}
                    </Text>
                  </View>
                  <Text style={styles.billItemPrice}>
                    {currency}{(item.quantity * item.product.sellingPrice).toFixed(0)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Bill Math Box */}
            <View style={styles.mathBox}>
              <View style={styles.mathRow}>
                <Text style={styles.mathLabel}>Subtotal</Text>
                <Text style={styles.mathVal}>{currency}{cartSubtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.mathRow}>
                <Text style={styles.mathLabel}>GST / Tax (5%)</Text>
                <Text style={styles.mathVal}>+{currency}{gstAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.mathRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0' }]}>
                <Text style={styles.mathTotalLabel}>Grand Total</Text>
                <Text style={styles.mathTotalVal}>{currency}{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Customer Pill Selector */}
            <Text style={styles.sectionTitle}>Customer Account:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <TouchableOpacity
                style={[
                  styles.customerPill,
                  selectedCustomerId === null && styles.customerPillActive,
                ]}
                onPress={() => setSelectedCustomerId(null)}
              >
                <Text
                  style={[
                    styles.customerPillText,
                    selectedCustomerId === null && styles.customerPillTextActive,
                  ]}
                >
                  Walk-in Customer
                </Text>
              </TouchableOpacity>

              {customers.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.customerPill,
                    selectedCustomerId === c.id && styles.customerPillActive,
                  ]}
                  onPress={() => setSelectedCustomerId(c.id)}
                >
                  <Text
                    style={[
                      styles.customerPillText,
                      selectedCustomerId === c.id && styles.customerPillTextActive,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Payment Method Selector (UPI, Cash, Card, Khata) */}
            <Text style={styles.sectionTitle}>Payment Method:</Text>
            <View style={styles.paymentGrid}>
              {[
                { name: 'UPI / QR', icon: QrCode },
                { name: 'Cash', icon: Banknote },
                { name: 'Card', icon: CreditCard },
                { name: 'Add to Khata', icon: BookOpen },
              ].map((m) => {
                const isSelected = paymentMode === m.name;
                const Icon = m.icon;
                return (
                  <TouchableOpacity
                    key={m.name}
                    style={[
                      styles.payBtn,
                      isSelected && styles.payBtnActive,
                    ]}
                    onPress={() => setPaymentMode(m.name)}
                  >
                    <Icon size={16} color={isSelected ? '#2563EB' : '#64748B'} />
                    <Text
                      style={[
                        styles.payText,
                        isSelected && styles.payTextActive,
                      ]}
                    >
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Print & Charge Button */}
            <TouchableOpacity
              style={styles.chargeButton}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Printer size={18} color="#FFF" />
              <Text style={styles.chargeButtonText}>
                Charge {currency}{grandTotal.toFixed(2)} & Print Bill
              </Text>
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
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  scannerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    maxHeight: 50,
    marginTop: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  catText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  gridScroll: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  gridContent: {
    paddingBottom: 100,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  unitBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lowStockBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    minHeight: 34,
  },
  productCat: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stepperBtn: {
    padding: 6,
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    paddingHorizontal: 4,
  },
  cartBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cartBarCount: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
  },
  cartBarTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  cartBarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cartBarActionText: {
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
    padding: 20,
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  billItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  billItemSub: {
    fontSize: 11,
    color: '#64748B',
  },
  billItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  mathBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mathRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mathLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  mathVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  mathTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  mathTotalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#16A34A',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
  },
  customerPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  customerPillActive: {
    backgroundColor: '#2563EB',
  },
  customerPillText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  customerPillTextActive: {
    color: '#FFF',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  payBtn: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  payBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  payText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  payTextActive: {
    color: '#2563EB',
  },
  chargeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chargeButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
