import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Modal, Platform, Alert
} from 'react-native';
import {
  RadioTower, Inbox, Users, UserCheck, BriefcaseBusiness, UserPlus,
  ChevronRight, X, User, CheckCircle
} from 'lucide-react-native';

const NAVY = '#071B3A';
const MUTED = '#64748B';
const BLUE = '#3B82F6';
const ORANGE = '#F97316';
const GREEN = '#10B981';
const PURPLE = '#8B5CF6';
const WHITE = '#FFFFFF';

const OVERVIEW_STATS = [
  { id: 'opportunities', label: 'Open Opportunities', value: '0', icon: RadioTower, color: BLUE, action: 'FeedWall' },
  { id: 'direct', label: 'Direct Requests', value: '0', icon: Inbox, color: ORANGE, action: 'DirectRequests' },
  { id: 'available', label: 'Candidates Available', value: '0', icon: Users, color: GREEN, action: 'Candidates' },
  { id: 'staff', label: 'Active Staff', value: '0', icon: UserCheck, color: PURPLE, action: 'StaffRecords' },
];

const FEED_REQUIREMENTS = [];

const MOCK_CANDIDATES = [];

export default function ManpowerDashboardHome({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pagePadding = width < 340 ? 12 : 16;
  const gridGap = 12;
  const columns = isMobile ? 2 : 4;
  const cardWidth = isMobile ? (width - (pagePadding * 2) - gridGap) / columns : (Math.min(width, 1200) - (pagePadding * 2) - (gridGap * 3)) / columns;

  const [opportunities, setOpportunities] = useState(FEED_REQUIREMENTS);
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Modals
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  
  // Candidate Selection
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const openDetails = (req) => {
    setSelectedReq(req);
    setDetailsVisible(true);
  };

  const openSubmit = (req) => {
    setSelectedReq(req);
    setSelectedCandidates([]); // Reset selection
    setSubmitVisible(true);
  };

  const toggleCandidate = (id) => {
    setSelectedCandidates(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= selectedReq?.count) {
         if (Platform.OS === 'web') window.alert(`You can only select up to ${selectedReq.count} candidates.`);
         else Alert.alert('Limit Reached', `You can only select up to ${selectedReq.count} candidates.`);
         return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmitCandidates = () => {
    if (selectedCandidates.length === 0) {
      if (Platform.OS === 'web') window.alert("Select at least one candidate.");
      else Alert.alert('Error', 'Select at least one candidate.');
      return;
    }
    
    // Simulate submission
    const remaining = opportunities.filter(o => o.id !== selectedReq.id);
    setOpportunities(remaining);
    
    setSubmitVisible(false);
    setDetailsVisible(false);
    
    if (Platform.OS === 'web') window.alert("Candidates submitted successfully.");
    else Alert.alert('Success', 'Candidates submitted successfully.');
  };

  const handleDecline = () => {
    // Simulate decline
    const remaining = opportunities.filter(o => o.id !== selectedReq.id);
    setOpportunities(remaining);
    setDetailsVisible(false);
    
    if (Platform.OS === 'web') window.alert("Opportunity declined.");
    else Alert.alert('Declined', 'Opportunity declined.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: pagePadding }]} showsVerticalScrollIndicator={false}>
        
        {/* Premium Welcome Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroGreeting}>Good Morning 👋</Text>
          <Text style={styles.heroAgencyName}>Elite Manpower</Text>
          <View style={styles.heroStatusBadge}>
            <Text style={styles.heroStatusText}>Manpower Agency</Text>
          </View>
          <Text style={styles.heroDesc}>Manage opportunities, candidate submissions and active staff from one place.</Text>
        </View>

        {/* Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={[styles.gridContainer, { gap: gridGap }]}>
            {OVERVIEW_STATS.map((stat) => (
              <TouchableOpacity 
                key={stat.id} 
                style={[styles.overviewCard, { width: cardWidth }]}
                onPress={() => onNavigate && onNavigate(stat.action)}
              >
                <View style={[styles.overviewIconBox, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={20} color={stat.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.overviewValue}>{stat.value}</Text>
                <Text style={styles.overviewLabel} numberOfLines={1}>{stat.label}</Text>
                <View style={styles.overviewFooter}>
                  <Text style={styles.overviewLinkText}>View</Text>
                  <ChevronRight size={12} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Open Job Opportunities */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={{flex: 1}}>
              <Text style={styles.sectionTitle}>Open Job Opportunities</Text>
              <Text style={styles.sectionSubtitle}>Latest manpower requirements posted by Hotels, Restaurants and Cafes</Text>
            </View>
            <TouchableOpacity style={styles.feedWallLink} onPress={() => onNavigate && onNavigate('FeedWall')}>
              <Text style={styles.viewAllText}>View Feed Wall</Text>
              <ChevronRight size={16} color={NAVY} style={{marginLeft: 2}} />
            </TouchableOpacity>
          </View>

          {opportunities.length === 0 ? (
            <View style={styles.emptyState}>
              <BriefcaseBusiness size={32} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No open job opportunities</Text>
              <Text style={styles.emptyText}>New manpower requirements matching your agency services will appear here.</Text>
            </View>
          ) : (
            <View style={[!isMobile && styles.desktopFeedGrid]}>
              {opportunities.slice(0, 2).map((req) => (
                <View key={req.id} style={[styles.reqCard, !isMobile && { width: '49%' }]}>
                  <View style={styles.reqTopRow}>
                    <Text style={styles.reqId}>{req.id}</Text>
                    {req.status === 'HIGH PRIORITY' || req.status === 'NEW' ? (
                      <View style={[styles.reqStatusBadge, req.status === 'HIGH PRIORITY' && { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                        <Text style={[styles.reqStatusText, req.status === 'HIGH PRIORITY' && { color: '#DC2626' }]}>{req.status}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.reqRole} numberOfLines={1}>{req.role}</Text>

                  <View style={styles.reqBusinessRow}>
                    <Text style={styles.reqBusinessText} numberOfLines={1}>{req.businessName}</Text>
                    <Text style={styles.reqBusinessSub} numberOfLines={1}> · {req.type} · {req.location}</Text>
                  </View>

                  <View style={styles.reqSimpleInfo}>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Requirement</Text>
                      <Text style={styles.reqInfoValue}>{req.count} Staff</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Experience</Text>
                      <Text style={styles.reqInfoValue}>{req.experience}</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Salary</Text>
                      <Text style={styles.reqInfoValue}>{req.salary}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reqSimpleInfo}>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Joining</Text>
                      <Text style={styles.reqInfoValue}>{req.joining}</Text>
                    </View>
                    <View style={styles.reqInfoCol}>
                      <Text style={styles.reqInfoLabel}>Type</Text>
                      <Text style={styles.reqInfoValue}>{req.typeStr}</Text>
                    </View>
                  </View>

                  <View style={styles.reqFooterAction}>
                    <TouchableOpacity style={styles.textActionBtn} onPress={() => openDetails(req)}>
                      <Text style={styles.reqActionText}>View Opportunity</Text>
                      <ChevronRight size={16} color={NAVY} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitBtn} onPress={() => openSubmit(req)}>
                      <UserPlus size={16} color={WHITE} style={{marginRight: 6}} />
                      <Text style={styles.submitBtnText}>Submit Candidates</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Opportunity Details Modal */}
      <Modal animationType="fade" transparent={true} visible={detailsVisible} onRequestClose={() => setDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Job Opportunity Details</Text>
              <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.closeBtn}><X size={24} color={MUTED} /></TouchableOpacity>
            </View>

            {selectedReq && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.modalTopInfo}>
                  <Text style={styles.modalId}>{selectedReq.id}</Text>
                  <Text style={styles.modalRoleTitle}>{selectedReq.role}</Text>
                  <Text style={styles.modalSubTitle}>{selectedReq.businessName} · {selectedReq.type} · {selectedReq.location}</Text>
                </View>

                <View style={styles.modalSection}>
                  <View style={styles.modalGrid}>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Staff Count</Text><Text style={styles.modalValue}>{selectedReq.count} Staff</Text></View>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Experience</Text><Text style={styles.modalValue}>{selectedReq.experience}</Text></View>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Salary Range</Text><Text style={styles.modalValue}>{selectedReq.salary}</Text></View>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Joining Date</Text><Text style={styles.modalValue}>{selectedReq.joining}</Text></View>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Employment Type</Text><Text style={styles.modalValue}>{selectedReq.typeStr}</Text></View>
                    <View style={styles.modalCol}><Text style={styles.modalLabel}>Shift Details</Text><Text style={styles.modalValue}>{selectedReq.shift}</Text></View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Skills Required</Text>
                  <Text style={styles.modalBodyText}>{selectedReq.skills}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Job Description</Text>
                  <Text style={styles.modalBodyText}>{selectedReq.desc}</Text>
                </View>

                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoTitle}>Request Source</Text>
                  <Text style={styles.modalInfoText}>Common Feed Wall</Text>
                </View>

                <View style={{height: 40}} />
              </ScrollView>
            )}

            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={handleDecline}>
                <Text style={styles.btnOutlineText}>Decline Opportunity</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => { setDetailsVisible(false); openSubmit(selectedReq); }}>
                <Text style={styles.btnPrimaryText}>Submit Candidates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Candidates Modal */}
      <Modal animationType="fade" transparent={true} visible={submitVisible} onRequestClose={() => setSubmitVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Submit Candidates</Text>
                {selectedReq && <Text style={styles.modalSubtitle}>Select suitable candidates for {selectedReq.role}</Text>}
              </View>
              <TouchableOpacity onPress={() => setSubmitVisible(false)} style={styles.closeBtn}><X size={24} color={MUTED} /></TouchableOpacity>
            </View>

            {selectedReq && (
              <View style={styles.submissionContextRow}>
                <Text style={styles.subContextText}><Text style={{fontWeight: '700'}}>{selectedReq.id}</Text> · {selectedReq.businessName}</Text>
                <Text style={styles.subContextCount}>Required: {selectedReq.count} Staff</Text>
              </View>
            )}

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Available Candidates ({MOCK_CANDIDATES.length})</Text>
              <View style={{marginTop: 12}}>
                {MOCK_CANDIDATES.map(cand => {
                  const isSelected = selectedCandidates.includes(cand.id);
                  return (
                    <TouchableOpacity 
                      key={cand.id} 
                      style={[styles.candidateRow, isSelected && styles.candidateRowSelected]}
                      onPress={() => toggleCandidate(cand.id)}
                    >
                      <View style={styles.candIconBox}>
                        <User size={20} color={isSelected ? PURPLE : MUTED} />
                      </View>
                      <View style={styles.candInfo}>
                        <Text style={styles.candName}>{cand.name}</Text>
                        <Text style={styles.candSub}>{cand.role} · {cand.experience}</Text>
                        <Text style={styles.candMeta}>Exp. Salary: {cand.salary} · {cand.location}</Text>
                      </View>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <CheckCircle size={14} color={WHITE} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{height: 40}} />
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setSubmitVisible(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnPrimary, selectedCandidates.length === 0 && {opacity: 0.5}]} 
                onPress={handleSubmitCandidates}
              >
                <Text style={styles.btnPrimaryText}>Submit Selected ({selectedCandidates.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%'
  },
  
  // Hero
  heroCard: {
    marginBottom: 24,
    backgroundColor: NAVY,
    borderRadius: 18,
    padding: 20,
    overflow: 'hidden',
  },
  heroGreeting: { fontSize: 14, color: '#CBD5E1', marginBottom: 4 },
  heroAgencyName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  heroStatusBadge: { backgroundColor: 'rgba(246, 184, 0, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  heroStatusText: { fontSize: 12, fontWeight: '700', color: '#F6B800' },
  heroDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 20, maxWidth: '90%' },
  
  // Sections
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: MUTED, paddingRight: 16 },
  feedWallLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: NAVY },
  
  // Overview Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  overviewCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  overviewIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  overviewValue: { fontSize: 24, fontWeight: '800', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, fontWeight: '600', color: MUTED },
  overviewFooter: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  overviewLinkText: { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginRight: 2 },
  
  // Feed
  desktopFeedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: NAVY, marginTop: 12, marginBottom: 4 },
  emptyText: { fontSize: 13, color: MUTED, textAlign: 'center', maxWidth: '80%' },

  // Opportunity Card
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  reqTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  reqId: { fontSize: 12, fontWeight: '700', color: MUTED },
  reqStatusBadge: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reqStatusText: { fontSize: 10, fontWeight: '800', color: '#2563EB', letterSpacing: 0.5 },
  
  reqRole: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  reqBusinessRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  reqBusinessText: { fontSize: 14, fontWeight: '600', color: MUTED },
  reqBusinessSub: { fontSize: 14, color: MUTED },
  
  reqSimpleInfo: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, gap: 16 },
  reqInfoCol: { flex: 1, minWidth: '30%' },
  reqInfoLabel: { fontSize: 11, fontWeight: '700', color: MUTED, marginBottom: 4 },
  reqInfoValue: { fontSize: 13, fontWeight: '600', color: NAVY },
  
  reqFooterAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', height: 44, paddingRight: 16 },
  reqActionText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 4 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, height: 42, borderRadius: 12 },
  submitBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, maxHeight: '90%', width: '100%', maxWidth: 600 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  modalSubtitle: { fontSize: 13, color: MUTED, marginTop: 4 },
  closeBtn: { padding: 4, marginLeft: 16 },
  
  modalBody: { padding: 20 },
  modalTopInfo: { marginBottom: 20 },
  modalId: { fontSize: 12, fontWeight: '700', color: MUTED, marginBottom: 4 },
  modalRoleTitle: { fontSize: 24, fontWeight: '800', color: NAVY, marginBottom: 4 },
  modalSubTitle: { fontSize: 14, color: MUTED, fontWeight: '500' },
  
  modalSection: { marginBottom: 24 },
  modalSectionTitle: { fontSize: 14, fontWeight: '800', color: MUTED, letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12 },
  modalCol: { width: '45%', marginBottom: 8 },
  modalLabel: { fontSize: 11, fontWeight: '700', color: MUTED, marginBottom: 4 },
  modalValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalBodyText: { fontSize: 14, color: NAVY, lineHeight: 22 },
  
  modalInfoBox: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  modalInfoTitle: { fontSize: 12, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
  modalInfoText: { fontSize: 14, fontWeight: '600', color: NAVY },
  
  modalFooterActions: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
  btnOutline: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '700', color: NAVY },
  btnPrimary: { flex: 1, height: 48, borderRadius: 12, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Submit Flow
  submissionContextRow: { backgroundColor: '#F8FAFC', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subContextText: { fontSize: 13, color: NAVY },
  subContextCount: { fontSize: 13, fontWeight: '700', color: PURPLE },
  
  candidateRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  candidateRowSelected: { backgroundColor: '#F5F3FF', borderColor: PURPLE },
  candIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  candInfo: { flex: 1 },
  candName: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 2 },
  candSub: { fontSize: 13, color: NAVY, fontWeight: '500', marginBottom: 2 },
  candMeta: { fontSize: 12, color: MUTED },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  checkboxSelected: { backgroundColor: PURPLE, borderColor: PURPLE },
});
