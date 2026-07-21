import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, FlatList, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { 
  UserRoundCheck, 
  CircleCheck, 
  UserRoundX, 
  Search, 
  SlidersHorizontal, 
  BriefcaseBusiness, 
  Building2, 
  MapPin, 
  CalendarDays, 
  ChevronRight, 
  X,
  UserRoundSearch
} from 'lucide-react-native';

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
    status: "Left Job"
  },
  { 
    id: "DEP-9004", candidate: "Amit Patel", role: "Steward", business: "The Taj Mahal Palace", reqId: "REQ-905",
    location: "Colaba, Mumbai", joiningDate: "12 Dec 2025", type: "Full Time",
    status: "Completed"
  }
];

  export default function ManpowerDeploymentsPage() {
  const { width } = useWindowDimensions();
  const summaryGridGap = 12;
  const summaryCardWidth = (width - 32 - summaryGridGap) / 2;
  
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
      case 'Left Job': return '#EF4444'; // Red
      default: return '#64748B'; // Gray
    }
  };

  const getStatusIcon = (status, size=14, color) => {
    switch(status) {
      case 'Working': return <UserRoundCheck size={size} color={color || '#10B981'} />;
      case 'Completed': return <CircleCheck size={size} color={color || '#3B82F6'} />;
      case 'Left Job': return <UserRoundX size={size} color={color || '#EF4444'} />;
      default: return null;
    }
  };

  const openView = (dep) => {
    setSelectedDep(dep);
    setViewVisible(true);
  };

  const updateStatus = (newStatus) => {
    setDeployments(prev => prev.map(d => d.id === selectedDep.id ? { ...d, status: newStatus } : d));
    setViewVisible(false);
    showToast(`Status updated to ${newStatus}`);
  };

  const filteredDeployments = deployments.filter(d => {
    const matchesTab = activeTab === 'All' || d.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      d.candidate.toLowerCase().includes(q) || 
      d.role.toLowerCase().includes(q) || 
      d.business.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const workingCount = deployments.filter(d => d.status === 'Working').length;
  const completedCount = deployments.filter(d => d.status === 'Completed').length;
  const leftJobCount = deployments.filter(d => d.status === 'Left Job').length;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDeployments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <UserRoundCheck size={24} color={NAVY} />
                <Text style={styles.headerTitle}>Staff Records</Text>
              </View>
              <Text style={styles.headerSub}>Track staff currently working and completed assignments.</Text>
            </View>

            {/* Staff Overview */}
            <View style={styles.summaryGrid}>
              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveTab('All')}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Total Staff</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#F8FAFC' }]}>
                    <UserRoundSearch size={20} color={NAVY} strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewCount}>{deployments.length}</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveTab('Working')}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Working</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <UserRoundCheck size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewCount}>{workingCount}</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveTab('Completed')}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Completed</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <CircleCheck size={20} color="#3B82F6" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewCount}>{completedCount}</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveTab('Left Job')}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Left Job</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FEF2F2' }]}>
                    <UserRoundX size={20} color="#EF4444" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewCount}>{leftJobCount}</Text>
              </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="Search by staff, role, or business..." 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.filterIconBtn}>
                  <SlidersHorizontal size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {['All', 'Working', 'Completed', 'Left Job'].map(tab => (
                  <TouchableOpacity key={tab} style={[styles.filterChip, activeTab === tab && styles.filterChipActive]} onPress={() => setActiveTab(tab)}>
                    <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <UserRoundSearch size={32} color="#CBD5E1" style={{marginBottom: 12}} />
            <Text style={styles.emptyTitle}>No staff records found</Text>
            <Text style={styles.emptyDesc}>Staff records will appear here after candidates start working with HoReCa businesses.</Text>
          </View>
        )}
        renderItem={({item}) => (
          <Pressable 
            style={({ pressed }) => [styles.recordCard, { opacity: pressed ? 0.95 : 1 }]}
            onPress={() => openView(item)}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordAvatar}><Text style={styles.recordAvatarText}>{item.candidate.charAt(0)}</Text></View>
              <View style={styles.recordHeaderInfo}>
                <Text style={styles.recordName} numberOfLines={1}>{item.candidate}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.recordBody}>
              <View style={styles.infoRow}><BriefcaseBusiness size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.role}</Text></View>
              <View style={styles.infoRow}><Building2 size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.business}</Text></View>
              <View style={styles.infoRow}><MapPin size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.location}</Text></View>
            </View>

            <View style={styles.recordFooter}>
              <View style={styles.infoRow}><CalendarDays size={14} color="#64748B" /><Text style={[styles.infoText, {fontSize: 12}]}>Joined: {item.joiningDate}</Text></View>
              <View style={styles.viewDetailsAction}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={14} color={NAVY} />
              </View>
            </View>
          </Pressable>
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
            
            <ScrollView style={{padding: 16, maxHeight: 500}} showsVerticalScrollIndicator={false}>
              {selectedDep && (
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                     <View style={[styles.recordAvatar, {width: 48, height: 48, borderRadius: 24}]}><Text style={[styles.recordAvatarText, {fontSize: 20}]}>{selectedDep.candidate.charAt(0)}</Text></View>
                     <View style={{marginLeft: 12, flex: 1}}>
                       <Text style={[styles.recordName, {fontSize: 18}]} numberOfLines={1}>{selectedDep.candidate}</Text>
                       <Text style={{fontSize: 14, color: '#64748B', marginTop: 2}} numberOfLines={1}>{selectedDep.role}</Text>
                     </View>
                  </View>

                  <View style={styles.detailGrid}>
                     <View style={styles.detailItem}><Building2 size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Business</Text><Text style={styles.detailValue}>{selectedDep.business}</Text></View></View>
                     <View style={styles.detailItem}><MapPin size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Location</Text><Text style={styles.detailValue}>{selectedDep.location}</Text></View></View>
                     <View style={styles.detailItem}><CalendarDays size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Joining Date</Text><Text style={styles.detailValue}>{selectedDep.joiningDate}</Text></View></View>
                     <View style={styles.detailItem}><BriefcaseBusiness size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Job Type</Text><Text style={styles.detailValue}>{selectedDep.type}</Text></View></View>
                  </View>

                  <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>Current Status</Text>
                    <View style={[styles.statusBadge, { alignSelf: 'flex-start', backgroundColor: getStatusColor(selectedDep.status) + '15', paddingVertical: 6, paddingHorizontal: 12 }]}>
                      <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedDep.status), fontSize: 13 }]}>{selectedDep.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.updateStatusSection}>
                    <Text style={styles.statusSectionTitle}>Update Status</Text>
                    <View style={styles.statusOptionsRow}>
                      <TouchableOpacity style={styles.statusUpdateBtn} onPress={() => updateStatus('Working')}>
                        <Text style={[styles.statusUpdateBtnText, {color: '#10B981'}]}>Working</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusUpdateBtn} onPress={() => updateStatus('Completed')}>
                        <Text style={[styles.statusUpdateBtnText, {color: '#3B82F6'}]}>Completed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusUpdateBtn} onPress={() => updateStatus('Left Job')}>
                        <Text style={[styles.statusUpdateBtnText, {color: '#EF4444'}]}>Left Job</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.modalActions, {marginTop: 24}]}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setViewVisible(false); showToast("Candidate Profile viewed."); }}><Text style={styles.secondaryBtnText}>View Candidate Profile</Text></TouchableOpacity>
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

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  overviewIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewCount: {
    fontSize: 28,
    fontWeight: '800',
    color: NAVY,
    marginTop: 12,
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },

  searchSection: { padding: 16, paddingBottom: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },
  filterIconBtn: { padding: 4, marginLeft: 8 },

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { paddingBottom: 110 },
  
  recordCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recordAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  recordHeaderInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 12 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: NAVY, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexShrink: 0 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  recordBody: { marginBottom: 16, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8, flex: 1 },

  recordFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  viewDetailsAction: { flexDirection: 'row', alignItems: 'center' },
  viewDetailsText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  popupCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  popupTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalCloseBtn: { padding: 4 },

  detailGrid: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, gap: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailTextWrapper: { marginLeft: 12, flex: 1 },
  detailLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  statusSection: { marginBottom: 20, paddingHorizontal: 4 },
  statusSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  
  updateStatusSection: { paddingHorizontal: 4 },
  statusOptionsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusUpdateBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  statusUpdateBtnText: { fontSize: 13, fontWeight: '600' },

  modalActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center' },
  secondaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
