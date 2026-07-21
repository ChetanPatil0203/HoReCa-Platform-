import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Calendar, RefreshCw, FileText, Eye, Check, Pen, XCircle, ChevronRight, Package, Clock } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';

// MOCK DATA
const ALL_REQUESTS = [
  { id: 'REQ-1001', category: 'Cleaning', title: 'Deep Kitchen Cleaning', date: 'Tomorrow, 10:00 AM', budget: '₹5,000 - ₹8,000', status: 'Active', responseCount: 4 },
  { id: 'REQ-1002', category: 'Maintenance', title: 'HVAC Routine Check', date: '15 Jul, 02:30 PM', budget: '₹2,500 - ₹4,000', status: 'Responses', responseCount: 2 },
  { id: 'REQ-1003', category: 'Plumbing', title: 'Fix Leaking Pipe', date: 'Today, 04:00 PM', budget: '₹1,000 - ₹2,000', status: 'Scheduled', responseCount: 1 },
  { id: 'REQ-1004', category: 'Electrical', title: 'Rewiring Main DB', date: '10 Jun, 09:00 AM', budget: '₹15,000 - ₹20,000', status: 'Completed', responseCount: 5 },
  { id: 'REQ-1005', category: 'Pest Control', title: 'Restaurant Pest Control', date: '01 Jun, 11:00 AM', budget: '₹3,000', status: 'Cancelled', responseCount: 0 },
];

const TABS = ['All', 'Active', 'Responses', 'Scheduled', 'Completed', 'Cancelled'];

const STATUS_COLORS = {
  'Active': { bg: '#E0F2FE', text: '#0284C7' },
  'Responses': { bg: '#FEF3C7', text: GOLD },
  'Scheduled': { bg: '#F3E8FF', text: '#9333EA' },
  'Completed': { bg: '#DCFCE7', text: '#16A34A' },
  'Cancelled': { bg: '#FEE2E2', text: '#DC2626' }
};

export default function MyRequestsPage({ onBack, onViewResponses }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRequests = ALL_REQUESTS.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchText.toLowerCase()) || 
      req.title.toLowerCase().includes(searchText.toLowerCase()) ||
      req.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Requests</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {/* Filters */}
          <View style={styles.filtersRow}>
            <View style={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search by ID, Category, or Title..."
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusScroll} contentContainerStyle={styles.statusTabs}>
            {TABS.map(status => (
              <TouchableOpacity 
                key={status} 
                style={[styles.statusTab, statusFilter === status && styles.statusTabActive]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[styles.statusTabText, statusFilter === status && styles.statusTabTextActive]}>{status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Requests List */}
          <View style={styles.ordersContainer}>
            {filteredRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Package size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyTitle}>No Requests Found</Text>
                <Text style={styles.emptySub}>Try adjusting your filters or search term.</Text>
              </View>
            ) : (
              filteredRequests.map(req => {
                const sColor = STATUS_COLORS[req.status] || STATUS_COLORS['Cancelled'];
                
                return (
                  <View key={req.id} style={styles.orderCard}>
                    
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.orderId}>{req.id}</Text>
                        <View style={styles.dateRow}>
                          <Calendar size={12} color="#64748B" />
                          <Text style={styles.orderDate}>{req.date}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
                        <Text style={[styles.statusText, { color: sColor.text }]}>{req.status}</Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <View style={styles.vendorRow}>
                        <View style={styles.vendorAvatar}>
                          <Text style={styles.vendorInitial}>{req.title.charAt(0)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.vendorName}>{req.title}</Text>
                          <Text style={styles.itemCount}>{req.category} • {req.responseCount} Responses</Text>
                        </View>
                        <Text style={styles.orderAmount}>{req.budget}</Text>
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, req.responseCount === 0 && { opacity: 0.5 }]} 
                        onPress={() => req.responseCount > 0 && onViewResponses(req)}
                        disabled={req.responseCount === 0}
                      >
                        <Eye size={14} color="#0F172A" />
                        <Text style={styles.actionBtnText}>View Responses</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E2E8F0' }]}>
                        <Pen size={14} color="#64748B" />
                        <Text style={[styles.actionBtnText, { color: '#64748B' }]}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#FFFBEB', borderColor: GOLD }]}
                      >
                        <XCircle size={14} color={GOLD} />
                        <Text style={[styles.actionBtnText, { color: GOLD }]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                )
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
  
  filtersRow: { marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  
  statusScroll: { flexGrow: 0, marginBottom: 20 },
  statusTabs: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  statusTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  statusTabActive: { backgroundColor: GOLD, borderColor: GOLD },
  statusTabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  statusTabTextActive: { color: '#fff' },

  ordersContainer: { gap: 16 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B' },

  orderCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  orderId: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderDate: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },

  cardBody: { padding: 16 },
  vendorRow: { flexDirection: 'row', alignItems: 'center' },
  vendorAvatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  vendorInitial: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  itemCount: { fontSize: 12, color: '#64748B' },
  orderAmount: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  cardActions: { flexDirection: 'row', padding: 16, paddingTop: 0, gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' }
});
