import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, useWindowDimensions, Modal,
  Switch, FlatList,
} from 'react-native';
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronDown,
  Heart, ShoppingCart, Star, X, Check, Clock,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { CATEGORY_PRODUCTS, SORT_OPTIONS } from '../../../constants/rawMaterialData';
import ProductDetailsPage from './ProductDetailsPage';

const GOLD = '#D97706';

// ─── Delivery sort weight ─────────────────────────────────────
const DELIVERY_RANK = { 'Same Day': 0, 'Next Day': 1, '2 Days': 2 };

// ─────────────────────────────────────────────────────────────
//  Row-style Product Card (vertical list)
// ─────────────────────────────────────────────────────────────
function ProductRowCard({ product, onAddToCart, onPress }) {
  const [isFav, setIsFav] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCart = () => {
    setAdded(true);
    onAddToCart && onAddToCart(product);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <TouchableOpacity
      style={styles.rowCard}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.92}
    >
      {/* Emoji Image */}
      <View style={[styles.rowImage, { backgroundColor: product.bg }]}>
        <Text style={styles.rowEmoji}>{product.emoji}</Text>
        {product.badge && (
          <View style={[styles.rowBadge, { backgroundColor: product.badgeColor }]}>
            <Text style={styles.rowBadgeText}>{product.badge}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <View style={styles.rowTopRow}>
          <Text style={styles.rowName} numberOfLines={1}>{product.name}</Text>
          <TouchableOpacity onPress={() => setIsFav(!isFav)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Heart
              size={15}
              color={isFav ? '#EF4444' : '#CBD5E1'}
              fill={isFav ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.rowVendor} numberOfLines={1}>{product.vendor}</Text>

        <View style={styles.rowMeta}>
          {/* Rating */}
          <View style={styles.metaChip}>
            <Star size={10} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.metaChipText}>{product.rating}</Text>
          </View>
          {/* Delivery */}
          <View style={styles.metaChip}>
            <Clock size={10} color="#64748B" />
            <Text style={styles.metaChipText}>{product.delivery}</Text>
          </View>
          {/* MOQ */}
          <Text style={styles.moqLabel}>MOQ: {product.moq}</Text>
        </View>

        <View style={styles.rowBottom}>
          {/* Price */}
          <View>
            <Text style={styles.rowPrice}>₹{product.price}</Text>
            <Text style={styles.rowUnit}>{product.unit}</Text>
          </View>

          {/* Stock + Cart */}
          <View style={styles.rowActions}>
            {!product.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
            {product.inStock && (
              <TouchableOpacity
                style={[styles.cartRowBtn, added && styles.cartRowBtnAdded]}
                onPress={handleCart}
                activeOpacity={0.8}
              >
                {added
                  ? <Check size={13} color="#fff" />
                  : <ShoppingCart size={13} color="#fff" />
                }
                <Text style={styles.cartRowBtnText}>{added ? 'Added' : 'Add'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
//  Filter Drawer (Modal)
// ─────────────────────────────────────────────────────────────
function FilterDrawer({ visible, onClose, onApply, initialFilters, catColor }) {
  const [priceMax, setPriceMax] = useState(String(initialFilters.priceMax));
  const [minRating, setMinRating] = useState(initialFilters.minRating);
  const [delivery, setDelivery] = useState(initialFilters.delivery); // 'Any'|'Same Day'|'Next Day'|'2 Days'
  const [inStockOnly, setInStockOnly] = useState(initialFilters.inStockOnly);

  const DELIVERY_OPTS = ['Any', 'Same Day', 'Next Day', '2 Days'];
  const RATING_OPTS   = [0, 4.0, 4.3, 4.5, 4.7];

  const handleApply = () => {
    onApply({
      priceMax: Number(priceMax) || 99999,
      minRating,
      delivery,
      inStockOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setPriceMax('99999');
    setMinRating(0);
    setDelivery('Any');
    setInStockOnly(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={fd.overlay}>
        <TouchableOpacity style={fd.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={fd.drawer}>
          {/* Header */}
          <View style={fd.header}>
            <Text style={fd.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={fd.closeBtn}>
              <X size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

            {/* ── Price Range ── */}
            <View style={fd.section}>
              <Text style={fd.sectionTitle}>Max Price (₹)</Text>
              <TextInput
                style={fd.input}
                value={priceMax === '99999' ? '' : priceMax}
                onChangeText={v => setPriceMax(v || '99999')}
                placeholder="e.g. 500"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
              />
            </View>

            {/* ── Minimum Rating ── */}
            <View style={fd.section}>
              <Text style={fd.sectionTitle}>Minimum Rating</Text>
              <View style={fd.chipRow}>
                {RATING_OPTS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[fd.chip, minRating === r && { backgroundColor: catColor, borderColor: catColor }]}
                    onPress={() => setMinRating(r)}
                  >
                    {r === 0
                      ? <Text style={[fd.chipText, minRating === r && fd.chipTextActive]}>Any</Text>
                      : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Star size={11} color={minRating === r ? '#fff' : '#F59E0B'} fill={minRating === r ? '#fff' : '#F59E0B'} />
                          <Text style={[fd.chipText, minRating === r && fd.chipTextActive]}>{r}+</Text>
                        </View>
                    }
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Delivery Preference ── */}
            <View style={fd.section}>
              <Text style={fd.sectionTitle}>Delivery Time</Text>
              <View style={fd.chipRow}>
                {DELIVERY_OPTS.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[fd.chip, delivery === d && { backgroundColor: catColor, borderColor: catColor }]}
                    onPress={() => setDelivery(d)}
                  >
                    <Text style={[fd.chipText, delivery === d && fd.chipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── In Stock ── */}
            <View style={fd.section}>
              <View style={fd.switchRow}>
                <View>
                  <Text style={fd.sectionTitle}>In Stock Only</Text>
                  <Text style={fd.switchSub}>Show only available products</Text>
                </View>
                <Switch
                  value={inStockOnly}
                  onValueChange={setInStockOnly}
                  trackColor={{ false: colors.border, true: catColor }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={fd.footer}>
            <TouchableOpacity style={fd.resetBtn} onPress={handleReset}>
              <Text style={fd.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[fd.applyBtn, { backgroundColor: catColor }]} onPress={handleApply}>
              <Text style={fd.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const fd = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(9,13,22,0.45)' },
  drawer: {
    width: 320, backgroundColor: '#fff', flex: 1,
    ...Platform.select({ web: { boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' } }),
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  closeBtn: { padding: 4 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  input: {
    height: 44, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 14, fontSize: 14, color: '#0F172A',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, backgroundColor: '#F8FAFC',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  chipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  footer: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  resetBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  resetText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  applyBtn: { flex: 2, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  applyText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

// ─────────────────────────────────────────────────────────────
//  Sort Dropdown
// ─────────────────────────────────────────────────────────────
function SortDropdown({ visible, selected, onSelect, onClose, catColor }) {
  if (!visible) return null;
  return (
    <View style={sd.container}>
      <TouchableOpacity style={sd.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={sd.menu}>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[sd.item, selected === opt.id && sd.itemActive]}
            onPress={() => { onSelect(opt.id); onClose(); }}
          >
            <Text style={[sd.itemText, selected === opt.id && { color: catColor, fontWeight: '700' }]}>
              {opt.label}
            </Text>
            {selected === opt.id && <Check size={14} color={catColor} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const sd = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  menu: {
    position: 'absolute', top: 120, right: 20, width: 230,
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }),
    zIndex: 51,
  },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemActive: { backgroundColor: '#FAFAFA' },
  itemText: { fontSize: 13, color: '#475569', fontWeight: '500' },
});

// ─────────────────────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────────────────────
export default function CategoryListingPage({ category, cartItems = [], onCartUpdate, onBack, onViewCart, onCompare }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const catColor = category?.color || GOLD;
  const catBg    = category?.bg    || '#FFFBEB';
  const allProducts = CATEGORY_PRODUCTS[category?.id] || [];

  // ── State ──────────────────────────────────────────────────
  const [search, setSearch]           = useState('');
  const [sortId, setSortId]           = useState('price-asc');
  const [showSort, setShowSort]       = useState(false);
  const [showFilter, setShowFilter]   = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceMax: 99999,
    minRating: 0,
    delivery: 'Any',
    inStockOnly: false,
  });
  const [activeQuickFilter, setActiveQuickFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const QUICK_FILTERS = ['All', 'In Stock', 'Same Day', '⭐ 4.5+'];

  // ── Derived: filtered + sorted products ────────────────────
  const displayedProducts = useMemo(() => {
    let list = [...allProducts];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q)
      );
    }

    // Quick filter
    if (activeQuickFilter === 'In Stock')   list = list.filter(p => p.inStock);
    if (activeQuickFilter === 'Same Day')   list = list.filter(p => p.delivery === 'Same Day');
    if (activeQuickFilter === '⭐ 4.5+')   list = list.filter(p => p.rating >= 4.5);

    // Advanced filters
    list = list.filter(p => p.price <= activeFilters.priceMax);
    list = list.filter(p => p.rating >= activeFilters.minRating);
    if (activeFilters.delivery !== 'Any') list = list.filter(p => p.delivery === activeFilters.delivery);
    if (activeFilters.inStockOnly)        list = list.filter(p => p.inStock);

    // Sort
    switch (sortId) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'delivery':   list.sort((a, b) => (DELIVERY_RANK[a.delivery] ?? 9) - (DELIVERY_RANK[b.delivery] ?? 9)); break;
      case 'orders':     list.sort((a, b) => b.orders - a.orders); break;
      default: break;
    }
    return list;
  }, [allProducts, search, activeQuickFilter, activeFilters, sortId]);

  const currentSortLabel = SORT_OPTIONS.find(o => o.id === sortId)?.label || 'Sort';

  const hasActiveFilters =
    activeFilters.priceMax < 99999 ||
    activeFilters.minRating > 0 ||
    activeFilters.delivery !== 'Any' ||
    activeFilters.inStockOnly;

  const handleAddToCart = useCallback((product) => {
    onCartUpdate && onCartUpdate(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: parseInt(product.moq) || 1 }];
    });
  }, [onCartUpdate]);

  const handleProductPress = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  if (selectedProduct) {
    return (
      <ProductDetailsPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        cartItems={cartItems}
        onCartUpdate={onCartUpdate}
        onViewCart={onViewCart}
        onCompare={onCompare}
      />
    );
  }

  return (
    <View style={styles.wrapper}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <View style={[styles.catEmojiBox, { backgroundColor: catBg }]}>
            <Text style={{ fontSize: 18 }}>{category?.emoji}</Text>
          </View>
          <View>
            <Text style={styles.catTitle} numberOfLines={1}>{category?.label}</Text>
            <Text style={styles.catCount}>{allProducts.length} products</Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          {/* Cart count badge (read-only display or click to view cart) */}
          {cartItems.length > 0 && (
            <TouchableOpacity style={[styles.cartIndicator, { backgroundColor: catColor }]} onPress={onViewCart}>
              <ShoppingCart size={13} color="#fff" />
              <Text style={styles.cartIndicatorText}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Search ──────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={15} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search in ${category?.label}...`}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={13} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filter / Sort Row ────────────────────────────────── */}
      <View style={styles.filterBarWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>

          {/* Filter button */}
          <TouchableOpacity
            style={[styles.filterChip, hasActiveFilters && { backgroundColor: catColor, borderColor: catColor }]}
            onPress={() => setShowFilter(true)}
          >
            <SlidersHorizontal size={13} color={hasActiveFilters ? '#fff' : '#475569'} />
            <Text style={[styles.filterChipText, hasActiveFilters && { color: '#fff' }]}>
              Filters{hasActiveFilters ? ' •' : ''}
            </Text>
          </TouchableOpacity>

          {/* Sort button */}
          <TouchableOpacity
            style={[styles.filterChip, showSort && { backgroundColor: catColor, borderColor: catColor }]}
            onPress={() => setShowSort(v => !v)}
          >
            <Text style={[styles.filterChipText, showSort && { color: '#fff' }]}>
              {sortId !== 'price-asc' ? currentSortLabel : 'Sort'}
            </Text>
            <ChevronDown size={12} color={showSort ? '#fff' : '#475569'} />
          </TouchableOpacity>

          {/* Quick Filter chips */}
          {QUICK_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeQuickFilter === f && { backgroundColor: catColor, borderColor: catColor },
              ]}
              onPress={() => setActiveQuickFilter(prev => prev === f ? 'All' : f)}
            >
              <Text style={[styles.filterChipText, activeQuickFilter === f && { color: '#fff' }]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{ width: 12 }} />
        </ScrollView>
      </View>

      {/* ── Product Count ────────────────────────────────────── */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {displayedProducts.length} of {allProducts.length} products
        </Text>
        {(search || hasActiveFilters || activeQuickFilter !== 'All') && (
          <TouchableOpacity onPress={() => {
            setSearch('');
            setActiveQuickFilter('All');
            setActiveFilters({ priceMax: 99999, minRating: 0, delivery: 'Any', inStockOnly: false });
          }}>
            <Text style={[styles.clearAllText, { color: catColor }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Product List ─────────────────────────────────────── */}
      {displayedProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySub}>Try changing your search or filters</Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: catColor }]}
            onPress={() => {
              setSearch('');
              setActiveQuickFilter('All');
              setActiveFilters({ priceMax: 99999, minRating: 0, delivery: 'Any', inStockOnly: false });
            }}
          >
            <Text style={styles.emptyBtnText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductRowCard
              product={item}
              onAddToCart={handleAddToCart}
              onPress={handleProductPress}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      {/* ── Sort Dropdown ────────────────────────────────────── */}
      <SortDropdown
        visible={showSort}
        selected={sortId}
        onSelect={setSortId}
        onClose={() => setShowSort(false)}
        catColor={catColor}
      />

      {/* ── Filter Drawer ────────────────────────────────────── */}
      <FilterDrawer
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setActiveFilters}
        initialFilters={activeFilters}
        catColor={catColor}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Top Bar ─────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border,
    gap: 12,
  },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  topBarCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  catEmojiBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  catCount: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  cartIndicatorText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  // ── Search ──────────────────────────────────────────────────
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, height: 40,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  // ── Filter Bar ──────────────────────────────────────────────
  filterBarWrap: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  filterBar: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, backgroundColor: '#F8FAFC',
  },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#475569' },

  // ── Result count ────────────────────────────────────────────
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  resultText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  clearAllText: { fontSize: 12, fontWeight: '700' },

  // ── Product List ────────────────────────────────────────────
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },

  // ── Row Card ────────────────────────────────────────────────
  rowCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 2px 10px rgba(0,0,0,0.04)' } }),
  },
  rowImage: {
    width: 92, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  rowEmoji: { fontSize: 40 },
  rowBadge: {
    position: 'absolute', top: 6, left: 4,
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 20,
  },
  rowBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  rowInfo: { flex: 1, padding: 12 },
  rowTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  rowName: { fontSize: 14, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8 },
  rowVendor: { fontSize: 11, color: '#94A3B8', marginBottom: 8 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaChipText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  moqLabel: { fontSize: 10, color: '#94A3B8', fontStyle: 'italic' },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  rowPrice: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  rowUnit: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  outOfStockBadge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  outOfStockText: { fontSize: 10, fontWeight: '700', color: '#EF4444' },
  cartRowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: GOLD, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
  },
  cartRowBtnAdded: { backgroundColor: '#10B981' },
  cartRowBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // ── Empty State ─────────────────────────────────────────────
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#94A3B8', marginBottom: 20 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
