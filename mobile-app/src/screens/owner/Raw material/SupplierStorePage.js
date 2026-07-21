import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions, Platform, TextInput } from 'react-native';
import { ArrowLeft, Star, MapPin, Clock, ShieldCheck, ShoppingCart, Plus, Minus, Search, BadgeCheck, CheckCircle2, Heart } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { SUPPLIER_PRODUCTS } from '../../../constants/rawMaterialData';

const PRIMARY_BTN = '#D97706'; // Orange/Gold for Add buttons
const ACTIVE_TAB = '#16A34A'; // Green for active tabs
const NAVY = '#0F172A';
const GREEN = '#10B981';
const GOLD = '#D97706';

// Helper to get mock emoji and bg for supplier products to match screenshot
const getProductEmojiAndBg = (name) => {
  const n = name.toLowerCase();
  if (n.includes('cabbage')) return { emoji: '🥬', bg: '#F0FDF4' };
  if (n.includes('cucumber')) return { emoji: '🥒', bg: '#ECFDF5' };
  if (n.includes('potato')) return { emoji: '🥔', bg: '#FEF3C7' };
  if (n.includes('spinach')) return { emoji: '🥬', bg: '#D1FAE5' };
  if (n.includes('tomato')) return { emoji: '🍅', bg: '#FEF2F2' };
  if (n.includes('onion')) return { emoji: '🧅', bg: '#FEF2F2' };
  if (n.includes('apple')) return { emoji: '🍎', bg: '#FEF2F2' };
  if (n.includes('milk')) return { emoji: '🥛', bg: '#EFF6FF' };
  if (n.includes('carrot')) return { emoji: '🥕', bg: '#FFF7ED' };
  if (n.includes('water')) return { emoji: '💧', bg: '#ECFEFF' };
  if (n.includes('coriander')) return { emoji: '🌿', bg: '#ECFDF5' };
  if (n.includes('rice')) return { emoji: '🍚', bg: '#FFFBEB' };
  if (n.includes('dal')) return { emoji: '🫘', bg: '#FFFBEB' };
  if (n.includes('oil')) return { emoji: '🫙', bg: '#FEF9C3' };
  return { emoji: '📦', bg: '#F1F5F9' };
};

