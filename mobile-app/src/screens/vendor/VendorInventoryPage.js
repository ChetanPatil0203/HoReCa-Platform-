import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Share, Alert } from 'react-native';
import { Search, Download, Plus, X, Pen } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';

const INVENTORY_DATA_BY_TYPE = {
  "raw-material": [
    { id: "PFS-GRN-001", name: "Premium Basmati Rice", category: "Grains", stock: "2,400", unit: "Kg", price: "₹ 85", minOrder: "50 Kg", status: "In Stock" },
    { id: "PFS-GRN-002", name: "Sona Masoori Rice", category: "Grains", stock: "1,500", unit: "Kg", price: "₹ 58", minOrder: "25 Kg", status: "In Stock" },
    { id: "PFS-FLR-001", name: "Wheat Flour (Atta)", category: "Flour", stock: "3,200", unit: "Kg", price: "₹ 44", minOrder: "20 Kg", status: "In Stock" },
    { id: "PFS-FLR-002", name: "Maida (Refined Flour)", category: "Flour", stock: "2,100", unit: "Kg", price: "₹ 38", minOrder: "20 Kg", status: "In Stock" },
    { id: "PFS-PLS-001", name: "Toor Dal", category: "Pulses", stock: "850", unit: "Kg", price: "₹ 115", minOrder: "10 Kg", status: "In Stock" },
    { id: "PFS-PLS-002", name: "Chana Dal", category: "Pulses", stock: "720", unit: "Kg", price: "₹ 50", minOrder: "10 Kg", status: "In Stock" },
    { id: "PFS-PLS-003", name: "Urad Dal (Whole)", category: "Pulses", stock: "0", unit: "Kg", price: "₹ 130", minOrder: "10 Kg", status: "Out of Stock" },
    { id: "PFS-OIL-001", name: "Refined Sunflower Oil", category: "Oils", stock: "1,200", unit: "L", price: "₹ 145", minOrder: "10 L", status: "In Stock" },
    { id: "PFS-SWT-001", name: "Sugar (Fine Grade M30)", category: "Sweeteners", stock: "5,000", unit: "Kg", price: "₹ 48", minOrder: "25 Kg", status: "In Stock" },
    { id: "PFS-SWT-002", name: "Jaggery (Gur) Blocks", category: "Sweeteners", stock: "280", unit: "Kg", price: "₹ 72", minOrder: "10 Kg", status: "In Stock" },
  ],
  "manpower": [
    { id: "EMP-KIT-001", name: "Executive Chef", category: "Kitchen Staff", stock: "8", unit: "agents", price: "₹ 1,200", minOrder: "1 person", status: "In Stock" },
    { id: "EMP-KIT-002", name: "Sous Chef", category: "Kitchen Staff", stock: "12", unit: "agents", price: "₹ 900", minOrder: "1 person", status: "In Stock" },
    { id: "EMP-FNB-001", name: "F&B Banquet Server", category: "F&B Staff", stock: "45", unit: "agents", price: "₹ 450", minOrder: "5 persons", status: "In Stock" },
    { id: "EMP-FNB-002", name: "Barista (Latte Art Pro)", category: "F&B Staff", stock: "10", unit: "agents", price: "₹ 600", minOrder: "1 person", status: "In Stock" },
    { id: "EMP-HSP-001", name: "Hostess / Front Desk", category: "Hospitality", stock: "15", unit: "agents", price: "₹ 700", minOrder: "1 person", status: "In Stock" },
    { id: "EMP-SEC-001", name: "Night Security Guard", category: "Security", stock: "0", unit: "agents", price: "₹ 800", minOrder: "2 persons", status: "Out of Stock" },
  ],
  "service": [
    { id: "PCS-MNT-001", name: "HVAC Annual AMC Maintenance", category: "Maintenance", stock: "5", unit: "teams", price: "₹ 85,000", minOrder: "1 contract", status: "In Stock" },
    { id: "PCS-CLN-001", name: "Kitchen Hood Deep Cleaning", category: "Cleaning", stock: "8", unit: "teams", price: "₹ 15,000", minOrder: "1 section", status: "In Stock" },
    { id: "PCS-PST-001", name: "FSSAI Pest Control", category: "Pest Control", stock: "12", unit: "teams", price: "₹ 4,800", minOrder: "1 property", status: "In Stock" },
    { id: "PCS-ELC-001", name: "Commercial Electrical Audit", category: "Electrical", stock: "4", unit: "teams", price: "₹ 12,000", minOrder: "1 audit", status: "In Stock" },
    { id: "PCS-PLM-001", name: "Plumbing Emergency Support", category: "Plumbing", stock: "0", unit: "teams", price: "₹ 3,500", minOrder: "1 visit", status: "Out of Stock" },
  ],
  "marketing": [
    { id: "BCM-SOC-001", name: "Social Media Campaign (Monthly)", category: "Social Media", stock: "4", unit: "slots", price: "₹ 40,000", minOrder: "1 month", status: "In Stock" },
    { id: "BCM-PHO-001", name: "Professional Food Photography", category: "Creative", stock: "6", unit: "slots", price: "₹ 18,000", minOrder: "1 photoshoot", status: "In Stock" },
    { id: "BCM-ADS-001", name: "Google & Meta Ads Setup", category: "Paid Ads", stock: "3", unit: "slots", price: "₹ 24,000", minOrder: "3 months", status: "In Stock" },
    { id: "BCM-PRL-001", name: "PR & Influencer Campaign", category: "Public Relations", stock: "5", unit: "slots", price: "₹ 55,000", minOrder: "1 campaign", status: "In Stock" },
    { id: "BCM-CRE-001", name: "Menu Design & Rebranding", category: "Creative", stock: "0", unit: "slots", price: "₹ 12,500", minOrder: "1 service", status: "Out of Stock" },
  ],
};

