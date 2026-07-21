import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, Dimensions 
} from 'react-native';
import { 
  ShoppingBag, Clock3, Truck, 
  TriangleAlert, ChevronRight, Package, Box, RefreshCcw, CheckCircle2, Navigation
} from 'lucide-react-native';

const PRIMARY = '#071B3A';
const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const OVERVIEW_CARDS = [
  { id: 'new', label: 'New Orders', value: '12', icon: ShoppingBag, bg: '#EFF6FF', iconColor: '#3B82F6', target: 'requests', filter: 'New' },
  { id: 'pending', label: 'Pending Orders', value: '8', icon: Clock3, bg: '#FFF7ED', iconColor: '#F97316', target: 'requests', filter: 'Pending' },
  { id: 'low', label: 'Low Stock Items', value: '3', icon: TriangleAlert, bg: '#FEF2F2', iconColor: '#EF4444', target: 'inventory', filter: 'Low Stock' },
  { id: 'deliveries', label: 'Deliveries Today', value: '5', icon: Truck, bg: '#F0FDF4', iconColor: '#22C55E', target: 'deliveries', filter: 'Today' },
];

const RECENT_ORDERS = [
  { id: 'ORD-942', hotel: 'The Grand Meridian', product: 'Premium Basmati Rice', qty: '500 kg', amount: '₹45,000', status: 'NEW', statusColor: '#3B82F6', statusBg: '#EFF6FF', date: 'Today · 10:30 AM' },
  { id: 'ORD-941', hotel: 'Azure Palace', product: 'Atlantic Salmon', qty: '50 kg', amount: '₹60,000', status: 'PROCESSING', statusColor: '#F97316', statusBg: '#FFF7ED', date: 'Yesterday · 02:00 PM' }
];

const TODAY_DELIVERIES = [
  { id: 'DEL-1', hotel: 'The Grand Meridian', product: 'Premium Basmati Rice', qty: '500 kg', time: '10:30 AM', status: 'Out for Delivery', statusColor: '#8B5CF6' },
  { id: 'DEL-2', hotel: 'Azure Palace', product: 'Atlantic Salmon', qty: '50 kg', time: '02:00 PM', status: 'Scheduled', statusColor: '#3B82F6' }
];

const RECENT_ACTIVITY = [
  { id: 'ACT-1', title: 'New Order Received', desc: 'Order ORD-942 from The Grand Meridian', time: '10 minutes ago', icon: ShoppingBag, color: '#3B82F6' },
  { id: 'ACT-2', title: 'Stock Updated', desc: 'Premium Basmati Rice stock increased', time: '45 minutes ago', icon: RefreshCcw, color: '#F97316' },
  { id: 'ACT-3', title: 'Delivery Completed', desc: 'Order ORD-938 delivered to Cafe Zephyr', time: '2 hours ago', icon: CheckCircle2, color: '#22C55E' }
];

