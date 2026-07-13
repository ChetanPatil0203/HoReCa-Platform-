import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Package, TrendingUp, Clock, Building2, ArrowUpRight, Star } from 'lucide-react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

const RECENT_ORDERS = [
  { id: "ORD-287", title: "Premium Basmati Rice", category: "raw-material", qty: "500 kg", vendor: "Metro Fresh Supplies", date: "14 Jun", status: "Accepted" },
  { id: "ORD-286", title: "Weekend Kitchen Staff", category: "manpower", qty: "2 persons", vendor: "Elite Staffing Co.", date: "13 Jun", status: "Pending" },
  { id: "ORD-285", title: "Deep Kitchen Cleaning", category: "service", qty: "Full property", vendor: "ProClean Services", date: "13 Jun", status: "Accepted" },
  { id: "ORD-284", title: "June Social Campaign", category: "marketing", qty: "30 days", vendor: "BrandCraft Agency", date: "12 Jun", status: "New" },
];

const VENDORS = [
  { name: "Metro Fresh Supplies", cat: "Raw Material", orders: 42, rating: 4.8, color: "#F59E0B" },
  { name: "Elite Staffing Co.", cat: "Manpower", orders: 28, rating: 4.7, color: "#1E40AF" },
  { name: "ProClean Services", cat: "Service", orders: 17, rating: 4.9, color: "#10B981" },
];

const CAT_COLORS = {
  "raw-material": "#F59E0B",
  manpower: "#1E40AF",
  service: "#10B981",
  marketing: "#8B5CF6",
};

const STATUS_META = {
  Accepted: { bg: "rgba(16, 185, 129, 0.07)", text: "#059669", dot: "#10B981" },
  Pending: { bg: "rgba(245, 158, 11, 0.07)", text: "#D97706", dot: "#F59E0B" },
  New: { bg: "rgba(30, 64, 175, 0.07)", text: "#1E40AF", dot: "#2563EB" },
  Rejected: { bg: "rgba(239, 68, 68, 0.07)", text: "#DC2626", dot: "#EF4444" },
};

import { mockDb } from '../../services/mockDb';

