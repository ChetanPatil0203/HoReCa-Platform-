import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, FlatList, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  Users, UserPlus, Search, Filter, X, CheckCircle,
  AlertTriangle, MapPin, Briefcase, DollarSign, ChevronRight,
  MoreVertical, Edit, Send, FileText, Upload, Calendar, User
} from 'lucide-react-native';

import SubmissionDetailsModal from '../../../components/vendor/manpowerAgent/SubmissionDetailsModal';
import InterviewDetailsModal from '../../../components/vendor/manpowerAgent/InterviewDetailsModal';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const INITIAL_CANDIDATES = [
  { 
    id: "C-1001", name: "Rahul Sharma", role: "Head Chef", experience: "9 Years", 
    salary: "₹65k", location: "Mumbai", availability: "Immediate", 
    verification: "Verified", status: "Available", mobile: "+91 9876543210",
    email: "rahul.chef@email.com", gender: "Male", dob: "12 May 1990",
    skills: ["Continental", "Italian", "Inventory"], prevEmployer: "Taj Lands End"
  },
  { 
    id: "C-1002", name: "Priya Desai", role: "Barista", experience: "2 Years", 
    salary: "₹20k", location: "Mumbai", availability: "15 Days", 
    verification: "Pending", status: "Available", mobile: "+91 9876543211",
    email: "priya.coffee@email.com", gender: "Female", dob: "05 Jun 1998",
    skills: ["Latte Art", "Customer Service"], prevEmployer: "Starbucks"
  },
  { 
    id: "C-1003", name: "Amit Kumar", role: "Head Chef", experience: "12 Years", 
    salary: "₹80k", location: "Navi Mumbai", availability: "Immediate", 
    verification: "Verified", status: "Submitted", mobile: "+91 9876543212",
    email: "amit.k@email.com", gender: "Male", dob: "22 Aug 1985",
    skills: ["Indian", "Tandoor"], prevEmployer: "Oberoi"
  },
];

const MOCK_REQS = {
  broadcast: [
    { id: "REQ-901", business: "The Grand Taj", role: "Head Chef", salary: "₹60k - ₹80k" },
    { id: "REQ-902", business: "Cafe Mocha", role: "Barista", salary: "₹18k - ₹25k" }
  ],
  direct: [
    { id: "DIR-8001", business: "Olive Bar", role: "Bartender", salary: "₹25k - ₹35k" }
  ]
};

