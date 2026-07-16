import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, Briefcase, DollarSign, FileText, CheckCircle, Calendar, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function CandidateProfilePage({ candidate, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  if (!candidate) return null;

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidate Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerBg} />
          <View style={[styles.bannerContent, !isMobile && styles.contentLayoutWeb]}>
            <View style={styles.profileRow}>
              <View style={styles.photoLg}>
                <Text style={styles.photoTextLg}>{candidate.photo}</Text>
              </View>
              <View style={styles.profileTextCol}>
                <Text style={styles.nameLg}>{candidate.name}</Text>
                <Text style={styles.roleLg}>{candidate.role}</Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color={GOLD} fill={GOLD} />
                  <Text style={styles.ratingTextLg}>{candidate.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Key Info Grid */}
          <View style={[styles.statsGrid, isMobile && { flexDirection: 'column' }]}>
            <View style={styles.statCard}>
              <Briefcase size={20} color={BLUE} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{candidate.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <DollarSign size={20} color="#16A34A" />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{candidate.expectedSalary}</Text>
                <Text style={styles.statLabel}>Expected Salary</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <ShieldCheck size={20} color="#9333EA" />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>Verified</Text>
                <Text style={styles.statLabel}>Background</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Professional Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Previous Employer</Text>
              <Text style={styles.detailValue}>{candidate.previousEmployer}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Availability</Text>
              <Text style={styles.detailValue}>{candidate.availability}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.subTitle}>Skills</Text>
            <View style={styles.tagsRow}>
              {candidate.skills.map(s => (
                <View key={s} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.subTitle, { marginTop: 20 }]}>Languages</Text>
            <View style={styles.tagsRow}>
              {candidate.languages.map(l => (
                <View key={l} style={[styles.tagBadge, { backgroundColor: '#F1F5F9' }]}>
                  <Text style={[styles.tagText, { color: '#475569' }]}>{l}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Verified Documents</Text>
            <View style={styles.docItem}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.docText}>Aadhar Card (Verified)</Text>
              <CheckCircle size={16} color="#16A34A" />
            </View>
            <View style={styles.docItem}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.docText}>Previous Experience Letter</Text>
              <CheckCircle size={16} color="#16A34A" />
            </View>
          </View>

          {/* Actions */}
          <View style={[styles.actionsRow, isMobile && { flexWrap: 'wrap' }]}>
            <TouchableOpacity style={[styles.secondaryBtn, { minWidth: '45%' }]}>
              <CheckCircle size={18} color="#16A34A" />
              <Text style={[styles.secondaryBtnText, { color: '#16A34A' }]}>Shortlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { minWidth: '45%', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.secondaryBtnText, { color: BLUE }]}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { minWidth: '45%', backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <Text style={[styles.secondaryBtnText, { color: '#D97706' }]}>Hold</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { minWidth: '45%', backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <Text style={[styles.secondaryBtnText, { color: '#DC2626' }]}>Reject</Text>
            </TouchableOpacity>
          </View>

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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 20 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  bannerContainer: { backgroundColor: '#0F172A', paddingTop: 32, paddingBottom: 32 },
  bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundColor: '#10B981' },
  bannerContent: { paddingHorizontal: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  photoLg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  photoTextLg: { fontSize: 32, fontWeight: '900', color: '#0F172A' },
  profileTextCol: { flex: 1 },
  nameLg: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  roleLg: { fontSize: 15, color: '#CBD5E1', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  ratingTextLg: { fontSize: 13, fontWeight: '700', color: GOLD, marginLeft: 6 },

  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  statTextCol: { flex: 1 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },

  cardSection: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 14, color: '#64748B' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  divider: { height: 1, backgroundColor: 'transparent', marginVertical: 8 },
  
  subTitle: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EFF6FF' },
  tagText: { fontSize: 13, fontWeight: '600', color: BLUE },

  docItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  docText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0F172A', marginLeft: 12 },

  actionsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  primaryBtn: { flex: 2, flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: BLUE, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' }
});
