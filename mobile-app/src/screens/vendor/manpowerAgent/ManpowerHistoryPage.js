import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { History, Search, ChevronRight, X, CircleX as XCircle } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorRequirements, fetchVendorCandidatesApi } from '../../../services/api.service';

const NAVY = '#081A3A';
const BG = '#F8FAFC';

const toTitleCase = (str) => {
  if (!str) return 'Staff Requirement';
  if (str.toLowerCase() === 'chef') return 'Head Chef';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const formatReqId = (id) => {
  if (!id) return 'REQ-000';
  if (typeof id === 'string' && id.includes('-') && id.length > 20) {
    return `REQ-${id.slice(0, 5).toUpperCase()}`;
  }
  return String(id).startsWith('REQ') ? String(id) : `REQ-${id}`;
};

export default function ManpowerHistoryPage() {
  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const filters = ['All', 'Requirements', 'Candidates', 'Staff Records'];

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      const [reqRes, candRes] = await Promise.all([
        fetchVendorRequirements(supplierId || 'all'),
        fetchVendorCandidatesApi(supplierId || 'all')
      ]);

      const reqs = reqRes?.data || reqRes || [];
      const cands = candRes?.data || candRes || [];

      const reqItems = Array.isArray(reqs) ? reqs.map(r => ({
        id: formatReqId(r.id),
        type: 'Requirement',
        name: `${toTitleCase(r.role || r.title || 'Staff Requirement')} (${r.count || r.staffRequired || 1} Staff)`,
        business: `${r.businessName || 'Business Partner'} · ${r.location || 'Location Not Specified'}`,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recent',
        status: (r.status === 'candidates_sent' || r.status === 'Candidates Sent') ? 'Candidates Sent' : (r.status || 'Open'),
        details: `Requirement posted for ${r.role || 'Staffing'} at ${r.businessName || 'Business Partner'}. Salary: ${r.salary || 'Not specified'}. Status: ${r.status || 'Open'}.`,
        notes: r.description || 'No extra notes provided.'
      })) : [];

      const candItems = Array.isArray(cands) ? cands.map(c => ({
        id: c.id || `CAND-${Math.floor(Math.random()*9000+1000)}`,
        type: 'Candidate',
        name: `${c.name} (${c.role || 'Chef'})`,
        business: `Experience: ${c.experience || '1-3 Years'} · Expected: ${c.salary || '₹25,000 / mo'}`,
        date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Registered Profile',
        status: c.status || 'Active Profile',
        details: `Candidate profile registered under agency database. Role: ${c.role}. Experience: ${c.experience || '3 Years'}. Mobile: ${c.mobile || 'Confidential'}`,
        notes: `Mobile: ${c.mobile || 'N/A'}`
      })) : [];

      setHistoryList([...reqItems, ...candItems]);
    } catch (err) {
      console.warn('Failed to load history items:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryData();
  }, [supplierId]);

  const filteredHistory = historyList.filter(item => {
    // 1. Tab Filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Requirements' && item.type !== 'Requirement') return false;
      if (activeFilter === 'Candidates' && item.type !== 'Candidate') return false;
      if (activeFilter === 'Staff Records' && item.type !== 'Staff Record') return false;
    }
    // 2. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchBusiness = (item.business || '').toLowerCase().includes(q);
      const matchType = (item.type || '').toLowerCase().includes(q);
      const matchStatus = (item.status || '').toLowerCase().includes(q);
      if (!matchName && !matchBusiness && !matchType && !matchStatus) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>History</Text>
        <Text style={styles.pageSubtitle}>View previous manpower activities.</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748B" style={{marginRight: 8}} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search history..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}><X size={16} color="#64748B" /></TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={NAVY} />
            <Text style={{ fontSize: 13, color: '#64748B', marginTop: 12 }}>Loading history records...</Text>
          </View>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item, idx) => (
            <View key={idx} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.typeBadge}>
                  <History size={12} color={NAVY} style={{marginRight: 4}} />
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBusiness}>{item.business}</Text>
              </View>
              <View style={styles.cardFooter}>
                 <Text style={styles.statusText}>{item.status}</Text>
                <TouchableOpacity style={styles.detailsBtn} onPress={() => setSelectedItem(item)}>
                  <Text style={styles.detailsBtnText}>View Details</Text>
                  <ChevronRight size={14} color={NAVY} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={{ padding: 40, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12 }}>
            <History size={36} color="#94A3B8" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: NAVY, marginTop: 12, marginBottom: 4 }}>No History Found</Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center' }}>Requirements and candidate submissions will appear here automatically.</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={selectedItem !== null} animationType="fade" transparent onRequestClose={() => setSelectedItem(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedItem(null)}>
          <TouchableWithoutFeedback>
            <View style={styles.detailsModalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Activity Details</Text>
                <TouchableOpacity onPress={() => setSelectedItem(null)}><XCircle size={22} color="#64748B" /></TouchableOpacity>
              </View>

              {selectedItem && (
                <ScrollView style={styles.detailsModalBody}>
                  <View style={styles.detailHeaderBox}>
                    <View>
                      <Text style={styles.detailTitleId}>{selectedItem.id}</Text>
                      <Text style={styles.detailTitleType}>{selectedItem.type}</Text>
                    </View>
                    <View style={styles.statusBadgeModal}>
                      <Text style={styles.statusTextModal}>{selectedItem.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>General Information</Text>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Name/Role:</Text><Text style={styles.detailValue}>{selectedItem.name}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Business:</Text><Text style={styles.detailValue}>{selectedItem.business}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{selectedItem.date}</Text></View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Summary Logs</Text>
                    <Text style={styles.detailSummaryText}>{selectedItem.details}</Text>
                  </View>

                  <View style={[styles.detailSection, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>
                    <Text style={styles.detailNotesText}>{selectedItem.notes || 'No additional notes registered.'}</Text>
                  </View>

                  <View style={{ height: 20 }} />
                </ScrollView>
              )}

              <TouchableOpacity style={styles.btnDismissModal} onPress={() => setSelectedItem(null)}>
                <Text style={styles.btnDismissModalText}>Close Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: '#64748B' },
  
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchText: { color: '#94A3B8', fontSize: 14, marginLeft: 8 },
  
  filterContainer: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  historyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: 'bold', color: NAVY },
  dateText: { fontSize: 12, color: '#64748B' },
  
  cardBody: { marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  itemBusiness: { fontSize: 13, color: '#64748B' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  statusText: { fontSize: 13, fontWeight: '600', color: '#10B981' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsBtnText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  
  // Custom styles
  searchInput: { flex: 1, fontSize: 14, color: NAVY, paddingVertical: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  detailsModalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  detailsModalBody: { paddingVertical: 16 },
  detailHeaderBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailTitleId: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  detailTitleType: { fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 'bold', marginTop: 2 },
  statusBadgeModal: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#E0F2FE' },
  statusTextModal: { fontSize: 12, fontWeight: 'bold', color: '#0369A1' },
  detailSection: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 8 },
  detailSectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: '#64748B' },
  detailValue: { fontSize: 13, fontWeight: '600', color: NAVY },
  detailSummaryText: { fontSize: 14, color: NAVY, lineHeight: 20 },
  detailNotesText: { fontSize: 13, color: '#64748B', fontStyle: 'italic', lineHeight: 18 },
  btnDismissModal: { height: 48, backgroundColor: NAVY, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  btnDismissModalText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
