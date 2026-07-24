import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, Dimensions, Modal, KeyboardAvoidingView,
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  Building2, UsersRound, ArrowUpDown, ShieldCheck, Star, 
  ChevronRight, MoreVertical, X, Clock3, AlertCircle 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F8FAFC';
const MUTED = '#94A3B8';
const GRAY = '#64748B';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const RED = '#EF4444';
const GOLD = '#D97706';

const RESPONSES = [];
const CANDIDATES = [];

const getStatusStyle = (status) => {
  switch (status) {
    case 'New': return { bg: '#EFF6FF', text: BLUE };
    case 'Reviewed': return { bg: '#F1F5F9', text: GRAY };
    case 'Candidates Shortlisted': return { bg: '#D1FAE5', text: GREEN };
    case 'Declined': return { bg: '#FEE2E2', text: RED };
    case 'Selected Agency': return { bg: '#F5F3FF', text: '#8B5CF6' };
    default: return { bg: '#F1F5F9', text: GRAY };
  }
};

export default function AgencyResponsesPage({ requirement, onBack }) {
  const [filter, setFilter] = useState('All');
  
  // Modals
  const [agencyModal, setAgencyModal] = useState(false);
  const [candidatesModal, setCandidatesModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [shortlistModal, setShortlistModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const openMoreMenu = (id) => {
    setActiveMenuId(id);
    setMoreMenuVisible(true);
  };

  const handleDecline = () => {
    setDeclineModal(true);
    setMoreMenuVisible(false);
  };

  const handleShortlist = () => {
    setShortlistModal(false);
    // show toast candidate shortlisted successfully
  };

  return (
    <View style={styles.container}>
      {/* Global Header spacing/mock replacement */}
      <View style={styles.globalHeaderMock} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isMobile ? (width < 340 ? 12 : 16) : 24 }]}>
        
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.pageTitleRow}>
            <Building2 size={24} color={NAVY} />
            <Text style={styles.pageTitle}>Agency Responses</Text>
          </View>
          <Text style={styles.pageSubtitle}>Compare agencies and review proposed candidates</Text>
        </View>

        {/* Requirement Summary */}
        <View style={styles.reqSummaryCard}>
          <Text style={styles.reqId}>REQ-091</Text>
          <View style={styles.reqDetailsRow}>
            <Text style={styles.reqVal}>Head Chef</Text>
            <Text style={styles.reqDot}>·</Text>
            <Text style={styles.reqVal}>2 Staff Needed</Text>
            <Text style={styles.reqDot}>·</Text>
            <Text style={styles.reqVal}>Mumbai</Text>
          </View>
          <Text style={styles.reqJoining}>Joining: Immediate</Text>
          <TouchableOpacity style={styles.viewReqBtn}>
            <Text style={styles.viewReqText}>View Requirement →</Text>
          </TouchableOpacity>
        </View>

        {/* Response Count and Sorting */}
        <View style={styles.controlsRow}>
          <Text style={styles.responseCount}>2 Agency Responses</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort</Text>
            <ArrowUpDown size={16} color={NAVY} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {['All', 'Verified', 'Reviewed', 'New'].map(f => (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterPill, filter === f && styles.filterPillActive]} 
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Agency Cards */}
        <View style={styles.cardsGrid}>
          {RESPONSES.map(res => {
            const sStyle = getStatusStyle(res.status);
            return (
              <View key={res.id} style={[styles.agencyCard, !isMobile && { width: '48%', marginRight: '2%' }]}>
                
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{res.initials}</Text>
                    </View>
                    <View>
                      <Text style={styles.agencyName} numberOfLines={1}>{res.agencyName}</Text>
                      <View style={styles.badgesRow}>
                        {res.verified && (
                          <View style={styles.verifiedRow}>
                            <ShieldCheck size={14} color={GREEN} />
                            <Text style={styles.verifiedText}>Verified Agency</Text>
                          </View>
                        )}
                        <View style={styles.ratingBadge}>
                          <Star size={12} color={GOLD} fill={GOLD} />
                          <Text style={styles.ratingText}>{res.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardHeaderRight}>
                    <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: sStyle.text }]}>{res.status}</Text>
                    </View>
                    <TouchableOpacity onPress={() => openMoreMenu(res.id)} style={{ padding: 4 }}>
                      <MoreVertical size={20} color={GRAY} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2x2 Grid */}
                <View style={styles.comparisonGrid}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>CANDIDATES</Text>
                    <Text style={styles.gridValue}>{res.candidatesOffered} Offered</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>SERVICE FEE</Text>
                    <Text style={styles.gridValue}>{res.serviceFee}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>REPLACEMENT</Text>
                    <Text style={styles.gridValue}>{res.replacementPeriod}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>JOINING</Text>
                    <Text style={styles.gridValue}>{res.joiningTime}</Text>
                  </View>
                </View>

                {/* Footer Actions */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.textBtn} onPress={() => { setSelectedAgency(res); setAgencyModal(true); }}>
                    <Text style={styles.textBtnText}>View Agency</Text>
                    <ChevronRight size={16} color={NAVY} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => { setSelectedAgency(res); setCandidatesModal(true); }}>
                    <UsersRound size={16} color={WHITE} />
                    <Text style={styles.primaryBtnText}>Review Candidates</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* More Menu anchored modal (mock position) */}
      {moreMenuVisible && (
        <Modal transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setMoreMenuVisible(false)}>
            <View style={styles.menuOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.menuContent}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
                    <Text style={styles.menuItemText}>Compare Agency</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                  <TouchableOpacity style={styles.menuItem} onPress={handleDecline}>
                    <Text style={styles.menuItemTextRed}>Decline Response</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Modals */}
      
      {/* Decline Response Modal */}
      <Modal visible={declineModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decline this agency response?</Text>
              <TouchableOpacity onPress={() => setDeclineModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.confirmText}>Agency: <Text style={{fontWeight: 'bold', color: NAVY}}>Elite Staffing Co.</Text></Text>
              <Text style={styles.confirmText}>Requirement: <Text style={{fontWeight: 'bold', color: NAVY}}>REQ-091</Text></Text>
              
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Reason for declining:</Text>
              <TouchableOpacity style={styles.reasonOption}><Text style={styles.reasonText}>Service fee is too high</Text></TouchableOpacity>
              <TouchableOpacity style={styles.reasonOption}><Text style={styles.reasonText}>Candidate profiles are not suitable</Text></TouchableOpacity>
              <TouchableOpacity style={styles.reasonOption}><Text style={styles.reasonText}>Joining timeline is not suitable</Text></TouchableOpacity>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setDeclineModal(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimaryModal, { backgroundColor: RED }]} onPress={() => setDeclineModal(false)}>
                <Text style={styles.btnPrimaryText}>Decline Response</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Agency Profile Modal */}
      <Modal visible={agencyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 560, maxHeight: '84%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agency Profile</Text>
              <TouchableOpacity onPress={() => setAgencyModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={[styles.avatar, { width: 64, height: 64, borderRadius: 32, marginBottom: 12 }]}>
                  <Text style={[styles.avatarText, { fontSize: 24 }]}>{selectedAgency?.initials}</Text>
                </View>
                <Text style={[styles.agencyName, { fontSize: 20, marginBottom: 4 }]}>{selectedAgency?.agencyName}</Text>
                <View style={styles.badgesRow}>
                  {selectedAgency?.verified && (
                    <View style={styles.verifiedRow}>
                      <ShieldCheck size={16} color={GREEN} />
                      <Text style={styles.verifiedText}>Verified Agency</Text>
                    </View>
                  )}
                  <View style={styles.ratingBadge}>
                    <Star size={14} color={GOLD} fill={GOLD} />
                    <Text style={styles.ratingText}>{selectedAgency?.rating}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Business Information</Text>
              <View style={styles.comparisonGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>SERVICE FEE MODEL</Text>
                  <Text style={styles.gridValue}>{selectedAgency?.serviceFee}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>REPLACEMENT POLICY</Text>
                  <Text style={styles.gridValue}>{selectedAgency?.replacementPeriod}</Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setAgencyModal(false)}>
                <Text style={styles.btnOutlineText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setAgencyModal(false); setCandidatesModal(true); }}>
                <Text style={styles.btnPrimaryText}>Review Candidates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Candidates Modal */}
      <Modal visible={candidatesModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 600, maxHeight: '84%', backgroundColor: LIGHT_BG }]}>
            <View style={[styles.modalHeader, { backgroundColor: WHITE }]}>
              <View>
                <Text style={styles.modalTitle}>Candidates from {selectedAgency?.agencyName}</Text>
                <Text style={styles.modalSubtitle}>{CANDIDATES.length} candidates proposed for REQ-091</Text>
              </View>
              <TouchableOpacity onPress={() => setCandidatesModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              
              {CANDIDATES.map(cand => (
                <View key={cand.id} style={styles.candidateCard}>
                  <View style={styles.candHeader}>
                    <View style={styles.candAvatar}><Text style={styles.candAvatarText}>{cand.initials}</Text></View>
                    <View style={styles.candInfo}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.candName}>{cand.name}</Text>
                        <View style={styles.candStatus}><Text style={styles.candStatusText}>Available</Text></View>
                      </View>
                      <Text style={styles.candRole}>{cand.role} · {cand.exp}</Text>
                      <Text style={styles.candLoc}>{cand.loc}</Text>
                    </View>
                  </View>
                  <View style={styles.candMeta}>
                    <Text style={styles.candMetaText}>Expected Salary: <Text style={{fontWeight: 'bold', color: NAVY}}>{cand.salary}</Text></Text>
                    <Text style={styles.candMetaText}>Available: <Text style={{color: NAVY}}>{cand.avail}</Text></Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.textBtn}>
                      <Text style={styles.textBtnText}>View Profile</Text>
                      <ChevronRight size={16} color={NAVY} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnOutlineModal, { borderColor: NAVY, height: 36, paddingHorizontal: 12 }]} onPress={() => { setSelectedCandidate(cand); setShortlistModal(true); }}>
                      <Text style={[styles.btnOutlineText, { fontSize: 13 }]}>Shortlist Candidate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Shortlist Confirmation Modal */}
      <Modal visible={shortlistModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 360 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shortlist this candidate?</Text>
              <TouchableOpacity onPress={() => setShortlistModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.confirmText}>Candidate: <Text style={{fontWeight: 'bold', color: NAVY}}>{selectedCandidate?.name}</Text></Text>
              <Text style={styles.confirmText}>Agency: <Text style={{fontWeight: 'bold', color: NAVY}}>{selectedAgency?.agencyName}</Text></Text>
              <Text style={styles.confirmText}>Requirement: <Text style={{fontWeight: 'bold', color: NAVY}}>Head Chef · REQ-091</Text></Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setShortlistModal(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimaryModal} onPress={handleShortlist}>
                <Text style={styles.btnPrimaryText}>Shortlist Candidate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%', paddingTop: 20 },
  
  pageHeader: { marginBottom: 16 },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 13, color: GRAY },

  reqSummaryCard: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  reqId: { fontSize: 12, fontWeight: 'bold', color: GRAY, marginBottom: 4 },
  reqDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 },
  reqVal: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  reqDot: { fontSize: 16, fontWeight: 'bold', color: GRAY, marginHorizontal: 8 },
  reqJoining: { fontSize: 14, color: GRAY, marginBottom: 12 },
  viewReqBtn: { alignSelf: 'flex-start' },
  viewReqText: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  responseCount: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: WHITE },
  sortText: { fontSize: 13, fontWeight: '600', color: NAVY },

  filtersWrap: { marginBottom: 16 },
  filtersScroll: { gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  filterPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterText: { fontSize: 13, fontWeight: '500', color: NAVY },
  filterTextActive: { color: WHITE },

  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  agencyCard: { width: '100%', backgroundColor: WHITE, borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: BLUE },
  agencyName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 12, color: GREEN, fontWeight: '600' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: GOLD },
  
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

  comparisonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  gridItem: { width: isMobile ? '48%' : '23%', backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10 },
  gridLabel: { fontSize: 10, fontWeight: 'bold', color: MUTED, marginBottom: 4 },
  gridValue: { fontSize: 13, fontWeight: '600', color: NAVY },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  textBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textBtnText: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: NAVY, paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  // Menus & Modals
  menuOverlay: { flex: 1, backgroundColor: 'transparent' },
  menuContent: { position: 'absolute', top: 180, right: 24, width: 200, backgroundColor: WHITE, borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  menuItem: { padding: 12, borderRadius: 8 },
  menuItemText: { fontSize: 14, color: NAVY, fontWeight: '500' },
  menuItemTextRed: { fontSize: 14, color: RED, fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContainer: { backgroundColor: WHITE, borderRadius: 20, width: '100%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalSubtitle: { fontSize: 13, color: GRAY, marginTop: 4 },
  modalBody: { padding: 20 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: WHITE, gap: 12 },
  
  confirmText: { fontSize: 14, color: GRAY, marginBottom: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 12 },
  reasonOption: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  reasonText: { fontSize: 14, color: NAVY },

  btnOutlineModal: { paddingHorizontal: 16, height: 44, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: WHITE },
  btnOutlineText: { color: NAVY, fontWeight: 'bold', fontSize: 14 },
  btnPrimaryModal: { paddingHorizontal: 20, height: 44, borderRadius: 10, justifyContent: 'center', backgroundColor: NAVY },
  btnPrimaryText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },

  candidateCard: { backgroundColor: WHITE, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 16 },
  candHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  candAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  candAvatarText: { fontSize: 18, fontWeight: 'bold', color: BLUE },
  candInfo: { flex: 1 },
  candName: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  candStatus: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  candStatusText: { fontSize: 10, fontWeight: 'bold', color: GREEN },
  candRole: { fontSize: 14, color: GRAY, marginTop: 2 },
  candLoc: { fontSize: 12, color: MUTED, marginTop: 2 },
  candMeta: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16, gap: 4 },
  candMetaText: { fontSize: 13, color: GRAY },
});
