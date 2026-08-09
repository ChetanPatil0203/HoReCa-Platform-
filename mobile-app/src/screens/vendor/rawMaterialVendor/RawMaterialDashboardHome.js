import React, { useContext, useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, Image
} from 'react-native';
import { TrendingUp, Package, Users, Truck, CircleAlert as AlertCircle, ChevronRight, ArrowUpRight, ArrowDownRight, PackageSearch, CircleCheck as CheckCircle2, Clock, MapPin, RefreshCw } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorOrders } from '../../../services/api.service';

const rawBgImage = require('../../../assets/raw.png');

const PRIMARY = '#081A3A';
const NAVY = '#081A3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const DB_TO_UI_STATUS = {
  pending: 'New',
  confirmed: 'Accepted',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  New: { bg: '#EFF6FF', color: '#3B82F6' },
  Accepted: { bg: '#D1FAE5', color: '#059669' },
  Processing: { bg: '#FFF7ED', color: '#F97316' },
  Packed: { bg: '#FEF9C3', color: '#D97706' },
  Dispatched: { bg: '#EEF2FF', color: '#4F46E5' },
  Delivered: { bg: '#F0FDF4', color: '#16A34A' },
  Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
};

export default function RawMaterialDashboardHome({ onNavigate, setActivePage }) {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const { user } = useContext(AuthContext);
  const supplierId = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!supplierId) { setLoading(false); return; }
    try {
      const res = await fetchVendorOrders(supplierId);
      if (res?.success) setOrders(res.data || []);
    } catch (e) {
      console.error('RawMaterialDashboardHome: fetchVendorOrders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [supplierId]);

  // Computed counts from real orders
  const newCount = orders.filter(o => o.status === 'pending').length;
  const acceptedCount = orders.filter(o => o.status === 'confirmed').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;

  const OVERVIEW_CARDS = [
    { id: 'new', label: 'New Orders', value: String(newCount), icon: Package, bg: '#EFF6FF', iconColor: '#3B82F6', target: 'requests' },
    { id: 'accepted', label: 'Accepted', value: String(acceptedCount), icon: CheckCircle2, bg: '#F0FDF4', iconColor: '#22C55E', target: 'requests' },
    { id: 'shipping', label: 'In Transit', value: String(shippedCount), icon: Truck, bg: '#EEF2FF', iconColor: '#4F46E5', target: 'deliveries' },
    { id: 'total', label: 'Total Orders', value: String(orders.length), icon: TrendingUp, bg: '#FFF7ED', iconColor: '#F97316', target: 'requests' },
  ];

  // Last 3 orders for "Recent Orders" section
  const recentOrders = orders.slice(0, 3).map(o => {
    const uiStatus = DB_TO_UI_STATUS[o.status] || o.status;
    const sc = STATUS_COLORS[uiStatus] || { bg: '#F1F5F9', color: '#64748B' };
    const firstItem = (o.items || [])[0];
    return {
      id: `#${o.id.slice(0, 8).toUpperCase()}`,
      hotel: o.owner?.bizName || o.owner?.ownerName || 'Client',
      product: firstItem?.product?.name || 'Mixed Items',
      qty: `${(o.items || []).reduce((s, i) => s + (i.quantity || 0), 0)} ${firstItem?.product?.unit || ''}`.trim(),
      amount: `₹${parseFloat(o.totalAmount || 0).toFixed(0)}`,
      date: new Date(o.createdAt).toLocaleDateString('en-IN'),
      status: uiStatus,
      statusBg: sc.bg,
      statusColor: sc.color,
    };
  });

  return (

    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.maxWidthContainer}>

          {/* Premium Welcome Hero with Background Image */}
          <View style={styles.heroCard}>
            <Image 
              source={rawBgImage}
              style={styles.heroBgImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroVendorName}>{user?.registration?.bizName || user?.businessName || user?.bizName || 'Vendor Agency'}</Text>
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
                      <card.icon size={18} color={card.iconColor} />
                    </View>
                    <Text style={styles.overviewValue}>{card.value}</Text>
                  </View>
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
                <TouchableOpacity onPress={() => onNavigate && onNavigate('requests')} style={styles.viewAllBtn}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={13} color="#000000" />
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator style={{ marginVertical: 20 }} color={GOLD} />
              ) : recentOrders.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                  <PackageSearch size={28} color='#CBD5E1' />
                  <Text style={{ color: MUTED, fontSize: 13, marginTop: 8 }}>No orders yet</Text>
                </View>
              ) : recentOrders.map(order => (
                <TouchableOpacity 
                  key={order.id} 
                  style={styles.card}
                  onPress={() => onNavigate && onNavigate('requests')}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.idText}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: 'transparent', paddingHorizontal: 0 }]}>
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
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </View>{/* end row */}

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
    backgroundColor: '#071B3A', 
    borderRadius: 20, 
    paddingHorizontal: 24, 
    paddingVertical: 32,
    minHeight: 140,
    justifyContent: 'center',
    marginBottom: 24, 
    overflow: 'hidden', 
    position: 'relative'
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 1,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 27, 58, 0.35)',
    borderRadius: 20,
    zIndex: 2,
  },
  heroContent: { position: 'relative', zIndex: 3 },
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
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#000000' },
  
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  overviewCard: { 
    backgroundColor: WHITE, borderRadius: 14, padding: 14, marginBottom: 4, 
    borderWidth: 1, borderColor: '#E8EDF4',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, 
    display: 'flex', flexDirection: 'column',
  },
  overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overviewValue: { fontSize: 24, fontWeight: '900', color: NAVY },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '600' },
  
  card: { 
    backgroundColor: WHITE, borderRadius: 14, padding: 12, marginBottom: 10, 
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  idText: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  
  cardBody: { marginBottom: 10 },
  primaryText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  secondaryText: { fontSize: 12, color: MUTED },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  amountText: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  dateText: { fontSize: 11, color: MUTED },
  viewOrderAction: {
    backgroundColor: NAVY,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
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
