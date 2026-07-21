import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, SafeAreaView, FlatList, TextInput, Pressable, useWindowDimensions
} from 'react-native';
import {
  Briefcase, Users, Calendar, MapPin, 
  Search, X, CheckCircle, Send, DollarSign, Building, ChevronRight,
  Building2, UsersRound, IndianRupee,
  FilePlus2, CircleCheck, Clock3
} from 'lucide-react-native';

const NAVY = '#081A3A';

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

export default function ManpowerDirectRequestsPage({ initialAction }) {
  const { width } = useWindowDimensions();
  const summaryGridGap = 12;
  const summaryCardWidth = (width - 32 - summaryGridGap) / 2;

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const filters = ["All", "New", "Accepted", "Candidates Sent", "Closed", "Declined"];

  // Modals state
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [declineVisible, setDeclineVisible] = useState(false);
  const [sendCandVisible, setSendCandVisible] = useState(false);
  const [selectedCands, setSelectedCands] = useState([]);

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  React.useEffect(() => {
    if (initialAction === 'submit-candidates' && INITIAL_REQUESTS.length > 0) {
      setSelectedReq(INITIAL_REQUESTS[0]);
      setSelectedCands([]);
      setSendCandVisible(true);
    }
  }, [initialAction]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return '#3B82F6';
      case 'Accepted': return '#F59E0B';
      case 'Candidates Sent': return '#8B5CF6';
      case 'Closed': return '#10B981';
      case 'Declined': return '#EF4444';
      default: return '#64748B';
    }
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

  const filteredRequests = requests.filter(r => {
    const matchesTab = activeFilter === "All" || r.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      r.id.toLowerCase().includes(q) || 
      r.role.toLowerCase().includes(q) || 
      r.businessName.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Briefcase size={24} color={NAVY} />
                <Text style={styles.headerTitle}>Job Requirements</Text>
              </View>
              <Text style={styles.headerSub}>View and manage job requirements from businesses.</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryGrid}>
              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("New")}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>New</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <FilePlus2 size={20} color="#3B82F6" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>1</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Accepted")}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Accepted</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <CircleCheck size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>1</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Candidates Sent")}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Candidates Sent</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#F5F3FF' }]}>
                    <Send size={20} color="#8B5CF6" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>1</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.overviewCard, { width: summaryCardWidth, opacity: pressed ? 0.9 : 1 }]}
                onPress={() => setActiveFilter("Pending")}
              >
                <View style={styles.overviewTopRow}>
                  <Text style={styles.overviewLabel} numberOfLines={2}>Pending</Text>
                  <View style={[styles.overviewIconBox, { backgroundColor: '#FFF7ED' }]}>
                    <Clock3 size={20} color="#F97316" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>2</Text>
              </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="Search by ID, Business, Role..." 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {filters.map(tab => (
                  <TouchableOpacity key={tab} style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]} onPress={() => setActiveFilter(tab)}>
                    <Text style={[styles.filterChipText, activeFilter === tab && styles.filterChipTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No job requirements found</Text>
            <Text style={styles.emptyDesc}>Requirements will appear here when businesses post them or send them to you.</Text>
          </View>
        )}
        renderItem={({item}) => (
          <View style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.recordHeaderLeft}>
                <View style={styles.recordAvatar}><Text style={styles.recordAvatarText}>{item.role.charAt(0)}</Text></View>
                <View style={styles.recordHeaderInfo}>
                  <Text style={styles.recordName} numberOfLines={1}>{item.role}</Text>
                  <Text style={styles.recordSub}>ID: {item.id}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.recordBody}>
              <View style={styles.infoRow}><Building2 size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.businessName}</Text></View>
              <View style={styles.infoRow}><MapPin size={14} color="#64748B" /><Text style={styles.infoText} numberOfLines={1}>{item.location}</Text></View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><UsersRound size={14} color="#64748B" /><Text style={styles.summaryText}>{item.count} Staff Needed</Text></View>
              <View style={styles.summaryItem}><IndianRupee size={14} color="#64748B" /><Text style={styles.summaryText}>{item.salary}</Text></View>
            </View>

            <View style={styles.recordFooter}>
              <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => { setSelectedReq(item); setDetailsVisible(true); }}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={16} color={NAVY} />
              </TouchableOpacity>
              
              {item.status === 'New' && (
                <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => handleAccept(item.id)}>
                  <Text style={styles.primaryBtnSmallText}>Accept</Text>
                </TouchableOpacity>
              )}
              {item.status === 'Accepted' && (
                <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => { setSelectedReq(item); setSendCandVisible(true); }}>
                  <Text style={styles.primaryBtnSmallText}>Send Candidates</Text>
                </TouchableOpacity>
              )}
              {item.status === 'Candidates Sent' && (
                <TouchableOpacity style={styles.primaryBtnSmall}>
                  <Text style={styles.primaryBtnSmallText}>View Submission</Text>
                </TouchableOpacity>
              )}
              {item.status === 'Pending' && (
                <TouchableOpacity style={styles.primaryBtnSmall}>
                  <Text style={styles.primaryBtnSmallText}>View Status</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* View Details Modal */}
      <Modal visible={detailsVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Requirement Details</Text>
              <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.modalCloseBtn}><X size={20} color="#1E293B" /></TouchableOpacity>
            </View>
            
            <ScrollView style={{padding: 16, maxHeight: 500}} showsVerticalScrollIndicator={false}>
              {selectedReq && (
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                     <View style={[styles.recordAvatar, {width: 48, height: 48, borderRadius: 24}]}><Text style={[styles.recordAvatarText, {fontSize: 20}]}>{selectedReq.role.charAt(0)}</Text></View>
                     <View style={{marginLeft: 12}}>
                       <Text style={[styles.recordName, {fontSize: 18}]}>{selectedReq.role}</Text>
                       <Text style={styles.recordSub}>{selectedReq.businessName}</Text>
                     </View>
                  </View>

                  <View style={styles.detailGrid}>
                     <View style={styles.detailItem}><Users size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Staff Required</Text><Text style={styles.detailValue}>{selectedReq.count}</Text></View></View>
                     <View style={styles.detailItem}><DollarSign size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Salary</Text><Text style={styles.detailValue}>{selectedReq.salary}</Text></View></View>
                     <View style={styles.detailItem}><Briefcase size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Experience</Text><Text style={styles.detailValue}>{selectedReq.experience}</Text></View></View>
                     <View style={styles.detailItem}><MapPin size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Location</Text><Text style={styles.detailValue}>{selectedReq.location}</Text></View></View>
                     <View style={styles.detailItem}><Calendar size={16} color="#64748B" /><View style={styles.detailTextWrapper}><Text style={styles.detailLabel}>Joining</Text><Text style={styles.detailValue}>{selectedReq.joining}</Text></View></View>
                  </View>

                  <View style={{marginBottom: 20}}>
                    <Text style={styles.sectionHeading}>Description</Text>
                    <Text style={styles.descText}>{selectedReq.desc}</Text>
                  </View>
                  
                  <View style={{marginBottom: 20}}>
                    <Text style={styles.sectionHeading}>Skills Required</Text>
                    <View style={styles.skillsWrap}>
                      {selectedReq.skills.map((s, idx) => (
                        <View key={idx} style={styles.skillPill}><Text style={styles.skillText}>{s}</Text></View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.statusSection}>
                    <Text style={styles.statusSectionTitle}>Current Status</Text>
                    <View style={[styles.statusBadge, { alignSelf: 'flex-start', backgroundColor: getStatusColor(selectedReq.status) + '15' }]}>
                      <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedReq.status) }]}>{selectedReq.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalActions}>
                    {selectedReq.status === 'New' && (
                      <>
                        <TouchableOpacity style={[styles.secondaryBtn, {borderColor: '#FECACA', borderWidth: 1}]} onPress={() => handleDeclineSelect(selectedReq)}>
                          <Text style={[styles.secondaryBtnText, {color: '#DC2626'}]}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => handleAccept(selectedReq.id)}>
                          <Text style={styles.primaryBtnText}>Accept Request</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {selectedReq.status === 'Accepted' && (
                      <TouchableOpacity style={[styles.primaryBtn, {width: '100%'}]} onPress={() => handleSendCandidatesOpen(selectedReq)}>
                        <Text style={styles.primaryBtnText}>Send Candidates</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Decline Bottom Sheet (Popup style) */}
      <Modal visible={declineVisible} transparent animationType="fade" onRequestClose={() => setDeclineVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Decline Request</Text>
              <TouchableOpacity onPress={() => setDeclineVisible(false)} style={styles.modalCloseBtn}><X size={20} color="#1E293B" /></TouchableOpacity>
            </View>
            <ScrollView style={{padding: 16}} showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetSub}>Please select a reason for declining this request.</Text>
              <View style={{marginTop: 16, marginBottom: 24}}>
                {DECLINE_REASONS.map((reason, idx) => (
                  <TouchableOpacity key={idx} style={styles.reasonBtn} onPress={() => submitDecline(reason)}>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Send Candidates Modal */}
      <Modal visible={sendCandVisible} animationType="slide" transparent={false} onRequestClose={() => setSendCandVisible(false)}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#F8FAFC'}}>
          <View style={[styles.popupHeader, {backgroundColor: '#fff'}]}>
            <TouchableOpacity onPress={() => setSendCandVisible(false)} style={styles.modalCloseBtn}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.popupTitle}>Select Candidates</Text>
            <View style={{width: 40}} />
          </View>
          
          <View style={styles.candMatchTextContainer}>
             <Text style={styles.candMatchText}>Select candidates to send for {selectedReq?.role} @ {selectedReq?.businessName}</Text>
          </View>

          <FlatList
            data={MOCK_CANDIDATES}
            keyExtractor={c => c.id}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity style={[styles.candCard, selectedCands.includes(item.id) && styles.candCardSelected]} onPress={() => toggleCandidate(item.id)}>
                <View style={[styles.checkbox, selectedCands.includes(item.id) && styles.checkboxSelected]}>
                  {selectedCands.includes(item.id) && <CheckCircle size={14} color="#fff" />}
                </View>
                <View style={styles.candInfo}>
                  <Text style={styles.candName}>{item.name}</Text>
                  <Text style={styles.candDesc}>{item.role} • {item.experience} • {item.salary}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.sendFormWrapper}>
            <TouchableOpacity style={[styles.primaryBtnLarge, selectedCands.length === 0 && {opacity: 0.5}]} onPress={submitCandidates} disabled={selectedCands.length === 0}>
              <Send size={18} color="#fff" style={{marginRight: 8}}/>
              <Text style={styles.primaryBtnLargeText}>Send {selectedCands.length} Candidates</Text>
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
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, paddingTop: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
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
  overviewValue: {
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

  tabSection: { padding: 16 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { paddingBottom: 120 },
  
  recordCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  recordHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  recordAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  recordAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  recordHeaderInfo: { flex: 1, marginLeft: 12 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  recordSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexShrink: 0 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  recordBody: { marginBottom: 12, gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8, flex: 1 },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  summaryItem: { flexDirection: 'row', alignItems: 'center' },
  summaryText: { fontSize: 13, color: NAVY, fontWeight: '500', marginLeft: 6 },

  recordFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center' },
  viewDetailsText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 2 },

  emptyBox: { marginHorizontal: 16, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 20 },
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

  sectionHeading: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  descText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  skillText: { fontSize: 12, color: '#475569', fontWeight: '500' },

  statusSection: { marginBottom: 24, paddingHorizontal: 4 },
  statusSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },

  modalActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  primaryBtnSmall: { minHeight: 40, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', flexShrink: 0 },
  primaryBtnSmallText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  sheetSub: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  reasonBtn: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reasonText: { fontSize: 14, color: '#1E293B' },

  candMatchTextContainer: { padding: 16, paddingBottom: 0 },
  candMatchText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  candCardSelected: { borderColor: NAVY, backgroundColor: '#F8FAFC' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  checkboxSelected: { backgroundColor: NAVY, borderColor: NAVY },
  candInfo: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  candDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  sendFormWrapper: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
