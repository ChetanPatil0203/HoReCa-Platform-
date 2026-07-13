import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Target, MonitorPlay, Calendar, Clock, CheckCircle, Presentation, Briefcase, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

const MOCK_REQUESTS = [
  { id: 'CMP-001', title: 'Summer Festival Promo', type: 'Social Media', date: '14 Jul, 10:30 AM', budget: '₹50,000/mo', status: 'Responses', responses: 5 },
  { id: 'CMP-002', title: 'New Menu Launch', type: 'Outdoor Branding', date: '12 Jul, 02:15 PM', budget: '₹1,20,000', status: 'Running', responses: 3 },
  { id: 'CMP-003', title: 'Website SEO', type: 'Digital Marketing', date: '10 Jul, 09:00 AM', budget: '₹25,000/mo', status: 'Completed', responses: 4 },
  { id: 'CMP-004', title: 'Radio Jingles', type: 'Offline Marketing', date: '08 Jul, 11:45 AM', budget: '₹40,000', status: 'Cancelled', responses: 0 },
];

export default function CampaignRequestsPage({ onBack, onViewResponses, onTrack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Responses', 'Running', 'Completed', 'Cancelled'];

  const filteredRequests = MOCK_REQUESTS.filter(req => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Campaign Requests</Text>
          <Text style={styles.pageSubtitle}>Manage your marketing requirements and proposals</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {filteredRequests.map(req => (
            <View key={req.id} style={styles.requestCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.requestId}>{req.id}</Text>
                  <View style={[styles.statusBadge, 
                    req.status === 'Completed' ? styles.statusCompleted : 
                    req.status === 'Running' ? styles.statusRunning : 
                    req.status === 'Cancelled' ? styles.statusCancelled : styles.statusResponses
                  ]}>
                    <Text style={[styles.statusText, 
                      req.status === 'Completed' ? styles.statusTextCompleted : 
                      req.status === 'Running' ? styles.statusTextRunning : 
                      req.status === 'Cancelled' ? styles.statusTextCancelled : styles.statusTextResponses
                    ]}>{req.status}</Text>
                  </View>
                </View>
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.requestType}>{req.type}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Calendar size={14} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.infoText}>{req.date}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Briefcase size={14} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.infoText}>{req.budget}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.responsesCount}>
                  <Text style={styles.responsesCountText}>{req.responses} Responses</Text>
                </View>
                {req.status === 'Running' || req.status === 'Completed' ? (
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => onTrack(req)}
                  >
                    <Text style={styles.actionBtnText}>Track Campaign</Text>
                    <ChevronRight size={16} color={NAVY} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => onViewResponses(req)}
                  >
                    <Text style={styles.actionBtnText}>View Responses</Text>
                    <ChevronRight size={16} color={NAVY} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {filteredRequests.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No campaigns found for this status.</Text>
            </View>
          )}

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
  
  tabsContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabsScroll: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 12, gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  tabBtnActive: { backgroundColor: NAVY, borderColor: NAVY },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%', gap: 20 },

  requestCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  cardHeader: { marginBottom: 16 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  requestId: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusResponses: { backgroundColor: '#EFF6FF' },
  statusTextResponses: { color: '#2563EB', fontSize: 11, fontWeight: '700' },
  statusRunning: { backgroundColor: '#F3E8FF' },
  statusTextRunning: { color: '#9333EA', fontSize: 11, fontWeight: '700' },
  statusCompleted: { backgroundColor: '#DCFCE7' },
  statusTextCompleted: { color: '#16A34A', fontSize: 11, fontWeight: '700' },
  statusCancelled: { backgroundColor: '#FEF2F2' },
  statusTextCancelled: { color: '#DC2626', fontSize: 11, fontWeight: '700' },

  requestTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  requestType: { fontSize: 14, color: '#64748B' },

  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, fontWeight: '600', color: NAVY },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  responsesCount: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  responsesCountText: { fontSize: 13, fontWeight: '800', color: '#2563EB' },
  
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: NAVY, marginRight: 4 },

  emptyState: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: '#64748B' }
});
