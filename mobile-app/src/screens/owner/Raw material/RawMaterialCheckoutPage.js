import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, TextInput, Alert, Modal, KeyboardAvoidingView, Animated, Easing } from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, ChevronRight, Check, Plus, Store } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { placeRawMaterialOrder } from '../../../services/api.service';

const PURPLE = '#D97706';

function SuccessCheckmark() {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const line1Anim = React.useRef(new Animated.Value(0)).current;
  const line2Anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(line1Anim, {
        toValue: 1,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(line2Anim, {
        toValue: 1,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const circleScale = scaleValue;

  return (
    <View style={animStyles.container}>
      <View style={animStyles.outerRing}>
        <Animated.View style={[animStyles.circle, { transform: [{ scale: circleScale }] }]}>
          {/* Draw Short Line */}
          <Animated.View
            style={[
              animStyles.line,
              animStyles.lineShort,
              {
                transform: [
                  { rotate: '45deg' },
                  { translateX: -7.5 },
                  { scaleX: line1Anim },
                  { translateX: 7.5 },
                ],
              },
            ]}
          />
          {/* Draw Long Line */}
          <Animated.View
            style={[
              animStyles.line,
              animStyles.lineLong,
              {
                transform: [
                  { rotate: '-45deg' },
                  { translateX: -14 },
                  { scaleX: line2Anim },
                  { translateX: 14 },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const animStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  outerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#54BA67', // matching green
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2.5,
  },
  lineShort: {
    width: 15,
    left: 23,
    top: 43,
  },
  lineLong: {
    width: 28,
    left: 31,
    top: 48,
  },
});


export default function RawMaterialCheckoutPage({ cartItems, user, onBack, onSuccess, isSuccess, onHome, onTrackOrder }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [addressId, setAddressId] = useState('a1');
  const [schedule, setSchedule] = useState('tomorrow_morning');
  const [payment, setPayment] = useState('cod');
  const [placedOrders, setPlacedOrders] = useState([]);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName]     = useState(user?.bizName || '');
  const [addrLine, setAddrLine]     = useState(user?.address || '');
  const [addrCity, setAddrCity]     = useState(user?.city || '');
  const [addrState, setAddrState]   = useState('Maharashtra');
  const [addrPhone, setAddrPhone]   = useState(user?.mobile || '');
  const [savedAddr, setSavedAddr]   = useState(null);

  // Preserve cartItems and totals locally on mount before parent clears them
  const [orderedItems] = useState(cartItems);
  const [savedGrandTotal] = useState(subtotal + gst + delivery);

  // Group by supplierName
  const groupedCart = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      const supplier = item.supplierName || 'Other Supplier';
      if (!groups[supplier]) groups[supplier] = [];
      groups[supplier].push(item);
    });
    return groups;
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.05;
  const delivery = subtotal > 1000 ? 0 : 50 * Object.keys(groupedCart).length;
  const grandTotal = subtotal + gst + delivery;

  const handlePlaceOrder = async () => {
    try {
      const ownerId = user?.id || '';
      const deliveryAddress = savedAddr
        ? `${savedAddr.name}, ${savedAddr.line}, ${savedAddr.city}, ${savedAddr.state}`
        : user?.address
        ? `${user.bizName || ''}, ${user.address}, ${user.city || ''}`.trim()
        : `${user?.bizName || 'My Business'}, ${user?.city || 'Mumbai'}`;

      const orderPromises = Object.keys(groupedCart).map(async (supplierName) => {
        const items = groupedCart[supplierName];
        const supplierId = items[0]?.supplierId;

        const orderData = {
          ownerId,
          supplierId,
          deliveryAddress,
          paymentMethod: payment,
          items: items.map(i => ({ productId: i.id, quantity: i.qty }))
        };

        return await placeRawMaterialOrder(orderData);
      });

      const results = await Promise.all(orderPromises);
      setPlacedOrders(results.map(r => r.data));
      onSuccess();
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const firstOrderId = placedOrders.length > 0
    ? placedOrders[0].id?.substring(0, 8).toUpperCase()
    : 'NEW';
  const displayOrderId = `#ORD-${firstOrderId}`;

  const getDeliveryDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()} | 16:00 - 18:00`;
  };

  if (isSuccess) {
    const formattedDelivery = getDeliveryDateStr();
    const formattedOrderId = `#${firstOrderId.substring(0, 4)}-${new Date().getFullYear()}`;

    return (
      <View style={styles.confirmWrapper}>
        {/* ── Top Bar ── */}
        <View style={styles.confirmTopBar}>
          <TouchableOpacity style={styles.confirmBackBtn} onPress={onHome}>
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.confirmHeaderTitle}>Confirmation</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.confirmScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.confirmContent}>
            
            {/* Animated Checkmark */}
            <SuccessCheckmark />

            <Text style={styles.confirmThankYou}>Thank You!</Text>
            <Text style={styles.confirmSubtitle}>Your order has been successfully placed.</Text>

            {/* Info Card */}
            <View style={styles.confirmCard}>
              <View style={styles.confirmCardHeaderRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.confirmCardLabel}>Estimated Delivery</Text>
                  <Text style={styles.confirmCardVal} numberOfLines={1}>{formattedDelivery}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.confirmCardLabel}>Order ID</Text>
                  <Text style={styles.confirmCardVal}>{formattedOrderId}</Text>
                </View>
              </View>

              <View style={styles.confirmDivider} />

              <Text style={styles.confirmDetailsTitle}>Order Details</Text>
              
              {orderedItems.map((item, idx) => (
                <View key={item.id || idx} style={styles.confirmItemRow}>
                  <View style={styles.confirmItemImg}>
                    <Store size={18} color="#48C470" />
                  </View>
                  <View style={styles.confirmItemInfo}>
                    <Text style={styles.confirmItemName}>{item.name}</Text>
                    <Text style={styles.confirmItemUnit}>{item.qty} {item.unit || 'kg'}</Text>
                  </View>
                  <Text style={styles.confirmItemPrice}>₹{(item.price * item.qty).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.confirmActionsArea}>
          <TouchableOpacity
            style={styles.confirmTrackBtn}
            activeOpacity={0.85}
            onPress={() => {
              const orderForTracking = placedOrders[0] || {};
              onTrackOrder({
                id: orderForTracking.id || '',
                displayId: displayOrderId,
                items: orderForTracking.items?.map(oi => ({
                  id: oi.product?.id || oi.productId,
                  name: oi.product?.name || 'Product',
                  qty: oi.quantity,
                  price: parseFloat(oi.priceAtPurchase),
                  unit: oi.product?.unit || 'kg'
                })) || orderedItems,
                total: parseFloat(orderForTracking.totalAmount) || savedGrandTotal,
                status: orderForTracking.status || 'pending',
                supplierName: orderForTracking.supplier?.bizName || '',
                deliveryAddress: orderForTracking.deliveryAddress || '',
                date: new Date(orderForTracking.createdAt || Date.now()).toLocaleDateString()
              });
            }}
          >
            <Text style={styles.confirmTrackBtnText}>Track My Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmHomeBtn}
            activeOpacity={0.85}
            onPress={onHome}
          >
            <Text style={styles.confirmHomeBtnText}>Back to Home</Text>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={isMobile ? { paddingBottom: 100 } : { paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          <View style={styles.leftCol}>

            {/* ── Delivery Address ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => setShowAddressModal(true)}
                  activeOpacity={0.7}
                >
                  <Plus size={14} color={PURPLE} />
                  <Text style={styles.addBtnText}>Change Address</Text>
                </TouchableOpacity>
              </View>

              {/* Show saved or default address */}
              <TouchableOpacity
                style={[styles.radioCard, styles.radioCardActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.radio, styles.radioActive]}>
                  <View style={styles.radioInner} />
                </View>
                <View style={styles.radioContent}>
                  <View style={styles.addressTop}>
                    <Text style={styles.addressName}>{savedAddr?.name || user?.bizName || 'My Business'}</Text>
                    <View style={styles.addressBadge}><Text style={styles.addressBadgeText}>Primary</Text></View>
                  </View>
                  <Text style={styles.addressText}>{savedAddr?.line || user?.address || '45, Culinary Street, Near Main Market'}</Text>
                  <Text style={styles.addressText}>{savedAddr?.city || user?.city || 'Mumbai'}, {savedAddr?.state || 'Maharashtra'}</Text>
                  <Text style={styles.addressPhone}>{savedAddr?.phone || user?.mobile || '+91 98765 43210'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ── Payment Method ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentList}>
                {['upi', 'netbanking', 'cod'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[styles.paymentRow, payment === method && styles.paymentRowActive]}
                    onPress={() => setPayment(method)}
                  >
                    <View style={styles.paymentLeft}>
                      <View style={[styles.radio, payment === method && styles.radioActive]}>
                        {payment === method && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.paymentText}>
                        {method === 'upi' && 'UPI / QR Code'}
                        {method === 'netbanking' && 'Bank Transfer'}
                        {method === 'cod' && 'Cash on Delivery'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </View>

          <View style={[styles.rightCol, isMobile && styles.rightColMobile]}>
            {/* ── Order Summary ── */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryItems}>
                {Object.keys(groupedCart).map(vendor => (
                  <View key={vendor} style={styles.summaryVendor}>
                    <Text style={styles.summaryVendorName}>{vendor}</Text>
                    {groupedCart[vendor].map(item => (
                      <View key={item.id} style={styles.summaryItemRow}>
                        <Text style={styles.summaryItemName}>{item.qty}x {item.name}</Text>
                        <Text style={styles.summaryItemPrice}>₹{item.price * item.qty}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items Total</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (5%)</Text>
                <Text style={styles.summaryValue}>₹{gst.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charges</Text>
                <Text style={styles.summaryValue}>{delivery === 0 ? 'Free' : `₹${delivery}`}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>

              {!isMobile && (
                <TouchableOpacity style={styles.checkoutBtn} onPress={handlePlaceOrder}>
                  <Text style={styles.checkoutText}>Place Order</Text>
                  <ChevronRight size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

        </View>
      </ScrollView>

      {isMobile && !isSuccess && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomTotalLabel}>Total</Text>
            <Text style={styles.bottomTotalValue}>₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtnMobile} onPress={handlePlaceOrder}>
            <Text style={styles.checkoutText}>Place Order</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Change Address Modal ── */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowAddressModal(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Change Delivery Address</Text>

            <Text style={styles.addrLabel}>Business / Recipient Name</Text>
            <TextInput
              style={styles.addrInput}
              value={addrName}
              onChangeText={setAddrName}
              placeholder="e.g. Chetan Cafe"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.addrLabel}>Address Line</Text>
            <TextInput
              style={styles.addrInput}
              value={addrLine}
              onChangeText={setAddrLine}
              placeholder="Street, Building, Area"
              placeholderTextColor="#94A3B8"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.addrLabel}>City</Text>
                <TextInput
                  style={styles.addrInput}
                  value={addrCity}
                  onChangeText={setAddrCity}
                  placeholder="City"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addrLabel}>State</Text>
                <TextInput
                  style={styles.addrInput}
                  value={addrState}
                  onChangeText={setAddrState}
                  placeholder="State"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={styles.addrLabel}>Phone Number</Text>
            <TextInput
              style={styles.addrInput}
              value={addrPhone}
              onChangeText={setAddrPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TouchableOpacity
              style={styles.addrSaveBtn}
              activeOpacity={0.85}
              onPress={() => {
                if (!addrName.trim() || !addrLine.trim() || !addrCity.trim()) {
                  Alert.alert('Missing Info', 'Please fill Name, Address and City.');
                  return;
                }
                setSavedAddr({ name: addrName.trim(), line: addrLine.trim(), city: addrCity.trim(), state: addrState.trim(), phone: addrPhone.trim() });
                setShowAddressModal(false);
              }}
            >
              <Text style={styles.addrSaveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { flexDirection: 'row', gap: 24, padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', alignItems: 'flex-start' },

  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 360 },
  rightColMobile: { width: '100%', marginTop: 16 },

  section: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16, ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.02)' } }) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: PURPLE },

  radioCard: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', marginBottom: 12 },
  radioCardActive: { borderColor: PURPLE, backgroundColor: '#F5F3FF' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  radioActive: { borderColor: PURPLE },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: PURPLE },

  radioContent: { flex: 1 },
  addressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  addressName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  addressBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  addressBadgeText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  addressText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  addressPhone: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginTop: 8 },

  paymentList: { gap: 12 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  paymentRowActive: { borderColor: PURPLE, backgroundColor: '#F5F3FF' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  paymentText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  codFee: { fontSize: 12, fontWeight: '600', color: '#10B981' },

  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.02)' } }) },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },

  summaryItems: { marginBottom: 16 },
  summaryVendor: { marginBottom: 12 },
  summaryVendorName: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryItemName: { fontSize: 13, color: '#475569', flex: 1 },
  summaryItemPrice: { fontSize: 13, fontWeight: '600', color: '#0F172A' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#475569' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  grandTotalValue: { fontSize: 18, fontWeight: '900', color: PURPLE },

  checkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: PURPLE, height: 48, borderRadius: 12, marginTop: 24 },
  checkoutText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center', ...Platform.select({ web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' } }) },
  bottomTotal: { flex: 1 },
  bottomTotalLabel: { fontSize: 12, color: '#64748B' },
  bottomTotalValue: { fontSize: 18, fontWeight: '900', color: PURPLE },
  checkoutBtnMobile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: PURPLE, height: 48, paddingHorizontal: 24, borderRadius: 12 },

  // Success / Confirmation State
  confirmWrapper: { flex: 1, backgroundColor: '#F6FAF7' },
  confirmTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'transparent' },
  confirmBackBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  confirmHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', textAlign: 'center', flex: 1 },
  confirmScroll: { flex: 1 },
  confirmContent: { paddingHorizontal: 24, alignItems: 'center', paddingBottom: 40 },
  confirmThankYou: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginTop: 12, marginBottom: 8 },
  confirmSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 28 },
  confirmCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 450, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  confirmCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  confirmCardLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  confirmCardVal: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  confirmDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
  confirmDetailsTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  confirmItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  confirmItemImg: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  confirmItemInfo: { flex: 1 },
  confirmItemName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  confirmItemUnit: { fontSize: 12, color: '#94A3B8' },
  confirmItemPrice: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  confirmActionsArea: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 36 : 24, paddingTop: 12, backgroundColor: '#F6FAF7' },
  confirmTrackBtn: { backgroundColor: '#54BA67', borderRadius: 25, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  confirmTrackBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  confirmHomeBtn: { borderColor: '#54BA67', borderWidth: 1.5, borderRadius: 25, height: 50, alignItems: 'center', justifyContent: 'center' },
  confirmHomeBtnText: { color: '#54BA67', fontSize: 15, fontWeight: '700' },

  // Change Address Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  addrLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, marginTop: 12 },
  addrInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  addrSaveBtn: {
    marginTop: 24,
    backgroundColor: PURPLE,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addrSaveBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