export default function RawMaterialDashboardHome({ onNavigate }) {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.maxWidthContainer}>

          {/* Premium Welcome Hero */}
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <Text style={styles.heroGreeting}>Good Morning 👋</Text>
              <Text style={styles.heroVendorName}>Metro Fresh</Text>
              <Text style={styles.heroVendorRole}>Raw Material Supplier</Text>
              
              <Text style={styles.heroSubText}>Manage orders, inventory and deliveries from one place.</Text>
              

            </View>
            <View style={styles.heroWatermark}>
              <Package size={80} color="rgba(255,255,255,0.06)" />
            </View>
          </View>

          {/* 1. Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewGrid}>
              {OVERVIEW_CARDS.map(card => (
                <TouchableOpacity 
                  key={card.id} 
                  style={[styles.overviewCard, isMobile ? { width: '48%' } : { width: '23%' }]}
                  onPress={() => onNavigate && onNavigate(card.target, card.filter)}
                  activeOpacity={0.7}
                >
                  <View style={styles.overviewTop}>
                    <View style={[styles.iconBox, { backgroundColor: card.bg }]}>
                      <card.icon size={20} color={card.iconColor} />
                    </View>
                  </View>
                  <Text style={styles.overviewValue}>{card.value}</Text>
                  <Text style={styles.overviewLabel}>{card.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={isMobile ? {} : styles.row}>
            {/* 2. Recent Orders */}
            <View style={[styles.section, isMobile ? {} : { flex: 1, marginRight: 16 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => onNavigate && onNavigate('requests')}>
                  <Text style={styles.viewAllText}>View All {'>'}</Text>
                </TouchableOpacity>
              </View>
              {RECENT_ORDERS.map(order => (
                <TouchableOpacity 
                  key={order.id} 
                  style={styles.card}
                  onPress={() => onNavigate && onNavigate('requests')}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.idText}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: order.statusBg }]}>
                      <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.primaryText} numberOfLines={1}>{order.hotel}</Text>
                    <Text style={styles.secondaryText} numberOfLines={1}>{order.product} · {order.qty}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.amountText}>{order.amount}</Text>
                      <Text style={styles.dateText}>{order.date}</Text>
                    </View>
                    <View style={styles.viewOrderAction}>
                      <Text style={styles.viewOrderText}>View Order</Text>
                      <ChevronRight size={14} color={NAVY} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 3. Today's Deliveries */}
            <View style={[styles.section, isMobile ? {} : { flex: 1 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Today's Deliveries</Text>
                <TouchableOpacity onPress={() => onNavigate && onNavigate('deliveries', 'Today')}>
                  <Text style={styles.viewAllText}>View All {'>'}</Text>
                </TouchableOpacity>
              </View>
              {TODAY_DELIVERIES.map(del => (
                <TouchableOpacity 
                  key={del.id} 
                  style={styles.card}
                  onPress={() => onNavigate && onNavigate('deliveries')}
                  activeOpacity={0.7}
                >
                  <View style={styles.deliveryRow}>
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.primaryText} numberOfLines={1}>{del.hotel}</Text>
                      <Text style={styles.secondaryText} numberOfLines={1}>{del.product} · {del.qty}</Text>
                      <View style={styles.deliveryMeta}>
                        <Text style={styles.timeText}>{del.time}</Text>
                        <Text style={[styles.deliveryStatusText, { color: del.statusColor }]}>{del.status}</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color={MUTED} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 4. Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => onNavigate && onNavigate('history')}>
                <Text style={styles.viewAllText}>View All {'>'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContainer}>
              {RECENT_ACTIVITY.map((act, index) => (
                <View key={act.id}>
                  <View style={styles.activityRow}>
                    <View style={styles.activityIconBox}>
                      <act.icon size={16} color={act.color} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{act.title}</Text>
                      <Text style={styles.activityDesc}>{act.desc}</Text>
                      <Text style={styles.activityTime}>{act.time}</Text>
                    </View>
                  </View>
                  {index < RECENT_ACTIVITY.length - 1 && <View style={styles.activityDivider} />}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110 }, 
  maxWidthContainer: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
  
  // Premium Welcome Hero
  heroCard: { 
    backgroundColor: PRIMARY, borderRadius: 20, padding: 20, marginBottom: 24, 
    overflow: 'hidden', position: 'relative'
  },
  heroContent: { position: 'relative', zIndex: 2 },
  heroGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' },
  heroVendorName: { fontSize: 24, fontWeight: 'bold', color: WHITE, marginBottom: 2 },
  heroVendorRole: { fontSize: 13, color: GOLD, fontWeight: '600', marginBottom: 12 },
  heroSubText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 16, maxWidth: '80%' },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  heroBadge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.15)', 
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginRight: 12,
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)'
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 6 },
  heroBadgeText: { color: '#4ADE80', fontSize: 12, fontWeight: '600' },
  heroActiveText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  heroWatermark: { position: 'absolute', right: -10, bottom: -10, opacity: 0.8, zIndex: 1 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: MUTED },
  
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  overviewCard: { 
    backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 4, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, 
    borderWidth: 1, borderColor: '#E6EBF2' 
  },
  overviewTop: { flexDirection: 'row', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overviewValue: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '500' },
  
  card: { 
    backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, 
    borderWidth: 1, borderColor: '#E6EBF2' 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idText: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  
  cardBody: { marginBottom: 14 },
  primaryText: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  secondaryText: { fontSize: 13, color: MUTED },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  amountText: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  dateText: { fontSize: 12, color: MUTED },
  viewOrderAction: { flexDirection: 'row', alignItems: 'center' },
  viewOrderText: { fontSize: 12, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  
  row: { flexDirection: 'row' },
  
  deliveryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deliveryInfo: { flex: 1, paddingRight: 12 },
  deliveryMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  timeText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 12 },
  deliveryStatusText: { fontSize: 13, fontWeight: '600' },
  
  activityContainer: { backgroundColor: WHITE, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E6EBF2', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start' },
  activityIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  activityDesc: { fontSize: 13, color: MUTED, marginBottom: 4, lineHeight: 18 },
  activityTime: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  activityDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14, marginLeft: 44 },

  bottomSpacer: { height: 20 }
});
