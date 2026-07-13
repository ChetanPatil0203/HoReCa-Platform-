import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, Briefcase, DollarSign, Clock, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { CANDIDATES } from '../../../constants/manpowerData';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function AvailableStaffPage({ onBack, onViewCandidate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Available Staff</Text>
          <Text style={styles.headerSub}>{CANDIDATES.length} Candidates</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {CANDIDATES.map(cand => (
            <View key={cand.id} style={styles.candidateCard}>
              
              <View style={styles.cardHeader}>
                <View style={styles.photoBox}>
                  <Text style={styles.photoText}>{cand.photo}</Text>
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={styles.candName}>{cand.name}</Text>
                  <Text style={styles.candRole}>{cand.role}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Star size={12} color={GOLD} fill={GOLD} />
                  <Text style={styles.ratingText}>{cand.rating}</Text>
                </View>
              </View>

              <View style={[styles.statsGrid, isMobile && { flexDirection: 'column' }]}>
                <View style={styles.statItem}>
                  <Briefcase size={16} color="#64748B" />
                  <Text style={styles.statText}><Text style={styles.boldText}>Exp:</Text> {cand.experience}</Text>
                </View>
                <View style={styles.statItem}>
                  <DollarSign size={16} color="#64748B" />
                  <Text style={styles.statText}><Text style={styles.boldText}>Salary:</Text> {cand.expectedSalary}</Text>
                </View>
                <View style={styles.statItem}>
                  <Clock size={16} color="#64748B" />
                  <Text style={styles.statText}><Text style={styles.boldText}>Avail:</Text> {cand.availability}</Text>
                </View>
              </View>

              <View style={styles.skillsSection}>
                <Text style={styles.skillsLabel}>Skills:</Text>
                <View style={styles.skillsRow}>
                  {cand.skills.map(s => (
                    <View key={s} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={[styles.cardFooter, isMobile && { flexDirection: 'column', gap: 12 }]}>
                <TouchableOpacity style={styles.viewProfileBtn} onPress={() => onViewCandidate(cand)}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.shortlistBtn, isMobile && { width: '100%' }]}>
                  <CheckCircle size={16} color="#16A34A" />
                  <Text style={styles.shortlistText}>Shortlist</Text>
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

  candidateCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  photoBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  photoText: { fontSize: 24, fontWeight: '800', color: '#64748B' },
  headerTextCol: { flex: 1, justifyContent: 'center', paddingTop: 4 },
  candName: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  candRole: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 13, fontWeight: '700', color: GOLD, marginLeft: 4 },

  statsGrid: { flexDirection: 'row', gap: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 20 },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#475569' },
  boldText: { fontWeight: '700', color: '#0F172A' },

  skillsSection: { marginBottom: 24 },
  skillsLabel: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#EFF6FF' },
  skillText: { fontSize: 12, fontWeight: '600', color: BLUE },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
  viewProfileBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  viewProfileText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  shortlistBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  shortlistText: { fontSize: 14, fontWeight: '700', color: '#16A34A' }
});
