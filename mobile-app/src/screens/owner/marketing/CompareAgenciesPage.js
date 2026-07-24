import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, Award, Zap, Camera, ShieldCheck, Check } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const COMPARE_DATA = {
  features: [
    { key: 'rating', label: 'Rating' },
    { key: 'price', label: 'Price (Monthly)' },
    { key: 'reach', label: 'Estimated Reach' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'experience', label: 'Experience' },
    { key: 'portfolio', label: 'Portfolio Rating' },
  ],
  agencies: []
};

export default function CompareAgenciesPage({ onBack, onAccept }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'Best Price': return { bg: '#DCFCE7', text: '#16A34A', icon: <Zap size={10} color="#16A34A" /> };
      case 'Highest Reach': return { bg: '#FEF3C7', text: '#D97706', icon: <Star size={10} color="#D97706" /> };
      case 'Fastest Delivery': return { bg: '#EFF6FF', text: '#2563EB', icon: <Zap size={10} color="#2563EB" /> };
      case 'Best Portfolio': return { bg: '#F3E8FF', text: '#9333EA', icon: <Camera size={10} color="#9333EA" /> };
      default: return { bg: '#F1F5F9', text: '#64748B', icon: null };
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Compare Agencies</Text>
          <Text style={styles.pageSubtitle}>Side-by-side proposal comparison</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
          <View style={styles.tableWrapper}>
            
            {/* Table Header row */}
            <View style={styles.headerRow}>
              <View style={[styles.colHeader, styles.featureCol]} />
              {COMPARE_DATA.agencies.map(agency => (
                <View key={agency.id} style={styles.colHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{agency.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.agencyName} numberOfLines={1}>{agency.name}</Text>
                  
                  <View style={styles.badgesWrapper}>
                    {agency.badges.map(b => {
                      const bStyle = getBadgeStyle(b);
                      return (
                        <View key={b} style={[styles.badge, { backgroundColor: bStyle.bg }]}>
                          {bStyle.icon}
                          <Text style={[styles.badgeText, { color: bStyle.text }]}>{b}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            {/* Feature Rows */}
            {COMPARE_DATA.features.map((feature, idx) => (
              <View key={feature.key} style={[styles.row, idx % 2 === 0 && styles.rowAlt]}>
                <View style={[styles.cell, styles.featureCol]}>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </View>
                {COMPARE_DATA.agencies.map(agency => (
                  <View key={`${agency.id}-${feature.key}`} style={styles.cell}>
                    {feature.key === 'rating' ? (
                      <View style={styles.ratingBox}>
                        <Star size={14} color={GOLD} fill={GOLD} style={{ marginRight: 4 }} />
                        <Text style={styles.cellValueBold}>{agency[feature.key]}</Text>
                      </View>
                    ) : feature.key === 'price' ? (
                      <Text style={styles.priceValue}>{agency[feature.key]}</Text>
                    ) : (
                      <Text style={styles.cellValue}>{agency[feature.key]}</Text>
                    )}
                  </View>
                ))}
              </View>
            ))}

            {/* Action Row */}
            <View style={styles.actionRow}>
              <View style={[styles.cell, styles.featureCol]} />
              {COMPARE_DATA.agencies.map(agency => (
                <View key={`action-${agency.id}`} style={styles.cell}>
                  <TouchableOpacity style={styles.selectBtn} onPress={() => onAccept(agency)}>
                    <Check size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.selectBtnText}>Select</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

          </View>
        </ScrollView>
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
  tableScroll: { padding: 24 },
  tableWrapper: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 24, backgroundColor: '#F8FAFC' },
  colHeader: { width: 220, alignItems: 'center', paddingHorizontal: 16 },
  featureCol: { width: 180, alignItems: 'flex-start', justifyContent: 'center' },
  
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  avatarText: { fontSize: 24, fontWeight: '900', color: NAVY },
  agencyName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 12, textAlign: 'center' },
  
  badgesWrapper: { alignItems: 'center', gap: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', marginLeft: 4 },

  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowAlt: { backgroundColor: '#F8FAFC' },
  cell: { width: 220, paddingVertical: 16, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  
  featureLabel: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  cellValue: { fontSize: 14, color: NAVY, fontWeight: '600', textAlign: 'center' },
  cellValueBold: { fontSize: 15, fontWeight: '800', color: NAVY },
  priceValue: { fontSize: 16, fontWeight: '900', color: '#16A34A' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },

  actionRow: { flexDirection: 'row', paddingVertical: 24, backgroundColor: '#fff' },
  selectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  selectBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' }
});
