import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Share, Alert, ActivityIndicator } from 'react-native';
import { Search, Download, Plus, X, Pen, RefreshCw } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { fetchRawMaterialProducts, createRawMaterialProduct } from '../../services/api.service';

// Map a backend Product record to the UI shape expected by the card renderer
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category?.name || 'Uncategorised',
  stock: String(p.stock ?? 0),
  unit: p.unit || 'units',
  price: `₹ ${parseFloat(p.price || 0).toFixed(0)}`,
  minOrder: `${p.moq ?? 1}`,
  status: (p.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
});

const METADATA_BY_TYPE = {
  "raw-material": {
    title: "Inventory Control", subTag: "RAW MATERIAL INVENTORY CONTROL",
    supplierLabel: "Supplier", totalLabel: "Total SKUs", activeLabel: "In Stock", inactiveLabel: "Out of Stock",
    valLabel: "Total Products", addBtnLabel: "Add Product", priceLabel: "WHOLESALE PRICE",
    qtyLabel: "MIN ORDER QTY", stockLabel: "Stock:", priceUnit: "kg",
    categories: ["Grains", "Flour", "Pulses", "Oils", "Sweeteners", "Dairy", "Spices", "Other"],
    color: "#F59E0B", bg: "#FFFBEB",
    iconMap: { "Grains": "🌾", "Flour": "🍞", "Pulses": "🥣", "Oils": "🫙", "Sweeteners": "🍬", "Dairy": "🥛", "Spices": "🌶️", "Other": "📦" },
  },
  "manpower": {
    title: "Roster Management", subTag: "STAFF ROSTER CONTROL",
    supplierLabel: "Agency", totalLabel: "Staff Roles", activeLabel: "Available", inactiveLabel: "Fully Deployed",
    valLabel: "Total Listings", addBtnLabel: "Add Personnel", priceLabel: "RATE PER SHIFT",
    qtyLabel: "MIN CONTRACT", stockLabel: "Active Pool:", priceUnit: "shift",
    categories: ["Kitchen Staff", "F&B Staff", "Hospitality", "Security", "Other"],
    color: "#2563EB", bg: "#EFF6FF",
    iconMap: { "Kitchen Staff": "👨‍🍳", "F&B Staff": "🤵", "Hospitality": "☕", "Security": "👮", "Other": "👤" },
  },
  "service": {
    title: "Services Catalog", subTag: "FACILITIES SERVICES CONTROL",
    supplierLabel: "Provider", totalLabel: "Total Services", activeLabel: "Active Teams", inactiveLabel: "Fully Booked",
    valLabel: "Total Services", addBtnLabel: "Add Service Item", priceLabel: "BASE SERVICE RATE",
    qtyLabel: "MIN BOOKING", stockLabel: "Teams Available:", priceUnit: "job",
    categories: ["Maintenance", "Cleaning", "Pest Control", "Electrical", "Plumbing", "Other"],
    color: "#10B981", bg: "#ECFDF5",
    iconMap: { "Maintenance": "🔧", "Cleaning": "🧹", "Pest Control": "🐜", "Electrical": "⚡", "Plumbing": "🫗", "Other": "🛠️" },
  },
  "marketing": {
    title: "Campaign Catalog", subTag: "MARKETING SERVICES CONTROL",
    supplierLabel: "Agency", totalLabel: "Total Packages", activeLabel: "Available Slots", inactiveLabel: "Sold Out",
    valLabel: "Total Packages", addBtnLabel: "Add Package", priceLabel: "BASE PACKAGE RATE",
    qtyLabel: "MIN PERIOD", stockLabel: "Open Slots:", priceUnit: "pkg",
    categories: ["Social Media", "Creative", "Paid Ads", "Public Relations", "Other"],
    color: "#8B5CF6", bg: "#F5F3FF",
    iconMap: { "Social Media": "📱", "Creative": "📷", "Paid Ads": "📈", "Public Relations": "📣", "Other": "📦" },
  },
};

// ── Live date string ──────────────────────────────────────
const TODAY = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

