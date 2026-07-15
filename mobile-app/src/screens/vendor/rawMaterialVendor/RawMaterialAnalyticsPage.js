import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView
} from 'react-native';
import {
  TrendingUp, TrendingDown, Package, Users, Truck,
  MapPin, Star, Lightbulb, ChevronDown, Filter
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const FILTERS = ['Date: This Month', 'Category: All', 'Client: All', 'City: All'];

const METRICS = [
  { label: 'Total Orders', value: '450', trend: '+12%', isPositive: true, icon: Package, color: '#3B82F6' },
  { label: 'Avg Order Value', value: '₹18.5k', trend: '+5%', isPositive: true, icon: TrendingUp, color: '#10B981' },
  { label: 'Repeat Client', value: '68%', trend: '+2%', isPositive: true, icon: Users, color: '#8B5CF6' },
  { label: 'On-Time Del.', value: '92%', trend: '-1%', isPositive: false, icon: Truck, color: '#F59E0B' },
  { label: 'Cancel Rate', value: '3.2%', trend: '-0.5%', isPositive: true, icon: TrendingDown, color: '#EF4444' }, // lower is better
  { label: 'Order Growth', value: '15%', trend: '+3%', isPositive: true, icon: TrendingUp, color: '#14B8A6' },
];

const PRODUCTS = [
  { name: 'Premium Basmati Rice', value: '₹4.5L', rank: 1 },
  { name: 'Extra Virgin Olive Oil', value: '₹3.2L', rank: 2 },
  { name: 'Atlantic Salmon', value: '₹1.8L', rank: 3 },
];

const CLIENTS = [
  { name: 'The Meridian Grand', value: '₹5.2L', rank: 1 },
  { name: 'Café Zephyr', value: '₹2.8L', rank: 2 },
  { name: 'Azure Palace', value: '₹1.5L', rank: 3 },
];

export default function RawMaterialAnalyticsPage() {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>

        {/* Top Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <View style={styles.filterIconBox}>
              <Filter size={18} color="#64748B" />
            </View>
            {FILTERS.map((f, idx) => (
              <TouchableOpacity key={idx} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{f}</Text>
                <ChevronDown size={14} color="#64748B" style={{marginLeft: 4}} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            {METRICS.map((item, idx) => (
              <View key={idx} style={[styles.metricCard, { width: (width - 48) / 2 }]}>
                <View style={styles.metricHeader}>
                  <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                    <item.icon size={16} color={item.color} />
                  </View>
                  <View style={[styles.trendBadge, {backgroundColor: item.isPositive ? '#D1FAE5' : '#FEE2E2'}]}>
                    <Text style={[styles.trendText, {color: item.isPositive ? '#059669' : '#DC2626'}]}>
                      {item.trend}
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel} numberOfLines={1}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Sales Trend (Mock Chart) */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Sales Trend</Text>
            <View style={styles.chartArea}>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 40}]} /><Text style={styles.chartLbl}>M1</Text></View>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 70}]} /><Text style={styles.chartLbl}>M2</Text></View>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 50}]} /><Text style={styles.chartLbl}>M3</Text></View>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 100}]} /><Text style={styles.chartLbl}>M4</Text></View>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 80}]} /><Text style={styles.chartLbl}>M5</Text></View>
              <View style={styles.chartCol}><View style={[styles.chartBar, {height: 120, backgroundColor: GOLD}]} /><Text style={styles.chartLbl}>M6</Text></View>
            </View>
          </View>

          {/* Performance Lists */}
          <View style={styles.twoColSection}>
            {/* Product Performance */}
            <View style={styles.sectionCardList}>
              <Text style={styles.sectionTitle}>Top Products</Text>
              {PRODUCTS.map(p => (
                <View key={p.rank} style={styles.listItemRow}>
                  <View style={styles.rankBox}><Text style={styles.rankText}>{p.rank}</Text></View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.listValue}>{p.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Client Performance */}
            <View style={[styles.sectionCardList, {marginTop: 16}]}>
              <Text style={styles.sectionTitle}>Top Clients</Text>
              {CLIENTS.map(c => (
                <View key={c.rank} style={styles.listItemRow}>
                  <View style={styles.rankBox}><Text style={styles.rankText}>{c.rank}</Text></View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName} numberOfLines={1}>{c.name}</Text>
                    <Text style={styles.listValue}>{c.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Delivery & Geo */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Delivery Performance</Text>
            <View style={styles.barGroup}>
              <View style={styles.barHeader}>
                <Text style={styles.barLabel}>On-Time</Text>
                <Text style={styles.barVal}>92%</Text>
              </View>
              <View style={styles.barBg}><View style={[styles.barFill, {width: '92%', backgroundColor: '#10B981'}]} /></View>
            </View>
            <View style={styles.barGroup}>
              <View style={styles.barHeader}>
                <Text style={styles.barLabel}>Delayed</Text>
                <Text style={styles.barVal}>8%</Text>
              </View>
              <View style={styles.barBg}><View style={[styles.barFill, {width: '8%', backgroundColor: '#F59E0B'}]} /></View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Geographic Demand</Text>
            <View style={styles.geoRow}>
              <MapPin size={18} color={NAVY} />
              <View style={styles.geoInfo}><Text style={styles.geoCity}>Metro City</Text></View>
              <Text style={styles.geoVal}>45%</Text>
            </View>
            <View style={styles.geoRow}>
              <MapPin size={18} color={NAVY} />
              <View style={styles.geoInfo}><Text style={styles.geoCity}>Azure Coast</Text></View>
              <Text style={styles.geoVal}>30%</Text>
            </View>
            <View style={styles.geoRow}>
              <MapPin size={18} color={NAVY} />
              <View style={styles.geoInfo}><Text style={styles.geoCity}>Westside Hub</Text></View>
              <Text style={styles.geoVal}>25%</Text>
            </View>
          </View>

          {/* Ratings */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Rating Distribution</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>5 <Star size={12} color="#F59E0B" fill="#F59E0B" /></Text>
              <View style={styles.barBg}><View style={[styles.barFill, {width: '75%', backgroundColor: '#F59E0B'}]} /></View>
              <Text style={styles.ratingVal}>75%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>4 <Star size={12} color="#F59E0B" fill="#F59E0B" /></Text>
              <View style={styles.barBg}><View style={[styles.barFill, {width: '20%', backgroundColor: '#F59E0B'}]} /></View>
              <Text style={styles.ratingVal}>20%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>3 <Star size={12} color="#F59E0B" fill="#F59E0B" /></Text>
              <View style={styles.barBg}><View style={[styles.barFill, {width: '5%', backgroundColor: '#F59E0B'}]} /></View>
              <Text style={styles.ratingVal}>5%</Text>
            </View>
          </View>

          {/* Insights */}
          <View style={[styles.sectionCard, {backgroundColor: '#F0F9FF', borderColor: '#BAE6FD'}]}>
            <View style={styles.insightHeader}>
              <Lightbulb size={20} color="#0284C7" />
              <Text style={styles.insightTitle}>Business Insights</Text>
            </View>
            <Text style={styles.insightText}>
              • Premium Basmati Rice sales are up 15% this month.{'\n'}
              • Delay rate has slightly increased in Westside Hub. Consider reviewing dispatch times for this route.{'\n'}
              • 3 clients are eligible for volume discounts based on their LTV.
            </Text>
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  
  filterContainer: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterScroll: { paddingHorizontal: 16, alignItems: 'center' },
  filterIconBox: { marginRight: 12 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', marginRight: 8,
  },
  filterChipText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  
  scrollContent: { padding: 16 },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: {
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  trendText: { fontSize: 11, fontWeight: 'bold' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#64748B' },

  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingBottom: 10, paddingTop: 10 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBar: { width: 24, backgroundColor: '#3B82F6', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartLbl: { fontSize: 11, color: '#64748B', marginTop: 8 },

  twoColSection: { marginBottom: 16 },
  sectionCardList: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  listItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rankBox: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { fontSize: 12, fontWeight: 'bold', color: NAVY },
  listInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listName: { fontSize: 14, color: '#334155', flex: 1, marginRight: 8 },
  listValue: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  barGroup: { marginBottom: 12 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 13, color: '#475569' },
  barVal: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  barBg: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  geoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  geoInfo: { flex: 1, marginLeft: 12 },
  geoCity: { fontSize: 14, color: '#334155' },
  geoVal: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingLabel: { width: 40, fontSize: 13, color: '#475569', flexDirection: 'row', alignItems: 'center' },
  ratingVal: { width: 40, fontSize: 12, color: '#64748B', textAlign: 'right' },

  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284C7', marginLeft: 8 },
  insightText: { fontSize: 14, color: '#0369A1', lineHeight: 22 },
});
