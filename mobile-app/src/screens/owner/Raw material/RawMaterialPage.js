import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions, Image, ImageBackground, Animated, Easing } from 'react-native';
import { Search, Heart, Bell, ShoppingCart, ChevronRight, Package, User } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import rawMaterialHero from '../../../assets/images/raw-material-hero.png';

import { colors } from '../../../theme/colors';
import { CATEGORIES, FEATURES } from '../../../constants/rawMaterialData';
import { fetchRawMaterialSuppliers } from '../../../services/api.service';

// Components
import ProductCard from '../../../components/owner/rawmaterial/ProductCard';
import CategoryCard from '../../../components/owner/rawmaterial/CategoryCard';
import VendorCard from '../../../components/owner/rawmaterial/VendorCard';

// Pages
import CategorySuppliersPage from './CategorySuppliersPage';
import SupplierStorePage from './SupplierStorePage';
import ProductDetailsPage from './ProductDetailsPage';
import RawMaterialCartPage from './RawMaterialCartPage';
import RawMaterialCheckoutPage from './RawMaterialCheckoutPage';
import RawMaterialOrdersPage from './RawMaterialOrdersPage';
import RawMaterialOrderTrackingPage from './RawMaterialOrderTrackingPage';
import RawMaterialOrderDetailsPage from './RawMaterialOrderDetailsPage';

const GOLD = '#D97706';
const PURPLE = '#D97706';

