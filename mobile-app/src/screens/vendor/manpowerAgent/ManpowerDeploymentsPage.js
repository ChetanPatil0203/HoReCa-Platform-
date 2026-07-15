import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Modal, SafeAreaView, FlatList, TextInput } from 'react-native';
import { Briefcase, Calendar, CheckCircle, Clock, MapPin, User, ChevronRight, X, AlertTriangle, FileText, Send } from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_DEPLOYMENTS = [
  { 
    id: "DEP-9001", candidate: "Vikram Singh", role: "Sous Chef", business: "JW Marriott", reqId: "REQ-901",
    joiningDate: "10 Jan 2026", salary: "₹50k", shift: "Morning", contract: "11 Months", replacement: "30 Days",
    status: "Active"
  },
  { 
    id: "DEP-9002", candidate: "Neha Gupta", role: "Store Manager", business: "Starbucks", reqId: "REQ-902",
    joiningDate: "18 Jul 2026", salary: "₹45k", shift: "Rotational", contract: "11 Months", replacement: "15 Days",
    status: "Joining Scheduled"
  },
  { 
    id: "DEP-9003", candidate: "Ravi Kumar", role: "Bartender", business: "Olive Bar", reqId: "DIR-8001",
    joiningDate: "01 Mar 2026", salary: "₹30k", shift: "Night", contract: "11 Months", replacement: "15 Days",
    status: "Left"
  }
];

const MOCK_REPLACEMENTS = [
  {
    id: "REP-01", business: "Olive Bar", candidate: "Ravi Kumar", role: "Bartender", 
    reason: "Candidate absconded", date: "15 Jul 2026", deadline: "20 Jul 2026", urgency: "High", status: "New"
  }
];

const AVAILABLE_CANDIDATES = [
  { id: "C-1002", name: "Priya Desai", role: "Barista", experience: "2 Years", salary: "₹20k", availability: "Immediate" },
  { id: "C-1004", name: "Suresh Pillai", role: "Bartender", experience: "5 Years", salary: "₹35k", availability: "Immediate" }
];

