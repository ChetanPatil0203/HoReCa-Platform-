import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, MapPin, Phone, FileText, Check, Package, Truck, Clock, Store } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const PURPLE = '#D97706';

// Derive tracking stages from the actual order status
const getTrackingStages = (order) => {
  const status = order?.status || 'pending';
  const orderDate = order?.rawDate || order?.date || new Date().toISOString();
  const formattedDate = new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const stages = [
    { id: 'pending', label: 'Order Placed', time: formattedDate, completed: true },
    { id: 'confirmed', label: 'Order Confirmed', time: '', completed: false },
    { id: 'shipped', label: 'Out for Delivery', time: '', completed: false },
    { id: 'delivered', label: 'Delivered', time: '', completed: false }
  ];

  if (status === 'cancelled') {
    return [
      { id: 'pending', label: 'Order Placed', time: formattedDate, completed: true },
      { id: 'cancelled', label: 'Order Cancelled', time: 'Cancelled', completed: true, current: true, isCancelled: true }
    ];
  }

  const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return stages.map((stage, index) => ({
    ...stage,
    completed: index <= currentIndex,
    current: index === currentIndex,
    time: index <= currentIndex ? (index === 0 ? formattedDate : (index === currentIndex ? 'Current' : 'Done')) : 'Pending'
  }));
};

export default function RawMaterialOrderTrackingPage({ order, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const currentOrder = order || {
    id: '',
    displayId: '',
    status: 'pending',
    supplierName: '',
    vendor: '',
    deliveryAddress: '',
    amount: 0,
    total: 0,
    items: []
  };

  const stages = getTrackingStages(currentOrder);
  const supplierName = currentOrder.supplierName || currentOrder.vendor || '';
  const totalAmount = currentOrder.total || currentOrder.amount || 0;
  const displayId = currentOrder.displayId || `#ORD-${(currentOrder.id || '').substring(0, 8).toUpperCase()}`;

  const statusLabels = {
    pending: 'Order Placed',
    confirmed: 'Confirmed',
    shipped: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.headerSub}>{displayId}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          <View style={styles.leftCol}>
            {/* Status Header */}
            <View style={styles.statusHeaderCard}>
              <View style={styles.statusHeaderRow}>
                <View>
                  <Text style={styles.statusTitle}>{statusLabels[currentOrder.status] || currentOrder.status}</Text>
                  <Text style={styles.expectedText}>
                    {currentOrder.status === 'delivered' ? 'Order Delivered' :
                      currentOrder.status === 'cancelled' ? 'Order Cancelled' :
                        'Expected: Tomorrow by 10:00 AM'}
                  </Text>
                </View>
                <View style={styles.truckIconBox}>
                  <Truck size={24} color={PURPLE} />
                </View>
              </View>
            </View>

            {/* Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.sectionTitle}>Tracking Updates</Text>

              <View style={styles.timeline}>
                {stages.map((stage, index) => {
                  const isLast = index === stages.length - 1;
                  return (
                    <View key={stage.id} style={styles.timelineRow}>
                      <View style={styles.timelineIndicator}>
                        <View style={[
                          styles.dot,
                          stage.completed ? (stage.isCancelled ? styles.dotCancelled : styles.dotCompleted) : null,
                          stage.current && !stage.isCancelled ? styles.dotCurrent : null
                        ]}>
                          {stage.completed && !stage.current && <Check size={10} color="#fff" />}
                        </View>
                        {!isLast && <View style={[styles.line, stage.completed ? (stage.isCancelled ? styles.lineCancelled : styles.lineCompleted) : null]} />}
                      </View>

                      <View style={[styles.timelineContent, isLast && { paddingBottom: 0 }]}>
                        <Text style={[styles.timelineLabel, stage.completed ? styles.timelineLabelActive : null]}>
                          {stage.label}
                        </Text>
                        <Text style={styles.timelineTime}>{stage.time}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            {/* Delivery Info */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Delivery Details</Text>

              <View style={styles.detailRow}>
                <MapPin size={18} color="#64748B" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Delivery Address</Text>
                  <Text style={styles.detailValue}>{currentOrder.deliveryAddress || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Store size={18} color="#64748B" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Supplier</Text>
                  <Text style={styles.detailValue}>{supplierName}</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Phone size={16} color="#0F172A" />
                  <Text style={styles.actionBtnText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Order Items */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Products ({currentOrder.items?.length || 0})</Text>
              {(currentOrder.items || []).map((item, index) => (
                <View key={item.id || index} style={styles.itemRow}>
                  <View style={styles.itemThumb}>
                    <Text style={styles.itemInitial}>{(item.name || 'P').charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>Qty: {item.qty}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{typeof totalAmount === 'number' ? totalAmount.toLocaleString() : totalAmount}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
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
  contentLayout: { padding: 16 },
  contentLayoutWeb: { flexDirection: 'row', gap: 24, padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%', alignItems: 'flex-start' },

  leftCol: { flex: 1, minWidth: 0, gap: 16 },
  rightCol: { flex: 1, minWidth: 0, gap: 16 },

  statusHeaderCard: { backgroundColor: '#F5F3FF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2D4F8', marginBottom: Platform.OS === 'web' ? 0 : 16 },
  statusHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTitle: { fontSize: 20, fontWeight: '900', color: PURPLE, marginBottom: 4 },
  expectedText: { fontSize: 14, color: '#6D28D9', fontWeight: '500' },
  truckIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: Platform.OS === 'web' ? 0 : 16 },
  timelineCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 20 },

  timeline: { paddingLeft: 8 },
  timelineRow: { flexDirection: 'row' },
  timelineIndicator: { width: 24, alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotCompleted: { backgroundColor: '#10B981' },
  dotCurrent: { backgroundColor: PURPLE, width: 20, height: 20, borderRadius: 10, borderWidth: 4, borderColor: '#E2D4F8' },
  dotCancelled: { backgroundColor: '#DC2626' },
  line: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: -4, zIndex: 1 },
  lineCompleted: { backgroundColor: '#10B981' },
  lineCancelled: { backgroundColor: '#DC2626' },

  timelineContent: { flex: 1, paddingLeft: 16, paddingBottom: 32, paddingTop: -2 },
  timelineLabel: { fontSize: 15, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  timelineLabelActive: { color: '#0F172A' },
  timelineTime: { fontSize: 13, color: '#94A3B8' },

  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailTextCol: { flex: 1 },
  detailLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemThumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemInitial: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  itemQty: { fontSize: 12, color: '#64748B' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  totalValue: { fontSize: 18, fontWeight: '900', color: PURPLE }
});
