import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, Zap, Clock, Star, Filter, Check, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { mockDb } from '../../../services/mockDb';

const CATEGORIES = [
  { id: "vegetables", label: "Vegetables", emoji: "🥦" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
  { id: "grains", label: "Grains & Rice", emoji: "🌾" },
  { id: "dairy", label: "Dairy Products", emoji: "🥛" },
  { id: "spices", label: "Spices & Masalas", emoji: "🌶️" },
];

const PRODUCTS = [
  { id: "v1", categoryId: "vegetables", name: "Red Onions", unitSize: "Per Kg", supplier: "Farm to Fork", price: 38, moq: 20, delivery: "Same Day", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=200&fit=crop" },
  { id: "v2", categoryId: "vegetables", name: "Tomatoes (Grade A)", unitSize: "Per Kg", supplier: "Farm to Fork", price: 42, moq: 20, delivery: "Same Day", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop" },
  { id: "g1", categoryId: "grains", name: "Premium Basmati Rice", unitSize: "25 Kg Bag", supplier: "Metro Fresh Grocery", price: 85, moq: 50, delivery: "Same Day", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop" },
  { id: "d1", categoryId: "dairy", name: "Full-Cream Milk", unitSize: "Per Litre", supplier: "Pure Dairy Co.", price: 68, moq: 20, delivery: "Same Day", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop" },
];

export default function SupplierMarketplace({ onBack, onNavigate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');

  const [activeCategory, setActiveCategory] = useState("vegetables");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [placedTotal, setPlacedTotal] = useState(0);

  const filteredProducts = PRODUCTS.filter(p => p.categoryId === activeCategory);

  const handleAdd = (id, qty) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + qty }));
  };

  const cartItemCount = Object.keys(cart).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerLeft, { flexShrink: 1, marginRight: 12 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={18} color={colors.dark} />
          </TouchableOpacity>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.pageTitle} numberOfLines={1}>Supplier Marketplace</Text>
            <Text style={styles.pageDesc} numberOfLines={1}>Browse and procure raw materials</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.cartBtn, 
            isMobile && { 
              width: 44, 
              height: 44, 
              paddingHorizontal: 0, 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative',
              borderRadius: 22
            }
          ]} 
          onPress={() => setCartOpen(true)}
        >
          <ShoppingCart size={18} color="#2563EB" />
          {!isMobile ? (
            <Text style={styles.cartBtnText}>View Cart ({cartItemCount})</Text>
          ) : (
            cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={[styles.contentLayout, isMobile && { gap: 8 }]}>
        {/* Sidebar Categories */}
        <View style={[styles.sidebar, isMobile && { width: 80, padding: 8, borderRightWidth: 1, borderRightColor: colors.border, display: 'flex' }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!isMobile && <Text style={styles.sidebarTitle}>CATEGORIES</Text>}
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[
                    styles.catBtn, 
                    isActive && styles.catBtnActive,
                    isMobile && { flexDirection: 'column', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8, marginBottom: 8 }
                  ]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Text style={[styles.catEmoji, isMobile && { marginRight: 0, marginBottom: 4, fontSize: 20 }]}>{cat.emoji}</Text>
                  <Text style={[
                    styles.catLabel, 
                    isActive && styles.catLabelActive,
                    isMobile && { fontSize: 9, textAlign: 'center', lineHeight: 12 }
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.mainGrid}>
          {/* Top Search & Filter Bar */}
          <View style={styles.toolbar}>
            <View style={styles.searchBox}>
              <Search size={16} color={colors.muted} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search products..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor={colors.muted}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={16} color={colors.muted} />
              <Text style={styles.filterBtnText}>Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <ScrollView style={styles.productsScroll}>
            <View style={[styles.productGridContainer, isMobile && { justifyContent: 'space-between', gap: 8 }]}>
              {filteredProducts.map(product => {
                const qty = cart[product.id] || 0;
                return (
                  <View key={product.id} style={[styles.productCard, isMobile && { width: '48%', minWidth: 140 }]}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <View style={styles.deliveryBadge}>
                        <Zap size={10} color="#059669" />
                        <Text style={styles.deliveryText}>{product.delivery}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productUnit}>{product.unitSize}</Text>
                      
                      <View style={styles.supplierRow}>
                        <Text style={styles.supplierName}>{product.supplier}</Text>
                        <View style={styles.ratingBox}>
                          <Star size={10} color="#F59E0B" fill="#F59E0B" />
                          <Text style={styles.ratingText}>4.7</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.moqText}>MOQ: <Text style={{ color: colors.dark }}>{product.moq}</Text></Text>
                      
                      <View style={styles.priceRow}>
                        <Text style={styles.priceText}>₹{product.price}</Text>
                      </View>

                      {qty === 0 ? (
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(product.id, product.moq)}>
                          <Plus size={14} color="#fff" />
                          <Text style={styles.addBtnText}>Add to Cart</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyBox}>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAdd(product.id, -1)}>
                            <Minus size={14} color="#2563EB" />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{qty}</Text>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAdd(product.id, 1)}>
                            <Plus size={14} color="#2563EB" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
      {/* Cart Modal Overlay */}
      {cartOpen && (
        <View style={styles.cartOverlay}>
          <TouchableOpacity style={styles.cartBackdrop} onPress={() => setCartOpen(false)} />
          <View style={styles.cartSidebar}>
            <View style={styles.cartHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.cartIconBox}>
                  <ShoppingCart size={16} color="#2563EB" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.cartTitle}>Order Summary</Text>
                  <Text style={styles.cartDesc}>{cartItemCount} items</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setCartOpen(false)} style={styles.closeBtn}>
                <Text style={{ fontSize: 18, color: colors.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.cartItemsScroll}>
              {cartItemCount === 0 ? (
                <View style={styles.emptyCart}>
                  <ShoppingCart size={32} color={colors.muted} />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
              ) : (
                Object.keys(cart).map(id => {
                  const product = PRODUCTS.find(p => p.id === id);
                  const qty = cart[id];
                  if (!product || qty === 0) return null;
                  return (
                    <View key={id} style={styles.cartItem}>
                      <View style={styles.cartItemTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cartItemName}>{product.name}</Text>
                          <Text style={styles.cartItemSub}>₹{product.price} {product.unitSize} · {product.supplier}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleAdd(id, -qty)} style={styles.removeBtn}>
                          <Text style={styles.removeBtnText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.cartItemBottom}>
                        <View style={styles.cartQtyBox}>
                          <TouchableOpacity style={styles.cartQtyBtn} onPress={() => handleAdd(id, -1)}>
                            <Minus size={12} color={colors.muted} />
                          </TouchableOpacity>
                          <Text style={styles.cartQtyText}>{qty}</Text>
                          <TouchableOpacity style={styles.cartQtyBtn} onPress={() => handleAdd(id, 1)}>
                            <Plus size={12} color={colors.muted} />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.cartItemTotal}>₹{(product.price * qty).toLocaleString("en-IN")}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {cartItemCount > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.cartTotalRow}>
                  <Text style={styles.cartTotalLabel}>Total</Text>
<Text style={styles.cartTotalVal}>
                    ₹{Object.keys(cart).reduce((sum, id) => {
                      const p = PRODUCTS.find(p => p.id === id);
                      return sum + (p ? p.price * cart[id] : 0);
                    }, 0).toLocaleString("en-IN")}
                  </Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => {
                   const ordersToPlace = [];
                   let totalAmount = 0;
                   Object.keys(cart).forEach(id => {
                     const p = PRODUCTS.find(p => p.id === id);
                     if (!p) return;
                     const qty = cart[id];
                     const orderId = "ORD-" + Math.floor(Math.random() * 900 + 100);
                     const orderAmount = p.price * qty;
                     totalAmount += orderAmount;
                     const orderObj = {
                       id: orderId,
                       title: p.name,
                       category: "raw-material",
                       qty: qty + " " + (p.unitSize.includes("Per") ? p.unitSize.split(" ")[1] || "Kg" : p.unitSize.split(" ")[1] || "units"),
                       vendor: p.supplier,
                       date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
                       status: "New",
                       amount: "₹" + orderAmount.toLocaleString("en-IN"),
                       client: "The Meridian Hotels"
                     };
                     mockDb.addOrder(orderObj);
                     ordersToPlace.push(orderObj);
                   });
                   setPlacedOrders(ordersToPlace);
                   setPlacedTotal(totalAmount);
                   setCartOpen(false);
                   setCart({});
                   setShowSuccess(true);
                 }}>
                  <Text style={styles.checkoutBtnText}>Confirm & Place Order</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      {/* Flipkart-Style Order Success Screen Overlay */}
      {showSuccess && (
        <View style={styles.successModalOverlay}>
          <View style={styles.successCard}>
            {/* Animated Green Circle Checkmark */}
            <View style={styles.successIconOuterCircle}>
              <View style={styles.successIconInnerCircle}>
                <Check size={40} color="#fff" strokeWidth={3} />
              </View>
            </View>

            {/* Confetti decoration visual */}
            <Text style={styles.successConfetti}>🎉 ✨ 🥳 ✨ 🎉</Text>

            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>Your procurement requests have been dispatched to verified vendors.</Text>

            {/* Summary Details Card */}
            <View style={styles.successDetailsCard}>
              <Text style={styles.successDetailsHeader}>ORDER SUMMARY</Text>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Total Paid:</Text>
                <Text style={styles.successDetailValue}>₹{placedTotal.toLocaleString("en-IN")}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Orders Code:</Text>
                <Text style={styles.successDetailValue} numberOfLines={1}>
                  {placedOrders.map(o => o.id).join(', ')}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Items count:</Text>
                <Text style={styles.successDetailValue}>{placedOrders.length} materials</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.successActionRow}>
              <TouchableOpacity 
                style={styles.successTrackBtn} 
                onPress={() => {
                  setShowSuccess(false);
                  if (onBack) onBack();
                  if (onNavigate) onNavigate("order-tracking");
                }}
              >
                <Text style={styles.successTrackBtnText}>Track Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.successContinueBtn} 
                onPress={() => {
                  setShowSuccess(false);
                }}
              >
                <Text style={styles.successContinueBtnText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.dark,
  },
  pageDesc: {
    fontSize: 12,
    color: colors.muted,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  cartBtnText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  sidebar: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '100%',
    display: 'flex',
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.muted,
    marginBottom: 12,
    letterSpacing: 1,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  catBtnActive: {
    backgroundColor: 'rgba(15,23,42,0.03)',
  },
  catEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  catLabel: {
    fontSize: 13,
    color: colors.sub,
    fontWeight: '500',
  },
  catLabelActive: {
    color: colors.dark,
    fontWeight: 'bold',
  },
  mainGrid: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    outlineStyle: 'none',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  filterBtnText: {
    marginLeft: 8,
    color: colors.muted,
    fontWeight: 'bold',
  },
  productsScroll: {
    flex: 1,
  },
  productGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }),
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  deliveryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  supplierName: {
    fontSize: 11,
    color: colors.sub,
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  moqText: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 12,
  },
  priceRow: {
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.dark,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2563EB',
  },
  cartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  cartBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.4)',
  },
  cartSidebar: {
    width: 380,
    maxWidth: '100%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    ...Platform.select({ web: { boxShadow: '-8px 0 24px rgba(0,0,0,0.1)' } }),
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  cartDesc: {
    fontSize: 12,
    color: colors.muted,
  },
  closeBtn: {
    padding: 8,
  },
  cartItemsScroll: {
    flex: 1,
    padding: 20,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyCartText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
  },
  cartItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cartItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  cartItemSub: {
    fontSize: 11,
    color: colors.muted,
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cartItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartQtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cartQtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  cartQtyText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    paddingHorizontal: 8,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2563EB',
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  cartTotalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563EB',
  },
  checkoutBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 13, 22, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    padding: 24,
  },
  successCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({ web: { boxShadow: '0 20px 40px rgba(0,0,0,0.15)' } }),
  },
  successIconOuterCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successIconInnerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successConfetti: {
    fontSize: 20,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  successDetailsCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  successDetailsHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  successDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  successDetailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    maxWidth: '60%',
    textAlign: 'right',
  },
  successActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  successTrackBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTrackBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  successContinueBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContinueBtnText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