export default function ManpowerDeploymentsPage() {
  const [deployments, setDeployments] = useState(MOCK_DEPLOYMENTS);
  const [replacements, setReplacements] = useState(MOCK_REPLACEMENTS);
  const [activeTab, setActiveTab] = useState('All');
  
  // Suggest Replacement State
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [selectedRep, setSelectedRep] = useState(null);
  const [selectedCandId, setSelectedCandId] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return '#10B981';
      case 'Joining Scheduled': return '#3B82F6';
      case 'Completed': return '#8B5CF6';
      case 'Left': return '#EF4444';
      default: return '#64748B';
    }
  };

  const handleJoining = (depId, action) => {
    setDeployments(prev => prev.map(d => d.id === depId ? { ...d, status: action === 'Confirm' ? 'Active' : 'Left' } : d));
    showToast(action === 'Confirm' ? "Candidate marked as Joined." : "Candidate marked as Did Not Join.");
  };

  const openSuggest = (rep) => {
    setSelectedRep(rep);
    setSelectedCandId(null);
    setSuggestVisible(true);
  };

  const submitReplacement = () => {
    if(!selectedCandId) return;
    setReplacements(prev => prev.map(r => r.id === selectedRep.id ? { ...r, status: 'Candidates Suggested' } : r));
    setSuggestVisible(false);
    showToast("Replacement candidates suggested to employer.");
  };

  const filteredDeployments = deployments.filter(d => activeTab === 'All' || activeTab === 'Replacement' || d.status === activeTab || (activeTab === 'Joining' && d.status === 'Joining Scheduled'));

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
          <CheckCircle size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Deployments</Text>
        </View>
        <Text style={styles.headerSub}>Manage active deployments and replacement requests.</Text>
      </View>

      {/* Summary */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryScrollContent}>
        {renderSummary("Joining", deployments.filter(d => d.status === 'Joining Scheduled').length, "#3B82F6")}
        {renderSummary("Active", deployments.filter(d => d.status === 'Active').length, "#10B981")}
        {renderSummary("Completed", 0, "#8B5CF6")}
        {renderSummary("Left", deployments.filter(d => d.status === 'Left').length, "#EF4444")}
        {renderSummary("Replace Req.", replacements.length, "#F59E0B")}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {['All', 'Joining', 'Active', 'Completed', 'Left', 'Replacement'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.filterChip, activeTab === tab && styles.filterChipActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>{tab}</Text>
              {tab === 'Replacement' && replacements.length > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{replacements.length}</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'Replacement' ? replacements : filteredDeployments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          if (activeTab === 'Replacement') {
            return (
              <View style={styles.repCard}>
                <View style={styles.repHeader}>
                  <AlertTriangle size={20} color="#EF4444" />
                  <View style={{marginLeft: 8, flex: 1}}>
                    <Text style={styles.repTitle}>Replacement Requested</Text>
                    <Text style={styles.repSub}>{item.business}</Text>
                  </View>
                  {item.urgency === 'High' && <View style={styles.urgentBadge}><Text style={styles.urgentBadgeText}>URGENT</Text></View>}
                </View>

                <View style={styles.repBody}>
                  <Text style={styles.repDesc}>Previous Candidate: <Text style={{fontWeight: 'bold'}}>{item.candidate}</Text> ({item.role})</Text>
                  <Text style={styles.repDesc}>Reason: {item.reason}</Text>
                  <Text style={styles.repDesc}>Deadline: <Text style={{color: '#DC2626', fontWeight: 'bold'}}>{item.deadline}</Text></Text>
                  <Text style={[styles.repDesc, {marginTop: 8, fontWeight: 'bold', color: item.status === 'New' ? '#2563EB' : '#10B981'}]}>Status: {item.status}</Text>
                </View>

                <View style={styles.repFooter}>
                  {item.status === 'New' && (
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => openSuggest(item)}>
                      <User size={16} color="#fff" style={{marginRight: 6}} />
                      <Text style={styles.primaryBtnText}>Suggest Replacement</Text>
                    </TouchableOpacity>
                  )}
                  {item.status !== 'New' && (
                    <TouchableOpacity style={styles.secondaryBtnOutline}><Text style={styles.secondaryBtnText}>View Submissions</Text></TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }

          // Normal Deployment Card
          return (
            <View style={styles.depCard}>
              <View style={styles.depHeader}>
                <View style={styles.depAvatar}><User size={20} color="#64748B" /></View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.depName}>{item.candidate}</Text>
                  <Text style={styles.depRole}>{item.role} @ {item.business}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.depGrid}>
                <View style={styles.depGridItem}><Calendar size={14} color="#64748B" /><Text style={styles.depGridText}>Join: {item.joiningDate}</Text></View>
                <View style={styles.depGridItem}><Briefcase size={14} color="#64748B" /><Text style={styles.depGridText}>Sal: {item.salary}</Text></View>
                <View style={styles.depGridItem}><Clock size={14} color="#64748B" /><Text style={styles.depGridText}>{item.shift}</Text></View>
                <View style={styles.depGridItem}><FileText size={14} color="#64748B" /><Text style={styles.depGridText}>{item.contract}</Text></View>
              </View>

              {item.status === 'Joining Scheduled' && (
                <View style={styles.joiningBox}>
                  <Text style={styles.joiningTitle}>Confirm Joining</Text>
                  <View style={styles.joiningActions}>
                    <TouchableOpacity style={styles.dangerBtnOutline} onPress={() => handleJoining(item.id, 'DidNotJoin')}><Text style={styles.dangerBtnText}>Did Not Join</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#10B981'}]} onPress={() => handleJoining(item.id, 'Confirm')}><Text style={styles.primaryBtnText}>Confirm Joined</Text></TouchableOpacity>
                  </View>
                </View>
              )}

              {item.status === 'Active' && (
                <View style={styles.depFooter}>
                  <TouchableOpacity style={styles.secondaryBtnOutline}><Text style={styles.secondaryBtnText}>Contact Client</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtnOutline}><Text style={styles.primaryBtnOutlineText}>Handle Replacement</Text></TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Suggest Replacement Modal */}
      <Modal visible={suggestVisible} animationType="slide" transparent={false} onRequestClose={() => setSuggestVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSuggestVisible(false)} style={styles.modalCloseBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Suggest Replacement</Text>
            <View style={{width: 40}} />
          </View>
          
          <View style={styles.candMatchTextContainer}>
             <Text style={styles.candMatchText}>Select candidates to replace {selectedRep?.candidate} ({selectedRep?.role})</Text>
          </View>

          <FlatList
            data={AVAILABLE_CANDIDATES}
            keyExtractor={c => c.id}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity style={[styles.candCard, selectedCandId === item.id && styles.candCardSelected]} onPress={() => setSelectedCandId(item.id)}>
                <View style={[styles.radio, selectedCandId === item.id && styles.radioSelected]}>
                  {selectedCandId === item.id && <View style={styles.radioInner} />}
                </View>
                <View style={styles.candInfo}>
                  <Text style={styles.candName}>{item.name}</Text>
                  <Text style={styles.candDesc}>{item.role} • {item.experience} • {item.salary}</Text>
                  <Text style={styles.candLoc}>Avail: {item.availability}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.sendFormWrapper}>
            <TextInput style={styles.inputArea} placeholder="Optional note for the employer..." multiline />
            <TouchableOpacity style={[styles.primaryBtnLarge, !selectedCandId && {opacity: 0.5}]} onPress={submitReplacement} disabled={!selectedCandId}>
              <Send size={18} color="#fff" style={{marginRight: 8}}/>
              <Text style={styles.primaryBtnLargeText}>Suggest Candidate</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B' },

  summaryScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', maxHeight: 80 },
  summaryScrollContent: { padding: 16, gap: 12 },
  summaryCard: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  summaryCount: { fontSize: 18, fontWeight: 'bold' },
  summaryLabel: { fontSize: 11, color: '#64748B' },

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  badge: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },

  listContent: { padding: 16, paddingBottom: 40 },
  
  depCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  depHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  depAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  depName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  depRole: { fontSize: 13, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  depGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16 },
  depGridItem: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  depGridText: { fontSize: 13, color: '#475569', marginLeft: 6 },

  joiningBox: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  joiningTitle: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 12 },
  joiningActions: { flexDirection: 'row', gap: 12 },
  dangerBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#FECACA', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  dangerBtnText: { color: '#DC2626', fontSize: 13, fontWeight: 'bold' },
  primaryBtn: { flex: 1.5, flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  depFooter: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  secondaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  primaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: NAVY, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  primaryBtnOutlineText: { color: NAVY, fontSize: 13, fontWeight: '600' },

  repCard: { backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' },
  repHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  repTitle: { fontSize: 16, fontWeight: 'bold', color: '#991B1B' },
  repSub: { fontSize: 13, color: '#B91C1C' },
  urgentBadge: { backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  urgentBadgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  repBody: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12 },
  repDesc: { fontSize: 13, color: '#475569', marginBottom: 4 },
  repFooter: { flexDirection: 'row', justifyContent: 'flex-end' },

  modalFullContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalCloseBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  candMatchTextContainer: { padding: 16, paddingBottom: 0 },
  candMatchText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  candCardSelected: { borderColor: NAVY, backgroundColor: '#F8FAFC' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  radioSelected: { borderColor: NAVY },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: NAVY },
  candInfo: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  candDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  candLoc: { fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: '500' },

  sendFormWrapper: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