export default function SupplierStorePage({ supplier, cartItems, onCartUpdate, onBack, onViewCart, onProductPress }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const products = SUPPLIER_PRODUCTS[supplier.id] || [];
  
  const subCategories = ['All', ...new Set(products.map(p => p.subCategory).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (activeTab !== 'All') {
      list = list.filter(p => p.subCategory === activeTab);
    }
    return list;
  }, [products, search, activeTab]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const getProductQtyInCart = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.qty : 0;
  };

  const handleAddToCart = (product, change) => {
    onCartUpdate(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newQty = 0;
      
      if (existing) {
        newQty = existing.qty + change;
      } else if (change > 0) {
        newQty = product.moq || 1;
      }

      if (newQty <= 0 || newQty < (product.moq || 1)) {
        return prev.filter(item => item.id !== product.id);
      } else if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item);
      } else {
        return [...prev, { ...product, qty: newQty }];
      }
    });
  };

  const tags = ['Fresh Stock', 'Trusted Supplier'];

  return (
    <View style={styles.container}>
      {/* ── Sticky Header ── */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{supplier.name}</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={onViewCart} activeOpacity={0.8}>
          <ShoppingCart size={20} color={NAVY} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Supplier Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.avatar, { backgroundColor: supplier.bg }]}>
              <Text style={[styles.avatarText, { color: supplier.color }]}>{supplier.initials}</Text>
            </View>
            <View style={styles.heroInfo}>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroName} numberOfLines={1}>{supplier.name}</Text>
                {supplier.verified && <BadgeCheck size={18} color="#0EA5E9" style={{ marginLeft: 4 }} />}
              </View>
              <View style={styles.heroBadges}>
                {supplier.wholesale && (
                  <View style={styles.wholesaleBadge}>
                    <Text style={styles.wholesaleText}>Wholesale Prices</Text>
                  </View>
                )}
                <View style={styles.ratingBadge}>
                  <Star size={12} color={GOLD} fill={GOLD} />
                  <Text style={styles.ratingText}><Text style={{fontWeight: '700'}}>{supplier.rating}</Text> ({supplier.reviews})</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.heroDetails}>
            <View style={styles.detailBox}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.detailText}>{supplier.location}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailBox}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.detailText}>{supplier.deliveryTime}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailBox}>
              <Text style={styles.minOrderText}>Min. Order ₹{supplier.minOrder}</Text>
            </View>
          </View>

          <View style={styles.heroTags}>
            {tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <CheckCircle2 size={12} color={GREEN} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchWrap}>
          <Search size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ── Category Chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContainer}>
          {subCategories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.tab, activeTab === cat && styles.activeTab]}
              onPress={() => setActiveTab(cat)}
            >
              <Text style={[styles.tabText, activeTab === cat && styles.activeTabText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Product List (Redesigned Row Cards matching screenshot) ── */}
        <View style={styles.productGrid}>
          {filteredProducts.map(product => {
            const qty = getProductQtyInCart(product.id);
            const inStock = product.stock > 0;
            const styleInfo = getProductEmojiAndBg(product.name);
            
            return (
              <TouchableOpacity 
                key={product.id} 
                style={styles.rowCard}
                activeOpacity={0.9}
                onPress={() => onProductPress(product)}
              >
                <View style={[styles.rowImage, { backgroundColor: styleInfo.bg }]}>
                  <Text style={styles.rowEmoji}>{styleInfo.emoji}</Text>
                </View>

                <View style={styles.rowInfo}>
                  <View style={styles.rowTopRow}>
                    <Text style={styles.rowName} numberOfLines={1}>{product.name}</Text>
                    <Heart size={16} color="#CBD5E1" />
                  </View>

                  <Text style={styles.rowVendor} numberOfLines={1}>{supplier.name}</Text>

                  <View style={styles.rowMeta}>
                    <View style={styles.metaChip}>
                      <Star size={10} color={GOLD} fill={GOLD} />
                      <Text style={styles.metaChipText}>{supplier.rating}</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Clock size={10} color="#64748B" />
                      <Text style={styles.metaChipText}>{supplier.deliveryTime || 'Same Day'}</Text>
                    </View>
                    <Text style={styles.moqLabel}>MOQ: {product.moq} {product.unit}</Text>
                  </View>

                  <View style={styles.rowBottom}>
                    <View>
                      <Text style={styles.rowPrice}>₹{product.price}</Text>
                      <Text style={styles.rowUnit}>per {product.unit}</Text>
                    </View>

                    <View style={styles.rowActions}>
                      {!inStock && (
                        <View style={styles.outOfStockBadge}>
                          <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                      )}
                      {inStock && qty === 0 && (
                        <TouchableOpacity 
                          style={styles.cartRowBtn}
                          onPress={() => handleAddToCart(product, product.moq)}
                          activeOpacity={0.8}
                        >
                          <ShoppingCart size={14} color="#fff" />
                          <Text style={styles.cartRowBtnText}>Add</Text>
                        </TouchableOpacity>
                      )}
                      {inStock && qty > 0 && (
                        <View style={styles.qtyBox}>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAddToCart(product, -1)}>
                            <Minus size={14} color={PRIMARY_BTN} />
                          </TouchableOpacity>
                          <View style={styles.qtyValBox}>
                            <Text style={styles.qtyText}>{qty}</Text>
                          </View>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAddToCart(product, 1)}>
                            <Plus size={14} color={PRIMARY_BTN} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or category.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 10,
  },
  headerMobile: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: NAVY, flex: 1, textAlign: 'center', paddingHorizontal: 12 },
  cartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },

  scrollContent: { padding: 16, paddingBottom: 100, maxWidth: 800, alignSelf: 'center', width: '100%' },

  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16, ...Platform.select({ web: { boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' } }) },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '900' },
  heroInfo: { flex: 1 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  heroName: { fontSize: 18, fontWeight: '900', color: NAVY, flexShrink: 1 },
  heroBadges: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  wholesaleBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#BBF7D0' },
  wholesaleText: { fontSize: 10, fontWeight: '800', color: GREEN },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#FEF3C7' },
  ratingText: { fontSize: 11, color: '#92400E' },
  heroDetails: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 12 },
  detailBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  detailDivider: { width: 1, height: 12, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
  minOrderText: { fontSize: 12, fontWeight: '800', color: NAVY },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#475569' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', height: 44, borderRadius: 12, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },

  tabsScroll: { marginBottom: 16 },
  tabsContainer: { gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  activeTab: { backgroundColor: ACTIVE_TAB, borderColor: ACTIVE_TAB },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#fff' },

  productGrid: { gap: 12 },
  
  // ── Row Card styling matching the screenshot ──
  rowCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  rowImage: {
    width: 72,
    height: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowEmoji: {
    fontSize: 32,
  },
  rowInfo: {
    flex: 1,
  },
  rowTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    paddingRight: 8,
  },
  rowVendor: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  moqLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  rowPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  rowUnit: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartRowBtn: {
    backgroundColor: PRIMARY_BTN,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 8,
    gap: 6,
  },
  cartRowBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_BTN,
    borderRadius: 8,
    height: 32,
    width: 80,
  },
  qtyBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  qtyValBox: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB', // Light orange tint
    height: '100%',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: PRIMARY_BTN,
  },
  outOfStockBadge: {
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B' }
});
