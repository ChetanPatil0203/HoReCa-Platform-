import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, FlatList, Platform, TextInput
} from 'react-native';
import {
  Briefcase, Users, FileText, Calendar, Clock, Star, MapPin, 
  Search, Filter, X, CheckCircle, Save, XCircle, 
  AlertTriangle, User, Lock, Send, DollarSign,
  AlertCircle, ChevronDown
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const INITIAL_REQUESTS = [
  {
    id: "DIR-8001", businessName: "The Grand Taj", type: "Hotel", verified: true,
    role: "Head Chef", count: 1, experience: "8-10 Years", salary: "₹60k - ₹80k",
    shift: "Morning", location: "Bandra West, Mumbai",
    joining: "Immediate", food: "Provided", accommodation: "Provided",
    urgency: "High", sentTime: "2 hours ago", status: "New",
    skills: ["Continental", "Team Management", "Inventory"],
    desc: "Looking for an experienced Head Chef to lead our new continental fine-dining restaurant. We specifically want your agency to source this as you have provided excellent head chefs in the past.",
    deadline: "20 Jul 2026",
    notes: "Please only send candidates with 5-star hotel experience."
  },
  {
    id: "DIR-8002", businessName: "Cafe Mocha", type: "Cafe", verified: true,
    role: "Barista", count: 2, experience: "1-3 Years", salary: "₹18k - ₹25k",
    shift: "Rotational", location: "Andheri, Mumbai",
    joining: "Within 7 Days", food: "Provided", accommodation: "Not Provided",
    urgency: "Normal", sentTime: "1 day ago", status: "Accepted",
    skills: ["Latte Art", "Customer Service", "Espresso"],
    desc: "Seeking enthusiastic baristas with good communication skills.",
    deadline: "25 Jul 2026",
    notes: "Need quick joiners."
  },
  {
    id: "DIR-8003", businessName: "Olive Bar", type: "Restaurant", verified: false,
    role: "Bartender", count: 1, experience: "3-5 Years", salary: "₹25k - ₹35k",
    shift: "Night", location: "Khar, Mumbai",
    joining: "Immediate", food: "Provided", accommodation: "Not Provided",
    urgency: "High", sentTime: "2 days ago", status: "Candidates Sent",
    skills: ["Mixology", "Inventory"],
    desc: "Requires expert mixologist.",
    deadline: "18 Jul 2026",
    notes: ""
  }
];

const MOCK_CANDIDATES = [
  { id: "C-01", name: "Rahul Sharma", role: "Head Chef", experience: "9 Years", salary: "₹65k", location: "Mumbai", docStatus: "Verified" },
  { id: "C-02", name: "Amit Kumar", role: "Head Chef", experience: "12 Years", salary: "₹80k", location: "Navi Mumbai", docStatus: "Verified" },
  { id: "C-03", name: "Priya Desai", role: "Barista", experience: "2 Years", salary: "₹20k", location: "Mumbai", docStatus: "Pending" },
  { id: "C-04", name: "Vikram Singh", role: "Bartender", experience: "4 Years", salary: "₹30k", location: "Pune", docStatus: "Verified" },
];

const DECLINE_REASONS = [
  "Suitable candidates unavailable",
  "Joining date not possible",
  "Salary range not suitable",
  "Location not serviceable",
  "Agency capacity full",
  "Other"
];

export default function ManpowerDirectRequestsPage() {
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 380;

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "New", "Accepted", "Candidates Sent", "Interviewing", "Filled", "Declined", "Expired"];

  // Modals state
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [declineVisible, setDeclineVisible] = useState(false);
  const [sendCandVisible, setSendCandVisible] = useState(false);

  // Send Candidates State
  const [selectedCands, setSelectedCands] = useState([]);

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAccept = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "Accepted" } : r));
    setDetailsVisible(false);
    showToast("Direct request accepted.");
  };

  const handleDeclineSelect = (req) => {
    setSelectedReq(req);
    setDeclineVisible(true);
  };

  const submitDecline = (reason) => {
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: "Declined" } : r));
    setDeclineVisible(false);
    setDetailsVisible(false);
    showToast("Direct request declined.");
  };

  const handleSendCandidatesOpen = (req) => {
    setSelectedReq(req);
    setSelectedCands([]);
    setSendCandVisible(true);
  };

  const toggleCandidate = (id) => {
    if (selectedCands.includes(id)) setSelectedCands(selectedCands.filter(c => c !== id));
    else setSelectedCands([...selectedCands, id]);
  };

  const submitCandidates = () => {
    if (selectedCands.length === 0) return;
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: "Candidates Sent" } : r));
    setSendCandVisible(false);
    setDetailsVisible(false);
    showToast("Candidates submitted successfully.");
  };

  const filteredRequests = requests.filter(r => activeFilter === "All" || r.status === activeFilter);

  const renderSummaryCard = (label, count, color) => (
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
          <Lock size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Direct Requests</Text>
        </View>
        <Text style={styles.headerSub}>Private manpower requirements sent only to your agency.</Text>
      </View>

      {/* Summary Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryScrollContent}>
        {renderSummaryCard("New", requests.filter(r => r.status === 'New').length, "#3B82F6")}
        {renderSummaryCard("Accepted", requests.filter(r => r.status === 'Accepted').length, "#F59E0B")}
        {renderSummaryCard("Sent", requests.filter(r => r.status === 'Candidates Sent').length, "#8B5CF6")}
        {renderSummaryCard("Interviewing", 0, "#10B981")}
        {renderSummaryCard("Filled", 0, "#10B981")}
        {renderSummaryCard("Declined", requests.filter(r => r.status === 'Declined').length, "#EF4444")}
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Search size={16} color="#64748B" />
          <TextInput placeholder="Search by ID, Business, Role..." style={styles.searchInput} placeholderTextColor="#94A3B8" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {filters.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.reqCard}>
            {/* Private Badge */}
            <View style={styles.privateBadgeRow}>
              <Lock size={12} color="#8B5CF6" />
              <Text style={styles.privateBadgeText}>Sent only to Elite Manpower Services</Text>
            </View>

            <View style={styles.reqHeader}>
              <View style={styles.reqHeaderLeft}>
                <Text style={styles.reqRole}>{item.role}</Text>
                <View style={styles.reqBusinessRow}>
                  <Briefcase size={12} color="#64748B" />
                  <Text style={styles.reqBusiness}>{item.businessName}</Text>
                  {item.verified && <CheckCircle size={12} color="#10B981" style={{marginLeft: 4}}/>}
                </View>
                <Text style={styles.reqId}>ID: {item.id} • Sent {item.sentTime}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'New' ? '#EFF6FF' : item.status === 'Declined' ? '#FEF2F2' : '#F0FDF4' }]}>
                <Text style={[styles.statusBadgeText, { color: item.status === 'New' ? '#2563EB' : item.status === 'Declined' ? '#DC2626' : '#16A34A' }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.reqDetailsGrid}>
              <View style={styles.reqDetailItem}>
                <Users size={14} color="#64748B" />
                <Text style={styles.reqDetailText}>{item.count} Staff</Text>
              </View>
              <View style={styles.reqDetailItem}>
                <Briefcase size={14} color="#64748B" />
                <Text style={styles.reqDetailText}>{item.experience}</Text>
              </View>
              <View style={styles.reqDetailItem}>
                <DollarSign size={14} color="#64748B" />
                <Text style={styles.reqDetailText}>{item.salary}</Text>
              </View>
              <View style={styles.reqDetailItem}>
                <MapPin size={14} color="#64748B" />
                <Text style={styles.reqDetailText}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.reqFooter}>
              {item.urgency === 'High' && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>URGENT</Text>
                </View>
              )}
              <View style={styles.reqActionRow}>
                <TouchableOpacity style={styles.secondaryBtnOutline} onPress={() => { setSelectedReq(item); setDetailsVisible(true); }}>
                  <Text style={styles.secondaryBtnText}>View Details</Text>
                </TouchableOpacity>

                {item.status === 'New' && (
                  <>
                    <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#10B981' }]} onPress={() => handleAccept(item.id)}>
                      <Text style={styles.primaryBtnText}>Accept</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.status === 'Accepted' && (
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSendCandidatesOpen(item)}>
                    <Text style={styles.primaryBtnText}>Send Candidates</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      />

      {/* Toast */}
      {toastMsg ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}


      {/* Decline Bottom Sheet */}
      <Modal visible={declineVisible} transparent animationType="slide" onRequestClose={() => setDeclineVisible(false)}>
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={styles.bottomSheetBackdrop} onPress={() => setDeclineVisible(false)} />
          <View style={styles.bottomSheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Decline Request</Text>
              <TouchableOpacity onPress={() => setDeclineVisible(false)}><X size={20} color="#1E293B" /></TouchableOpacity>
            </View>
            <Text style={styles.sheetSub}>Please select a reason for declining this request.</Text>
            
            <View style={{marginTop: 16}}>
              {DECLINE_REASONS.map((reason, idx) => (
                <TouchableOpacity key={idx} style={styles.reasonBtn} onPress={() => submitDecline(reason)}>
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Candidates Modal */}
      <Modal visible={sendCandVisible} animationType="slide" transparent={false} onRequestClose={() => setSendCandVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSendCandVisible(false)} style={styles.modalCloseBtn}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Candidates</Text>
            <View style={{width: 40}} />
          </View>

          <View style={styles.candidateListWrapper}>
            <Text style={styles.candMatchText}>Showing candidates matching: {selectedReq?.role}</Text>
            
            <FlatList
              data={MOCK_CANDIDATES.filter(c => selectedReq && c.role.includes(selectedReq.role.split(' ')[1] || selectedReq.role))}
              keyExtractor={c => c.id}
              contentContainerStyle={{padding: 16}}
              renderItem={({item}) => (
                <TouchableOpacity style={[styles.candCard, selectedCands.includes(item.id) && styles.candCardSelected]} onPress={() => toggleCandidate(item.id)}>
                  <View style={[styles.checkbox, selectedCands.includes(item.id) && styles.checkboxSelected]}>
                    {selectedCands.includes(item.id) && <CheckCircle size={14} color="#fff" />}
                  </View>
                  <View style={styles.candAvatar}><User size={16} color="#64748B" /></View>
                  <View style={styles.candInfo}>
                    <Text style={styles.candName}>{item.name}</Text>
                    <Text style={styles.candDesc}>{item.role} • {item.experience} • {item.salary}</Text>
                    <Text style={styles.candLoc}>{item.location}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.sendFormWrapper}>
            <Text style={styles.inputLabel}>Agency Note (Optional)</Text>
            <TextInput style={styles.inputArea} placeholder="E.g. These candidates are ready to join immediately..." multiline />
            
            <TouchableOpacity style={[styles.primaryBtnLarge, selectedCands.length === 0 && { opacity: 0.5 }]} onPress={submitCandidates} disabled={selectedCands.length === 0}>
              <Text style={styles.primaryBtnLargeText}>Send {selectedCands.length > 0 ? selectedCands.length : ''} Candidates</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsVisible} animationType="slide" transparent={false} onRequestClose={() => setDetailsVisible(false)}>
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.modalCloseBtn}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Details</Text>
            <View style={{width: 40}} />
          </View>

          {selectedReq && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.privateBadgeRowLarge}>
                <Lock size={14} color="#8B5CF6" />
                <Text style={styles.privateBadgeTextLarge}>Sent only to your agency</Text>
              </View>

              <View style={styles.reqHeaderLeft}>
                <Text style={[styles.reqRole, { fontSize: 22, marginTop: 12 }]}>{selectedReq.role}</Text>
                <View style={styles.reqBusinessRow}>
                  <Briefcase size={14} color="#64748B" />
                  <Text style={styles.reqBusiness}>{selectedReq.businessName} ({selectedReq.type})</Text>
                </View>
                <Text style={styles.reqId}>ID: {selectedReq.id} • Posted {selectedReq.sentTime}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionSubtitleBold}>Job Description</Text>
              <Text style={styles.modalDesc}>{selectedReq.desc}</Text>

              {selectedReq.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Owner's Note to You:</Text>
                  <Text style={styles.notesText}>{selectedReq.notes}</Text>
                </View>
              ) : null}

              <View style={styles.tagsContainer}>
                {selectedReq.skills.map(s => (
                  <View key={s} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />
              
              <Text style={styles.sectionSubtitleBold}>Key Requirements</Text>
              <View style={styles.specGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Staff Count</Text>
                  <Text style={styles.specVal}>{selectedReq.count}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Experience</Text>
                  <Text style={styles.specVal}>{selectedReq.experience}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Salary Range</Text>
                  <Text style={styles.specVal}>{selectedReq.salary}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Shift</Text>
                  <Text style={styles.specVal}>{selectedReq.shift}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Joining</Text>
                  <Text style={styles.specVal}>{selectedReq.joining}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Food/Accom.</Text>
                  <Text style={styles.specVal}>{selectedReq.food} / {selectedReq.accommodation}</Text>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            {selectedReq?.status === 'New' && (
              <>
                <TouchableOpacity style={styles.dangerBtnOutline} onPress={() => handleDeclineSelect(selectedReq)}>
                  <Text style={styles.dangerBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#10B981', flex: 1.5 }]} onPress={() => handleAccept(selectedReq.id)}>
                  <Text style={styles.primaryBtnLargeText}>Accept Request</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedReq?.status === 'Accepted' && (
              <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => handleSendCandidatesOpen(selectedReq)}>
                <Text style={styles.primaryBtnLargeText}>Send Candidates</Text>
              </TouchableOpacity>
            )}
            {selectedReq?.status !== 'New' && selectedReq?.status !== 'Accepted' && (
               <Text style={styles.statusFooterText}>Status: {selectedReq?.status}</Text>
            )}
          </View>
        </SafeAreaView>
      </Modal>

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

  filterSection: { padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B', height: '100%' },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 40 },
  reqCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  privateBadgeRow: { backgroundColor: '#F3E8FF', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  privateBadgeText: { fontSize: 11, color: '#7E22CE', fontWeight: 'bold', marginLeft: 6 },
  
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16 },
  reqHeaderLeft: { flex: 1 },
  reqRole: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  reqBusinessRow: { flexDirection: 'row', alignItems: 'center' },
  reqBusiness: { fontSize: 13, color: '#475569', marginLeft: 6, fontWeight: '500' },
  reqId: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  reqDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  reqDetailItem: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  reqDetailText: { fontSize: 13, color: '#475569', marginLeft: 8 },

  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', padding: 16 },
  urgentBadge: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  urgentBadgeText: { fontSize: 10, color: '#DC2626', fontWeight: 'bold' },
  reqActionRow: { flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'flex-end' },
  secondaryBtnOutline: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  secondaryBtnText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  primaryBtn: { backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  bottomSheetOverlay: { flex: 1, justifyContent: 'flex-end' },
  bottomSheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  sheetSub: { fontSize: 14, color: '#64748B' },
  reasonBtn: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reasonText: { fontSize: 15, color: '#334155' },

  modalFullContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalCloseBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  
  modalContent: { flex: 1, padding: 16, backgroundColor: '#fff' },
  privateBadgeRowLarge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E8FF', padding: 12, borderRadius: 8, marginBottom: 12 },
  privateBadgeTextLarge: { fontSize: 13, color: '#7E22CE', fontWeight: 'bold', marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  sectionSubtitleBold: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  modalDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 },
  notesBox: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 16 },
  notesLabel: { fontSize: 13, fontWeight: 'bold', color: '#D97706', marginBottom: 4 },
  notesText: { fontSize: 14, color: '#92400E', fontStyle: 'italic' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingBottom: 40 },
  specItem: { width: '45%' },
  specLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  specVal: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  modalFooter: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  dangerBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#FECACA', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dangerBtnText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
  primaryBtnLarge: { flex: 1, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  statusFooterText: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#64748B', paddingVertical: 14 },

  candidateListWrapper: { flex: 1 },
  candMatchText: { padding: 16, paddingBottom: 0, fontSize: 13, color: '#64748B' },
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  candCardSelected: { borderColor: NAVY, backgroundColor: '#F8FAFC' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxSelected: { backgroundColor: NAVY, borderColor: NAVY },
  candAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  candInfo: { flex: 1 },
  candName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  candDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  candLoc: { fontSize: 11, color: '#94A3B8', marginTop: 2 },

  sendFormWrapper: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
