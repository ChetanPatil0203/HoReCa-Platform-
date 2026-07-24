import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, MapPin, Phone, FileText, Check, Package, Truck, Clock, Store } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const PURPLE = '#D97706';

const STATUS_STAGES = [
  { id: 'confirmed', label: 'Order Confirmed', time: '12 Jul, 10:30 AM', completed: true },
  { id: 'accepted', label: 'Preparing Your Order', time: '12 Jul, 11:15 AM', completed: true },
  { id: 'out', label: 'Out for Delivery', time: 'Today, 09:00 AM', completed: true, current: true },
  { id: 'delivered', label: 'Delivered', time: 'Pending', completed: false }
];

export default function RawMaterialOrderTrackingPage({ order, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const currentOrder = order || {
    id: '',
    status: '',
    supplierName: '',
    expectedDelivery: '',
    amount: 0,
    items: []
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
          <Text style={styles.headerSub}>{currentOrder.id}</Text>
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
                  <Text style={styles.statusTitle}>{currentOrder.status}</Text>
                  <Text style={styles.expectedText}>Expected: {currentOrder.expectedDelivery}</Text>
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
                {STATUS_STAGES.map((stage, index) => {
                  const isLast = index === STATUS_STAGES.length - 1;
                  return (
                    <View key={stage.id} style={styles.timelineRow}>
                      <View style={styles.timelineIndicator}>
                        <View style={[styles.dot, stage.completed ? styles.dotCompleted : null, stage.current ? styles.dotCurrent : null]}>
                          {stage.completed && !stage.current && <Check size={10} color="#fff" />}
                        </View>
                        {!isLast && <View style={[styles.line, stage.completed ? styles.lineCompleted : null]} />}
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
                  <Text style={styles.detailValue}>Hotel Grand Palace, Plot 42, MIDC Road, Andheri East, Mumbai, MH</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Store size={18} color="#64748B" />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Supplier</Text>
                  <Text style={styles.detailValue}>{currentOrder.supplierName}</Text>
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
              <Text style={styles.sectionTitle}>Products ({currentOrder.items.length})</Text>
              {currentOrder.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemThumb}>
                    <Text style={styles.itemInitial}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>Qty: {item.qty}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{currentOrder.amount}</Text>
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
  line: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: -4, zIndex: 1 },
  lineCompleted: { backgroundColor: '#10B981' },
  
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
