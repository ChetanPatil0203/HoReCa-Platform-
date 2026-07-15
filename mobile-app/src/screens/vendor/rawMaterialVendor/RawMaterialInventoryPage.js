import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  Search, Filter, Package, Plus, MoreVertical, Archive, Edit, History, AlertTriangle, AlertCircle, TrendingUp, XCircle, CheckCircle
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const MOCK_INVENTORY = [
  {
    id: "PRD-001", sku: "RM-RICE-BSMT-01", name: "Premium Basmati Rice", category: "Grains",
    currentStock: 1200, reservedStock: 200, availableStock: 1000, unit: "kg",
    wholesalePrice: 85, moq: "50kg", expiry: "12 Dec 2027", status: "In Stock"
  },
  {
    id: "PRD-002", sku: "RM-SLMN-ATL-01", name: "Atlantic Salmon (Whole)", category: "Seafood",
    currentStock: 45, reservedStock: 30, availableStock: 15, unit: "kg",
    wholesalePrice: 1200, moq: "10kg", expiry: "20 Jul 2026", status: "Low Stock"
  },
  {
    id: "PRD-003", sku: "RM-OIL-EVOO-02", name: "Olive Oil (Extra Virgin)", category: "Oils",
    currentStock: 0, reservedStock: 0, availableStock: 0, unit: "L",
    wholesalePrice: 850, moq: "5L", expiry: "05 May 2028", status: "Out of Stock"
  }
];

