import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, MapPin, Store, ChevronRight, CircleX as XCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { fetchOrderById, cancelRawMaterialOrder } from '../../../services/api.service';

const PURPLE = '#D97706';

const STATUS_COLORS = {
  'pending': { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  'confirmed': { bg: '#E0F2FE', text: '#0284C7', label: 'Confirmed' },
  'shipped': { bg: '#FEF3C7', text: '#D97706', label: 'Out for Delivery' },
  'delivered': { bg: '#DCFCE7', text: '#16A34A', label: 'Delivered' },
  'cancelled': { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' }
};

export default function RawMaterialOrderDetailsPage({ order, user, onBack, onReorder }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const [fullOrder, setFullOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [order?.id]);

  const loadOrderDetails = async () => {
    if (!order?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchOrderById(order.id);
      if (res?.success) {
        setFullOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
      // Fallback to the order object passed via props
      setFullOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const doCancel = async (reason) => {
      try {
        setCancelling(true);
        await cancelRawMaterialOrder(order.id, reason || 'Cancelled by owner');
        await loadOrderDetails(); // Reload to reflect new status
      } catch (err) {
        console.error('Failed to cancel order:', err);
        if (Platform.OS === 'web') {
          alert('Failed to cancel order: ' + (err.response?.data?.message || err.message));
        } else {
          Alert.alert('Error', 'Failed to cancel order. ' + (err.response?.data?.message || err.message));
        }
      } finally {
        setCancelling(false);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to cancel this order?')) {
        doCancel('Cancelled by owner');
      }
    } else {
      Alert.alert(
        'Cancel Order',
        'Are you sure you want to cancel this order?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes, Cancel', style: 'destructive', onPress: () => doCancel('Cancelled by owner') }
        ]
      );
    }
  };

  // Build display data from fullOrder (API) or fallback to prop
  const displayOrder = fullOrder ? {
    id: fullOrder.id,
    displayId: `#ORD-${fullOrder.id.substring(0, 8).toUpperCase()}`,
    status: fullOrder.status,
    statusLabel: STATUS_COLORS[fullOrder.status]?.label || fullOrder.status,
    date: new Date(fullOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    supplierName: fullOrder.supplier?.bizName || 'Unknown Vendor',
    supplierCity: fullOrder.supplier?.city || '',
    deliveryAddress: fullOrder.deliveryAddress || '',
    paymentMethod: fullOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : fullOrder.paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer',
    items: (fullOrder.items || []).map(oi => ({
      id: oi.product?.id || oi.productId,
      name: oi.product?.name || 'Product',
      qty: oi.quantity,
      price: parseFloat(oi.priceAtPurchase),
      unit: oi.product?.unit || 'kg'
    })),
    itemsTotal: (fullOrder.items || []).reduce((sum, oi) => sum + (parseFloat(oi.priceAtPurchase) * oi.quantity), 0),
    amount: parseFloat(fullOrder.totalAmount),
    deliveryCharges: 0
  } : {
    id: order?.id || '',
    displayId: order?.displayId || `#ORD-${(order?.id || '').substring(0, 8).toUpperCase()}`,
    status: order?.status || 'pending',
    statusLabel: STATUS_COLORS[order?.status]?.label || order?.status || 'Pending',
    date: order?.date || '',
    supplierName: order?.vendor || order?.supplierName || '',
    supplierCity: '',
    deliveryAddress: order?.deliveryAddress || '',
    paymentMethod: order?.paymentMethod || 'Cash on Delivery',
    items: order?.items || [],
    itemsTotal: (order?.items || []).reduce((sum, i) => sum + (i.price * i.qty), 0),
    amount: order?.amount || 0,
    deliveryCharges: 0
  };

  const canCancel = ['pending', 'confirmed'].includes(displayOrder.status);
  const sColor = STATUS_COLORS[displayOrder.status] || STATUS_COLORS['pending'];

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PURPLE} />
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
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSub}>{displayOrder.displayId}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.contentLayout}>
          {/* Status + Date */}
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>Order Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
                  <Text style={[styles.statusValue, { color: sColor.text }]}>{sColor.label}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.statusLabel}>Order Date</Text>
                <Text style={styles.dateValue}>{displayOrder.date}</Text>
              </View>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#64748B" />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailValue}>{displayOrder.deliveryAddress || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Supplier Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Supplier Details</Text>
            <View style={styles.detailRow}>
              <Store size={18} color="#64748B" />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailValue}>{displayOrder.supplierName}</Text>
                {displayOrder.supplierCity ? <Text style={styles.detailSub}>{displayOrder.supplierCity}</Text> : null}
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.detailValue}>{displayOrder.paymentMethod}</Text>
          </View>

          {/* Ordered Items */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ordered Items</Text>
            {( displayOrder?.items || [] ).map((item, index) => (
              <View key={item.id || index} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.qty} {item.unit}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items Total</Text>
              <Text style={styles.summaryValue}>₹{displayOrder.itemsTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>{displayOrder.deliveryCharges === 0 ? 'Free' : `₹${displayOrder.deliveryCharges}`}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{displayOrder.amount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Cancel Order */}
          {canCancel && (
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={handleCancel}
              disabled={cancelling}
            >
              <XCircle size={16} color="#DC2626" />
              <Text style={styles.cancelBtnText}>{cancelling ? 'Cancelling...' : 'Cancel Order'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Reorder Button */}
      {displayOrder.status !== 'cancelled' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.reorderBtn} onPress={() => onReorder({
            ...displayOrder,
            items: displayOrder.items
          })}>
            <Text style={styles.reorderText}>Reorder</Text>
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
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, maxWidth: 600, alignSelf: 'center', width: '100%', gap: 16 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.02)' } }) },
  
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusLabel: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusValue: { fontSize: 14, fontWeight: '800' },
  dateValue: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailTextCol: { flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 20 },
  detailSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  itemQty: { fontSize: 13, color: '#64748B' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#475569' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  totalValue: { fontSize: 20, fontWeight: '900', color: PURPLE },

  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  reorderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: PURPLE, height: 48, borderRadius: 12 },
  reorderText: { fontSize: 15, fontWeight: '700', color: '#fff' }
});