const METADATA_BY_TYPE = {
  "raw-material": {
    title: "Inventory Control", subTag: "RAW MATERIAL INVENTORY CONTROL", supplier: "Metro Fresh Supplies",
    supplierLabel: "Supplier", totalLabel: "Total SKUs", activeLabel: "In Stock", inactiveLabel: "Out of Stock",
    valLabel: "Inventory Value", val: "₹12.4L", addBtnLabel: "Add Bulk Stock", priceLabel: "WHOLESALE PRICE",
    qtyLabel: "MIN ORDER QTY", stockLabel: "Stock:", priceUnit: "kg",
    categories: ["Grains", "Flour", "Pulses", "Oils", "Sweeteners"],
    color: "#F59E0B", bg: "#FFFBEB",
    iconMap: { "Grains": "🌾", "Flour": "🍞", "Pulses": "🥣", "Oils": "🫙", "Sweeteners": "🍬" },
  },
  "manpower": {
    title: "Roster Management", subTag: "STAFF ROSTER CONTROL", supplier: "Elite Staffing Co.",
    supplierLabel: "Agency", totalLabel: "Staff Roles", activeLabel: "Available", inactiveLabel: "Fully Deployed",
    valLabel: "Monthly Payroll Est.", val: "₹4.8L", addBtnLabel: "Add Personnel", priceLabel: "RATE PER SHIFT",
    qtyLabel: "MIN CONTRACT", stockLabel: "Active Pool:", priceUnit: "shift",
    categories: ["Kitchen Staff", "F&B Staff", "Hospitality", "Security"],
    color: "#2563EB", bg: "#EFF6FF",
    iconMap: { "Kitchen Staff": "👨‍🍳", "F&B Staff": "🤵", "Hospitality": "☕", "Security": "👮" },
  },
  "service": {
    title: "Services Catalog", subTag: "FACILITIES SERVICES CONTROL", supplier: "ProClean Services",
    supplierLabel: "Provider", totalLabel: "Total Services", activeLabel: "Active Teams", inactiveLabel: "Fully Booked",
    valLabel: "Operational Value", val: "₹3.2L", addBtnLabel: "Add Service Item", priceLabel: "BASE SERVICE RATE",
    qtyLabel: "MIN BOOKING", stockLabel: "Teams Available:", priceUnit: "job",
    categories: ["Maintenance", "Cleaning", "Pest Control", "Electrical", "Plumbing"],
    color: "#10B981", bg: "#ECFDF5",
    iconMap: { "Maintenance": "🔧", "Cleaning": "🧹", "Pest Control": "🐜", "Electrical": "⚡", "Plumbing": "🫗" },
  },
  "marketing": {
    title: "Campaign Catalog", subTag: "MARKETING SERVICES CONTROL", supplier: "BrandCraft Agency",
    supplierLabel: "Agency", totalLabel: "Total Packages", activeLabel: "Available Slots", inactiveLabel: "Sold Out",
    valLabel: "Pipeline Value", val: "₹2.9L", addBtnLabel: "Add Package", priceLabel: "BASE PACKAGE RATE",
    qtyLabel: "MIN PERIOD", stockLabel: "Open Slots:", priceUnit: "pkg",
    categories: ["Social Media", "Creative", "Paid Ads", "Public Relations"],
    color: "#8B5CF6", bg: "#F5F3FF",
    iconMap: { "Social Media": "📱", "Creative": "📷", "Paid Ads": "📈", "Public Relations": "📣" },
  },
};