export default function ManpowerCandidatesPage() {
  const { width } = useWindowDimensions();
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modals
  const [addVisible, setAddVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [sendReqVisible, setSendReqVisible] = useState(false);
  
  const [selectedCand, setSelectedCand] = useState(null);
  
  const [addStep, setAddStep] = useState(1);
  const [newCand, setNewCand] = useState({ name: '', mobile: '', role: '', experience: '', salary: '' });

  // Profile State
  const [profTab, setProfTab] = useState('Overview');

  // Submissions State
  const [selectedSub, setSelectedSub] = useState(null);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewModalVisible, setInterviewModalVisible] = useState(false);

  // Send Req State
  const [reqTab, setReqTab] = useState('broadcast');
  const [selectedReq, setSelectedReq] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return '#10B981';
      case 'Submitted': return '#8B5CF6';
      case 'Interviewing': return '#F59E0B';
      case 'Selected': return '#3B82F6';
      case 'Deployed': return '#059669';
      default: return '#64748B';
    }
  };

  const submitAddCandidate = () => {
    if (!newCand.name || !newCand.mobile || !newCand.role) {
      showToast("Please fill required fields (Name, Mobile, Role)");
      return;
    }
    const cand = {
      ...newCand,
      id: "C-" + Math.floor(Math.random() * 9000 + 1000),
      verification: "Pending",
      status: "Available",
      location: "Mumbai",
      availability: "Immediate",
      skills: [],
      prevEmployer: "N/A"
    };
    setCandidates([cand, ...candidates]);
    setAddVisible(false);
    setAddStep(1);
    setNewCand({ name: '', mobile: '', role: '', experience: '', salary: '' });
    showToast("Candidate added successfully!");
  };

  const openSendReq = (cand) => {
    setSelectedCand(cand);
    setSelectedReq(null);
    setReqTab('broadcast');
    setSendReqVisible(true);
  };

  const handleSubClick = (status) => {
    if (status === 'Interview Scheduled') {
      setSelectedInterview({
        candidateName: selectedCand.name,
        business: "The Grand Taj",
        role: selectedCand.role,
        reqId: "REQ-901",
        date: "20 Jul 2026",
        time: "11:00 AM",
        mode: "Video Call",
        location: "Zoom",
        ownerNotes: "Please be on time.",
        status: "Scheduled"
      });
      setInterviewModalVisible(true);
    } else {
      setSelectedSub({
        candidateName: selectedCand.name,
        role: selectedCand.role,
        business: "Cafe Mocha",
        date: "14 Jul 2026",
        status: status,
        note: "Available for immediate join."
      });
      setSubModalVisible(true);
    }
  };

  const submitSendReq = () => {
    if(!selectedReq) return;
    setCandidates(prev => prev.map(c => c.id === selectedCand.id ? { ...c, status: 'Submitted' } : c));
    setSendReqVisible(false);
    setProfileVisible(false);
    showToast("Candidate submitted to requirement.");
  };

  const filteredCandidates = candidates.filter(c => 
    (activeFilter === 'All' || c.status === activeFilter) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <Users size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Candidates</Text>
        </View>
        <Text style={styles.headerSub}>Manage candidate profiles, documents and availability.</Text>
      </View>

      {/* Top Actions */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setAddVisible(true)}>
          <UserPlus size={16} color="#fff" />
          <Text style={styles.primaryBtnText}>Add Candidate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Upload size={16} color={NAVY} />
          <Text style={styles.secondaryBtnText}>Import</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Calendar size={16} color={NAVY} />
          <Text style={styles.secondaryBtnText}>Availability</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryScrollContent}>
        {renderSummary("Total", candidates.length, NAVY)}
        {renderSummary("Available", candidates.filter(c => c.status==='Available').length, "#10B981")}
        {renderSummary("Submitted", candidates.filter(c => c.status==='Submitted').length, "#8B5CF6")}
        {renderSummary("Interviewing", 0, "#F59E0B")}
        {renderSummary("Deployed", 0, "#059669")}
      </ScrollView>

      {/* Search & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Search size={16} color="#64748B" />
          <TextInput 
            placeholder="Search name, role..." 
            style={styles.searchInput} 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8" 
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {['All', 'Available', 'Submitted', 'Interviewing', 'Selected', 'Deployed'].map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Candidates List */}
      <FlatList
        data={filteredCandidates}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.candCard}>
            <View style={styles.candHeader}>
              <View style={styles.candAvatar}><Text style={styles.candAvatarText}>{item.name.charAt(0)}</Text></View>
              <View style={styles.candInfo}>
                <Text style={styles.candName}>{item.name}</Text>
                <Text style={styles.candId}>{item.id} • {item.verification}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.candDetailsGrid}>
              <View style={styles.candDetailItem}><Briefcase size={14} color="#64748B" /><Text style={styles.candDetailText}>{item.role}</Text></View>
              <View style={styles.candDetailItem}><Calendar size={14} color="#64748B" /><Text style={styles.candDetailText}>{item.experience}</Text></View>
              <View style={styles.candDetailItem}><DollarSign size={14} color="#64748B" /><Text style={styles.candDetailText}>{item.salary}</Text></View>
              <View style={styles.candDetailItem}><MapPin size={14} color="#64748B" /><Text style={styles.candDetailText}>{item.location}</Text></View>
            </View>

            <View style={styles.candFooter}>
              <Text style={styles.candAvailText}>Avail: {item.availability}</Text>
              <View style={styles.candActionRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedCand(item); setProfileVisible(true); }}>
                  <Text style={styles.iconBtnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, { paddingHorizontal: 12, paddingVertical: 6 }]} onPress={() => openSendReq(item)}>
                  <Send size={14} color="#fff" style={{marginRight: 4}}/>
                  <Text style={styles.primaryBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Add Candidate Form Modal */}
      <Modal visible={addVisible} animationType="slide" onRequestClose={() => setAddVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddVisible(false)} style={styles.modalCloseBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Add Candidate (Step {addStep}/4)</Text>
            <View style={{width: 40}} />
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <ScrollView style={styles.modalContent}>
              {addStep === 1 && (
                <View>
                  <Text style={styles.formSectionTitle}>Basic Information</Text>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput style={styles.input} value={newCand.name} onChangeText={t => setNewCand({...newCand, name: t})} placeholder="e.g. Rahul Sharma" />
                  
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput style={styles.input} value={newCand.mobile} onChangeText={t => setNewCand({...newCand, mobile: t})} placeholder="+91" keyboardType="phone-pad" />
                </View>
              )}
              {addStep === 2 && (
                <View>
                  <Text style={styles.formSectionTitle}>Professional Details</Text>
                  <Text style={styles.inputLabel}>Primary Role *</Text>
                  <TextInput style={styles.input} value={newCand.role} onChangeText={t => setNewCand({...newCand, role: t})} placeholder="e.g. Head Chef" />
                  
                  <Text style={styles.inputLabel}>Experience (Years)</Text>
                  <TextInput style={styles.input} value={newCand.experience} onChangeText={t => setNewCand({...newCand, experience: t})} placeholder="e.g. 5" keyboardType="numeric" />
                  
                  <Text style={styles.inputLabel}>Expected Salary</Text>
                  <TextInput style={styles.input} value={newCand.salary} onChangeText={t => setNewCand({...newCand, salary: t})} placeholder="e.g. 45000" keyboardType="numeric" />
                </View>
              )}
              {addStep === 3 && (
                <View>
                  <Text style={styles.formSectionTitle}>Documents Upload</Text>
                  <View style={styles.docUploadBox}><Text style={styles.docUploadText}>Upload Aadhaar</Text></View>
                  <View style={styles.docUploadBox}><Text style={styles.docUploadText}>Upload PAN</Text></View>
                  <View style={styles.docUploadBox}><Text style={styles.docUploadText}>Upload Resume</Text></View>
                </View>
              )}
              {addStep === 4 && (
                <View>
                  <Text style={styles.formSectionTitle}>Review Details</Text>
                  <Text style={styles.reviewText}>Name: {newCand.name}</Text>
                  <Text style={styles.reviewText}>Mobile: {newCand.mobile}</Text>
                  <Text style={styles.reviewText}>Role: {newCand.role}</Text>
                  <Text style={styles.reviewText}>Exp: {newCand.experience} Years</Text>
                  <Text style={styles.reviewText}>Salary: ₹{newCand.salary}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {addStep > 1 && (
                <TouchableOpacity style={styles.secondaryBtnOutline} onPress={() => setAddStep(addStep - 1)}>
                  <Text style={styles.secondaryBtnText}>Back</Text>
                </TouchableOpacity>
              )}
              {addStep < 4 ? (
                <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setAddStep(addStep + 1)}>
                  <Text style={styles.primaryBtnLargeText}>Next Step</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#10B981' }]} onPress={submitAddCandidate}>
                  <Text style={styles.primaryBtnLargeText}>Save Candidate</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Candidate Profile Modal */}
      <Modal visible={profileVisible} animationType="slide" onRequestClose={() => setProfileVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setProfileVisible(false)} style={styles.modalCloseBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Candidate Profile</Text>
            <View style={{width: 40}} />
          </View>
          
          {selectedCand && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.profHeaderRow}>
                <View style={styles.profAvatarLarge}><Text style={styles.profAvatarTextLarge}>{selectedCand.name.charAt(0)}</Text></View>
                <View style={{flex: 1}}>
                  <Text style={styles.profName}>{selectedCand.name}</Text>
                  <Text style={styles.profRole}>{selectedCand.role}</Text>
                  <Text style={styles.profId}>{selectedCand.id} • {selectedCand.verification}</Text>
                </View>
              </View>

              <View style={styles.profTabs}>
                <TouchableOpacity style={[styles.profTab, profTab === 'Overview' && styles.profTabActive]} onPress={() => setProfTab('Overview')}><Text style={[styles.profTabText, profTab === 'Overview' && styles.profTabTextActive]}>Overview</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.profTab, profTab === 'Submissions' && styles.profTabActive]} onPress={() => setProfTab('Submissions')}><Text style={[styles.profTabText, profTab === 'Submissions' && styles.profTabTextActive]}>Submissions</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.profTab, profTab === 'Documents' && styles.profTabActive]} onPress={() => setProfTab('Documents')}><Text style={[styles.profTabText, profTab === 'Documents' && styles.profTabTextActive]}>Documents</Text></TouchableOpacity>
              </View>

              {profTab === 'Overview' && (
                <>
                  <View style={styles.profSection}>
                    <Text style={styles.formSectionTitle}>Contact Info</Text>
                    <Text style={styles.profDetailText}>Mobile: {selectedCand.mobile}</Text>
                    <Text style={styles.profDetailText}>Email: {selectedCand.email}</Text>
                    <Text style={styles.profDetailText}>Location: {selectedCand.location}</Text>
                  </View>

                  <View style={styles.profSection}>
                    <Text style={styles.formSectionTitle}>Professional Info</Text>
                    <Text style={styles.profDetailText}>Experience: {selectedCand.experience}</Text>
                    <Text style={styles.profDetailText}>Expected Salary: {selectedCand.salary}</Text>
                    <Text style={styles.profDetailText}>Previous Employer: {selectedCand.prevEmployer}</Text>
                    <Text style={styles.profDetailText}>Availability: {selectedCand.availability}</Text>
                  </View>

                  <View style={styles.profSection}>
                    <Text style={styles.formSectionTitle}>Skills</Text>
                    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
                      {selectedCand.skills.map(s => <View key={s} style={styles.skillBadge}><Text style={styles.skillText}>{s}</Text></View>)}
                    </View>
                  </View>
                </>
              )}

              {profTab === 'Submissions' && (
                <View style={styles.profSection}>
                  <Text style={styles.formSectionTitle}>Recent Submissions</Text>
                  
                  {['Interview Scheduled', 'Viewed', 'Rejected'].map((status, idx) => (
                    <TouchableOpacity key={idx} style={styles.subCard} onPress={() => handleSubClick(status)}>
                      <View style={{flex: 1}}>
                        <Text style={styles.subCardTitle}>Cafe Mocha</Text>
                        <Text style={styles.subCardSub}>Barista • 14 Jul 2026</Text>
                      </View>
                      <View style={styles.subCardStatusBox}>
                        <Text style={[styles.subCardStatus, { color: getStatusColor(status) }]}>{status}</Text>
                        <ChevronRight size={16} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.secondaryBtnOutline}><Text style={styles.secondaryBtnText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => openSendReq(selectedCand)}>
              <Text style={styles.primaryBtnLargeText}>Send to Requirement</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Send to Requirement Modal */}
      <Modal visible={sendReqVisible} animationType="slide" transparent={false} onRequestClose={() => setSendReqVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSendReqVisible(false)} style={styles.modalCloseBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Send to Requirement</Text>
            <View style={{width: 40}} />
          </View>

          <View style={styles.reqTabsRow}>
            <TouchableOpacity style={[styles.reqTabBtn, reqTab === 'broadcast' && styles.reqTabBtnActive]} onPress={() => setReqTab('broadcast')}>
              <Text style={[styles.reqTabText, reqTab === 'broadcast' && styles.reqTabTextActive]}>Broadcasts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.reqTabBtn, reqTab === 'direct' && styles.reqTabBtnActive]} onPress={() => setReqTab('direct')}>
              <Text style={[styles.reqTabText, reqTab === 'direct' && styles.reqTabTextActive]}>Direct Requests</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={reqTab === 'broadcast' ? MOCK_REQS.broadcast : MOCK_REQS.direct}
            keyExtractor={item => item.id}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity style={[styles.reqSelCard, selectedReq?.id === item.id && styles.reqSelCardActive]} onPress={() => setSelectedReq(item)}>
                <View style={styles.reqSelInfo}>
                  <Text style={styles.reqSelRole}>{item.role}</Text>
                  <Text style={styles.reqSelBus}>{item.business} • {item.id}</Text>
                  <Text style={styles.reqSelSal}>{item.salary}</Text>
                </View>
                <View style={[styles.radio, selectedReq?.id === item.id && styles.radioActive]}>
                  {selectedReq?.id === item.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.sendFormWrapper}>
            <TextInput style={styles.inputArea} placeholder="Optional note for the employer..." multiline />
            <TouchableOpacity style={[styles.primaryBtnLarge, !selectedReq && {opacity: 0.5}]} onPress={submitSendReq} disabled={!selectedReq}>
              <Text style={styles.primaryBtnLargeText}>Submit Candidate</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Embedded Workflow Modals */}
      <SubmissionDetailsModal 
        visible={subModalVisible} 
        onClose={() => setSubModalVisible(false)} 
        submission={selectedSub} 
      />
      <InterviewDetailsModal 
        visible={interviewModalVisible} 
        onClose={() => setInterviewModalVisible(false)} 
        interview={selectedInterview} 
      />

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

  topActions: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  primaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  secondaryBtn: { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: NAVY, fontSize: 13, fontWeight: '500', marginLeft: 6 },

  summaryScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', maxHeight: 80 },
  summaryScrollContent: { padding: 16, gap: 12 },
  summaryCard: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  summaryCount: { fontSize: 18, fontWeight: 'bold' },
  summaryLabel: { fontSize: 11, color: '#64748B' },

  filterSection: { padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B', height: '100%' },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 40 },
  candCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16 },
  candHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  candAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  candAvatarText: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  candInfo: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  candId: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  candDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16 },
  candDetailItem: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  candDetailText: { fontSize: 13, color: '#475569', marginLeft: 8 },

  candFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  candAvailText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  candActionRow: { flexDirection: 'row', gap: 8 },
  iconBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  iconBtnText: { fontSize: 12, color: '#475569', fontWeight: '600' },

  modalFullContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalCloseBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalContent: { flex: 1, padding: 16, backgroundColor: '#fff' },
  
  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 16, marginTop: 8 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 16, color: '#1E293B' },
  reviewText: { fontSize: 15, color: '#475569', marginBottom: 8 },
  docUploadBox: { height: 60, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: '#F8FAFC' },
  docUploadText: { fontSize: 13, color: NAVY, fontWeight: '500' },

  modalFooter: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  secondaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLarge: { flex: 2, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  profHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profAvatarLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  profAvatarTextLarge: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  profName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  profRole: { fontSize: 16, color: '#64748B', marginTop: 4 },
  profId: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  
  profTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 16 },
  profTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  profTabActive: { borderBottomColor: NAVY },
  profTabText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  profTabTextActive: { color: NAVY, fontWeight: 'bold' },
  profSection: { marginBottom: 24 },
  profDetailText: { fontSize: 14, color: '#475569', marginBottom: 8 },
  skillBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  skillText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  
  subCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  subCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  subCardSub: { fontSize: 13, color: '#64748B' },
  subCardStatusBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subCardStatus: { fontSize: 12, fontWeight: 'bold' },

  reqTabsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  reqTabBtn: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  reqTabBtnActive: { borderBottomWidth: 2, borderBottomColor: NAVY },
  reqTabText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  reqTabTextActive: { color: NAVY, fontWeight: 'bold' },
  reqSelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  reqSelCardActive: { borderColor: NAVY, backgroundColor: '#F8FAFC' },
  reqSelInfo: { flex: 1 },
  reqSelRole: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  reqSelBus: { fontSize: 13, color: '#64748B', marginTop: 4 },
  reqSelSal: { fontSize: 13, color: '#10B981', marginTop: 4, fontWeight: '500' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: NAVY },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: NAVY },

  sendFormWrapper: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
