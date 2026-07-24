import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, FlatList, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  UsersRound, UserPlus, MoreVertical, Search, SlidersHorizontal, Users, UserRoundCheck, BriefcaseBusiness,
  BadgeCheck, Clock3, CircleX, ChevronRight, Send, X, MapPin, Briefcase, DollarSign, Calendar, Upload, Download, FileText, User
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const INITIAL_CANDIDATES = [];

export default function ManpowerCandidatesPage({ route, initialAction }) {
  // Simulate passing a context via route params
  const selectedJobReq = route?.params?.selectedJobReq || null; // e.g. { id: 'REQ-901', role: 'Head Chef', business: 'The Grand Taj' }

  const { width } = useWindowDimensions();
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modals
  const [addVisible, setAddVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [submitConfirmVisible, setSubmitConfirmVisible] = useState(false);

  const [selectedCand, setSelectedCand] = useState(null);

  const [addStep, setAddStep] = useState(1);
  const [newCand, setNewCand] = useState({ name: '', mobile: '', role: '', experience: '', salary: '' });

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  React.useEffect(() => {
    if (initialAction === 'add-candidate') {
      setAddStep(1);
      setAddVisible(true);
    }
  }, [initialAction]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10B981'; // Green
      case 'Working': return '#3B82F6';   // Blue
      case 'Unavailable': return '#64748B'; // Gray
      case 'Submitted': return '#F59E0B'; // Orange
      default: return '#64748B';
    }
  };

  const getVerificationIcon = (ver) => {
    if (ver === 'Verified') return <BadgeCheck size={14} color="#10B981" />;
    if (ver === 'Pending') return <Clock3 size={14} color="#F59E0B" />;
    return <CircleX size={14} color="#EF4444" />;
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
      availMsg: "Available Immediately",
      skills: [],
      prevEmployer: "N/A"
    };
    setCandidates([cand, ...candidates]);
    setAddVisible(false);
    setAddStep(1);
    setNewCand({ name: '', mobile: '', role: '', experience: '', salary: '' });
    showToast("Candidate added successfully!");
  };

  const handleConfirmSubmit = () => {
    setCandidates(prev => prev.map(c => c.id === selectedCand.id ? { ...c, status: 'Submitted', availMsg: 'Submitted to Job' } : c));
    setSubmitConfirmVisible(false);
    showToast("Candidate submitted successfully.");
  };

  const filteredCandidates = candidates.filter(c =>
    (activeFilter === 'All' || c.status === activeFilter) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCands = candidates.length;
  const availCands = candidates.filter(c => c.status === 'Available').length;
  const workingCands = candidates.filter(c => c.status === 'Working').length;

  const renderHeader = () => (
    <View style={{ paddingBottom: 12 }}>
      {/* Page Intro & Top Actions */}
      <View style={styles.introSection}>
        <View style={styles.introLeft}>
          <View style={styles.introTitleRow}>
            <UsersRound size={22} color={NAVY} />
            <Text style={styles.introTitle}>Candidates</Text>
          </View>
          <Text style={styles.introSub}>Manage candidate profiles and availability.</Text>
        </View>
        <View style={styles.introRight}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setAddVisible(true)}>
            <UserPlus size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Add Candidate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreBtn} onPress={() => setMoreVisible(true)}>
            <MoreVertical size={20} color={NAVY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Candidate Overview Card */}
      <View style={styles.overviewCard}>
        <TouchableOpacity style={styles.overviewSeg} onPress={() => setActiveFilter('All')}>
          <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Users size={18} color="#3B82F6" />
          </View>
          <Text style={styles.overviewCount}>{totalCands}</Text>
          <Text style={styles.overviewLabel}>Total Candidates</Text>
        </TouchableOpacity>
        <View style={styles.overviewDivider} />

        <TouchableOpacity style={styles.overviewSeg} onPress={() => setActiveFilter('Available')}>
          <View style={[styles.overviewIconBox, { backgroundColor: '#ECFDF5' }]}>
            <UserRoundCheck size={18} color="#10B981" />
          </View>
          <Text style={styles.overviewCount}>{availCands}</Text>
          <Text style={styles.overviewLabel}>Available</Text>
        </TouchableOpacity>
        <View style={styles.overviewDivider} />

        <TouchableOpacity style={styles.overviewSeg} onPress={() => setActiveFilter('Working')}>
          <View style={[styles.overviewIconBox, { backgroundColor: '#F5F3FF' }]}>
            <BriefcaseBusiness size={18} color="#8B5CF6" />
          </View>
          <Text style={styles.overviewCount}>{workingCands}</Text>
          <Text style={styles.overviewLabel}>Currently Working</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <Search size={18} color="#64748B" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by candidate, role, or location..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setAdvancedFilterVisible(true)} style={styles.filterIconBtn}>
              <SlidersHorizontal size={18} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPills}>
          {['All', 'Available', 'Submitted', 'Working', 'Unavailable'].map(f => (
            <TouchableOpacity key={f} style={[styles.pill, activeFilter === f && styles.pillActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Candidates List with Header */}
        <FlatList
          ListHeaderComponent={renderHeader}
          data={filteredCandidates}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <UsersRound size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyTitle}>No candidates found</Text>
              <Text style={styles.emptySub}>Try changing your search or filters.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setAddVisible(true)}>
                <Text style={styles.primaryBtnText}>Add Candidate</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => {
            const isEligibleForJob = selectedJobReq && item.status === 'Available';

            return (
              <TouchableOpacity style={styles.candCard} activeOpacity={0.7} onPress={() => { setSelectedCand(item); setProfileVisible(true); }}>
                <View style={styles.candTopRow}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
                  <View style={styles.nameCol}>
                    <Text style={styles.candName}>{item.name}</Text>
                    <View style={styles.idRow}>
                      <Text style={styles.candId}>{item.id}</Text>
                      <View style={styles.dot} />
                      <View style={styles.verifRow}>
                        {getVerificationIcon(item.verification)}
                        <Text style={[styles.verifText,
                        item.verification === 'Verified' ? { color: '#10B981' } :
                          item.verification === 'Pending' ? { color: '#F59E0B' } : { color: '#EF4444' }
                        ]}>{item.verification}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '1A' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.candDetails}>
                  <Text style={styles.detailText}><Text style={{ fontWeight: '600', color: NAVY }}>{item.role}</Text> • {item.experience}</Text>
                  <Text style={styles.detailText}>{item.location} • {item.salary}</Text>
                </View>

                <View style={styles.candFooter}>
                  <Text style={styles.availMsg}>{item.availMsg}</Text>
                  <View style={styles.footerActions}>
                    {isEligibleForJob ? (
                      <>
                        <TouchableOpacity style={styles.linkAction} onPress={() => { setSelectedCand(item); setProfileVisible(true); }}>
                          <Text style={styles.linkText}>View Profile</Text>
                          <ChevronRight size={14} color={NAVY} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitJobBtn} onPress={() => { setSelectedCand(item); setSubmitConfirmVisible(true); }}>
                          <Send size={14} color="#fff" />
                          <Text style={styles.submitJobText}>Submit for Job</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity style={styles.linkAction} onPress={() => { setSelectedCand(item); setProfileVisible(true); }}>
                          <Text style={styles.linkText}>View Profile</Text>
                          <ChevronRight size={14} color={NAVY} />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {/* Main More Menu Bottom Sheet (Simplified with standard Modal for now) */}
      <Modal visible={moreVisible} transparent={true} animationType="fade" onRequestClose={() => setMoreVisible(false)}>
        <TouchableOpacity style={styles.modalOverlayCenter} activeOpacity={1} onPress={() => setMoreVisible(false)}>
          <View style={styles.centerMenuBox}>
            <TouchableOpacity style={styles.menuItem}>
              <Upload size={20} color={NAVY} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Import Candidates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Download size={20} color={NAVY} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Download Import Template</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <FileText size={20} color={NAVY} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Export Candidate List</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Advanced Filter Modal */}
      <Modal visible={advancedFilterVisible} transparent={true} animationType="fade" onRequestClose={() => setAdvancedFilterVisible(false)}>
        <TouchableOpacity style={styles.modalOverlayCenter} activeOpacity={1} onPress={() => setAdvancedFilterVisible(false)}>
          <View style={styles.profileModalBox}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setAdvancedFilterVisible(false)}><X size={24} color="#1E293B" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.sheetContent}>
              <Text style={styles.inputLabel}>Primary Role</Text>
              <TextInput style={styles.input} placeholder="e.g. Head Chef" />
              <Text style={styles.inputLabel}>Experience Range</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Min yrs" keyboardType="numeric" />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Max yrs" keyboardType="numeric" />
              </View>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput style={styles.input} placeholder="e.g. Mumbai" />
            </ScrollView>
            <View style={styles.sheetFooter}>
              <TouchableOpacity style={styles.secondaryBtnOutline} onPress={() => setAdvancedFilterVisible(false)}>
                <Text style={styles.secondaryBtnText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtnLarge} onPress={() => setAdvancedFilterVisible(false)}>
                <Text style={styles.primaryBtnLargeText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Submit for Job Confirmation Modal */}
      <Modal visible={submitConfirmVisible} transparent={true} animationType="fade" onRequestClose={() => setSubmitConfirmVisible(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerCard}>
            <Text style={styles.centerTitle}>Confirm Submission</Text>
            <Text style={styles.centerSub}>Are you sure you want to submit this candidate?</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryRow}><Text style={{ fontWeight: 'bold', color: NAVY }}>Candidate:</Text> {selectedCand?.name}</Text>
              <Text style={styles.summaryRow}><Text style={{ fontWeight: 'bold', color: NAVY }}>Job Requirement:</Text> {selectedJobReq?.role}</Text>
              <Text style={styles.summaryRow}><Text style={{ fontWeight: 'bold', color: NAVY }}>Business:</Text> {selectedJobReq?.business}</Text>
            </View>
            <View style={styles.centerActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setSubmitConfirmVisible(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmSubmit}>
                <Text style={styles.btnConfirmText}>Confirm Submission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Candidate Form Modal */}
      <Modal visible={addVisible} transparent={true} animationType="fade" onRequestClose={() => setAddVisible(false)}>
        <TouchableOpacity style={styles.modalOverlayCenter} activeOpacity={1} onPress={() => setAddVisible(false)}>
          <View style={[styles.bottomSheet, { maxHeight: '90%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Candidate</Text>
              <TouchableOpacity onPress={() => setAddVisible(false)}><X size={24} color="#1E293B" /></TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flexShrink: 1 }}>
              <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.formSectionTitle}>Basic Information</Text>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput style={styles.input} value={newCand.name} onChangeText={t => setNewCand({ ...newCand, name: t })} placeholder="e.g. Rahul Sharma" />
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <TextInput style={styles.input} value={newCand.mobile} onChangeText={t => setNewCand({ ...newCand, mobile: t })} placeholder="+91" keyboardType="phone-pad" />

                  <Text style={styles.formSectionTitle}>Professional Details</Text>
                  <Text style={styles.inputLabel}>Primary Role</Text>
                  <TextInput style={styles.input} value={newCand.role} onChangeText={t => setNewCand({ ...newCand, role: t })} placeholder="e.g. Head Chef" />
                  <Text style={styles.inputLabel}>Experience (Years)</Text>
                  <TextInput style={styles.input} value={newCand.experience} onChangeText={t => setNewCand({ ...newCand, experience: t })} placeholder="e.g. 5" keyboardType="numeric" />
                  <Text style={styles.inputLabel}>Expected Salary</Text>
                  <TextInput style={styles.input} value={newCand.salary} onChangeText={t => setNewCand({ ...newCand, salary: t })} placeholder="e.g. 45000" keyboardType="numeric" />

                  <Text style={styles.formSectionTitle}>Documents Upload</Text>
                  <View style={styles.docGrid}>
                    <TouchableOpacity style={styles.docUploadBoxSmall}>
                      <Upload size={18} color={NAVY} style={{ marginBottom: 4 }} />
                      <Text style={styles.docUploadText}>Aadhaar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.docUploadBoxSmall}>
                      <Upload size={18} color={NAVY} style={{ marginBottom: 4 }} />
                      <Text style={styles.docUploadText}>PAN Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.docUploadBoxSmall}>
                      <User size={18} color={NAVY} style={{ marginBottom: 4 }} />
                      <Text style={styles.docUploadText}>Photo</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ height: 20 }} />
                </TouchableOpacity>
              </ScrollView>
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={[styles.primaryBtnLarge, { flex: 1 }]} onPress={submitAddCandidate}>
                  <Text style={styles.primaryBtnLargeText}>Save Candidate</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Candidate Profile Modal */}
      <Modal visible={profileVisible} animationType="fade" transparent={true} onRequestClose={() => setProfileVisible(false)}>
        <TouchableOpacity style={styles.modalOverlayCenter} activeOpacity={1} onPress={() => setProfileVisible(false)}>
          <View style={styles.profileModalBox}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setProfileVisible(false)} style={styles.modalCloseBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
              <Text style={styles.modalTitle}>Candidate Profile</Text>
              <View style={{ width: 40 }} />
            </View>

            {selectedCand && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.profHeaderRow}>
                  <View style={styles.profAvatarLarge}><Text style={styles.profAvatarTextLarge}>{selectedCand.name.charAt(0)}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profName}>{selectedCand.name}</Text>
                    <Text style={styles.profRole}>{selectedCand.role}</Text>
                    <Text style={styles.profId}>{selectedCand.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedCand.status) + '1A', alignSelf: 'flex-start' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedCand.status) }]}>{selectedCand.status}</Text>
                  </View>
                </View>

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
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    {selectedCand.skills.map(s => <View key={s} style={styles.skillBadge}><Text style={styles.skillText}>{s}</Text></View>)}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentWrapper: { flex: 1 },

  introSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16, backgroundColor: '#F8FAFC' },
  introLeft: { flex: 1 },
  introTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  introTitle: { fontSize: 22, fontWeight: '900', color: NAVY, marginLeft: 8 },
  introSub: { fontSize: 13, color: '#64748B' },
  introRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  primaryBtn: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  moreBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  overviewCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', paddingVertical: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8 },
  overviewSeg: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  overviewDivider: { width: 1, height: '70%', backgroundColor: '#E2E8F0', alignSelf: 'center' },
  overviewIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  overviewCount: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  overviewLabel: { fontSize: 12, color: '#475569', fontWeight: '500', textAlign: 'center' },

  searchSection: { marginBottom: 12 },
  searchBarWrapper: { paddingHorizontal: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B', height: '100%' },
  filterIconBtn: { padding: 6 },

  filterPills: { gap: 8, paddingHorizontal: 16, paddingBottom: 4 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  pillTextActive: { color: '#fff' },

  listContent: { paddingBottom: 110, paddingTop: 0 },
  candCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  candTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  nameCol: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  candId: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  verifRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifText: { fontSize: 12, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  candDetails: { marginBottom: 16 },
  detailText: { fontSize: 13, color: '#475569', marginBottom: 4, lineHeight: 20 },

  candFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  availMsg: { fontSize: 12, color: '#64748B', fontWeight: '500', flex: 1 },
  footerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  linkAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  linkText: { fontSize: 13, color: NAVY, fontWeight: '600' },
  moreContextBtn: { padding: 4 },
  submitJobBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  submitJobText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B', marginBottom: 24 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  centerMenuBox: { backgroundColor: '#fff', borderRadius: 24, padding: 16, width: '100%', maxWidth: 400, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuIcon: { marginRight: 16 },
  menuItemText: { fontSize: 16, color: NAVY, fontWeight: '500' },

  bottomSheet: { backgroundColor: '#fff', borderRadius: 24, maxHeight: '90%', width: '100%', maxWidth: 500, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  sheetContent: { padding: 20 },
  sheetFooter: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },

  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  centerCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  centerTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  centerSub: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  summaryBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  summaryRow: { fontSize: 14, color: '#475569', marginBottom: 6 },
  centerActions: { flexDirection: 'row', gap: 12 },
  btnCancel: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#F1F5F9' },
  btnCancelText: { color: '#64748B', fontWeight: 'bold', fontSize: 14 },
  btnConfirm: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: NAVY },
  btnConfirmText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  modalFullContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  profileModalBox: { backgroundColor: '#fff', borderRadius: 24, width: '100%', maxWidth: 500, maxHeight: '85%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalCloseBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalContent: { padding: 20, backgroundColor: '#fff' },

  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16, marginTop: 8 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 16, height: 48, marginBottom: 16, color: NAVY },

  docGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  docUploadBoxSmall: { flex: 1, height: 70, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  docUploadText: { fontSize: 12, color: NAVY, fontWeight: '600' },

  secondaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: '#64748B', fontSize: 14, fontWeight: 'bold' },
  primaryBtnLarge: { flex: 2, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  profHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profAvatarLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  profAvatarTextLarge: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  profName: { fontSize: 22, fontWeight: 'bold', color: NAVY },
  profRole: { fontSize: 16, color: '#64748B', marginTop: 4 },
  profId: { fontSize: 13, color: '#94A3B8', marginTop: 4 },

  profSection: { marginBottom: 24 },
  profDetailText: { fontSize: 14, color: '#475569', marginBottom: 8 },
  skillBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  skillText: { fontSize: 12, color: '#475569', fontWeight: '500' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
