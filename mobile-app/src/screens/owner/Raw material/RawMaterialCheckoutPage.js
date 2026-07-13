import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, TextInput } from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, ChevronRight, Check, Plus } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';

export default function RawMaterialCheckoutPage({ cartItems, onBack, onSuccess, isSuccess, onHome }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [addressId, setAddressId] = useState('a1');
  const [schedule, setSchedule] = useState('tomorrow_morning');
  const [payment, setPayment] = useState('cod');

  // Group by vendor for summary
  const groupedCart = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      if (!groups[item.vendor]) groups[item.vendor] = [];
      groups[item.vendor].push(item);
    });
    return groups;
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.05; 
  const delivery = subtotal > 1000 ? 0 : 50; 
  const grandTotal = subtotal + gst + delivery;

  const handlePlaceOrder = () => {
    onSuccess();
  };

  if (isSuccess) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <Check size={64} color="#10B981" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSub}>Your order ID is #ORD-49201</Text>
          
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Total Amount</Text>
              <Text style={styles.successValue}>₹{grandTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment Method</Text>
              <Text style={styles.successValue}>{payment === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Expected Delivery</Text>
              <Text style={styles.successValue}>Tomorrow by 10:00 AM</Text>
            </View>
          </View>

          <View style={styles.successActions}>
            <TouchableOpacity style={styles.trackBtn}>
              <Text style={styles.trackBtnText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
              <Text style={styles.homeBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
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
                <TouchableOpacity style={styles.addBtn}>
                  <Plus size={14} color={GOLD} />
                  <Text style={styles.addBtnText}>Add New</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.radioCard, addressId === 'a1' && styles.radioCardActive]}
                onPress={() => setAddressId('a1')}
                activeOpacity={0.8}
              >
                <View style={[styles.radio, addressId === 'a1' && styles.radioActive]}>
                  {addressId === 'a1' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioContent}>
                  <View style={styles.addressTop}>
                    <Text style={styles.addressName}>The Grand Restaurant</Text>
                    <View style={styles.addressBadge}><Text style={styles.addressBadgeText}>Primary</Text></View>
                  </View>
                  <Text style={styles.addressText}>45, Culinary Street, Near Main Market, Andheri West</Text>
                  <Text style={styles.addressText}>Mumbai, Maharashtra 400053</Text>
                  <Text style={styles.addressPhone}>+91 98765 43210</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ── Delivery Schedule ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Schedule</Text>
              <View style={styles.scheduleGrid}>
                <TouchableOpacity 
                  style={[styles.scheduleCard, schedule === 'today_eve' && styles.scheduleCardActive]}
                  onPress={() => setSchedule('today_eve')}
                >
                  <Calendar size={16} color={schedule === 'today_eve' ? GOLD : '#64748B'} />
                  <Text style={[styles.scheduleTitle, schedule === 'today_eve' && { color: GOLD }]}>Today</Text>
                  <Text style={styles.scheduleSub}>4 PM - 7 PM</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.scheduleCard, schedule === 'tomorrow_morning' && styles.scheduleCardActive]}
                  onPress={() => setSchedule('tomorrow_morning')}
                >
                  <Calendar size={16} color={schedule === 'tomorrow_morning' ? GOLD : '#64748B'} />
                  <Text style={[styles.scheduleTitle, schedule === 'tomorrow_morning' && { color: GOLD }]}>Tomorrow</Text>
                  <Text style={styles.scheduleSub}>8 AM - 11 AM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Payment Method ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentList}>
                {['upi', 'card', 'netbanking', 'cod'].map(method => (
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
                        {method === 'upi' && 'UPI (GPay, PhonePe)'}
                        {method === 'card' && 'Credit / Debit Card'}
                        {method === 'netbanking' && 'Net Banking'}
                        {method === 'cod' && 'Cash on Delivery'}
                      </Text>
                    </View>
                    {method === 'cod' && <Text style={styles.codFee}>Free</Text>}
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
                <Text style={styles.grandTotalLabel}>Total to Pay</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>

              {!isMobile && (
                <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
                  <Text style={styles.placeOrderText}>Place Order</Text>
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
          <TouchableOpacity style={styles.placeOrderBtnMobile} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { flexDirection: 'row', gap: 32, padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', alignItems: 'flex-start' },
  
  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 380 },
  rightColMobile: { width: '100%', marginTop: 24 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: GOLD },

  radioCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  radioCardActive: { borderColor: GOLD, backgroundColor: '#FFFBEB' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 16, marginTop: 2 },
  radioActive: { borderColor: GOLD },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD },
  
  radioContent: { flex: 1 },
  addressTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  addressName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  addressBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  addressBadgeText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  addressText: { fontSize: 13, color: '#475569', marginBottom: 2 },
  addressPhone: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginTop: 4 },

  scheduleGrid: { flexDirection: 'row', gap: 12 },
  scheduleCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  scheduleCardActive: { borderColor: GOLD, backgroundColor: '#FFFBEB' },
  scheduleTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 8, marginBottom: 2 },
  scheduleSub: { fontSize: 12, color: '#64748B' },

  paymentList: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  paymentRowActive: { backgroundColor: '#FAFAFA' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  paymentText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  codFee: { fontSize: 12, color: '#059669', fontWeight: '700' },

  summaryCard: { backgroundColor: '#fff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  summaryItems: { marginBottom: 16 },
  summaryVendor: { marginBottom: 12 },
  summaryVendorName: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryItemName: { fontSize: 13, color: '#0F172A', flex: 1, marginRight: 8 },
  summaryItemPrice: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#475569' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  grandTotalValue: { fontSize: 20, fontWeight: '900', color: GOLD },

  placeOrderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: GOLD, height: 48, borderRadius: 12, marginTop: 24 },
  placeOrderText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  bottomTotal: { flex: 1 },
  bottomTotalLabel: { fontSize: 12, color: '#64748B' },
  bottomTotalValue: { fontSize: 18, fontWeight: '900', color: GOLD },
  placeOrderBtnMobile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: GOLD, height: 48, paddingHorizontal: 24, borderRadius: 12 },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
  successSub: { fontSize: 15, color: '#64748B', marginBottom: 32 },
  successCard: { backgroundColor: '#fff', width: '100%', maxWidth: 400, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 32 },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  successLabel: { fontSize: 14, color: '#475569' },
  successValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  successActions: { width: '100%', maxWidth: 400, gap: 12 },
  trackBtn: { backgroundColor: GOLD, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trackBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  homeBtn: { backgroundColor: '#F8FAFC', height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { fontSize: 15, fontWeight: '700', color: '#0F172A' }
});
