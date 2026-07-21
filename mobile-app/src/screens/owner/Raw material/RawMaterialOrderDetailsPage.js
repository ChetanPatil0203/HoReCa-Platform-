import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, MapPin, Store, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const PURPLE = '#D97706';

export default function RawMaterialOrderDetailsPage({ order, onBack, onReorder }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  // Using passed order or a mock if not available
  const currentOrder = order || {
    id: 'ORD-49201',
    status: 'Delivered',
    date: '12 Jul 2026, 10:30 AM',
    supplierName: 'Fresh Farm Suppliers',
    amount: 1450,
    itemsTotal: 1400,
    deliveryCharges: 50,
    items: [
      { id: 'p1', name: 'Tomato', qty: 5, price: 25 },
      { id: 'p2', name: 'Onion', qty: 5, price: 20 }
    ]
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSub}>{currentOrder.id}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.contentLayout}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>Order Status</Text>
                <Text style={[styles.statusValue, currentOrder.status === 'Delivered' && { color: '#10B981' }]}>{currentOrder.status}</Text>
              </View>
              <View>
                <Text style={styles.statusLabel}>Order Date</Text>
                <Text style={styles.dateValue}>{currentOrder.date}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#64748B" />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailValue}>Hotel Grand Palace, Plot 42, MIDC Road, Andheri East, Mumbai, MH</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Supplier Details</Text>
            <View style={styles.detailRow}>
              <Store size={18} color="#64748B" />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailValue}>{currentOrder.supplierName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ordered Items</Text>
            {currentOrder.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.qty}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items Total</Text>
              <Text style={styles.summaryValue}>₹{currentOrder.itemsTotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>₹{currentOrder.deliveryCharges}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{currentOrder.amount}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Reorder Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.reorderBtn} onPress={() => onReorder(currentOrder)}>
          <Text style={styles.reorderText}>Reorder</Text>
          <ChevronRight size={16} color="#fff" />
        </TouchableOpacity>
      </View>
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
  
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  statusValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  dateValue: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailTextCol: { flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 20 },
  
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
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  reorderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: PURPLE, height: 48, borderRadius: 12 },
  reorderText: { fontSize: 15, fontWeight: '700', color: '#fff' }
});
