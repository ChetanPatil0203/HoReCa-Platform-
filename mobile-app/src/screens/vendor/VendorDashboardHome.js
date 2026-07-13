import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Truck, TrendingUp, Star, Zap, Package, Users, Wrench, Megaphone } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { mockDb } from '../../services/mockDb';

const CAT = {
  "raw-material": { icon: Package, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", label: "Raw Material Supplier", accent: "#D97706" },
  manpower: { icon: Users, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "Manpower Agency", accent: "#1D4ED8" },
  service: { icon: Wrench, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", label: "Service Provider", accent: "#059669" },
  marketing: { icon: Megaphone, color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", label: "Marketing Agency", accent: "#7C3AED" },
};

const KPI_DATA = {
  "raw-material": [
    { label: "Active Deliveries", value: "12", delta: "+2 this week", icon: Truck, color: "#F59E0B" },
    { label: "Monthly Revenue", value: "₹2.8L", delta: "+16% vs last month", icon: TrendingUp, color: "#10B981" },
    { label: "Avg. Rating", value: "4.8 ★", delta: "From 142 reviews", icon: Star, color: "#F59E0B" },
    { label: "On-Time Rate", value: "97.2%", delta: "+1.2% this month", icon: Zap, color: "#2563EB" },
  ],
  manpower: [
    { label: "Active Placements", value: "28", delta: "+4 this week", icon: Users, color: "#2563EB" },
    { label: "Monthly Revenue", value: "₹1.9L", delta: "+22% vs last month", icon: TrendingUp, color: "#10B981" },
    { label: "Avg. Rating", value: "4.7 ★", delta: "From 84 reviews", icon: Star, color: "#F59E0B" },
    { label: "Fill Rate", value: "94.5%", delta: "+2.1% this month", icon: Zap, color: "#2563EB" },
  ],
  service: [
    { label: "Jobs This Month", value: "17", delta: "+3 vs last month", icon: Wrench, color: "#10B981" },
    { label: "Monthly Revenue", value: "₹1.1L", delta: "+18% vs last month", icon: TrendingUp, color: "#10B981" },
    { label: "Avg. Rating", value: "4.9 ★", delta: "From 61 reviews", icon: Star, color: "#F59E0B" },
    { label: "Completion Rate", value: "100%", delta: "All jobs completed", icon: Zap, color: "#2563EB" },
  ],
  marketing: [
    { label: "Active Campaigns", value: "3", delta: "+1 this month", icon: Megaphone, color: "#8B5CF6" },
    { label: "Monthly Revenue", value: "₹1.2L", delta: "+34% vs last month", icon: TrendingUp, color: "#10B981" },
    { label: "Avg. Rating", value: "4.5 ★", delta: "From 38 reviews", icon: Star, color: "#F59E0B" },
    { label: "Client Retention", value: "86%", delta: "+4% this month", icon: Zap, color: "#2563EB" },
  ],
};

const REVENUE_DATA = {
  "raw-material": [{ month: "Jan", revenue: 1.8 }, { month: "Feb", revenue: 1.6 }, { month: "Mar", revenue: 2.1 }, { month: "Apr", revenue: 2.4 }, { month: "May", revenue: 2.2 }, { month: "Jun", revenue: 2.8 }],
  manpower: [{ month: "Jan", revenue: 1.1 }, { month: "Feb", revenue: 1.3 }, { month: "Mar", revenue: 1.4 }, { month: "Apr", revenue: 1.5 }, { month: "May", revenue: 1.4 }, { month: "Jun", revenue: 1.9 }],
  service: [{ month: "Jan", revenue: 0.5 }, { month: "Feb", revenue: 0.6 }, { month: "Mar", revenue: 0.8 }, { month: "Apr", revenue: 0.7 }, { month: "May", revenue: 0.9 }, { month: "Jun", revenue: 1.1 }],
  marketing: [{ month: "Jan", revenue: 0.4 }, { month: "Feb", revenue: 0.5 }, { month: "Mar", revenue: 0.7 }, { month: "Apr", revenue: 0.8 }, { month: "May", revenue: 0.9 }, { month: "Jun", revenue: 1.2 }],
};

const RECENT_ORDERS = {
  "raw-material": [
    { id: "ORD-291", title: "Basmati Rice 600kg", client: "The Meridian Grand", value: "₹21,000", date: "16 Jun", status: "Accepted" },
    { id: "ORD-287", title: "Atlantic Salmon 80kg", client: "Azure Palace Hotel", value: "₹78,400", date: "15 Jun", status: "Accepted" },
    { id: "ORD-283", title: "Fresh Vegetables 200kg", client: "Café Zephyr Group", value: "₹8,200", date: "14 Jun", status: "Accepted" },
  ],
  manpower: [
    { id: "ORD-M001", title: "Weekend Banquet Servers – 10p", client: "The Meridian Grand", value: "₹20,000", date: "16 Jun", status: "Accepted" },
    { id: "ORD-M004", title: "Security Guards – Night Shift", client: "Azure Palace Hotel", value: "₹36,000", date: "15 Jun", status: "Pending" },
  ],
  service: [
    { id: "ORD-S001", title: "HVAC Annual Maintenance AMC", client: "Sunset Resort", value: "₹85,000", date: "16 Jun", status: "New" },
    { id: "ORD-S004", title: "Electrical Wiring Audit", client: "Café Zephyr Group", value: "₹12,000", date: "14 Jun", status: "Accepted" },
  ],
  marketing: [
    { id: "ORD-K001", title: "July Social Media Campaign", client: "Azure Palace Hotel", value: "₹40,000", date: "16 Jun", status: "New" },
    { id: "ORD-K002", title: "Complete Menu Photography", client: "Spice Route Restaurant", value: "₹18,000", date: "15 Jun", status: "Pending" },
  ],
};

const STATUS_STYLES = {
  New: { bg: "#DBEAFE", color: "#2563EB" },
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Accepted: { bg: "#D1FAE5", color: "#059669" },
  "Proposal Sent": { bg: "#F5F3FF", color: "#7C3AED" },
};

export default function VendorDashboardHome() {
  const { vendorType } = useContext(AuthContext);
  const type = vendorType || 'raw-material';
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const activeMeta = CAT[type] || CAT["raw-material"];
  const kpiData = KPI_DATA[type] || KPI_DATA["raw-material"];
  const revenueData = REVENUE_DATA[type] || REVENUE_DATA["raw-material"];
  const recentOrders = RECENT_ORDERS[type] || RECENT_ORDERS["raw-material"];

  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    setOrders(mockDb.getOrders());
  }, []);

  const maxRev = Math.max(...revenueData.map(d => d.revenue));
  const WelcomeIcon = activeMeta.icon;

  const filteredOrders = orders.filter(o => o.category === type);
  const displayOrders = filteredOrders.length > 0 ? filteredOrders : recentOrders;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Welcome Banner */}
      <View style={[styles.welcomeBanner, { backgroundColor: activeMeta.bg, borderColor: activeMeta.border }]}>
        <View style={[styles.bannerIconBox, { backgroundColor: activeMeta.bg }]}>
          <WelcomeIcon size={24} color={activeMeta.color} />
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Welcome back, Partner</Text>
          <Text style={styles.bannerSub}>
            {activeMeta.label} · {
              type === 'raw-material' ? 'Metro Fresh' : 
              type === 'manpower' ? 'Elite Manpower' : 
              type === 'service' ? 'ProClean Services' : 'BrandCraft Agency'
            }
          </Text>
        </View>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activePillText}>Active</Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {kpiData.map((kpi, idx) => (
          <View key={idx} style={[styles.kpiCard, { borderTopColor: kpi.color }]}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconBox, { backgroundColor: kpi.color + '14' }]}>
                <kpi.icon size={16} color={kpi.color} />
              </View>
              <View style={styles.kpiTrendPill}>
                <Text style={styles.kpiTrendText}>↑</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={styles.kpiDelta}>{kpi.delta}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.bottomGrid, isMobile && { flexDirection: 'column' }]}>
        {/* Revenue Trend */}
        <View style={[styles.revCard, isMobile && { minWidth: '100%' }]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Revenue Trend</Text>
              <Text style={styles.cardSub}>Monthly (₹ Lakhs)</Text>
            </View>
            <TouchableOpacity><Text style={[styles.viewAllText, { color: activeMeta.color }]}>View All →</Text></TouchableOpacity>
          </View>
          
          <View style={styles.chartBars}>
            {revenueData.map((d, i) => {
              const pct = (d.revenue / maxRev) * 100;
              const isLast = i === revenueData.length - 1;
              return (
                <View key={d.month} style={styles.barCol}>
                  <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: isLast ? activeMeta.color : activeMeta.color + '28' }]} />
                </View>
              )
            })}
          </View>
          <View style={styles.chartLabels}>
            {revenueData.map(d => <Text key={d.month} style={styles.chartLabelText}>{d.month}</Text>)}
          </View>

          <View style={styles.revFooter}>
            <View>
              <Text style={styles.revFooterLabel}>This Month</Text>
              <Text style={[styles.revFooterVal, { color: activeMeta.color }]}>₹{type === 'raw-material' ? '2.8L' : type === 'manpower' ? '1.9L' : type === 'service' ? '1.1L' : '1.2L'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.revFooterLabel}>Growth</Text>
              <Text style={styles.revFooterGrowth}>+18%</Text>
            </View>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={[styles.ordersCard, isMobile && { minWidth: '100%' }]}>
          <View style={[styles.cardHeaderRow, { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 }]}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={[styles.viewAllText, { color: activeMeta.color }]}>View Requests →</Text></TouchableOpacity>
          </View>
          <View style={styles.ordersList}>
            {displayOrders.slice(0, 4).map(o => {
              const s = STATUS_STYLES[o.status] || STATUS_STYLES["Pending"];
              return (
                <TouchableOpacity key={o.id} style={styles.orderItem}>
                  <View style={[styles.orderItemLine, { backgroundColor: activeMeta.color }]} />
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemTitle}>{o.title}</Text>
                    <Text style={styles.orderItemSub}>{o.client || 'The Meridian Hotels'} · {o.date}</Text>
                  </View>
                  <View style={styles.orderItemRight}>
                    <Text style={[styles.orderItemVal, { color: activeMeta.color }]}>{o.amount || o.value}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusText, { color: s.color }]}>{o.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  bannerIconBox: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: '#FFFBEB',
    borderWidth: 1, borderColor: '#FDE68A', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 14,
  },
  bannerContent: {
    flex: 1, marginLeft: 20,
  },
  bannerTitle: {
    fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4,
  },
  bannerSub: {
    fontSize: 14, color: '#475569',
  },
  activePill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A',
  },
  activeDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginRight: 8,
  },
  activePillText: {
    fontSize: 12, fontWeight: 'bold', color: '#F59E0B',
  },
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20,
  },
  kpiCard: {
    flex: 1, minWidth: 150, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 3,
    ...Platform.select({ web: { boxShadow: '0 1px 3px rgba(0,0,0,0.04)' } }),
  },
  kpiHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  kpiIconBox: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  kpiTrendPill: {
    backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  kpiTrendText: {
    color: '#059669', fontSize: 12, fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 24, fontWeight: '800', color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 12, color: '#94A3B8', marginTop: 2,
  },
  kpiDelta: {
    fontSize: 12, color: '#059669', fontWeight: '500', marginTop: 8,
  },
  bottomGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  revCard: {
    flex: 1, minWidth: 300, backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15, fontWeight: 'bold', color: '#0F172A',
  },
  cardSub: {
    fontSize: 12, color: '#94A3B8', marginTop: 2,
  },
  viewAllText: {
    color: '#2563EB', fontSize: 12, fontWeight: 'bold',
  },
  chartBars: {
    flexDirection: 'row', height: 80, alignItems: 'flex-end', gap: 6, marginBottom: 12,
  },
  barCol: {
    flex: 1, height: '100%', justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6,
  },
  chartLabels: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
  },
  chartLabelText: {
    flex: 1, textAlign: 'center', fontSize: 10, color: '#94A3B8',
  },
  revFooter: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  revFooterLabel: {
    fontSize: 12, color: '#94A3B8',
  },
  revFooterVal: {
    fontSize: 18, fontWeight: '800', color: '#2563EB',
  },
  revFooterGrowth: {
    fontSize: 14, fontWeight: 'bold', color: '#059669',
  },
  ordersCard: {
    flex: 2, minWidth: 300, backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  ordersList: {
    flexDirection: 'column',
  },
  orderItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  orderItemLine: {
    width: 4, height: 32, borderRadius: 2, backgroundColor: '#2563EB', marginRight: 16,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 14, fontWeight: '600', color: '#0F172A',
  },
  orderItemSub: {
    fontSize: 12, color: '#94A3B8', marginTop: 2,
  },
  orderItemRight: {
    alignItems: 'flex-end', gap: 6,
  },
  orderItemVal: {
    fontSize: 14, fontWeight: 'bold', color: '#2563EB',
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  statusText: {
    fontSize: 10, fontWeight: 'bold',
  }
});
