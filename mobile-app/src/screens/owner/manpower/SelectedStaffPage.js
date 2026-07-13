import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, User, Building, Calendar, Phone, MessageSquare, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { SELECTED_STAFF } from '../../../constants/manpowerData';

const BLUE = '#2563EB';

export default function SelectedStaffPage({ onBack, onRequestReplacement }) {
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
          <Text style={styles.headerTitle}>Selected Staff</Text>
          <Text style={styles.headerSub}>{SELECTED_STAFF.length} Hired Employees</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          <View style={[styles.grid, isMobile && { flexDirection: 'column' }]}>
            {SELECTED_STAFF.map(staff => (
              <View key={staff.id} style={[styles.staffCard, !isMobile && { width: '48%' }]}>
                
                <View style={styles.cardHeader}>
                  <View style={styles.photoBox}>
                    <Text style={styles.photoText}>{staff.photo}</Text>
                  </View>
                  <View style={styles.headerTextCol}>
                    <Text style={styles.staffName}>{staff.name}</Text>
                    <Text style={styles.staffRole}>{staff.role}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <CheckCircle size={14} color="#16A34A" />
                    <Text style={styles.statusText}>{staff.status}</Text>
                  </View>
                </View>

                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Building size={16} color="#64748B" />
                    <Text style={styles.detailText}><Text style={styles.boldText}>Agency:</Text> {staff.agency}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#64748B" />
                    <Text style={styles.detailText}><Text style={styles.boldText}>Joined:</Text> {staff.joiningDate}</Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Phone size={18} color="#0F172A" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MessageSquare size={18} color="#0F172A" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => onRequestReplacement(staff)}>
                    <Text style={styles.primaryBtnText}>Replace</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))}
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
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  staffCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  photoBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  photoText: { fontSize: 20, fontWeight: '800', color: '#64748B' },
  headerTextCol: { flex: 1, justifyContent: 'center', paddingTop: 4 },
  staffName: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  staffRole: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#16A34A' },

  detailsBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, gap: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#475569' },
  boldText: { fontWeight: '700', color: '#0F172A' },

  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#0F172A' }
});
