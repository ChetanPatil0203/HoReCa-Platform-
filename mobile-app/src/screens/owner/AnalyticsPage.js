import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { PieChart, TrendingUp, BarChart2, Activity } from 'lucide-react-native';
import { colors } from '../../theme/colors';

// MOCK DATA
const METRICS = [
  { label: "Total Spend (MTD)", value: "₹0", trend: "0%", up: true, color: "#3B7FE0" },
  { label: "Active Suppliers", value: "0", trend: "0", up: true, color: "#0FA668" },
  { label: "Avg Delivery Time", value: "0 hrs", trend: "0m", up: true, color: "#9B5CF6" },
  { label: "Rejected Orders", value: "0", trend: "0", up: true, color: "#D4940A" },
];

export default function AnalyticsPage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: "rgba(59,127,224,0.1)" }]}>
            <PieChart size={24} color="#3B7FE0" />
          </View>
          <View>
            <Text style={styles.pageTitle}>Business Intelligence</Text>
            <Text style={styles.pageDesc}>Real-time analytics and procurement spend insights</Text>
          </View>
        </View>
      </View>

      {/* Top Metrics */}
      <View style={styles.statsGrid}>
        {METRICS.map(m => (
          <View key={m.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{m.label}</Text>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: m.color }]}>{m.value}</Text>
              <View style={[styles.trendBadge, { backgroundColor: m.up ? 'rgba(15,166,104,0.1)' : 'rgba(208,64,64,0.1)' }]}>
                <TrendingUp size={10} color={m.up ? '#0FA668' : '#D04040'} />
                <Text style={[styles.trendText, { color: m.up ? '#0FA668' : '#D04040' }]}>{m.trend}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Charts / Data Viz Mock */}
      <View style={styles.chartsGrid}>
        {/* Spend by Category Mock Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Spend By Category (Current Month)</Text>
            <BarChart2 size={16} color={colors.muted} />
          </View>
          
          <View style={styles.barChartArea}>
            {[
              { label: "Raw Material", val: 0, color: "#D4940A", amt: "₹0" },
              { label: "Manpower", val: 0, color: "#3B7FE0", amt: "₹0" },
              { label: "Services", val: 0, color: "#0FA668", amt: "₹0" },
              { label: "Marketing", val: 0, color: "#9B5CF6", amt: "₹0" }
            ].map(b => (
              <View key={b.label} style={styles.barRow}>
                <View style={styles.barLabelCol}>
                  <Text style={styles.barLabelText}>{b.label}</Text>
                  <Text style={styles.barAmtText}>{b.amt}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${b.val}%`, backgroundColor: b.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* System Activity */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Platform Activity</Text>
            <Activity size={16} color={colors.muted} />
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Activity graph will load here.</Text>
            <Text style={[styles.emptyText, { fontSize: 11, marginTop: 4 }]}>React Native Chart integration pending.</Text>
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
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
  },
  pageDesc: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  chartsGrid: {
    flexDirection: Platform.OS === 'web' && Platform.isPad === false ? 'row' : 'column',
    gap: 20,
    ...(Platform.OS === 'web' ? { display: 'flex', flexDirection: 'row' } : {})
  },
  chartCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  barChartArea: {
    flex: 1,
    gap: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabelCol: {
    width: 100,
  },
  barLabelText: {
    fontSize: 12,
    color: colors.sub,
    fontWeight: 'bold',
  },
  barAmtText: {
    fontSize: 10,
    color: colors.muted,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(15,23,42,0.03)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  }
});