export default function VendorInventoryPage() {
  const { vendorType, user } = useContext(AuthContext);
  const type = vendorType || 'raw-material';
  const meta = METADATA_BY_TYPE[type] || METADATA_BY_TYPE["raw-material"];
  const supplierId = user?.id;

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch from backend ─────────────────────────────────
  const loadInventory = async (silent = false) => {
    if (!supplierId) { setLoading(false); return; }
    try {
      if (!silent) setLoading(true);
      setError(null);
      const res = await fetchRawMaterialProducts(null, supplierId);
      if (res?.success) {
        setInventory((res.data || []).map(mapProduct));
      } else {
        setError(res?.message || 'Failed to load inventory.');
      }
    } catch (err) {
      console.error('VendorInventoryPage: fetchRawMaterialProducts error:', err);
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInventory(); }, [supplierId]);

  // ── Search state ───────────────────────────────────────
  const [searchText, setSearchText] = useState('');

  // ── Add modal state ────────────────────────────────────
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // ── Edit modal state ───────────────────────────────────
  const [editItem, setEditItem] = useState(null); // item being edited

  // ── Shared form states (used for both Add & Edit) ──────
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minOrder, setMinOrder] = useState('1');
  const [category, setCategory] = useState(meta.categories[0]);

  // ── Inline validation errors ───────────────────────────
  const [errors, setErrors] = useState({});

  // ── Derived: filtered list ─────────────────────────────
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const inStockCount = inventory.filter(i => i.status === 'In Stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'Out of Stock').length;

  // ── Validate form ──────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!price.trim()) e.price = 'Price is required';
    else if (isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid positive number';
    if (!stock.trim()) e.stock = 'Stock/Availability is required';
    else if (isNaN(Number(stock)) || Number(stock) < 0) e.stock = 'Enter a valid number (0 or more)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName(''); setPrice(''); setStock(''); setMinOrder('1');
    setCategory(meta.categories[0]); setErrors({});
  };

  // ── Open Edit modal pre-filled ─────────────────────────
  const openEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    // Strip "₹ " prefix
    setPrice(item.price.replace('₹ ', '').replace(/,/g, ''));
    setStock(item.stock.replace(/,/g, ''));
    setMinOrder(item.minOrder.split(' ')[0]);
    setCategory(item.category);
    setErrors({});
  };

  // ── Add new item (via API) ─────────────────────────────
  const handleAddItem = async () => {
    if (!validate()) return;
    const unitMap = { "raw-material": "Kg", manpower: "agents", service: "teams", marketing: "slots" };
    try {
      const res = await createRawMaterialProduct({
        supplierId,
        name: name.trim(),
        category,
        stock: Number(stock),
        unit: unitMap[type] || 'units',
        price: Number(price),
        moq: Number(minOrder) || 1,
      });
      if (res?.success) {
        resetForm();
        setIsAddModalVisible(false);
        loadInventory(true); // refresh
      } else {
        Alert.alert('Error', res?.message || 'Failed to add product.');
      }
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Could not connect to server.');
    }
  };

  // ── Save edited item (local optimistic update — no PATCH API yet) ────
  const handleSaveEdit = () => {
    if (!validate()) return;
    const unitMap = { "raw-material": "Kg", manpower: "agents", service: "teams", marketing: "slots" };
    const updated = inventory.map(item =>
      item.id === editItem.id
        ? {
            ...item,
            name: name.trim(),
            category,
            stock: String(Number(stock)),
            price: `₹ ${price}`,
            minOrder: `${minOrder} ${unitMap[type] || 'unit'}`,
            status: Number(stock) > 0 ? 'In Stock' : 'Out of Stock',
          }
        : item
    );
    setInventory(updated);
    setEditItem(null);
    resetForm();
  };

  // ── Export as CSV via Share ────────────────────────────
  const handleExport = () => {
    const header = `ID,Name,Category,Stock,Unit,Price,Min Order,Status`;
    const rows = inventory.map(i =>
      `${i.id},"${i.name}",${i.category},${i.stock},${i.unit},"${i.price}","${i.minOrder}",${i.status}`
    ).join('\n');
    const csv = `${header}\n${rows}`;
    Share.share({
      message: csv,
      title: `${meta.title} Export`,
    });
  };

  // ── Shared form UI (Add + Edit) ────────────────────────
  const renderForm = () => (
    <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Item Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="e.g. Head Chef / HVAC Maintenance"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={t => { setName(t); if (errors.name) setErrors({ ...errors, name: null }); }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Price */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{meta.priceLabel} (₹) <Text style={{ color: '#EF4444' }}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="e.g. 1200"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
          value={price}
          onChangeText={t => { setPrice(t); if (errors.price) setErrors({ ...errors, price: null }); }}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      </View>

      {/* Stock */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Total Available <Text style={{ color: '#EF4444' }}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.stock && styles.inputError]}
          placeholder="e.g. 10"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
          value={stock}
          onChangeText={t => { setStock(t); if (errors.stock) setErrors({ ...errors, stock: null }); }}
        />
        {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
        {stock && !errors.stock && (
          <Text style={{ fontSize: 11, color: Number(stock) > 0 ? '#10B981' : '#EF4444', marginTop: 4 }}>
            {Number(stock) > 0 ? '✓ Will be marked In Stock' : '⚠ Will be marked Out of Stock'}
          </Text>
        )}
      </View>

      {/* Min Order */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Minimum Booking</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
          value={minOrder}
          onChangeText={setMinOrder}
        />
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {meta.categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={{
                paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1,
                borderColor: category === cat ? meta.color : '#E2E8F0',
                backgroundColor: category === cat ? meta.bg : '#F8FAFC',
              }}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: category === cat ? meta.color : '#475569' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color={meta.color} />
        <Text style={{ marginTop: 12, color: '#64748B', fontSize: 13 }}>Loading inventory...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA', padding: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#EF4444', marginBottom: 8 }}>Could not load inventory</Text>
        <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={() => loadInventory()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: meta.color, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
          <RefreshCw size={14} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={styles.container}>

        <FlatList
          ListHeaderComponent={
            <View>
              {/* Top Header */}
              <View style={styles.topHeader}>
                <Text style={styles.topHeaderTitle}>{meta.title}</Text>
                <Text style={styles.topHeaderDate}>{TODAY}</Text>
              </View>

              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTag, { color: meta.color }]}>{meta.subTag}</Text>
                  <Text style={styles.sectionTitle}>{meta.title}</Text>
                  <Text style={styles.sectionSupplier}>
                    {meta.supplierLabel}: <Text style={{ fontWeight: '700', color: '#1E293B' }}>{user?.bizName || user?.businessName || 'Your Business'}</Text>
                  </Text>
                </View>

                {/* Action Row */}
                <View style={{ marginBottom: 20 }}>
                  <View style={styles.actionRow}>
                    {/* ── FIX 1: Live Search ── */}
                    <View style={[styles.searchContainer, { flex: 1 }, searchText.length > 0 && { borderColor: meta.color }]}>
                      <Search size={16} color={searchText.length > 0 ? meta.color : '#94A3B8'} />
                      <TextInput
                        placeholder="Search by name, category, ID..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                      />
                      {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                          <X size={14} color="#94A3B8" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* ── FIX 2: Export with Share API ── */}
                    <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
                      <Download size={14} color="#64748B" />
                      <Text style={styles.exportBtnText}>Export</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.addBulkBtn, { backgroundColor: meta.color }]} onPress={() => { resetForm(); setIsAddModalVisible(true); }}>
                      <Plus size={16} color="#fff" />
                      <Text style={styles.addBulkBtnText}>{meta.addBtnLabel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Search Result Count */}
                {searchText.length > 0 && (
                  <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
                    {filteredInventory.length} result{filteredInventory.length !== 1 ? 's' : ''} for "{searchText}"
                  </Text>
                )}

                {/* Stats Row */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                  <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#F0F9FF', borderColor: '#E0F2FE' }]}>
                      <Text style={[styles.statValue, { color: '#2563EB' }]}>{inventory.length}</Text>
                      <Text style={styles.statLabel}>{meta.totalLabel}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}>
                      <Text style={[styles.statValue, { color: '#10B981' }]}>{inStockCount}</Text>
                      <Text style={styles.statLabel}>{meta.activeLabel}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
                      <Text style={[styles.statValue, { color: '#EF4444' }]}>{outOfStockCount}</Text>
                      <Text style={styles.statLabel}>{meta.inactiveLabel}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                      <Text style={[styles.statValue, { color: '#F59E0B' }]}>{inventory.length}</Text>
                      <Text style={styles.statLabel}>{meta.valLabel}</Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Empty State */}
                {filteredInventory.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>{searchText ? '🔍' : '📦'}</Text>
                    <Text style={styles.emptyTitle}>
                      {searchText ? `No results for "${searchText}"` : 'No items yet'}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                      {searchText ? 'Try a different search term' : `Tap "${meta.addBtnLabel}" to get started`}
                    </Text>
                    {!searchText && (
                      <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: meta.color }]} onPress={() => { resetForm(); setIsAddModalVisible(true); }}>
                        <Text style={styles.emptyBtnText}>+ {meta.addBtnLabel}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          }
          data={filteredInventory}
          keyExtractor={item => item.id}
          numColumns={isMobile ? 1 : 2}
          key={isMobile ? 'one-col' : 'two-col'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, !isMobile && { marginHorizontal: 8 }]}>

              <View style={styles.cardHeader}>
                <View style={styles.imagePlaceholder}>
                  <Text style={{ fontSize: 18 }}>{meta.iconMap[item.category] || '📦'}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productId}>{item.id}</Text>
                  <Text style={styles.productStock}>
                    {meta.stockLabel}{' '}
                    <Text style={{ fontWeight: '700', color: '#10B981' }}>{item.stock}</Text>{' '}{item.unit}
                  </Text>
                </View>
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>CATEGORY</Text>
                  <Text style={[styles.detailValue, { color: meta.color }]}>{item.category}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{meta.priceLabel}</Text>
                  <Text style={styles.priceValue}>
                    {item.price} <Text style={styles.priceUnit}>/ {meta.priceUnit}</Text>
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{meta.qtyLabel}</Text>
                  <View style={styles.minOrderBox}>
                    <Text style={styles.minOrderText}>{item.minOrder}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, item.status === 'In Stock' ? styles.statusInStock : styles.statusOutStock]}>
                  <View style={[styles.statusDot, { backgroundColor: item.status === 'In Stock' ? '#10B981' : '#EF4444' }]} />
                  <Text style={[styles.statusText, item.status === 'In Stock' ? styles.statusTextInStock : styles.statusTextOutStock]}>
                    {item.status}
                  </Text>
                </View>

                {/* ── FIX 3: Update Live button opens Edit modal ── */}
                <TouchableOpacity style={styles.updateBtn} onPress={() => openEdit(item)}>
                  <Pen size={12} color="#3B82F6" />
                  <Text style={styles.updateBtnText}>Update Live</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        />

      </View>

      {/* ── Add Item Modal ─────────────────────────────── */}
      <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="formSheet">
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{meta.addBtnLabel}</Text>
              <Text style={styles.modalSubtitle}>Create new item in the catalog</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => { resetForm(); setIsAddModalVisible(false); }}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {renderForm()}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { resetForm(); setIsAddModalVisible(false); }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: meta.color }]} onPress={handleAddItem}>
              <Text style={styles.submitBtnText}>+ Add to Catalog</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Edit Item Modal ────────────────────────────── */}
      <Modal visible={editItem !== null} animationType="slide" presentationStyle="formSheet">
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Update Item</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>{editItem?.name}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => { setEditItem(null); resetForm(); }}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {renderForm()}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditItem(null); resetForm(); }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: meta.color }]} onPress={handleSaveEdit}>
              <Text style={styles.submitBtnText}>✓ Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', maxWidth: 1200, width: '100%', alignSelf: 'center' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  topHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  topHeaderDate: { fontSize: 13, color: '#64748B', marginTop: 4 },

  scrollContent: { paddingBottom: 40 },

  sectionHeader: { marginBottom: 20 },
  sectionTag: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  sectionSupplier: { fontSize: 13, color: '#64748B' },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 16, height: 48, gap: 8, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 16, height: 48, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  exportBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  addBulkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 16, height: 48, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  addBulkBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  statsContainer: { flexDirection: 'row', gap: 12, paddingRight: 16 },
  statCard: { padding: 16, borderRadius: 16, borderWidth: 1, minWidth: 140, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4, color: '#0F172A' },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  listContent: { paddingBottom: 115 },
  card: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#EAF0F6', overflow: 'hidden', flex: 1, marginHorizontal: 16, marginBottom: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },

  cardHeader: { flexDirection: 'row', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  imagePlaceholder: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  productId: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  productStock: { fontSize: 12, color: '#64748B' },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 18, gap: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailItem: { flex: 1, minWidth: '30%' },
  detailLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '800', marginBottom: 6, letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: '700' },
  priceValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  priceUnit: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  minOrderBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignSelf: 'flex-start' },
  minOrderText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#FAFAFA' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, gap: 6 },
  statusInStock: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  statusOutStock: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusTextInStock: { color: '#10B981' },
  statusTextOutStock: { color: '#EF4444' },

  updateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#fff' },
  updateBtnText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },

  // Modal
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#94A3B8' },
  closeBtn: { padding: 4 },
  modalForm: { padding: 24 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 46, fontSize: 14, color: '#0F172A' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { fontSize: 11, color: '#EF4444', marginTop: 4, marginLeft: 4 },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, backgroundColor: '#fff' },
  cancelBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  submitBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