export default function RawMaterialInventoryPage() {
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState(MOCK_INVENTORY);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  
  // Modals
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [updateStockModalVisible, setUpdateStockModalVisible] = useState(false);
  const [stockActionType, setStockActionType] = useState('Add'); // Add, Reduce, Set
  const [stockValue, setStockValue] = useState('');
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  const getStatusColor = (status) => {
    if (status === 'In Stock') return '#10B981';
    if (status === 'Low Stock') return '#F59E0B';
    if (status === 'Out of Stock') return '#EF4444';
    return '#64748B';
  };

  const getStatusText = (available) => {
    if (available === 0) return 'Out of Stock';
    if (available <= 20) return 'Low Stock';
    return 'In Stock';
  };

  const openUpdateStock = (product) => {
    setSelectedProduct(product);
    setStockActionType('Add');
    setStockValue('');
    setMenuVisibleId(null);
    setUpdateStockModalVisible(true);
  };

  const getValidationMessage = () => {
    if (!stockValue) return null;
    const qty = parseInt(stockValue, 10);
    if (isNaN(qty)) return "Must be a numeric value.";
    
    if (stockActionType === 'Add') {
      if (qty <= 0) return "Quantity must be greater than 0.";
    } else if (stockActionType === 'Reduce') {
      if (qty <= 0) return "Quantity must be greater than 0.";
      if (qty > selectedProduct?.currentStock) return `Cannot reduce more than current stock (${selectedProduct.currentStock}).`;
      if ((selectedProduct.currentStock - qty) < selectedProduct.reservedStock) {
        return `Resulting stock cannot be less than reserved stock (${selectedProduct.reservedStock}).`;
      }
    } else if (stockActionType === 'Set') {
      if (qty < 0) return "Stock cannot be negative.";
      if (qty < selectedProduct?.reservedStock) {
        return `Cannot set below reserved stock (${selectedProduct.reservedStock}).`;
      }
    }
    return null;
  };
  
  const validationMsg = getValidationMessage();
  const isValid = stockValue !== '' && !validationMsg && selectedProduct !== null;

  const handleUpdateStock = () => {
    if (!isValid || !selectedProduct) return;
    
    const qty = parseInt(stockValue, 10);
    let newCurrent = selectedProduct.currentStock;
    
    if (stockActionType === 'Add') newCurrent += qty;
    if (stockActionType === 'Reduce') newCurrent -= qty;
    if (stockActionType === 'Set') newCurrent = qty;

    const newAvailable = newCurrent - selectedProduct.reservedStock;
    const newStatus = getStatusText(newAvailable);

    // 7. Add a stock history record.
    const historyRecord = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      updateType: stockActionType,
      previousStock: selectedProduct.currentStock,
      updatedStock: newCurrent,
      quantityChanged: qty,
      reason: 'Manual Update',
      batchNumber: '-',
      expiryDate: selectedProduct.expiry,
      dateTime: new Date().toISOString()
    };
    console.log("Stock History Record Added:", historyRecord);

    // Update products state
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          currentStock: newCurrent,
          availableStock: newAvailable,
          status: newStatus
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setUpdateStockModalVisible(false);
    setStockValue('');
    
    // Show Toast
    setSuccessToast("Stock updated successfully.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Summary Metrics
  const totalSkus = products.length;
  const outOfStock = products.filter(p => p.availableStock === 0).length;
  const lowStock = products.filter(p => p.availableStock > 0 && p.availableStock <= 20).length;
  const inStock = products.filter(p => p.availableStock > 20).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.currentStock * p.wholesalePrice), 0);
  const formattedValue = `₹${(inventoryValue / 100000).toFixed(1)}L`;

  const summaryData = [
    { label: 'Total SKUs', value: totalSkus, icon: Package, color: '#3B82F6' },
    { label: 'In Stock', value: inStock, icon: CheckCircle, color: '#10B981' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Out of Stock', value: outOfStock, icon: AlertCircle, color: '#EF4444' },
    { label: 'Inventory Value', value: formattedValue, icon: TrendingUp, color: '#14B8A6' },
  ];

  const renderProductCard = ({ item }) => {
    return (
      <View style={styles.productCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.imagePlaceholder}>
              <Package size={24} color="#94A3B8" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.skuText}>SKU: {item.sku}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setMenuVisibleId(menuVisibleId === item.id ? null : item.id)} style={styles.menuIconBtn}>
            <MoreVertical size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Action Menu (Floating) */}
        {menuVisibleId === item.id && (
          <View style={styles.floatingMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Edit size={16} color="#475569" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <History size={16} color="#475569" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Stock History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Archive size={16} color="#EF4444" style={styles.menuItemIcon} />
              <Text style={[styles.menuItemText, {color: '#EF4444'}]}>Archive Product</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Body */}
        <View style={styles.cardBody}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.stockGrid}>
            <View style={styles.stockCol}>
              <Text style={styles.stockLabel}>Available</Text>
              <Text style={styles.stockValuePrimary}>{item.availableStock} {item.unit}</Text>
            </View>
            <View style={styles.stockCol}>
              <Text style={styles.stockLabel}>Reserved</Text>
              <Text style={styles.stockValue}>{item.reservedStock} {item.unit}</Text>
            </View>
            <View style={styles.stockCol}>
              <Text style={styles.stockLabel}>Total</Text>
              <Text style={styles.stockValue}>{item.currentStock} {item.unit}</Text>
            </View>
          </View>

          <View style={styles.metaInfoRow}>
            <Text style={styles.metaText}>Wholesale: <Text style={styles.metaBold}>₹{item.wholesalePrice}/{item.unit}</Text></Text>
            <Text style={styles.metaText}>MOQ: <Text style={styles.metaBold}>{item.moq}</Text></Text>
            <Text style={styles.metaText}>Expiry: <Text style={styles.metaBold}>{item.expiry}</Text></Text>
          </View>
        </View>

        {/* Footer / Primary Action */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => openUpdateStock(item)}>
            <Text style={styles.btnPrimaryText}>Update Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inventory Control</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Toast */}
        {successToast && (
          <View style={styles.toast}>
            <CheckCircle size={16} color="#FFFFFF" style={{marginRight: 8}} />
            <Text style={styles.toastText}>{successToast}</Text>
          </View>
        )}

        {/* Top Action Bar */}
        <View style={styles.topActionBar}>
          <TouchableOpacity style={styles.btnAddProduct} onPress={() => { setAddStep(1); setAddProductModalVisible(true); }}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.btnAddProductText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
            {summaryData.map((item, idx) => (
              <View key={idx} style={styles.summaryCard}>
                <View style={[styles.summaryIconBox, { backgroundColor: item.color + '15' }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderProductCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Package size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
        />

        {/* Multi-step Add Product Modal */}
        <Modal visible={addProductModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalSafeArea}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Product - Step {addStep} of 5</Text>
                <TouchableOpacity onPress={() => setAddProductModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(addStep / 5) * 100}%` }]} />
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {addStep === 1 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Basic Information</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Product Name</Text>
                      <TextInput style={styles.inputField} placeholder="E.g. Basmati Rice" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Category</Text>
                      <TextInput style={styles.inputField} placeholder="Select Category" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>SKU</Text>
                      <TextInput style={styles.inputField} placeholder="Leave blank to auto-generate" />
                    </View>
                  </View>
                )}
                {addStep === 2 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Pricing & Stock</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Wholesale Price (₹)</Text>
                      <TextInput style={styles.inputField} placeholder="0.00" keyboardType="numeric" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Initial Stock</Text>
                      <TextInput style={styles.inputField} placeholder="0" keyboardType="numeric" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Unit (kg, L, box)</Text>
                      <TextInput style={styles.inputField} placeholder="E.g. kg" />
                    </View>
                  </View>
                )}
                {addStep === 3 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Quality & Packaging</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Grade / Quality</Text>
                      <TextInput style={styles.inputField} placeholder="Premium" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Minimum Order Qty (MOQ)</Text>
                      <TextInput style={styles.inputField} placeholder="E.g. 50" keyboardType="numeric" />
                    </View>
                  </View>
                )}
                {addStep === 4 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Batch & Expiry</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Requires Expiry Tracking?</Text>
                      <TextInput style={styles.inputField} placeholder="Yes / No" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Default Shelf Life (Days)</Text>
                      <TextInput style={styles.inputField} placeholder="180" keyboardType="numeric" />
                    </View>
                  </View>
                )}
                {addStep === 5 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Review & Save</Text>
                    <Text style={styles.reviewText}>Please review the details. The product will be published to your catalog immediately.</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.btnOutline, addStep === 1 && {opacity: 0.5}]} 
                  onPress={() => addStep > 1 && setAddStep(addStep - 1)}
                  disabled={addStep === 1}
                >
                  <Text style={styles.btnOutlineText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.btnPrimarySave} 
                  onPress={() => {
                    if (addStep < 5) setAddStep(addStep + 1);
                    else setAddProductModalVisible(false); // Simulate save
                  }}
                >
                  <Text style={styles.btnPrimaryText}>{addStep === 5 ? 'Save Product' : 'Next'}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* Update Stock Bottom Sheet */}
        <Modal visible={updateStockModalVisible} transparent={true} animationType="slide">
          <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Update Stock</Text>
                <TouchableOpacity onPress={() => setUpdateStockModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              {selectedProduct && (
                <View style={styles.sheetBody}>
                  <Text style={styles.productNameLarge}>{selectedProduct.name}</Text>
                  
                  <View style={styles.stockInfoBlock}>
                    <View style={styles.stockInfoCol}>
                      <Text style={styles.stockInfoLabel}>Current</Text>
                      <Text style={styles.stockInfoVal}>{selectedProduct.currentStock} {selectedProduct.unit}</Text>
                    </View>
                    <View style={styles.stockInfoDivider} />
                    <View style={styles.stockInfoCol}>
                      <Text style={styles.stockInfoLabel}>Reserved</Text>
                      <Text style={styles.stockInfoVal}>{selectedProduct.reservedStock} {selectedProduct.unit}</Text>
                    </View>
                    <View style={styles.stockInfoDivider} />
                    <View style={styles.stockInfoCol}>
                      <Text style={styles.stockInfoLabel}>Available</Text>
                      <Text style={[styles.stockInfoVal, {color: '#10B981'}]}>{selectedProduct.availableStock} {selectedProduct.unit}</Text>
                    </View>
                  </View>

                  <View style={styles.actionTypeGroup}>
                    {['Add', 'Reduce', 'Set'].map((type) => (
                      <TouchableOpacity 
                        key={type} 
                        style={[styles.actionTypeBtn, stockActionType === type && styles.actionTypeBtnActive]}
                        onPress={() => setStockActionType(type)}
                      >
                        <Text style={[styles.actionTypeBtnText, stockActionType === type && styles.actionTypeBtnTextActive]}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {stockActionType === 'Add' ? 'Add Stock Quantity' : stockActionType === 'Reduce' ? 'Reduce Stock Quantity' : 'Amount to Set'}
                    </Text>
                    <TextInput 
                      style={styles.inputFieldLarge} 
                      placeholder="0" 
                      keyboardType="numeric"
                      value={stockValue}
                      onChangeText={setStockValue}
                    />
                  </View>

                  {validationMsg ? (
                    <Text style={styles.errorText}>{validationMsg}</Text>
                  ) : null}

                  <TouchableOpacity 
                    style={[styles.btnPrimaryLarge, !isValid && {backgroundColor: '#94A3B8'}]} 
                    disabled={!isValid} 
                    onPress={handleUpdateStock}
                  >
                    <Text style={styles.btnPrimaryText}>{stockActionType} Stock</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  headerActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 8 },
  toast: {
    position: 'absolute', top: 16, left: 16, right: 16,
    backgroundColor: '#10B981', padding: 12, borderRadius: 8, zIndex: 100,
    flexDirection: 'row', alignItems: 'center'
  },
  toastText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  topActionBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  btnAddProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnAddProductText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryScroll: { paddingHorizontal: 16 },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  summaryLabel: { fontSize: 13, color: '#64748B' },
  listContent: { padding: 16, paddingBottom: 80 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontSize: 15 },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '600', color: NAVY, marginBottom: 4 },
  skuText: { fontSize: 12, color: '#64748B' },
  menuIconBtn: { padding: 4 },
  floatingMenu: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItemIcon: { marginRight: 8 },
  menuItemText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  cardBody: { marginBottom: 16 },
  badgeRow: { flexDirection: 'row', marginBottom: 16 },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: { fontSize: 11, color: '#475569', fontWeight: '500' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  stockGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  stockCol: { flex: 1 },
  stockLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  stockValuePrimary: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  stockValue: { fontSize: 15, fontWeight: '600', color: NAVY },
  metaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaText: { fontSize: 12, color: '#64748B', marginBottom: 4, width: '48%' },
  metaBold: { fontWeight: '600', color: NAVY },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  btnPrimary: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: { color: NAVY, fontWeight: '600', fontSize: 14 },
  
  // Modals
  modalSafeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  progressBarBg: { height: 4, backgroundColor: '#F1F5F9', width: '100%' },
  progressBarFill: { height: 4, backgroundColor: GOLD },
  modalBody: { flex: 1, padding: 20 },
  stepContainer: { paddingBottom: 40 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 20 },
  reviewText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#475569', marginBottom: 8 },
  inputField: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  btnOutlineText: { color: '#475569', fontWeight: '600', fontSize: 15 },
  btnPrimarySave: {
    flex: 1,
    backgroundColor: NAVY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryLarge: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: NAVY,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  
  // Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  sheetBody: { paddingBottom: 20 },
  productNameLarge: { fontSize: 18, fontWeight: '600', color: NAVY, marginBottom: 16 },
  stockInfoBlock: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  stockInfoCol: { flex: 1, alignItems: 'center' },
  stockInfoDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 8 },
  stockInfoLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  stockInfoVal: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  
  actionTypeGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  actionTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  actionTypeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionTypeBtnText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
  actionTypeBtnTextActive: { color: NAVY, fontWeight: 'bold' },
  inputFieldLarge: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    color: NAVY,
  },
  errorText: { color: '#EF4444', fontSize: 13, marginTop: -8, marginBottom: 12, textAlign: 'center' },
});
