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
  Plus,
  Package,
  AlertTriangle,
  Minus,
  Check,
  X,
  Search,
} from 'lucide-react-native';
import { useAppStore, Product } from '../store/useAppStore';

export const InventoryScreen = () => {
  const { products, business, createProduct, adjustStock } = useAppStore();
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [unit, setUnit] = useState('pcs');

  const currency = business?.currencySymbol || '₹';

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'low') return !p.isService && p.currentStock <= p.minStockAlert && p.currentStock > 0;
    if (filterMode === 'out') return !p.isService && p.currentStock <= 0;
    return true;
  });

  const handleSaveProduct = async () => {
    if (!name.trim() || !sellingPrice.trim()) {
      Alert.alert('Required', 'Please enter Item Name and Selling Price.');
      return;
    }

    const ok = await createProduct({
      name: name.trim(),
      category: category.trim() || 'General',
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currentStock: parseInt(stock, 10) || 0,
      minStockAlert: 5,
      unit,
      isService: false,
    });

    if (ok) {
      setIsAddModalOpen(false);
      setName('');
      setCostPrice('');
      setSellingPrice('');
      Alert.alert('Item Added', 'Product successfully added to inventory!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Items & Inventory</Text>
          <Text style={styles.subtitle}>{products.length} products listed</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFF" />
          <Text style={styles.addBtnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, filterMode === 'all' && styles.tabActive]}
          onPress={() => setFilterMode('all')}
        >
          <Text style={[styles.tabText, filterMode === 'all' && styles.tabTextActive]}>
            All Items ({products.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filterMode === 'low' && styles.tabActive]}
          onPress={() => setFilterMode('low')}
        >
          <Text style={[styles.tabText, filterMode === 'low' && styles.tabTextActive, { color: '#D97706' }]}>
            Low Stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filterMode === 'out' && styles.tabActive]}
          onPress={() => setFilterMode('out')}
        >
          <Text style={[styles.tabText, filterMode === 'out' && styles.tabTextActive, { color: '#DC2626' }]}>
            Out of Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((item) => {
          const isLow = !item.isService && item.currentStock <= item.minStockAlert && item.currentStock > 0;
          const isOut = !item.isService && item.currentStock <= 0;

          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIconBox}>
                <Package size={22} color="#2563EB" />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrices}>
                  Cost: {currency}{item.costPrice.toFixed(0)} • Sell:{' '}
                  <Text style={{ fontWeight: '800', color: '#0F172A' }}>
                    {currency}{item.sellingPrice.toFixed(0)}
                  </Text>
                </Text>
              </View>

              {/* Stock Stepper */}
              <View style={{ alignItems: 'flex-end' }}>
                <View
                  style={[
                    styles.stockBadge,
                    isOut
                      ? styles.stockBadgeOut
                      : isLow
                      ? styles.stockBadgeLow
                      : styles.stockBadgeOk,
                  ]}
                >
                  <Text
                    style={[
                      styles.stockBadgeText,
                      isOut
                        ? styles.stockTextOut
                        : isLow
                        ? styles.stockTextLow
                        : styles.stockTextOk,
                    ]}
                  >
                    {item.isService ? 'Service' : `${item.currentStock} in stock`}
                  </Text>
                </View>

                {!item.isService && (
                  <View style={styles.stepperWrap}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => adjustStock(item.id, -1)}
                    >
                      <Minus size={14} color="#64748B" />
                    </TouchableOpacity>
                    <Text style={styles.stepperVal}>{item.currentStock}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => adjustStock(item.id, 1)}
                    >
                      <Plus size={14} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Product to Catalog</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Product / Item Name *</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="e.g. Masala Chai 500g, USB Cable"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Selling Price ({currency}) *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="₹ 50"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Purchase Cost ({currency})</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="₹ 30"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={costPrice}
                  onChangeText={setCostPrice}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Starting Quantity</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Unit (pcs, kg, box)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="pcs"
                  placeholderTextColor="#94A3B8"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
              <Check size={18} color="#FFF" />
              <Text style={styles.saveButtonText}>Add to Catalog</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemCategory: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  itemPrices: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  stockBadgeOk: {
    backgroundColor: '#DCFCE7',
  },
  stockBadgeLow: {
    backgroundColor: '#FEF3C7',
  },
  stockBadgeOut: {
    backgroundColor: '#FEE2E2',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockTextOk: {
    color: '#15803D',
  },
  stockTextLow: {
    color: '#B45309',
  },
  stockTextOut: {
    color: '#B91C1C',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepperBtn: {
    padding: 6,
  },
  stepperVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 6,
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
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    marginTop: 8,
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
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
