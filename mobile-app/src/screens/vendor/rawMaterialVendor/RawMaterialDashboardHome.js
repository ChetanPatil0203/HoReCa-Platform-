import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, Dimensions 
} from 'react-native';
import { 
  ShoppingBag, Clock3, Truck, 
  TriangleAlert, ChevronRight
} from 'lucide-react-native';

const PRIMARY = '#0B1736';
const ACCENT = '#6C4CF6';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#94A3B8';
const DANGER = '#EF4444';
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';
const INFO = '#3B82F6';

const OVERVIEW_CARDS = [
  { id: 'new', label: 'New Orders', value: '12', icon: ShoppingBag, bg: '#EEF2FF', iconColor: ACCENT, target: 'requests', filter: 'New' },
  { id: 'pending', label: 'Pending Orders', value: '8', icon: Clock3, bg: '#FFF7ED', iconColor: WARNING, target: 'requests', filter: 'Pending' },
  { id: 'low', label: 'Low Stock Items', value: '3', icon: TriangleAlert, bg: '#FEF2F2', iconColor: DANGER, target: 'inventory', filter: 'Low Stock' },
  { id: 'deliveries', label: 'Deliveries Today', value: '5', icon: Truck, bg: '#ECFDF5', iconColor: SUCCESS, target: 'deliveries', filter: 'Today' },
];

const RECENT_ORDERS = [
  { id: 'ORD-942', hotel: 'The Grand Meridian', product: 'Premium Basmati Rice', qty: '500kg', amount: '₹45,000', status: 'New', statusColor: ACCENT, date: 'Today, 10:30 AM' },
  { id: 'ORD-941', hotel: 'Azure Palace', product: 'Atlantic Salmon', qty: '50kg', amount: '₹60,000', status: 'Processing', statusColor: INFO, date: 'Yesterday, 02:00 PM' }
];

const TODAY_DELIVERIES = [
  { id: 'DEL-1', hotel: 'The Grand Meridian', product: 'Premium Basmati Rice', time: '10:30 AM', status: 'Out for Delivery', statusColor: INFO },
  { id: 'DEL-2', hotel: 'Azure Palace', product: 'Atlantic Salmon', time: '02:00 PM', status: 'Scheduled', statusColor: ACCENT }
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

          {/* Vendor Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Good Morning 👋</Text>
            <Text style={styles.vendorNameText}>Metro Fresh</Text>
            <Text style={styles.vendorRoleText}>Raw Material Supplier</Text>
          </View>

          {/* 1. Summary Cards */}
          <View style={styles.section}>
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
                      <card.icon size={18} color={card.iconColor} />
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
                  <Text style={styles.viewAllText}>View All</Text>
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
                    <View style={[styles.statusBadge, { backgroundColor: order.statusColor + '15' }]}>
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
                    <ChevronRight size={20} color={MUTED} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 3. Today's Deliveries */}
            <View style={[styles.section, isMobile ? {} : { flex: 1 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Today's Deliveries</Text>
                <TouchableOpacity onPress={() => onNavigate && onNavigate('deliveries', 'Today')}>
                  <Text style={styles.viewAllText}>View All</Text>
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
                      <Text style={styles.secondaryText} numberOfLines={1}>{del.product}</Text>
                      <View style={styles.deliveryMeta}>
                        <Text style={styles.timeText}>{del.time}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: del.statusColor + '15', paddingVertical: 2, paddingHorizontal: 8 }]}>
                          <Text style={[styles.statusText, { color: del.statusColor, fontSize: 10 }]}>{del.status}</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color={MUTED} />
                  </View>
                </TouchableOpacity>
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
  scrollContent: { padding: 16, paddingBottom: 100 }, 
  maxWidthContainer: { width: '100%', maxWidth: 1000, alignSelf: 'center' },
  
  welcomeSection: { marginBottom: 24, marginTop: 8 },
  greetingText: { fontSize: 14, color: MUTED, marginBottom: 4 },
  vendorNameText: { fontSize: 24, fontWeight: 'bold', color: PRIMARY },
  vendorRoleText: { fontSize: 13, color: MUTED, marginTop: 2 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: PRIMARY },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: ACCENT },
  
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  overviewCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#F1F5F9' },
  overviewTop: { flexDirection: 'row', marginBottom: 12 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  overviewValue: { fontSize: 24, fontWeight: 'bold', color: PRIMARY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '500' },
  
  card: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  idText: { fontSize: 12, fontWeight: 'bold', color: PRIMARY },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  
  cardBody: { marginBottom: 12 },
  primaryText: { fontSize: 14, fontWeight: '600', color: PRIMARY, marginBottom: 4 },
  secondaryText: { fontSize: 13, color: MUTED },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 12 },
  amountText: { fontSize: 15, fontWeight: 'bold', color: PRIMARY, marginBottom: 2 },
  dateText: { fontSize: 11, color: MUTED },
  
  row: { flexDirection: 'row' },
  
  deliveryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deliveryInfo: { flex: 1, paddingRight: 12 },
  deliveryMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  timeText: { fontSize: 12, fontWeight: '600', color: PRIMARY, marginRight: 12 },
  
  bottomSpacer: { height: 60 }
});
