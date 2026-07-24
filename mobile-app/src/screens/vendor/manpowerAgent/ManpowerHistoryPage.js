import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { History, Search, ChevronRight, X, XCircle } from 'lucide-react-native';

const NAVY = '#081A3A';
const BG = '#F8FAFC';

const MOCK_HISTORY = [];

export default function ManpowerHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const filters = ['All', 'Requirements', 'Candidates', 'Staff Records'];

  const filteredHistory = MOCK_HISTORY.filter(item => {
    // 1. Tab Filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Requirements' && item.type !== 'Requirement') return false;
      if (activeFilter === 'Candidates' && item.type !== 'Candidate') return false;
      if (activeFilter === 'Staff Records' && item.type !== 'Staff Record') return false;
    }
    // 2. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBusiness = item.business.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      const matchStatus = item.status.toLowerCase().includes(q);
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
        {filteredHistory.map(item => (
          <View key={item.id} style={styles.historyCard}>
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
        ))}
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
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, paddingBottom: 8 },
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
