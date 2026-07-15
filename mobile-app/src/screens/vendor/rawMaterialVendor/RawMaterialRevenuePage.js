import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, Platform
} from 'react-native';
import {
  Download, Filter, IndianRupee, TrendingUp, Clock, AlertCircle, 
  ArrowUpRight, ArrowDownRight, CheckCircle, FileText, XCircle, Package
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const FILTERS = ['Week', 'Month', 'Quarter', 'Year', 'Custom'];

const SUMMARY_DATA = [
  { label: 'Total Earnings', value: '₹14.5L', icon: IndianRupee, color: '#10B981', trend: '+12%' },
  { label: 'Net Earnings', value: '₹12.1L', icon: TrendingUp, color: '#3B82F6', trend: '+8%' },
  { label: 'Pending Settlement', value: '₹1.8L', icon: Clock, color: '#F59E0B' },
  { label: 'Avg Order Value', value: '₹18,500', icon: IndianRupee, color: '#8B5CF6' },
  { label: 'Outstanding', value: '₹45,000', icon: AlertCircle, color: '#EF4444' },
  { label: 'Refunds', value: '₹12,000', icon: ArrowDownRight, color: '#64748B' },
];

const SETTLEMENTS = [
  { id: 'SET-9012', date: '14 Jul 2026', amount: '₹1,50,000', status: 'Completed' },
  { id: 'SET-9011', date: '10 Jul 2026', amount: '₹2,25,000', status: 'Completed' },
  { id: 'SET-9013', date: 'Pending', amount: '₹1,80,000', status: 'Pending' },
];

const PRODUCTS = [
  { name: 'Premium Basmati Rice', revenue: '₹4.5L', percent: '35%' },
  { name: 'Extra Virgin Olive Oil', revenue: '₹3.2L', percent: '25%' },
  { name: 'Atlantic Salmon', revenue: '₹1.8L', percent: '15%' },
];

export default function RawMaterialRevenuePage() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('Month');
  
  // Download Modal
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revenue</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setDownloadModalVisible(true)}>
            <Download size={20} color={NAVY} />
          </TouchableOpacity>
        </View>

        {/* Top Date Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map(f => (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f && styles.activeFilterChipText]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Summary Cards Grid */}
          <View style={styles.summaryGrid}>
            {SUMMARY_DATA.map((item, idx) => (
              <View key={idx} style={[styles.summaryCard, { width: (width - 48) / 2 }]}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.summaryIconBox, { backgroundColor: item.color + '15' }]}>
                    <item.icon size={18} color={item.color} />
                  </View>
                  {item.trend && (
                    <Text style={styles.trendText}>{item.trend}</Text>
                  )}
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Revenue Trend (Mock Chart) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Revenue Trend</Text>
              <TouchableOpacity><Text style={styles.linkText}>Details</Text></TouchableOpacity>
            </View>
            
            <View style={styles.mockChartContainer}>
              {/* Bars representing chart */}
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 40 }]} />
                <Text style={styles.chartLabel}>W1</Text>
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 80 }]} />
                <Text style={styles.chartLabel}>W2</Text>
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 60 }]} />
                <Text style={styles.chartLabel}>W3</Text>
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 110, backgroundColor: GOLD }]} />
                <Text style={styles.chartLabel}>W4</Text>
              </View>
            </View>
          </View>

          {/* Earnings Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
            
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Gross Sales</Text>
              <Text style={styles.breakdownValue}>₹14,50,000</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fees (8%)</Text>
              <Text style={styles.breakdownValueNegative}>- ₹1,16,000</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Taxes (GST)</Text>
              <Text style={styles.breakdownValueNegative}>- ₹72,500</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Refunds</Text>
              <Text style={styles.breakdownValueNegative}>- ₹12,000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownTotalLabel}>Net Earnings</Text>
              <Text style={styles.breakdownTotalValue}>₹12,49,500</Text>
            </View>
          </View>

          {/* Settlement History */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Settlements</Text>
              <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
            </View>
            
            {SETTLEMENTS.map((set) => (
              <View key={set.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordId}>{set.id}</Text>
                  <View style={[styles.statusBadge, set.status === 'Completed' ? styles.bgSuccess : styles.bgWarning]}>
                    <Text style={[styles.statusText, set.status === 'Completed' ? styles.textSuccess : styles.textWarning]}>{set.status}</Text>
                  </View>
                </View>
                <View style={styles.recordBody}>
                  <View>
                    <Text style={styles.recordLabel}>Date</Text>
                    <Text style={styles.recordValue}>{set.date}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.recordLabel}>Amount</Text>
                    <Text style={styles.recordAmount}>{set.amount}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Top Revenue Products */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Top Revenue Products</Text>
            {PRODUCTS.map((prod, idx) => (
              <View key={idx} style={styles.productRow}>
                <View style={styles.productIconBox}>
                  <Package size={20} color="#64748B" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                  <Text style={styles.productPercent}>{prod.percent} of Total</Text>
                </View>
                <Text style={styles.productRevenue}>{prod.revenue}</Text>
              </View>
            ))}
          </View>

          <View style={{height: 40}} />
        </ScrollView>

        {/* Download Action Modal */}
        <Modal visible={downloadModalVisible} transparent={true} animationType="slide">
          <View style={styles.sheetOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Download Reports</Text>
                <TouchableOpacity onPress={() => setDownloadModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.downloadOptionBtn}>
                <FileText size={24} color={NAVY} />
                <View style={styles.downloadOptionTextContainer}>
                  <Text style={styles.downloadOptionTitle}>Revenue Report</Text>
                  <Text style={styles.downloadOptionSub}>Detailed breakdown of sales and earnings</Text>
                </View>
                <Download size={20} color={NAVY} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.downloadOptionBtn}>
                <FileText size={24} color="#10B981" />
                <View style={styles.downloadOptionTextContainer}>
                  <Text style={styles.downloadOptionTitle}>Settlement Statement</Text>
                  <Text style={styles.downloadOptionSub}>Record of all bank transfers and payouts</Text>
                </View>
                <Download size={20} color="#10B981" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.downloadOptionBtn}>
                <FileText size={24} color="#F59E0B" />
                <View style={styles.downloadOptionTextContainer}>
                  <Text style={styles.downloadOptionTitle}>Tax Summary</Text>
                  <Text style={styles.downloadOptionSub}>GST and TDS deductions report</Text>
                </View>
                <Download size={20} color="#F59E0B" />
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  iconBtn: { padding: 8 },
  filterContainer: {
    backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  filterScroll: { paddingHorizontal: 16 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8,
  },
  activeFilterChip: { backgroundColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeFilterChipText: { color: '#FFFFFF' },
  scrollContent: { padding: 16 },
  
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: {
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  trendText: { fontSize: 12, color: '#10B981', fontWeight: 'bold' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  summaryLabel: { fontSize: 12, color: '#64748B' },

  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  linkText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
  
  mockChartContainer: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end',
    height: 140, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  mockBarCol: { alignItems: 'center' },
  mockBar: { width: 30, backgroundColor: '#3B82F6', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartLabel: { fontSize: 12, color: '#64748B', marginTop: 8 },

  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  breakdownLabel: { fontSize: 14, color: '#475569' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  breakdownValueNegative: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  breakdownTotalLabel: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  breakdownTotalValue: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },

  recordCard: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 12 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  recordId: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgWarning: { backgroundColor: '#FEF3C7' },
  textSuccess: { color: '#059669', fontSize: 11, fontWeight: '600' },
  textWarning: { color: '#D97706', fontSize: 11, fontWeight: '600' },
  recordBody: { flexDirection: 'row', justifyContent: 'space-between' },
  recordLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  recordValue: { fontSize: 14, color: NAVY, fontWeight: '500' },
  recordAmount: { fontSize: 15, fontWeight: 'bold', color: NAVY },

  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  productIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: NAVY, marginBottom: 2 },
  productPercent: { fontSize: 12, color: '#64748B' },
  productRevenue: { fontSize: 15, fontWeight: 'bold', color: NAVY },

  // Sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  downloadOptionBtn: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', 
    borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9'
  },
  downloadOptionTextContainer: { flex: 1, marginLeft: 16 },
  downloadOptionTitle: { fontSize: 16, fontWeight: '600', color: NAVY, marginBottom: 4 },
  downloadOptionSub: { fontSize: 12, color: '#64748B' },
});
