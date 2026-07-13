import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, useWindowDimensions,
} from 'react-native';
import {
  Search, Heart, Bell, ShoppingCart, ChevronRight,
  ArrowRight, Star, Zap, ShieldCheck, Truck, Package
} from 'lucide-react-native';

import { colors } from '../../../theme/colors';
import { CATEGORIES, PRODUCTS, VENDORS, FEATURES } from '../../../constants/rawMaterialData';
import ProductCard from '../../../components/owner/rawmaterial/ProductCard';
import CategoryCard from '../../../components/owner/rawmaterial/CategoryCard';
import VendorCard from '../../../components/owner/rawmaterial/VendorCard';
import CategoryListingPage from './CategoryListingPage';
import RawMaterialCartPage from './RawMaterialCartPage';
import RawMaterialCheckoutPage from './RawMaterialCheckoutPage';
import RawMaterialComparePage from './RawMaterialComparePage';
import RawMaterialOrdersPage from './RawMaterialOrdersPage';
import RawMaterialOrderTrackingPage from './RawMaterialOrderTrackingPage';


const GOLD = '#D97706';
const GOLD_BG = '#FFFBEB';

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, subtitle, onSeeAll }) {
  return (
    <View style={sh.row}>
      <View>
        <Text style={sh.title}>{title}</Text>
        {subtitle ? <Text style={sh.sub}>{subtitle}</Text> : null}
      </View>
      {onSeeAll && (
        <TouchableOpacity style={sh.seeAllBtn} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={sh.seeAllText}>See All</Text>
          <ChevronRight size={13} color={GOLD} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '900', color: '#0F172A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 12, fontWeight: '700', color: GOLD },
});

// ─── Feature Icon Map ─────────────────────────────────────────
const FEATURE_ICONS = {
  quotes:   { Icon: Zap,         color: '#7C3AED', bg: '#F5F3FF' },
  compare:  { Icon: Star,        color: '#D97706', bg: '#FFFBEB' },
  payment:  { Icon: ShieldCheck, color: '#16A34A', bg: '#F0FDF4' },
  delivery: { Icon: Truck,       color: '#2563EB', bg: '#EFF6FF' },
};


// ─────────────────────────────────────────────────────────────
export default function RawMaterialPage({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [searchText, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // home | category | cart | checkout | success | compare | orders | orderTracking
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [compareProduct, setCompareProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleQuickReorder = (order) => {
    // Merge order items into cart
    setCartItems(prev => {
      const newCart = [...prev];
      order.items.forEach(orderItem => {
        const existing = newCart.find(item => item.id === orderItem.id);
        if (existing) {
          existing.qty += orderItem.qty;
        } else {
          newCart.push({ ...orderItem });
        }
      });
      return newCart;
    });
    // For simplicity, just route to cart
    setCurrentView('cart');
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: parseInt(product.moq) || 1 }];
    });
  };

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat);
    setCurrentView('category');
  };

  const handleViewProducts = (vendor) => {
    // Placeholder – future: navigate to vendor store
  };

  // ── Render correct view ────────────────────────────
  if (currentView === 'checkout' || currentView === 'success') {
    return (
      <RawMaterialCheckoutPage
        cartItems={cartItems}
        onBack={() => setCurrentView('cart')}
        onSuccess={() => {
          setCartItems([]);
          setCurrentView('success');
        }}
        isSuccess={currentView === 'success'}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'cart') {
    return (
      <RawMaterialCartPage
        cartItems={cartItems}
        setCartItems={setCartItems}
        onBack={() => setCurrentView('home')}
        onCheckout={() => setCurrentView('checkout')}
      />
    );
  }

  if (currentView === 'orders') {
    return (
      <RawMaterialOrdersPage 
        onBack={() => setCurrentView('home')}
        onTrackOrder={(order) => {
          setSelectedOrder(order);
          setCurrentView('orderTracking');
        }}
        onQuickReorder={handleQuickReorder}
      />
    );
  }

  if (currentView === 'orderTracking' && selectedOrder) {
    return (
      <RawMaterialOrderTrackingPage 
        order={selectedOrder}
        onBack={() => setCurrentView('orders')}
      />
    );
  }

  if (currentView === 'compare' && compareProduct) {
    return (
      <RawMaterialComparePage
        product={compareProduct}
        onBack={() => {
          setCompareProduct(null);
          setCurrentView(selectedCategory ? 'category' : 'home');
        }}
        onAddToCart={(product, vendor) => {
          handleAddToCart({ ...product, vendor: vendor.name, price: vendor.price, moq: vendor.moq });
          setCurrentView('cart');
        }}
        onQuote={(product, vendor) => {
          // Open quote modal for vendor if implemented
          console.log('Request quote for', product.name, 'from', vendor.name);
        }}
      />
    );
  }

  if (currentView === 'category' && selectedCategory) {
    return (
      <CategoryListingPage
        category={selectedCategory}
        cartItems={cartItems}
        onCartUpdate={setCartItems}
        onBack={() => {
          setSelectedCategory(null);
          setCurrentView('home');
        }}
        onViewCart={() => setCurrentView('cart')}
        onCompare={(product) => {
          setCompareProduct(product);
          setCurrentView('compare');
        }}
      />
    );
  }

  // ── Filtered Products (search) ────────────────────────────
  const filteredProducts = searchText.trim()
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchText.toLowerCase())
      )
    : PRODUCTS;


  return (
    <View style={styles.wrapper}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View>
          <Text style={styles.pageTitle}>Raw Material</Text>
          <Text style={styles.pageSubtitle}>Marketplace & Procurement</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('orders')}>
            <Package size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Heart size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Bell size={18} color={colors.muted} />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          {/* Cart */}
          <TouchableOpacity style={[styles.cartBtn, { backgroundColor: GOLD }]} onPress={() => setCurrentView('cart')} activeOpacity={0.8}>
            <ShoppingCart size={16} color="#fff" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search Bar ──────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, categories, vendors..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Scrollable Content ───────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isMobile && { padding: 0 }]}
      >

        {/* ── Hero Banner ─────────────────────────────────── */}
        <View style={[styles.heroBanner, isMobile && styles.heroBannerMobile]}>
          {/* Left */}
          <View style={[styles.heroLeft, isMobile && { flex: 0, width: '100%' }]}>
            <View style={styles.heroPill}>
              <Zap size={10} color={GOLD} />
              <Text style={styles.heroPillText}>HoReCa Exclusive Pricing</Text>
            </View>

            <Text style={styles.heroHeadline}>
              Get the best quality raw materials{' '}
              <Text style={{ color: GOLD }}>at the best prices</Text>
            </Text>
            <Text style={styles.heroDesc}>
              Compare vendors, request quotes and save more on every order.
            </Text>
            <TouchableOpacity style={styles.shopNowBtn} activeOpacity={0.85}>
              <Text style={styles.shopNowText}>Shop Now</Text>
              <ArrowRight size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Right — Illustration */}
          {!isMobile && (
            <View style={styles.heroRight}>
              <View style={styles.heroIllustrationBg}>
                <Text style={styles.heroEmoji}>🥦</Text>
                <Text style={[styles.heroEmoji, { fontSize: 52, top: 10, right: -10, position: 'absolute' }]}>🍅</Text>
                <Text style={[styles.heroEmoji, { fontSize: 44, bottom: 8, left: -5, position: 'absolute' }]}>🌾</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Shop by Category ────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse all fresh produce categories"
            onSeeAll={() => {}}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={handleCategoryPress}
              />
            ))}
            <View style={{ width: 4 }} />
          </ScrollView>
        </View>

        {/* ── Frequently Ordered ──────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Frequently Ordered"
            subtitle="Quick reorder your essentials"
            onSeeAll={() => {}}
          />
          {searchText.length > 0 && filteredProducts.length === 0 ? (
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchEmoji}>🔍</Text>
              <Text style={styles.emptySearchText}>No products found for "{searchText}"</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {(searchText.length > 0 ? filteredProducts : PRODUCTS).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
              <View style={{ width: 4 }} />
            </ScrollView>
          )}
        </View>

        {/* ── Top Rated Vendors ───────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Top Rated Vendors"
            subtitle="Trusted suppliers for HoReCa businesses"
            onSeeAll={() => {}}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {VENDORS.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onViewProducts={handleViewProducts}
              />
            ))}
            <View style={{ width: 4 }} />
          </ScrollView>
        </View>

        {/* ── Feature Strip ───────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Why HoReCa Connect?" />
          <View style={[styles.featuresGrid, isMobile && styles.featuresGridMobile]}>
            {FEATURES.map(feat => {
              const { Icon, color, bg } = FEATURE_ICONS[feat.id] || FEATURE_ICONS.quotes;
              return (
                <View key={feat.id} style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                  <View style={[styles.featureIconBox, { backgroundColor: bg }]}>
                    <Icon size={20} color={color} />
                  </View>
                  <Text style={styles.featureLabel}>{feat.label}</Text>
                  <Text style={styles.featureDesc}>{feat.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── Header ───────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageHeaderMobile: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },

  // ── Search ────────────────────────────────────────────────
  searchWrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  clearText: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },

  // ── Scroll Content ────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },

  // ── Hero ─────────────────────────────────────────────────
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 28,
    marginBottom: 28,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 8px 32px rgba(15,23,42,0.2)' } }),
  },
  heroBannerMobile: {
    flexDirection: 'column',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(217,119,6,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.3)',
  },
  heroPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 10,
  },
  heroDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 22,
    maxWidth: 320,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GOLD,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopNowText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  heroRight: {
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIllustrationBg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  heroEmoji: {
    fontSize: 60,
  },

  // ── Section ───────────────────────────────────────────────
  section: {
    marginBottom: 28,
  },
  hScroll: {
    marginHorizontal: -4,
    paddingLeft: 4,
  },

  // ── Empty Search ──────────────────────────────────────────
  emptySearch: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptySearchEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptySearchText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // ── Features ──────────────────────────────────────────────
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  featuresGridMobile: {
    gap: 10,
  },
  featureCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    ...Platform.select({ web: { boxShadow: '0 2px 12px rgba(0,0,0,0.04)' } }),
  },
  featureCardMobile: {
    minWidth: '45%',
    padding: 14,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
