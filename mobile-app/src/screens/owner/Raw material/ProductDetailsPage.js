import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, useWindowDimensions, Modal,
} from 'react-native';
import {
  ArrowLeft, Heart, Share2, Star, MapPin, 
  ChevronRight, Minus, Plus, ShoppingCart, 
  Search, X, Check,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';

// ─────────────────────────────────────────────────────────────
// Request Quote Modal
// ─────────────────────────────────────────────────────────────
function RequestQuoteModal({ visible, onClose, product }) {
  const [qty, setQty] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, API call here
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={mq.overlay}>
          <View style={mq.successCard}>
            <Check size={48} color="#10B981" />
            <Text style={mq.successTitle}>Quote Requested!</Text>
            <Text style={mq.successSub}>Vendor will reply shortly.</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={mq.overlay}>
        <TouchableOpacity style={mq.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={mq.modal}>
          <View style={mq.header}>
            <Text style={mq.title}>Request Custom Quote</Text>
            <TouchableOpacity onPress={onClose} style={mq.closeBtn}>
              <X size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={mq.body} showsVerticalScrollIndicator={false}>
            <Text style={mq.productName}>For: {product?.name}</Text>
            
            <View style={mq.inputGroup}>
              <Text style={mq.label}>Required Quantity (min {product?.moq})</Text>
              <TextInput 
                style={mq.input} 
                placeholder="e.g. 50 kg"
                value={qty} onChangeText={setQty}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={mq.inputGroup}>
              <Text style={mq.label}>Expected Delivery Date</Text>
              <TextInput 
                style={mq.input} 
                placeholder="DD/MM/YYYY"
                value={date} onChangeText={setDate}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={mq.inputGroup}>
              <Text style={mq.label}>Target Budget (₹)</Text>
              <TextInput 
                style={mq.input} 
                placeholder="e.g. 35 per kg"
                value={budget} onChangeText={setBudget}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={mq.inputGroup}>
              <Text style={mq.label}>Special Instructions</Text>
              <TextInput 
                style={[mq.input, mq.textArea]} 
                placeholder="Any specific quality requirements..."
                value={notes} onChangeText={setNotes}
                multiline numberOfLines={3}
                placeholderTextColor={colors.muted}
              />
            </View>
          </ScrollView>

          <View style={mq.footer}>
            <TouchableOpacity style={mq.submitBtn} onPress={handleSubmit}>
              <Text style={mq.submitText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mq = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9,13,22,0.6)' },
  modal: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '90%', ...Platform.select({ web: { alignSelf: 'center', width: 400, borderRadius: 16, marginBottom: 'auto', marginTop: 'auto' } })
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  closeBtn: { padding: 4 },
  body: { padding: 20 },
  productName: { fontSize: 13, fontWeight: '600', color: GOLD, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: '#0F172A',
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: '#fff' },
  submitBtn: { backgroundColor: GOLD, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  successCard: { backgroundColor: '#fff', margin: 40, padding: 32, borderRadius: 20, alignItems: 'center', ...Platform.select({ web: { alignSelf: 'center', width: 300 } }) },
  successTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 8 },
  successSub: { fontSize: 13, color: '#64748B' }
});

// ─────────────────────────────────────────────────────────────
// Main Product Details Page
// ─────────────────────────────────────────────────────────────
export default function ProductDetailsPage({ product, onBack, cartItems = [], onCartUpdate, onViewCart, onCompare }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [isFav, setIsFav] = useState(false);
  const [qty, setQty] = useState(parseInt(product.moq) || 1);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const numericMoq = parseInt(product.moq) || 1;

  const handleDecrease = () => {
    if (qty > numericMoq) setQty(qty - 1);
  };
  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleAddToCart = () => {
    onCartUpdate && onCartUpdate(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty: qty }];
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>

        <View style={styles.topBarRight}>
          {cartItems.length > 0 && (
            <TouchableOpacity style={styles.cartBadgeBtn} onPress={onViewCart}>
              <ShoppingCart size={15} color="#fff" />
              <Text style={styles.cartBadgeText}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFav(!isFav)}>
            <Heart size={18} color={isFav ? '#EF4444' : '#0F172A'} fill={isFav ? '#EF4444' : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={isMobile ? { paddingBottom: 100 } : { paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {/* Left Column (Web) / Top (Mobile) */}
          <View style={!isMobile && { flex: 1, maxWidth: 500 }}>
            {/* ── Product Image Area ── */}
            <View style={[styles.imageArea, { backgroundColor: product.bg || '#F8FAFC' }]}>
              <Text style={styles.mainEmoji}>{product.emoji}</Text>
            </View>
          </View>

          {/* Right Column (Web) / Bottom (Mobile) */}
          <View style={[styles.detailsArea, !isMobile && { flex: 1 }]}>
            
            {/* ── Summary ── */}
            <View style={styles.summaryBox}>
              <View style={styles.titleRow}>
                <Text style={styles.productName}>{product.name} (Grade A)</Text>
                {product.inStock ? (
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>In Stock</Text>
                  </View>
                ) : (
                  <View style={[styles.stockBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                    <Text style={[styles.stockText, { color: '#EF4444' }]}>Out of Stock</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                <Text style={styles.unit}>/ {product.unit.replace('per ', '')}</Text>
              </View>

              {/* Metrics */}
              <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Min. Order</Text>
                  <Text style={styles.metricValue}>{product.moq}</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Available</Text>
                  <Text style={styles.metricValue}>250 {product.unit.replace('per ', '')}s</Text>
                </View>
              </View>
            </View>

            {/* ── Vendor Card ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Supplier</Text>
              <View style={styles.vendorCard}>
                <View style={styles.vendorAvatar}>
                  <Text style={styles.vendorInitials}>{product.vendor.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={styles.vendorInfo}>
              <Text style={styles.vendorName} numberOfLines={1}>{product.vendor}</Text>
                  <View style={styles.vendorMeta}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.vendorRating}>{product.rating} (120 reviews)</Text>
                  </View>
                  <View style={styles.vendorLocationRow}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.vendorLocation}>Mumbai, Maharashtra</Text>
                  </View>
                  <View style={styles.vendorActionsRow}>
                    <TouchableOpacity style={styles.viewVendorBtn}>
                      <Text style={styles.viewVendorText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.compareBtn} onPress={() => onCompare && onCompare(product)}>
                      <Text style={styles.compareBtnText}>Compare</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* ── Details ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              <View style={styles.detailsBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quality</Text>
                  <Text style={styles.detailValue}>Grade A (Export Quality)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailValue}>Medium (45mm - 55mm)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Packaging</Text>
                  <Text style={styles.detailValue}>Gunny Bag / Mesh Bag</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery Time</Text>
                  <Text style={styles.detailValue}>{product.delivery || 'Tomorrow'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>GST</Text>
                  <Text style={styles.detailValue}>5% (Not included)</Text>
                </View>
                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Return Policy</Text>
                  <Text style={styles.detailValue}>Not Returnable</Text>
                </View>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      <View style={[styles.bottomBar, !isMobile && styles.bottomBarWeb]}>
        
        {/* Qty Selector */}
        <View style={styles.qtyBox}>
          <TouchableOpacity style={styles.qtyBtn} onPress={handleDecrease}>
            <Minus size={16} color={qty > numericMoq ? "#0F172A" : "#CBD5E1"} />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrease}>
            <Plus size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.actionBtns}>
          <TouchableOpacity style={styles.quoteBtn} onPress={() => setShowQuoteModal(true)}>
            <Search size={16} color={GOLD} />
            <Text style={styles.quoteText}>Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <ShoppingCart size={16} color="#fff" />
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

      </View>

      <RequestQuoteModal 
        visible={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
        product={product} 
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },

  // Top Bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, height: 36, borderRadius: 10,
    backgroundColor: GOLD,
  },
  cartBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1, textAlign: 'center', paddingHorizontal: 10 },
  topBarRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { flexDirection: 'row', gap: 32, padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%' },

  // Image
  imageArea: {
    aspectRatio: 1, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  mainEmoji: { fontSize: 120 },

  detailsArea: { flex: 1 },

  // Summary
  summaryBox: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  productName: { fontSize: 20, fontWeight: '900', color: '#0F172A', flex: 1, marginRight: 10 },
  stockBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#D1FAE5' },
  stockText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 16 },
  price: { fontSize: 26, fontWeight: '900', color: GOLD },
  unit: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  metricsRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12 },
  metricBox: { flex: 1 },
  metricLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  metricValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  metricDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: 12 },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  
  // Vendor
  vendorCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  vendorAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  vendorInitials: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  vendorMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  vendorRating: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  vendorLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  vendorLocation: { fontSize: 13, color: '#64748B' },
  vendorActionsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  viewVendorBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  viewVendorText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  compareBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: GOLD, backgroundColor: '#FFFBEB', alignItems: 'center' },
  compareBtnText: { fontSize: 13, fontWeight: '700', color: GOLD },

  // Details
  detailsBox: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { flex: 1, fontSize: 13, color: '#64748B' },
  detailValue: { flex: 1.5, fontSize: 13, fontWeight: '600', color: '#0F172A', textAlign: 'right' },

  // Bottom Bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border,
    gap: 12,
  },
  bottomBarWeb: { position: 'relative', borderTopWidth: 0, backgroundColor: 'transparent', padding: 0, marginTop: 10 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, height: 48 },
  qtyBtn: { width: 40, height: '100%', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 15, fontWeight: '800', color: '#0F172A', minWidth: 32, textAlign: 'center' },
  actionBtns: { flex: 1, flexDirection: 'row', gap: 8 },
  quoteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 48, borderRadius: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7'
  },
  quoteText: { fontSize: 14, fontWeight: '700', color: GOLD },
  cartBtn: {
    flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 48, borderRadius: 12, backgroundColor: GOLD,
  },
  cartBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
