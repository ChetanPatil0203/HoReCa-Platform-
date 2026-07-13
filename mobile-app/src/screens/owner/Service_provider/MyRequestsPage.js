import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Clock, DollarSign, Calendar, Tag, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

// MOCK DATA
const ALL_REQUESTS = [
  { id: 'REQ-1001', category: 'Cleaning', title: 'Deep Kitchen Cleaning', date: 'Tomorrow, 10:00 AM', budget: '₹5,000 - ₹8,000', status: 'Active', responseCount: 4 },
  { id: 'REQ-1002', category: 'Maintenance', title: 'HVAC Routine Check', date: '15 Jul, 02:30 PM', budget: '₹2,500 - ₹4,000', status: 'Responses', responseCount: 2 },
  { id: 'REQ-1003', category: 'Plumbing', title: 'Fix Leaking Pipe', date: 'Today, 04:00 PM', budget: '₹1,000 - ₹2,000', status: 'Scheduled', responseCount: 1 },
  { id: 'REQ-1004', category: 'Electrical', title: 'Rewiring Main DB', date: '10 Jun, 09:00 AM', budget: '₹15,000 - ₹20,000', status: 'Completed', responseCount: 5 },
  { id: 'REQ-1005', category: 'Pest Control', title: 'Restaurant Pest Control', date: '01 Jun, 11:00 AM', budget: '₹3,000', status: 'Cancelled', responseCount: 0 },
];

const STATUS_COLORS = {
  'Active': { bg: '#EFF6FF', text: '#2563EB' },
  'Responses': { bg: '#FEF3C7', text: '#D97706' },
  'Scheduled': { bg: '#F3E8FF', text: '#9333EA' },
  'Completed': { bg: '#DCFCE7', text: '#16A34A' },
  'Cancelled': { bg: '#FEF2F2', text: '#DC2626' }
};

export default function MyRequestsPage({ onBack, onViewResponses }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Active', 'Responses', 'Scheduled', 'Completed', 'Cancelled'];

  const filteredRequests = ALL_REQUESTS.filter(req => activeTab === 'All' || req.status === activeTab);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>My Requests</Text>
          <Text style={styles.pageSubtitle}>Manage your service requests and responses</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No requests found</Text>
              <Text style={styles.emptyDesc}>You have no requests matching the '{activeTab}' status.</Text>
            </View>
          ) : (
            filteredRequests.map(req => {
              const statusStyle = STATUS_COLORS[req.status] || STATUS_COLORS['Active'];
              return (
                <View key={req.id} style={styles.requestCard}>
                  <View style={styles.reqHeader}>
                    <View style={styles.reqIdBox}>
                      <Text style={styles.reqId}>{req.id}</Text>
                      <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: statusStyle.text }]}>{req.status}</Text>
                      </View>
                    </View>
                    {req.responseCount > 0 && (
                      <Text style={styles.responseCountText}>{req.responseCount} Responses</Text>
                    )}
                  </View>

                  <Text style={styles.reqTitle}>{req.title}</Text>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Tag size={14} color="#64748B" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{req.category}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Calendar size={14} color="#64748B" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{req.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarSign size={14} color="#64748B" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{req.budget}</Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity 
                      style={[styles.primaryBtn, req.responseCount === 0 && { opacity: 0.5 }]} 
                      disabled={req.responseCount === 0}
                      onPress={() => onViewResponses(req)}
                    >
                      <Text style={styles.primaryBtnText}>View Responses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn}>
                      <Text style={styles.secondaryBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.secondaryBtn, { borderColor: '#FECACA' }]}>
                      <Text style={[styles.secondaryBtnText, { color: '#DC2626' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
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
  tabsScroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 12, paddingTop: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  tabActive: { backgroundColor: NAVY },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 24 },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center' },

  requestCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reqIdBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reqId: { fontSize: 14, fontWeight: '800', color: '#64748B' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  responseCountText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

  reqTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 16 },
  
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { marginRight: 6 },
  metaText: { fontSize: 13, fontWeight: '500', color: '#475569' },

  actionsRow: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  primaryBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: NAVY, alignItems: 'center' },
  primaryBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  secondaryBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  secondaryBtnText: { fontSize: 13, fontWeight: '700', color: '#475569' }
});
