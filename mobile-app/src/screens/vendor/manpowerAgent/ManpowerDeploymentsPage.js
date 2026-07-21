import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, FlatList, TextInput } from 'react-native';
import { Briefcase, Calendar, Clock, MapPin, UserCheck, ChevronRight, X, Search, Building } from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_DEPLOYMENTS = [
  { 
    id: "DEP-9001", candidate: "Vikram Singh", role: "Sous Chef", business: "JW Marriott", reqId: "REQ-901",
    location: "Andheri West, Mumbai", joiningDate: "10 Jan 2026", type: "Full Time",
    status: "Working"
  },
  { 
    id: "DEP-9002", candidate: "Neha Gupta", role: "Store Manager", business: "Starbucks", reqId: "REQ-902",
    location: "Bandra, Mumbai", joiningDate: "18 Jul 2026", type: "Rotational",
    status: "Working"
  },
  { 
    id: "DEP-9003", candidate: "Ravi Kumar", role: "Bartender", business: "Olive Bar", reqId: "DIR-8001",
    location: "Khar, Mumbai", joiningDate: "01 Mar 2026", type: "Night Shift",
    status: "Left"
  },
  { 
    id: "DEP-9004", candidate: "Amit Patel", role: "Steward", business: "The Taj Mahal Palace", reqId: "REQ-905",
    location: "Colaba, Mumbai", joiningDate: "12 Dec 2025", type: "Full Time",
    status: "Completed"
  }
];

export default function ManpowerDeploymentsPage() {
  const [deployments, setDeployments] = useState(MOCK_DEPLOYMENTS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");
  
  // View Record State
  const [viewVisible, setViewVisible] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Working': return '#10B981'; // Green
      case 'Completed': return '#3B82F6'; // Blue
      case 'Left': return '#EF4444'; // Red
      default: return '#64748B'; // Gray
    }
  };

  const openView = (dep) => {
    setSelectedDep(dep);
    setViewVisible(true);
  };

  const filteredDeployments = deployments.filter(d => {
    const matchesTab = activeTab === 'All' || d.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      d.candidate.toLowerCase().includes(q) || 
      d.role.toLowerCase().includes(q) || 
      d.business.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const renderSummary = (label, count, color) => (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryCount, { color }]}>{count}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <UserCheck size={24} color={NAVY} />
          <Text style={styles.headerTitle}>Staff Records</Text>
        </View>
        <Text style={styles.headerSub}>Track staff currently working and completed assignments.</Text>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        {renderSummary("Working", deployments.filter(d => d.status === 'Working').length, "#10B981")}
        {renderSummary("Completed", deployments.filter(d => d.status === 'Completed').length, "#3B82F6")}
        {renderSummary("Left", deployments.filter(d => d.status === 'Left').length, "#EF4444")}
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search staff records..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {['All', 'Working', 'Completed', 'Left'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.filterChip, activeTab === tab && styles.filterChipActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredDeployments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No staff records found</Text>
            <Text style={styles.emptyDesc}>Staff records will appear here when candidates start working with HoReCa businesses.</Text>
          </View>
        )}
        renderItem={({item}) => (
          <View style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.recordAvatar}><Text style={styles.recordAvatarText}>{item.candidate.charAt(0)}</Text></View>
              <View style={styles.recordHeaderInfo}>
                <Text style={styles.recordName}>{item.candidate}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.recordBody}>
              <View style={styles.infoRow}><Briefcase size={14} color="#64748B" /><Text style={styles.infoText}>{item.role}</Text></View>
              <View style={styles.infoRow}><Building size={14} color="#64748B" /><Text style={styles.infoText}>{item.business}</Text></View>
              <View style={styles.infoRow}><MapPin size={14} color="#64748B" /><Text style={styles.infoText}>{item.location}</Text></View>
              <View style={styles.infoRow}><Calendar size={14} color="#64748B" /><Text style={styles.infoText}>Joined: {item.joiningDate}</Text></View>
              <View style={styles.infoRow}><Clock size={14} color="#64748B" /><Text style={styles.infoText}>{item.type}</Text></View>
            </View>

            <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => openView(item)}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ChevronRight size={16} color={NAVY} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* View Record Modal */}
      <Modal visible={viewVisible} animationType="fade" transparent={true} onRequestClose={() => setViewVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Staff Record Details</Text>
              <TouchableOpacity onPress={() => setViewVisible(false)} style={styles.modalCloseBtn}><X size={20} color="#1E293B" /></TouchableOpacity>
            </View>
            
            <ScrollView style={{padding: 16, maxHeight: 450}} showsVerticalScrollIndicator={false}>
              {selectedDep && (
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                     <View style={[styles.recordAvatar, {width: 48, height: 48, borderRadius: 24}]}><Text style={[styles.recordAvatarText, {fontSize: 20}]}>{selectedDep.candidate.charAt(0)}</Text></View>
                     <View style={{marginLeft: 12}}>
                       <Text style={[styles.recordName, {fontSize: 18}]}>{selectedDep.candidate}</Text>
                     </View>
                  </View>

                  <View style={styles.detailGrid}>
                     <View style={styles.detailItem}><Briefcase size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Job Role</Text><Text style={styles.detailValue}>{selectedDep.role}</Text></View></View>
                     <View style={styles.detailItem}><Building size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Business</Text><Text style={styles.detailValue}>{selectedDep.business}</Text></View></View>
                     <View style={styles.detailItem}><MapPin size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Location</Text><Text style={styles.detailValue}>{selectedDep.location}</Text></View></View>
                     <View style={styles.detailItem}><Calendar size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Joining Date</Text><Text style={styles.detailValue}>{selectedDep.joiningDate}</Text></View></View>
                     <View style={styles.detailItem}><Clock size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Job Type</Text><Text style={styles.detailValue}>{selectedDep.type}</Text></View></View>
                  </View>

                  <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>Current Status</Text>
                    <View style={[styles.statusBadge, { alignSelf: 'flex-start', backgroundColor: getStatusColor(selectedDep.status) + '15' }]}>
                      <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedDep.status) }]}>{selectedDep.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setViewVisible(false); showToast("View Candidate Profile under construction."); }}><Text style={styles.secondaryBtnText}>View Candidate Profile</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => { setViewVisible(false); showToast("Update Status under construction."); }}><Text style={styles.primaryBtnText}>Update Status</Text></TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, paddingTop: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  summarySection: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  summaryCard: { flex: 1, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  summaryCount: { fontSize: 24, fontWeight: 'bold' },
  summaryLabel: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '500' },

  searchSection: { padding: 16, paddingBottom: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingTop: 0, paddingBottom: 40 },
  
  recordCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  recordAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  recordHeaderInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 12 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  recordBody: { marginBottom: 16, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8 },

  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, justifyContent: 'flex-start' },
  viewDetailsText: { fontSize: 14, fontWeight: '600', color: NAVY, marginRight: 4 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  popupCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  popupTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalCloseBtn: { padding: 4 },

  detailGrid: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, gap: 16, marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailTextWrapper: { marginLeft: 12 },
  detailLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  statusSection: { marginBottom: 24, paddingHorizontal: 4 },
  statusSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },

  modalActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center' },
  primaryBtnText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
