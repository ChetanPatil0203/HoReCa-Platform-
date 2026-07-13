import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, ShieldCheck, Clock, CheckCircle, Info } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_RESPONSES = [
  { 
    id: 'RSP-001', 
    providerName: 'Elite Fixers', 
    verified: true, 
    rating: 4.9, 
    quotedPrice: '₹3,500', 
    visitCharge: '₹200 (Waived on hire)', 
    availability: 'Tomorrow, 10:30 AM', 
    warranty: '30 Days', 
    estimatedTime: '2-3 Hours' 
  },
  { 
    id: 'RSP-002', 
    providerName: 'Rapid Repairs', 
    verified: false, 
    rating: 4.5, 
    quotedPrice: '₹3,000', 
    visitCharge: '₹150', 
    availability: 'Today, 04:00 PM', 
    warranty: 'None', 
    estimatedTime: '4 Hours' 
  },
  { 
    id: 'RSP-003', 
    providerName: 'SafeGuard Solutions', 
    verified: true, 
    rating: 4.8, 
    quotedPrice: '₹3,800', 
    visitCharge: 'Free', 
    availability: '15 Jul, 09:00 AM', 
    warranty: '90 Days', 
    estimatedTime: '2 Hours' 
  }
];

export default function ProviderResponsesPage({ request, onBack, onCompare, onAccept }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Provider Responses</Text>
          <Text style={styles.pageSubtitle}>For: {request?.title || 'Deep Kitchen Cleaning'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {MOCK_RESPONSES.map(resp => (
            <View key={resp.id} style={styles.responseCard}>
              <View style={styles.resHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{resp.providerName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.providerName}>{resp.providerName}</Text>
                    {resp.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 4 }} />}
                  </View>
                  <View style={styles.ratingRow}>
                    <Star size={14} color={GOLD} fill={GOLD} />
                    <Text style={styles.ratingText}>{resp.rating} Rating</Text>
                  </View>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>Quoted Price</Text>
                  <Text style={styles.quotedPrice}>{resp.quotedPrice}</Text>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Visit Charge</Text>
                  <Text style={styles.detailValue}>{resp.visitCharge}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Availability</Text>
                  <Text style={styles.detailValue}>{resp.availability}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Warranty</Text>
                  <Text style={styles.detailValue}>{resp.warranty}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Est. Completion</Text>
                  <Text style={styles.detailValue}>{resp.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E2E8F0' }]}>
                  <Text style={[styles.actionBtnText, { color: NAVY }]}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, { borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }]}
                  onPress={() => onCompare()}
                >
                  <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>Compare</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[styles.actionBtn, { borderColor: '#FECACA' }]}>
                  <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#16A34A', borderColor: '#16A34A' }]}
                  onPress={() => onAccept(resp)}
                >
                  <Text style={[styles.actionBtnText, { color: '#fff' }]}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

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
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 24 },

  responseCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  resHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '900', color: NAVY },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  providerName: { fontSize: 18, fontWeight: '800', color: NAVY },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#64748B', marginLeft: 6 },
  priceCol: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  quotedPrice: { fontSize: 20, fontWeight: '900', color: '#16A34A' },

  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  detailItem: { flex: 1, minWidth: '45%', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12 },
  detailLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '700', color: NAVY },

  actionsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '700' }
});
