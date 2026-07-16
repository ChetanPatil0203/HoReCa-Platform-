import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Users, Calendar, Clock, Pen, XCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { ALL_REQUIREMENTS } from '../../../constants/manpowerData';

const GOLD = '#D97706';
const BLUE = '#2563EB';

const TABS = ['All', 'Active', 'Responses', 'Shortlisted', 'Filled', 'Closed'];

const STATUS_COLORS = {
  'Active': { bg: '#DBEAFE', text: BLUE },
  'Responses': { bg: '#FEF3C7', text: GOLD },
  'Shortlisted': { bg: '#F3E8FF', text: '#9333EA' },
  'Filled': { bg: '#DCFCE7', text: '#16A34A' },
  'Closed': { bg: '#F1F5F9', text: '#64748B' }
};

export default function MyRequirementsPage({ onBack, onViewResponses }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const [activeTab, setActiveTab] = useState('All');

  const filteredReqs = ALL_REQUIREMENTS.filter(req => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Requirements</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContainer}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.cardsContainer}>
            {filteredReqs.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={40} color="#CBD5E1" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyTitle}>No requirements found</Text>
                <Text style={styles.emptySub}>You don't have any requirements in this status.</Text>
              </View>
            ) : (
              filteredReqs.map(req => {
                const sColor = STATUS_COLORS[req.status] || STATUS_COLORS['Closed'];
                
                return (
                  <View key={req.id} style={styles.reqCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.reqId}>{req.id}</Text>
                        <Text style={styles.reqRole}>{req.role}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
                        <Text style={[styles.statusText, { color: sColor.text }]}>{req.status}</Text>
                      </View>
                    </View>

                    <View style={[styles.cardBody, isMobile && { flexDirection: 'column', gap: 12 }]}>
                      <View style={styles.infoCol}>
                        <View style={styles.infoRow}>
                          <Users size={14} color="#64748B" />
                          <Text style={styles.infoText}>Required: <Text style={styles.boldText}>{req.staffRequired}</Text> Staff</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Calendar size={14} color="#64748B" />
                          <Text style={styles.infoText}>Joining: <Text style={styles.boldText}>{req.joiningDate}</Text></Text>
                        </View>
                      </View>

                      <View style={styles.infoCol}>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Salary:</Text>
                          <Text style={styles.boldText}>{req.salary}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Posted:</Text>
                          <Text style={styles.infoText}>{req.postedDate}</Text>
                        </View>
                      </View>

                      <View style={styles.responseCol}>
                        <Text style={styles.responseCount}>{req.responses}</Text>
                        <Text style={styles.responseLabel}>Agency{'\n'}Responses</Text>
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E2E8F0' }]}>
                        <Pen size={14} color="#64748B" />
                        <Text style={[styles.actionBtnText, { color: '#64748B' }]}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E2E8F0' }]}>
                        <XCircle size={14} color="#EF4444" />
                        <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.primaryActionBtn, req.responses === 0 && { opacity: 0.5 }]}
                        onPress={() => req.responses > 0 && onViewResponses(req)}
                        disabled={req.responses === 0}
                      >
                        <Text style={styles.primaryActionText}>View Responses</Text>
                        <ChevronRight size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
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
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%' },

  tabsScroll: { flexGrow: 0, marginBottom: 20 },
  tabsContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },

  cardsContainer: { gap: 16 },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 60, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B' },

  reqCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reqId: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  reqRole: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '800' },

  cardBody: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoCol: { flex: 1, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 13, color: '#64748B', width: 50 },
  infoText: { fontSize: 13, color: '#475569' },
  boldText: { fontWeight: '700', color: '#0F172A' },
  
  responseCol: { width: 100, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  responseCount: { fontSize: 24, fontWeight: '900', color: BLUE, marginBottom: 2 },
  responseLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', textAlign: 'center' },

  cardActions: { flexDirection: 'row', padding: 16, gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  primaryActionBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: 10, backgroundColor: BLUE },
  primaryActionText: { fontSize: 13, fontWeight: '800', color: '#fff' }
});