// ── Live date string ──────────────────────────────────────
const TODAY = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

export default function VendorInventoryPage() {
  const { vendorType } = useContext(AuthContext);
  const type = vendorType || 'raw-material';
  const meta = METADATA_BY_TYPE[type] || METADATA_BY_TYPE["raw-material"];

  const [inventory, setInventory] = useState(
    () => INVENTORY_DATA_BY_TYPE[type] || INVENTORY_DATA_BY_TYPE["raw-material"]
  );

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

  // ── Add new item ───────────────────────────────────────
  const handleAddItem = () => {
    if (!validate()) return;
    const unitMap = { "raw-material": "Kg", manpower: "agents", service: "teams", marketing: "slots" };
    const newItem = {
      id: type.toUpperCase().slice(0, 3) + "-" + category.toUpperCase().slice(0, 3) + "-" + Math.floor(Math.random() * 900 + 100),
      name: name.trim(),
      category,
      stock: Number(stock).toLocaleString("en-IN"),
      unit: unitMap[type] || "units",
      price: "₹ " + price,
      minOrder: minOrder + " " + (unitMap[type] || "unit"),
      status: Number(stock) > 0 ? "In Stock" : "Out of Stock",
    };
    setInventory([newItem, ...inventory]);
    resetForm();
    setIsAddModalVisible(false);
  };

  // ── Save edited item ───────────────────────────────────
  const handleSaveEdit = () => {
    if (!validate()) return;
    const unitMap = { "raw-material": "Kg", manpower: "agents", service: "teams", marketing: "slots" };
    const updated = inventory.map(item =>
      item.id === editItem.id
        ? {
            ...item,
            name: name.trim(),
            category,
            stock: Number(stock).toLocaleString("en-IN"),
            price: "₹ " + price,
            minOrder: minOrder + " " + (unitMap[type] || "unit"),
            status: Number(stock) > 0 ? "In Stock" : "Out of Stock",
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

  return (
    <View style={styles.container}>

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>{meta.title}</Text>
        <Text style={styles.topHeaderDate}>{TODAY}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTag, { color: meta.color }]}>{meta.subTag}</Text>
          <Text style={styles.sectionTitle}>{meta.title}</Text>
          <Text style={styles.sectionSupplier}>
            {meta.supplierLabel}: <Text style={{ fontWeight: '700', color: '#1E293B' }}>{meta.supplier}</Text>
          </Text>
        </View>

        {/* Action Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <View style={styles.actionRow}>
            {/* ── FIX 1: Live Search ── */}
            <View style={[styles.searchContainer, searchText.length > 0 && { borderColor: meta.color }]}>
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
        </ScrollView>

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
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{meta.val}</Text>
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

        {/* Item Cards */}
        <View style={styles.list}>
          {filteredInventory.map((item) => (
            <View key={item.id} style={styles.card}>

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
          ))}
        </View>

      </ScrollView>

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
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  topHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  topHeaderDate: { fontSize: 11, color: colors.muted, marginTop: 4 },

  scrollContent: { padding: 16, paddingBottom: 40 },

  sectionHeader: { marginBottom: 20 },
  sectionTag: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  sectionSupplier: { fontSize: 13, color: '#64748B' },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, width: 220, height: 40, gap: 6 },
  searchInput: { flex: 1, fontSize: 12, color: '#1E293B' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 16, height: 40 },
  exportBtnText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  addBulkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, paddingHorizontal: 16, height: 40 },
  addBulkBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  statsContainer: { flexDirection: 'row', gap: 12, paddingRight: 16 },
  statCard: { padding: 16, borderRadius: 8, borderWidth: 1, minWidth: 140 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  emptyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },

  cardHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  imagePlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  productId: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  productStock: { fontSize: 11, color: '#64748B' },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailItem: { flex: 1, minWidth: '30%' },
  detailLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: '700' },
  priceValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  priceUnit: { fontSize: 12, color: colors.muted, fontWeight: '500' },

  minOrderBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', alignSelf: 'flex-start' },
  minOrderText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#FAFAFA' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
  statusInStock: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  statusOutStock: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextInStock: { color: '#10B981' },
  statusTextOutStock: { color: '#EF4444' },

  updateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#fff' },
  updateBtnText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },

  // Modal
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#94A3B8' },
  closeBtn: { padding: 4 },
  modalForm: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 16, height: 44, fontSize: 14, color: '#0F172A' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { fontSize: 11, color: '#EF4444', marginTop: 4, marginLeft: 4 },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, backgroundColor: '#fff' },
  cancelBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  submitBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
