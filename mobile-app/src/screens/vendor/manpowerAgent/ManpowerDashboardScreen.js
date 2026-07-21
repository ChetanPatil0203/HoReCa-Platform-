import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity , Alert} from 'react-native';
import { TrendingUp, Star, Zap, Users } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { mockDb } from '../../../services/mockDb';

const KPI_DATA = [
  { label: "Active Placements", value: "28", delta: "+4 this week", icon: Users, color: "#2563EB" },
  { label: "Monthly Revenue", value: "₹1.9L", delta: "+22% vs last month", icon: TrendingUp, color: "#10B981" },
  { label: "Avg. Rating", value: "4.7 ★", delta: "From 84 reviews", icon: Star, color: "#F59E0B" },
  { label: "Fill Rate", value: "94.5%", delta: "+2.1% this month", icon: Zap, color: "#2563EB" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 1.1 }, { month: "Feb", revenue: 1.3 }, 
  { month: "Mar", revenue: 1.4 }, { month: "Apr", revenue: 1.5 }, 
  { month: "May", revenue: 1.4 }, { month: "Jun", revenue: 1.9 }
];

const RECENT_ORDERS = [
  { id: "ORD-M001", title: "Weekend Banquet Servers – 10p", client: "The Meridian Grand", value: "₹20,000", date: "16 Jun", status: "Accepted" },
  { id: "ORD-M004", title: "Security Guards – Night Shift", client: "Azure Palace Hotel", value: "₹36,000", date: "15 Jun", status: "Pending" },
];

const STATUS_STYLES = {
  New: { bg: "#DBEAFE", color: "#2563EB" },
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Accepted: { bg: "#D1FAE5", color: "#059669" },
  "Proposal Sent": { bg: "#F5F3FF", color: "#7C3AED" },
};

export default function ManpowerDashboardScreen() {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    setOrders(mockDb.getOrders());
  }, []);

  const maxRev = Math.max(...REVENUE_DATA.map(d => d.revenue));
  
  const filteredOrders = orders.filter(o => o.category === 'manpower');
  const displayOrders = filteredOrders.length > 0 ? filteredOrders : RECENT_ORDERS;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Welcome Banner */}
      <View style={[styles.welcomeBanner, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
        <View style={[styles.bannerIconBox, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE", shadowColor: "#2563EB" }]}>
          <Users size={24} color="#2563EB" />
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Welcome back, Partner</Text>
          <Text style={styles.bannerSub}>Manpower Agency · Elite Manpower</Text>
        </View>
        <View style={[styles.activePill, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
          <View style={[styles.activeDot, { backgroundColor: "#2563EB" }]} />
          <Text style={[styles.activePillText, { color: "#2563EB" }]}>Active</Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {KPI_DATA.map((kpi, idx) => (
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

      <View style={styles.bottomGrid}>
        {/* Revenue Trend */}
        <View style={styles.revCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Revenue Trend</Text>
              <Text style={styles.cardSub}>Monthly (₹ Lakhs)</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}><Text style={[styles.viewAllText, { color: "#2563EB" }]}>View All →</Text></TouchableOpacity>
          </View>
          
          <View style={styles.chartBars}>
            {REVENUE_DATA.map((d, i) => {
              const pct = (d.revenue / maxRev) * 100;
              const isLast = i === REVENUE_DATA.length - 1;
              return (
                <View key={d.month} style={styles.barCol}>
                  <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: isLast ? "#2563EB" : "#2563EB28" }]} />
                </View>
              )
            })}
          </View>
          <View style={styles.chartLabels}>
            {REVENUE_DATA.map(d => <Text key={d.month} style={styles.chartLabelText}>{d.month}</Text>)}
          </View>

          <View style={styles.revFooter}>
            <View>
              <Text style={styles.revFooterLabel}>This Month</Text>
              <Text style={[styles.revFooterVal, { color: "#2563EB" }]}>₹1.9L</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.revFooterLabel}>Growth</Text>
              <Text style={styles.revFooterGrowth}>+22%</Text>
            </View>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersCard}>
          <View style={[styles.cardHeaderRow, { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 }]}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={[styles.viewAllText, { color: "#2563EB" }]}>View Requests →</Text></TouchableOpacity>
          </View>
          <View style={styles.ordersList}>
            {displayOrders.slice(0, 4).map(o => {
              const s = STATUS_STYLES[o.status] || STATUS_STYLES["Pending"];
              return (
                <TouchableOpacity key={o.id} style={styles.orderItem}>
                  <View style={[styles.orderItemLine, { backgroundColor: "#2563EB" }]} />
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemTitle}>{o.title}</Text>
                    <Text style={styles.orderItemSub}>{o.client || 'The Meridian Hotels'} · {o.date}</Text>
                  </View>
                  <View style={styles.orderItemRight}>
                    <Text style={[styles.orderItemVal, { color: "#2563EB" }]}>{o.amount || o.value}</Text>
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
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 16, padding: 24, marginBottom: 24,
  },
  bannerIconBox: {
    width: 56, height: 56, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 14,
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
    borderRadius: 16, borderWidth: 1,
  },
  activeDot: {
    width: 8, height: 8, borderRadius: 4, marginRight: 8,
  },
  activePillText: {
    fontSize: 12, fontWeight: 'bold',
  },
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20,
  },
  kpiCard: {
    flex: 1, minWidth: 200, backgroundColor: '#fff', borderRadius: 16, padding: 20,
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
    flexDirection: Platform.OS === 'web' && Platform.isPad === false ? 'row' : 'column',
    gap: 20,
  },
  revCard: {
    flex: 1, minWidth: 300, backgroundColor: '#fff', borderRadius: 16, padding: 24,
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
    fontSize: 12, fontWeight: 'bold',
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
    fontSize: 18, fontWeight: '800',
  },
  revFooterGrowth: {
    fontSize: 14, fontWeight: 'bold', color: '#059669',
  },
  ordersCard: {
    flex: 2, minWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 24,
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
    width: 4, height: 32, borderRadius: 2, marginRight: 16,
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
    fontSize: 14, fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  statusText: {
    fontSize: 10, fontWeight: 'bold',
  }
});
