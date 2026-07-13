import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, ShieldCheck, Star, Users, DollarSign, Clock, XCircle, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { ALL_RESPONSES } from '../../../constants/manpowerData';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function AgencyResponsesPage({ requirement, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  // Using ALL_RESPONSES as mock data for whatever requirement is passed
  const responses = ALL_RESPONSES;

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Agency Responses</Text>
          <Text style={styles.headerSub}>{requirement ? requirement.id : 'Responses'}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {responses.map(res => (
            <View key={res.id} style={styles.agencyCard}>
              
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.agencyLogo}>
                  <Text style={styles.agencyLogoText}>{res.agencyName.charAt(0)}</Text>
                </View>
                <View style={styles.headerTextCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.agencyName}>{res.agencyName}</Text>
                    {res.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 6 }} />}
                  </View>
                  <View style={styles.ratingRow}>
                    <Star size={14} color={GOLD} fill={GOLD} />
                    <Text style={styles.ratingText}>{res.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewAgencyBtn}>
                  <Text style={styles.viewAgencyText}>View Agency</Text>
                </TouchableOpacity>
              </View>

              {/* Card Body (Grid) */}
              <View style={styles.cardBody}>
                <View style={styles.gridRow}>
                  <View style={styles.gridItem}>
                    <View style={styles.gridIconBox}><Users size={16} color="#64748B" /></View>
                    <View>
                      <Text style={styles.gridLabel}>Candidates</Text>
                      <Text style={styles.gridValue}>{res.candidatesOffered} Offered</Text>
                    </View>
                  </View>
                  <View style={styles.gridItem}>
                    <View style={styles.gridIconBox}><DollarSign size={16} color="#64748B" /></View>
                    <View>
                      <Text style={styles.gridLabel}>Service Charge</Text>
                      <Text style={styles.gridValue}>{res.serviceCharge}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.gridRow, { marginTop: 16 }]}>
                  <View style={styles.gridItem}>
                    <View style={styles.gridIconBox}><ShieldCheck size={16} color="#64748B" /></View>
                    <View>
                      <Text style={styles.gridLabel}>Replacement</Text>
                      <Text style={styles.gridValue}>{res.replacementPeriod}</Text>
                    </View>
                  </View>
                  <View style={styles.gridItem}>
                    <View style={styles.gridIconBox}><Clock size={16} color="#64748B" /></View>
                    <View>
                      <Text style={styles.gridLabel}>Joining Time</Text>
                      <Text style={styles.gridValue}>{res.joiningTime}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Card Footer */}
              <View style={[styles.cardFooter, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <View style={styles.actionGroup}>
                  <TouchableOpacity style={styles.rejectBtn}>
                    <XCircle size={16} color="#EF4444" />
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortlistBtn}>
                    <CheckCircle size={16} color="#16A34A" />
                    <Text style={styles.shortlistText}>Shortlist</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.viewCandidatesBtn, isMobile && { width: '100%' }]}>
                  <Text style={styles.viewCandidatesText}>View Candidates ({res.candidatesOffered})</Text>
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
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  agencyCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  agencyLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  agencyLogoText: { fontSize: 24, fontWeight: '900', color: BLUE },
  headerTextCol: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  agencyName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 13, fontWeight: '700', color: GOLD, marginLeft: 4 },
  viewAgencyBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  viewAgencyText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  cardBody: { padding: 20 },
  gridRow: { flexDirection: 'row', gap: 16 },
  gridItem: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  gridIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  gridLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  gridValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  actionGroup: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  rejectText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  shortlistBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  shortlistText: { fontSize: 13, fontWeight: '700', color: '#16A34A' },
  viewCandidatesBtn: { backgroundColor: '#0F172A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  viewCandidatesText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