function AnimatedCategoryRow({ categories, direction = 'right-to-left', onCategoryPress }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const CARD_WIDTH = 116; // 100 width + 16 uniform spacing
  const TOTAL_DISTANCE = CARD_WIDTH * categories.length;

  React.useEffect(() => {
    const startValue = direction === 'right-to-left' ? 0 : -TOTAL_DISTANCE;
    const endValue = direction === 'right-to-left' ? -TOTAL_DISTANCE : 0;

    translateX.setValue(startValue);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: endValue,
        duration: 26000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();
    return () => animation.stop();
  }, [direction, TOTAL_DISTANCE]);

  const repeatedItems = [...categories, ...categories, ...categories, ...categories];

  return (
    <View style={{ overflow: 'hidden', width: '100%', paddingVertical: 2 }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX }],
          width: CARD_WIDTH * repeatedItems.length,
        }}
      >
        {repeatedItems.map((cat, index) => (
          <CategoryCard
            key={`${cat.id}-${index}`}
            category={cat}
            onPress={onCategoryPress}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default function RawMaterialPage({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const { user } = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState([]);



  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // home | suppliers | supplierStore | productDetails | cart | checkout | success | orders | orderTracking | orderDetails
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [vendors, setVendors] = useState([]);

  React.useEffect(() => {
    const loadVendors = async () => {
      try {
        const res = await fetchRawMaterialSuppliers();
        if (res?.success) {
          const mappedVendors = res.data.map((v, index) => ({
            id: v.id,
            name: v.bizName,
            location: v.city,
            rating: 4.5,
            reviews: 100,
            image: null,
            initials: v.bizName.substring(0, 2).toUpperCase(),
            bg: index % 2 === 0 ? '#FEF3C7' : '#E0E7FF',
            color: index % 2 === 0 ? '#B45309' : '#3730A3',
            products: v.products?.length || 10,
            badge: index === 0 ? 'Top Seller' : null,
            badgeColor: index === 0 ? '#16A34A' : null
          }));
          setVendors(mappedVendors);
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };
    loadVendors();
  }, []);

  // Bottom Nav items
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Search, view: 'home' },
    { id: 'orders', label: 'Orders', icon: Package, view: 'orders' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, view: 'cart' },
    { id: 'inbox', label: 'Inbox', icon: Bell, view: 'home' }, // mock
    { id: 'profile', label: 'Profile', icon: User, view: 'home' }, // mock
  ];

  const handleQuickReorder = (order) => {
    setSelectedOrder(order);
    setCurrentView('orderDetails');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const renderBottomNav = () => null;

  // ── Render correct view ────────────────────────────
  if (currentView === 'checkout' || currentView === 'success') {
    return (
      <View style={{ flex: 1 }}>
        <RawMaterialCheckoutPage
          cartItems={cartItems}
          user={user}
          onBack={() => setCurrentView('cart')}
          onSuccess={() => {
            setCartItems([]);
            setCurrentView('success');
          }}
          isSuccess={currentView === 'success'}
          onHome={() => setCurrentView('home')}
          onTrackOrder={(order) => {
            setSelectedOrder(order);
            setCurrentView('orderTracking');
          }}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'cart') {
    return (
      <View style={{ flex: 1 }}>
        <RawMaterialCartPage
          cartItems={cartItems}
          setCartItems={setCartItems}
          onBack={() => setCurrentView('home')}
          onCheckout={() => setCurrentView('checkout')}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'orders') {
    return (
      <View style={{ flex: 1 }}>
        <RawMaterialOrdersPage
          user={user}
          onBack={() => setCurrentView('home')}
          onTrackOrder={(order) => {
            setSelectedOrder(order);
            setCurrentView('orderTracking');
          }}
          onQuickReorder={handleQuickReorder}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'orderTracking' && selectedOrder) {
    return (
      <View style={{ flex: 1 }}>
        <RawMaterialOrderTrackingPage
          order={selectedOrder}
          onBack={() => setCurrentView('home')}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'orderDetails' && selectedOrder) {
    return (
      <View style={{ flex: 1 }}>
        <RawMaterialOrderDetailsPage
          order={selectedOrder}
          user={user}
          onBack={() => setCurrentView('orders')}
          onReorder={(order) => {
            setCartItems(prev => {
              let newCart = [...prev];
              order.items.forEach(orderItem => {
                const existing = newCart.find(i => i.id === orderItem.id);
                if (existing) existing.qty += orderItem.qty;
                else newCart.push({ ...orderItem });
              });
              return newCart;
            });
            setCurrentView('cart');
          }}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'productDetails' && selectedProduct) {
    return (
      <View style={{ flex: 1 }}>
        <ProductDetailsPage
          product={selectedProduct}
          cartItems={cartItems}
          onCartUpdate={setCartItems}
          onBack={() => setCurrentView('supplierStore')}
          onViewCart={() => setCurrentView('cart')}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'supplierStore' && selectedSupplier) {
    return (
      <View style={{ flex: 1 }}>
        <SupplierStorePage
          supplier={selectedSupplier}
          cartItems={cartItems}
          onCartUpdate={setCartItems}
          onBack={() => setCurrentView('suppliers')}
          onViewCart={() => setCurrentView('cart')}
          onProductPress={(product) => {
            setSelectedProduct(product);
            setCurrentView('productDetails');
          }}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  if (currentView === 'suppliers' && selectedCategory) {
    return (
      <View style={{ flex: 1 }}>
        <CategorySuppliersPage
          category={selectedCategory}
          onBack={() => setCurrentView('home')}
          onSupplierPress={(supplier) => {
            setSelectedSupplier(supplier);
            setCurrentView('supplierStore');
          }}
        />
        {isMobile && renderBottomNav()}
      </View>
    );
  }

  // ── HOME VIEW ────────────────────────────
  // Components for original home page layout
  const SectionHeader = ({ title, action, onAction }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* ── Page Header ─────────────────────────────────────── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.pageTitle}>Raw Material</Text>
          <Text style={styles.pageSubtitle}>Marketplace & Procurement</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('orders')}>
            <Package size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('cart')}>
            <ShoppingCart size={20} color="#0F172A" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
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
            placeholder="Search categories, suppliers, products..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* ── Scrollable Content ───────────────────────────────── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, isMobile && { paddingBottom: 100 }]}>

        {/* ── Hero Banner ── */}
        <View style={styles.heroCard}>
          <Image
            source={rawMaterialHero}
            resizeMode="cover"
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text
                style={[
                  styles.heroTitle,
                  {
                    fontSize: width < 340 ? 20 : (width < 375 ? 23 : 26),
                    lineHeight: width < 340 ? 26 : (width < 375 ? 30 : 34)
                  }
                ]}
                numberOfLines={3}
              >
                Get the best quality raw materials for your business
              </Text>

            </View>
          </View>
        </View>

        {/* ── Shop by Category ── */}
        <SectionHeader title="Shop by Category" action="" />
        <View style={{ marginBottom: 20, gap: 12 }}>
          <AnimatedCategoryRow
            categories={CATEGORIES.slice(0, 4)}
            direction="right-to-left"
            onCategoryPress={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('suppliers');
            }}
          />
          <AnimatedCategoryRow
            categories={CATEGORIES.slice(4, 8)}
            direction="left-to-right"
            onCategoryPress={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('suppliers');
            }}
          />
        </View>


        {/* ── Top Rated Vendors ── */}
        <SectionHeader title="Top Rated Vendors" action="View All" />
        <View style={{ flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} onPress={() => {
              setSelectedSupplier(vendor);
              setCurrentView('supplierStore');
            }} />
          ))}
        </View>


      </ScrollView>

      {isMobile && renderBottomNav()}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageHeaderMobile: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  pageSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },

  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, backgroundColor: '#F8FAFC' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, maxWidth: 1200, alignSelf: 'center', width: '100%' },

  heroCard: {
    width: '100%',
    aspectRatio: 859 / 369,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#071B3A',
    position: 'relative',
    padding: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '-15%',
    width: '130%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(7, 27, 58, 0.52)',
  },
  heroContent: {
    width: '75%',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.2,
  },


  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionAction: { fontSize: 13, fontWeight: '700', color: '#000000' },

  hScroll: { marginHorizontal: -16, marginBottom: 24 },
  hScrollContent: { paddingHorizontal: 16, gap: 16 },

  featuresStrip: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  featuresTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  featuresGrid: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', flexWrap: 'wrap', gap: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, minWidth: 200, gap: 12 },
  featureIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  featureEmoji: { fontSize: 20 },
  featureTextCol: { flex: 1 },
  featureLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  featureDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },

  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    ...Platform.select({ web: { display: 'none' } })
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  navIconBox: { position: 'relative', marginBottom: 4 },
  navBadge: {
    position: 'absolute',
    top: -4, right: -8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    borderRadius: 8,
    minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center'
  },
  navBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  navLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' }
});
