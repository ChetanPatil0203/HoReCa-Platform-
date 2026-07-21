import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { DollarSign, TrendingUp } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export default function VendorRevenuePage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <DollarSign size={24} color="#059669" />
          </View>
          <View>
            <Text style={styles.title}>Revenue Analytics</Text>
            <Text style={styles.subtitle}>Financial overview and growth</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Total Earnings (YTD)</Text>
            <View style={styles.growthBadge}>
              <TrendingUp size={14} color="#059669" />
              <Text style={styles.growthText}>+24.5%</Text>
            </View>
          </View>
          <Text style={styles.heroValue}>₹18,45,000</Text>
          <Text style={styles.heroSub}>Compared to ₹14,81,900 same period last year</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending Clearances</Text>
            <Text style={styles.statVal}>₹2,10,000</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Order Value</Text>
            <Text style={styles.statVal}>₹42,500</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#6EE7B7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  content: { gap: 16 },
  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' } }) },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 14, color: colors.muted, fontWeight: 'bold' },
  growthBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  growthText: { color: '#059669', fontSize: 12, fontWeight: 'bold' },
  heroValue: { fontSize: 40, fontWeight: '900', color: '#059669', marginBottom: 8 },
  heroSub: { fontSize: 13, color: colors.muted },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  statCard: { flex: 1, minWidth: 200, backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 13, color: colors.muted, marginBottom: 8 },
  statVal: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' }
});
