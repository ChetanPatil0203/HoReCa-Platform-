import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, ShieldCheck, Download, Users, Target, Activity, CheckCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_RESPONSES = [
  { 
    id: 'RESP-01', agencyName: 'Creative Minds', rating: 4.9, verified: true, 
    budget: '₹45,000/mo', reach: '500K - 1M Impressions', timeline: '3 Months', 
    strategy: 'Focus on Meta Ads with influencer tie-ups for initial push.', 
    roi: '3.5x - 4x'
  },
  { 
    id: 'RESP-02', agencyName: 'BrandBoosters', rating: 5.0, verified: true, 
    budget: '₹60,000/mo', reach: '1M+ Impressions', timeline: 'Ongoing', 
    strategy: 'Aggressive Google Search Ads + Instagram Reels organic push.', 
    roi: '5x'
  },
  { 
    id: 'RESP-03', agencyName: 'Digital Dynamics', rating: 4.7, verified: true, 
    budget: '₹30,000/mo', reach: '200K Impressions', timeline: '1 Month', 
    strategy: 'Local SEO and hyper-local Facebook ads.', 
    roi: '2x'
  }
];

export default function AgencyResponsesPage({ request, onBack, onCompare, onAccept }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const title = request?.title || 'Summer Festival Promo';
  const reqId = request?.id || 'CMP-001';

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Agency Responses</Text>
            <Text style={styles.pageSubtitle}>{title} • {reqId}</Text>
          </View>
        </View>
        {!isMobile && (
          <TouchableOpacity style={styles.compareBtnTop} onPress={onCompare}>
            <Activity size={16} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.compareBtnTopText}>Compare Agencies</Text>
          </TouchableOpacity>
        )}
      </View>

      {isMobile && (
        <View style={styles.mobileCompareBar}>
          <TouchableOpacity style={styles.compareBtnTop} onPress={onCompare}>
            <Activity size={16} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={styles.compareBtnTopText}>Compare Agencies</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {MOCK_RESPONSES.map(resp => (
            <View key={resp.id} style={styles.responseCard}>
              
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{resp.agencyName.charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.agencyName} numberOfLines={1}>{resp.agencyName}</Text>
                    {resp.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 6 }} />}
                  </View>
                  <View style={styles.ratingBox}>
                    <Star size={12} color={GOLD} fill={GOLD} style={{ marginRight: 4 }} />
                    <Text style={styles.ratingText}>{resp.rating}</Text>
                  </View>
                </View>
                <Text style={styles.budgetText}>{resp.budget}</Text>
              </View>

              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Users size={16} color="#64748B" style={{ marginBottom: 6 }} />
                  <Text style={styles.metricValue}>{resp.reach}</Text>
                  <Text style={styles.metricLabel}>Expected Reach</Text>
                </View>
                <View style={styles.metricBox}>
                  <Target size={16} color="#64748B" style={{ marginBottom: 6 }} />
                  <Text style={styles.metricValue}>{resp.roi}</Text>
                  <Text style={styles.metricLabel}>Estimated ROI</Text>
                </View>
                <View style={styles.metricBox}>
                  <Clock size={16} color="#64748B" style={{ marginBottom: 6 }} />
                  <Text style={styles.metricValue}>{resp.timeline}</Text>
                  <Text style={styles.metricLabel}>Timeline</Text>
                </View>
              </View>

              <View style={styles.strategyBox}>
                <Text style={styles.strategyTitle}>Strategy Summary</Text>
                <Text style={styles.strategyText}>{resp.strategy}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Download size={14} color={NAVY} style={{ marginRight: 6 }} />
                  <Text style={styles.downloadBtnText}>View Proposal</Text>
                </TouchableOpacity>
                <View style={styles.flexActions}>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: '#FECACA', marginRight: 12 }]}>
                    <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: NAVY, borderColor: NAVY }]} onPress={() => onAccept(resp)}>
                    <Text style={[styles.actionBtnText, { color: '#fff' }]}>Accept Proposal</Text>
                  </TouchableOpacity>
                </View>
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
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  mobileCompareBar: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  compareBtnTop: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' },
  compareBtnTopText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 900, alignSelf: 'center', width: '100%', gap: 24 },

  responseCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '900', color: NAVY },
  headerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  agencyName: { fontSize: 18, fontWeight: '800', color: NAVY, flexShrink: 1 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  budgetText: { fontSize: 18, fontWeight: '900', color: '#16A34A' },

  metricsGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 20, flexWrap: 'wrap', gap: 16 },
  metricBox: { flex: 1, minWidth: 100 },
  metricValue: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#64748B' },

  strategyBox: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 24 },
  strategyTitle: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 8 },
  strategyText: { fontSize: 14, color: '#92400E', lineHeight: 20 },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  downloadBtnText: { fontSize: 13, fontWeight: '700', color: NAVY },
  flexActions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
  actionBtnText: { fontSize: 14, fontWeight: '700' }
});
