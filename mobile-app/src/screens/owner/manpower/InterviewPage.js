import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, User, Building, Calendar, Clock, Video, FileText, CheckCircle, XCircle, CirclePause } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function InterviewPage({ interview, candidate, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  // Using passed interview or mock data
  const data = interview || {
    date: '15 Aug 2026',
    time: '11:00 AM',
    mode: 'Video Call (Zoom)',
    agency: 'Elite Staffing Co.',
    notes: 'Candidate needs to show menu planning portfolio.'
  };

  const candName = candidate ? candidate.name : 'Rajesh Kumar';
  const candRole = candidate ? candidate.role : 'Head Chef';

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Management</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interview Details</Text>
            
            <View style={styles.detailCard}>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <View style={styles.iconBox}><User size={16} color="#64748B" /></View>
                  <View>
                    <Text style={styles.label}>Candidate</Text>
                    <Text style={styles.value}>{candName} ({candRole})</Text>
                  </View>
                </View>
                <View style={styles.gridItem}>
                  <View style={styles.iconBox}><Building size={16} color="#64748B" /></View>
                  <View>
                    <Text style={styles.label}>Agency</Text>
                    <Text style={styles.value}>{data.agency}</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.gridRow, { marginTop: 16 }]}>
                <View style={styles.gridItem}>
                  <View style={styles.iconBox}><Calendar size={16} color="#64748B" /></View>
                  <View>
                    <Text style={styles.label}>Date & Time</Text>
                    <Text style={styles.value}>{data.date} at {data.time}</Text>
                  </View>
                </View>
                <View style={styles.gridItem}>
                  <View style={styles.iconBox}><Video size={16} color="#64748B" /></View>
                  <View>
                    <Text style={styles.label}>Mode</Text>
                    <Text style={styles.value}>{data.mode}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.notesBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                <FileText size={16} color="#475569" />
                <Text style={styles.notesTitle}>Notes / Instructions</Text>
              </View>
              <Text style={styles.notesText}>{data.notes}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Interview Decision</Text>
            <Text style={styles.decisionDesc}>Update the status of this candidate based on their interview performance.</Text>

            <View style={[styles.actionsRow, isMobile && { flexDirection: 'column' }]}>
              <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                <CheckCircle size={24} color="#16A34A" />
                <Text style={[styles.decisionBtnText, { color: '#16A34A' }]}>Selected</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <CirclePause size={24} color="#D97706" />
                <Text style={[styles.decisionBtnText, { color: '#D97706' }]}>On Hold</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                <XCircle size={24} color="#EF4444" />
                <Text style={[styles.decisionBtnText, { color: '#EF4444' }]}>Rejected</Text>
              </TouchableOpacity>
            </View>

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
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  
  detailCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  gridRow: { flexDirection: 'row', gap: 16 },
  gridItem: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  notesBox: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 16 },
  notesTitle: { fontSize: 13, fontWeight: '700', color: '#1E3A8A' },
  notesText: { fontSize: 14, color: '#1E40AF', lineHeight: 22 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 32 },

  decisionDesc: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  actionsRow: { flexDirection: 'row', gap: 16 },
  decisionBtn: { flex: 1, paddingVertical: 20, borderRadius: 16, borderWidth: 2, alignItems: 'center', gap: 12 },
  decisionBtnText: { fontSize: 16, fontWeight: '800' }
});
