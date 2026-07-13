import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_COMPARISON = [
  { 
    id: 'PRV-001', 
    name: 'Elite Fixers', 
    verified: true, 
    rating: 4.9, 
    price: '₹3,500', 
    visitCharge: '₹200 (Waived)', 
    availability: 'Tomorrow, 10:30 AM', 
    estimatedTime: '2-3 Hours',
    warranty: '30 Days',
    reviews: 450
  },
  { 
    id: 'PRV-002', 
    name: 'Rapid Repairs', 
    verified: false, 
    rating: 4.5, 
    price: '₹3,000', 
    visitCharge: '₹150', 
    availability: 'Today, 04:00 PM', 
    estimatedTime: '4 Hours',
    warranty: 'None',
    reviews: 120
  },
  { 
    id: 'PRV-003', 
    name: 'SafeGuard Solutions', 
    verified: true, 
    rating: 4.8, 
    price: '₹3,800', 
    visitCharge: 'Free', 
    availability: '15 Jul, 09:00 AM', 
    estimatedTime: '2 Hours',
    warranty: '90 Days',
    reviews: 890
  }
];

export default function CompareProvidersPage({ request, onBack, onSelectProvider }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Compare Providers</Text>
          <Text style={styles.pageSubtitle}>For: {request?.title || 'Deep Kitchen Cleaning'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
            <View style={styles.table}>
              
              {/* Header Row (Providers) */}
              <View style={styles.tableRow}>
                <View style={[styles.tableCellHeader, styles.fixedCell]} />
                {MOCK_COMPARISON.map(provider => (
                  <View key={provider.id} style={[styles.tableCellHeader, styles.providerHeaderCell]}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.nameRow}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      {provider.verified && <ShieldCheck size={14} color="#16A34A" style={{ marginLeft: 4 }} />}
                    </View>
                  </View>
                ))}
              </View>

              {/* Data Rows */}
              {[
                { label: 'Rating', key: 'rating', render: (val) => (
                  <View style={styles.ratingRow}>
                    <Star size={14} color={GOLD} fill={GOLD} />
                    <Text style={styles.cellTextBold}>{val}</Text>
                  </View>
                )},
                { label: 'Quoted Price', key: 'price', render: (val) => <Text style={[styles.cellTextBold, { color: '#16A34A' }]}>{val}</Text> },
                { label: 'Visit Charge', key: 'visitCharge' },
                { label: 'Availability', key: 'availability' },
                { label: 'Completion Time', key: 'estimatedTime' },
                { label: 'Warranty', key: 'warranty' },
                { label: 'Total Reviews', key: 'reviews' },
              ].map((row, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.rowAlternate]}>
                  <View style={[styles.tableCell, styles.fixedCell]}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                  </View>
                  {MOCK_COMPARISON.map(provider => (
                    <View key={provider.id} style={styles.tableCell}>
                      {row.render ? row.render(provider[row.key]) : <Text style={styles.cellText}>{provider[row.key]}</Text>}
                    </View>
                  ))}
                </View>
              ))}

              {/* Actions Row */}
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.fixedCell]} />
                {MOCK_COMPARISON.map(provider => (
                  <View key={provider.id} style={styles.tableCell}>
                    <TouchableOpacity 
                      style={styles.selectBtn}
                      onPress={() => onSelectProvider(provider)}
                    >
                      <Text style={styles.selectBtnText}>Select Provider</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </View>
          </ScrollView>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 24 },

  tableScroll: { width: '100%' },
  table: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', minWidth: 800 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowAlternate: { backgroundColor: '#F8FAFC' },
  tableCellHeader: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1, borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  fixedCell: { width: 150, flex: 0, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff' },
  tableCell: { padding: 16, flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#F1F5F9' },

  providerHeaderCell: { gap: 8 },
  avatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900', color: NAVY },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  providerName: { fontSize: 15, fontWeight: '800', color: NAVY, textAlign: 'center' },

  rowLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  cellText: { fontSize: 14, color: NAVY, textAlign: 'center' },
  cellTextBold: { fontSize: 14, fontWeight: '700', color: NAVY, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  selectBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#16A34A', width: '100%', alignItems: 'center' },
  selectBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' }
});
