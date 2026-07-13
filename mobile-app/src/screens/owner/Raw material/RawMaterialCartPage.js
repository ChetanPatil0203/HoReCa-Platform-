import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Trash, Minus, Plus, ShoppingCart, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';

export default function RawMaterialCartPage({ cartItems, setCartItems, onBack, onCheckout }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const updateQty = (id, delta, minQty = 1) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(minQty, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Group by vendor
  const groupedCart = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      if (!groups[item.vendor]) groups[item.vendor] = [];
      groups[item.vendor].push(item);
    });
    return groups;
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.05; // mock 5%
  const delivery = subtotal > 1000 ? 0 : 50; // free over 1000
  const grandTotal = subtotal + gst + delivery;

  if (cartItems.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.emptyState}>
          <ShoppingCart size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Looks like you haven't added any raw materials yet.</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={onBack}>
            <Text style={styles.shopNowText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSub}>{cartItems.length} items</Text>
        </View>

        <TouchableOpacity onPress={() => setCartItems([])}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={isMobile ? { paddingBottom: 100 } : { paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={styles.leftCol}>
            {Object.keys(groupedCart).map(vendor => (
              <View key={vendor} style={styles.vendorGroup}>
                <View style={styles.vendorHeader}>
                  <ShoppingCart size={16} color={GOLD} />
                  <Text style={styles.vendorName}>{vendor}</Text>
                </View>
                
                {groupedCart[vendor].map(item => {
                  const minQ = parseInt(item.moq) || 1;
                  return (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={[styles.itemImage, { backgroundColor: item.bg || '#F8FAFC' }]}>
                        <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      </View>
                      <View style={styles.itemDetails}>
                        <View style={styles.itemRowTop}>
                          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                            <Trash size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.itemPrice}>₹{item.price} / {item.unit.replace('per ', '')}</Text>
                        
                        <View style={styles.itemRowBottom}>
                          <View style={styles.qtyControls}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1, minQ)}>
                              <Minus size={14} color={item.qty > minQ ? "#0F172A" : "#CBD5E1"} />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{item.qty}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1, minQ)}>
                              <Plus size={14} color="#0F172A" />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.itemTotal}>₹{(item.price * item.qty).toLocaleString()}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={[styles.rightCol, isMobile && styles.rightColMobile]}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (5%)</Text>
                <Text style={styles.summaryValue}>₹{gst.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>{delivery === 0 ? 'Free' : `₹${delivery}`}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>

              {!isMobile && (
                <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                  <ChevronRight size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

        </View>
      </ScrollView>

      {isMobile && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomTotalLabel}>Total</Text>
            <Text style={styles.bottomTotalValue}>₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtnMobile} onPress={onCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  clearText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { flexDirection: 'row', gap: 24, padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', alignItems: 'flex-start' },
  
  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 360 },
  rightColMobile: { width: '100%', marginTop: 16 },

  vendorGroup: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  vendorHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, backgroundColor: '#FAFAFA', borderBottomWidth: 1, borderBottomColor: colors.border },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  cartItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemImage: { width: 64, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemEmoji: { fontSize: 32 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 8 },
  removeBtn: { padding: 4 },
  itemPrice: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  
  itemRowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 8, height: 32 },
  qtyBtn: { width: 32, height: '100%', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 13, fontWeight: '700', color: '#0F172A', minWidth: 24, textAlign: 'center' },
  itemTotal: { fontSize: 15, fontWeight: '800', color: '#0F172A' },

  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#475569' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  grandTotalValue: { fontSize: 18, fontWeight: '900', color: GOLD },

  checkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: GOLD, height: 48, borderRadius: 12, marginTop: 24 },
  checkoutText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  bottomTotal: { flex: 1 },
  bottomTotalLabel: { fontSize: 12, color: '#64748B' },
  bottomTotalValue: { fontSize: 18, fontWeight: '900', color: GOLD },
  checkoutBtnMobile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: GOLD, height: 48, paddingHorizontal: 24, borderRadius: 12 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  shopNowBtn: { backgroundColor: GOLD, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopNowText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