export default function DashboardHome({ user }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    setOrders(mockDb.getOrders());
  }, []);

  const totalOrders = orders.length;
  const acceptedOrders = orders.filter(o => o.status === 'Accepted').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'New').length;

  return (
    <View style={styles.container}>
      {/* ── Welcome Header ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcomeTitle}>Good morning, {user?.name?.split(" ")[0] || 'Owner'} 👋</Text>
          <Text style={styles.welcomeSub}>
            Operational control panel for <Text style={{ color: colors.dark, fontWeight: 'bold' }}>{user?.businessName || 'Business'}</Text>
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE FEED ONLINE</Text>
        </View>
      </View>

      {/* ── KPI Grid ── */}
      <View style={[styles.kpiGrid, isMobile && { justifyContent: 'space-between', gap: 10 }]}>
        {[
          { label: "Total Orders", value: String(totalOrders), delta: "+8 completed", icon: Package, color: "#D97706", bg: "#FEF3C7" },
          { label: "Accepted", value: String(acceptedOrders), delta: "55% acceptance", icon: TrendingUp, color: "#059669", bg: "#D1FAE5" },
          { label: "Awaiting Review", value: String(pendingOrders), delta: "Pending responses", icon: Clock, color: "#2563EB", bg: "#DBEAFE" },
          { label: "Supply Nodes", value: "12", delta: "Active partner nets", icon: Building2, color: "#334155", bg: "#F1F5F9" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <View key={idx} style={[styles.kpiCard, isMobile && { flex: 0, minWidth: '47%', width: '47%', padding: 16 }]}>
              <View style={[styles.kpiIconBox, { backgroundColor: kpi.bg, marginBottom: isMobile ? 8 : 16 }]}>
                <Icon size={20} color={kpi.color} strokeWidth={2.2} />
              </View>
              <Text style={[styles.kpiValue, isMobile && { fontSize: 24 }]}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiDelta}>{kpi.delta}</Text>
            </View>
          );
        })}
      </View>

      {/* ── Bottom Section ── */}
      <View style={[styles.tablesRow, isMobile && { flexDirection: 'column' }]}>
        
        {/* Recent Active Logs */}
        <View style={[styles.recentLogsContainer, isMobile && { minWidth: '100%' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>RECENT LOGS</Text>
            <TouchableOpacity style={styles.exploreBtn}>
              <Text style={styles.exploreText}>EXPLORE ALL</Text>
              <ArrowUpRight size={12} color="#1E40AF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.logsList}>
            {orders.slice(0, 5).map(order => {
              const sm = STATUS_META[order.status] || STATUS_META["Pending"];
              const catColor = CAT_COLORS[order.category] || "#64748B";

              if (isMobile) {
                return (
                  <View key={order.id} style={{ paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                        <View style={[styles.catIndicator, { backgroundColor: catColor, height: 18, width: 3, marginRight: 8 }]} />
                        <Text style={[styles.logTitle, { fontSize: 13, flex: 1 }]} numberOfLines={1}>{order.title}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: sm.bg, paddingHorizontal: 8, paddingVertical: 3 }]}>
                        <View style={[styles.statusDot, { backgroundColor: sm.dot }]} />
                        <Text style={[styles.statusText, { color: sm.text, fontSize: 9 }]}>{order.status}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 11 }}>
                      <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500' }}>{order.vendor} · {order.qty}</Text>
                      <Text style={{ fontSize: 11, color: colors.muted }}>{order.date}</Text>
                    </View>
                  </View>
                );
              }

              return (
                <View key={order.id} style={styles.logRow}>
                  <View style={styles.logLeft}>
                    <View style={[styles.catIndicator, { backgroundColor: catColor }]} />
                    <View>
                      <Text style={styles.logTitle}>{order.title}</Text>
                      <Text style={styles.logQty}>{order.qty}</Text>
                    </View>
                  </View>
                  <View style={styles.logCenter}>
                    <Text style={styles.logVendor}>{order.vendor}</Text>
                    <Text style={styles.logDate}>{order.date}</Text>
                  </View>
                  <View style={styles.logRight}>
                    <View style={[styles.statusBadge, { backgroundColor: sm.bg }]}>
                      <View style={[styles.statusDot, { backgroundColor: sm.dot }]} />
                      <Text style={[styles.statusText, { color: sm.text }]}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Vendors */}
        <View style={[styles.vendorsContainer, isMobile && { minWidth: '100%' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>ACTIVE NODE RATING</Text>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineBadgeText}>ALL CHANNELS ONLINE</Text>
            </View>
          </View>

          <View style={styles.vendorList}>
            {VENDORS.map((v, i) => (
              <View key={v.name} style={styles.vendorRow}>
                <View style={[styles.rankBox, i === 0 && styles.rankBoxTop]}>
                  <Text style={[styles.rankText, i === 0 && styles.rankTextTop]}>{i + 1}</Text>
                </View>
                <View style={[styles.vendorAvatar, { backgroundColor: `${v.color}15`, borderColor: v.color }]}>
                  <Text style={[styles.vendorAvatarText, { color: v.color }]}>
                    {v.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{v.name}</Text>
                  <Text style={styles.vendorStats}>{v.cat} · {v.orders} cycles</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{v.rating}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    fontWeight: '500',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...Platform.select({ web: { boxShadow: '0 2px 4px rgba(0,0,0,0.02)' } }),
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    letterSpacing: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 32,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  kpiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.muted,
    letterSpacing: 0.5,
  },
  kpiDelta: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginTop: 16,
  },
  tablesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  recentLogsContainer: {
    flex: 2,
    minWidth: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  vendorsContainer: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.dark,
    letterSpacing: 0.5,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginRight: 4,
    letterSpacing: 0.5,
  },
  onlineBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  onlineBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#047857',
    letterSpacing: 0.5,
  },
  logsList: {
    paddingVertical: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  logTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
  },
  logQty: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.muted,
    marginTop: 2,
  },
  logCenter: {
    flex: 1.5,
    paddingHorizontal: 16,
  },
  logVendor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  logDate: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    marginTop: 2,
  },
  logRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  vendorList: {
    paddingVertical: 8,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rankBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankBoxTop: {
    backgroundColor: '#FEF3C7',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.muted,
  },
  rankTextTop: {
    color: '#D97706',
  },
  vendorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  vendorAvatarText: {
    fontSize: 12,
    fontWeight: '900',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
  },
  vendorStats: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.muted,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
    marginLeft: 4,
  }
});
