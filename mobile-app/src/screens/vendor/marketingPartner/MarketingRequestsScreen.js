import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, 
  ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  Search, SlidersHorizontal, ChevronRight, Send, 
  MoreVertical, X, CheckCircle
} from 'lucide-react-native';

const { height } = Dimensions.get('window');

const DIRECT_REQUESTS = [
  { 
    id: "DIR-001", 
    client: "The Meridian Hotels", 
    campaign: "Wedding Season Social Ads", 
    type: "Online", 
    category: "Performance Marketing", 
    budget: "₹1,50,000", 
    startDate: "01 Sep 2026", 
    duration: "2 Months", 
    location: "Mumbai, Maharashtra", 
    requestedTime: "3 hours ago", 
    status: "New",
    objective: "Drive luxury wedding package inquiries.",
    targetAudience: "HNIs, Engaged Couples (25-35)",
    platforms: "Instagram, Facebook, Google Ads",
    deliverables: "4 Ad Sets, Weekly Analytics, Landing Page Optimization",
    ownerNote: "We are looking for an agency that has previous luxury hospitality experience.",
    attachments: 2
  },
  { 
    id: "DIR-002", 
    client: "Café Zephyr Group", 
    campaign: "Weekend Brunch Influencer Push", 
    type: "Online & Offline", 
    category: "Influencer Marketing", 
    budget: "₹30,000", 
    startDate: "20 Aug 2026", 
    duration: "1 Month", 
    location: "Mumbai, Maharashtra", 
    requestedTime: "1 day ago", 
    status: "Viewed",
    objective: "Increase weekend footfall via local food bloggers.",
    targetAudience: "Foodies, Gen-Z, Millennials (18-30)",
    platforms: "Instagram Reels, Zomato Reviews",
    deliverables: "10 Influencer Collaborations, Event Coverage",
    ownerNote: "Influencers must have >50k local followers.",
    attachments: 0
  }
];

const DECLINE_REASONS = [
  "Budget not suitable",
  "Timeline unavailable",
  "Service not offered",
  "Location not suitable",
  "Current workload is full",
  "Other"
];

const DIRECT_FILTERS = ["All", "New", "Viewed", "Proposal Sent", "Declined", "Closed"];

export default function MarketingRequestsScreen({ setActivePage, handleSendProposal: parentHandleSendProposal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [directFilter, setDirectFilter] = useState("All");
  
  // Modals
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [sendProposalVisible, setSendProposalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState(null);
  const [declineOtherText, setDeclineOtherText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [successToast, setSuccessToast] = useState("");

  // Proposal Form State
  const [propTitle, setPropTitle] = useState("");
  const [propAmount, setPropAmount] = useState("");
  const [propDuration, setPropDuration] = useState("");
  const [propStartDate, setPropStartDate] = useState("");
  const [propSummary, setPropSummary] = useState("");
  const [propStrategy, setPropStrategy] = useState("");
  const [propDeliverables, setPropDeliverables] = useState("");
  const [propRevisions, setPropRevisions] = useState("");
  const [propPayment, setPropPayment] = useState("");
  const [propValidUntil, setPropValidUntil] = useState("");

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const openDetails = (req) => {
    setSelectedRequest(req);
    setActiveMenuId(null);
    setDetailsModalVisible(true);
  };

  const openDecline = (req) => {
    setSelectedRequest(req);
    setActiveMenuId(null);
    setSelectedDeclineReason(null);
    setDeclineOtherText("");
    setDeclineModalVisible(true);
  };

  const openSendProposal = (req) => {
    setSelectedRequest(req);
    setActiveMenuId(null);
    // Reset form
    setPropTitle(""); setPropAmount(""); setPropDuration(""); setPropStartDate("");
    setPropSummary(""); setPropStrategy(""); setPropDeliverables(""); setPropRevisions("");
    setPropPayment(""); setPropValidUntil("");
    setSendProposalVisible(true);
  };

  const submitProposal = () => {
    setSendProposalVisible(false);
    setDetailsModalVisible(false);
    
    // In a real implementation this would:
    // 1. Change Direct Request status to Proposal Sent
    // 2. Add the proposal to the Proposals page state/backend
    
    showToast("Proposal submitted successfully.");
  };

  const isProposalValid = () => {
    return propTitle && propAmount && propDuration && propStartDate && propSummary && propDeliverables && propValidUntil;
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'New': return { bg: '#E0F2FE', text: '#0369A1' }; // Soft blue
      case 'Viewed': return { bg: '#F1F5F9', text: '#475569' }; // Soft gray-blue
      case 'Proposal Sent': return { bg: '#E0F2FE', text: '#0369A1' }; // Soft blue
      case 'Accepted': return { bg: '#DCFCE7', text: '#15803D' }; // Soft green
      case 'Declined': return { bg: '#FEE2E2', text: '#B91C1C' }; // Soft red
      case 'Closed': return { bg: '#F3F4F6', text: '#4B5563' }; // Soft gray
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderFilterChips = () => (
    <View style={styles.filterWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {DIRECT_FILTERS.map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterChip, directFilter === f && styles.filterChipActive]}
            onPress={() => setDirectFilter(f)}
          >
            <Text style={[styles.filterChipText, directFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDirectRequestCard = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const isMenuOpen = activeMenuId === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.idText}>{item.id}</Text>
            <View style={styles.badgeDirect}><Text style={styles.badgeDirectText}>DIRECT REQUEST</Text></View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.campaign}</Text>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={styles.detailValue}>{item.budget}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{item.location}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{item.startDate}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{item.duration}</Text>
          </View>
        </View>

        <Text style={styles.timeText}>Requested {item.requestedTime}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.textAction} onPress={() => openDetails(item)}>
            <Text style={styles.textActionLabel}>View Details</Text>
            <ChevronRight size={16} color="#1E3A8A" />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            {(item.status === 'New' || item.status === 'Viewed') && (
              <>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => openSendProposal(item)}>
                  <Text style={styles.btnPrimaryText}>Send Proposal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.moreBtn} 
                  onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                >
                  <MoreVertical size={20} color="#64748B" />
                </TouchableOpacity>
              </>
            )}
            {item.status === 'Proposal Sent' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setActivePage('proposals')}>
                <Text style={styles.btnPrimaryText}>View Proposal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isMenuOpen && (
          <View style={styles.moreMenu}>
            {(item.status === 'New' || item.status === 'Viewed') && (
              <TouchableOpacity style={styles.menuItem} onPress={() => openDecline(item)}>
                <Text style={styles.menuItemDanger}>Decline Request</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveMenuId(null)}>
              <Text style={styles.menuItemText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const getFilteredDirect = () => {
    return directFilter === 'All' ? DIRECT_REQUESTS : DIRECT_REQUESTS.filter(r => r.status === directFilter);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <Text style={styles.pageTitle}>Requests</Text>
          <Text style={styles.pageSubtitle}>Marketing requests sent directly to your agency</Text>
          <View style={styles.headerActions}>
            <View style={styles.searchBar}>
              <Search size={18} color="#94A3B8" />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search requests, clients, or services..." 
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetVisible(true)}>
              <SlidersHorizontal size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
        </View>

        {renderFilterChips()}

        <FlatList
          data={getFilteredDirect()}
          keyExtractor={(item) => item.id}
          renderItem={renderDirectRequestCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No matching requests found</Text>
              <Text style={styles.emptyStateSub}>Try changing your search or filters.</Text>
            </View>
          }
        />

        {successToast ? (
          <View style={styles.toast}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.toastText}>{successToast}</Text>
          </View>
        ) : null}

        {/* View Details Modal */}
        <Modal visible={detailsModalVisible} transparent animationType="fade" onRequestClose={() => setDetailsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Direct Request Details</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              {selectedRequest && (
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Text style={styles.idText}>{selectedRequest.id}</Text>
                  <Text style={styles.modalCampaignTitle}>{selectedRequest.campaign}</Text>
                  <Text style={styles.clientName}>{selectedRequest.client}</Text>
                  <Text style={styles.categoryText}>{selectedRequest.category}</Text>
                  
                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionTitle}>Project Brief</Text>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Objective</Text><Text style={styles.detailValueM}>{selectedRequest.objective}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Target Audience</Text><Text style={styles.detailValueM}>{selectedRequest.targetAudience}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Deliverables</Text><Text style={styles.detailValueM}>{selectedRequest.deliverables}</Text></View>
                  
                  <View style={styles.sectionDivider} />
                  <Text style={styles.sectionTitle}>Logistics</Text>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Budget</Text><Text style={styles.detailValueM}>{selectedRequest.budget}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Location</Text><Text style={styles.detailValueM}>{selectedRequest.location}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Start Date</Text><Text style={styles.detailValueM}>{selectedRequest.startDate}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailLabelM}>Duration</Text><Text style={styles.detailValueM}>{selectedRequest.duration}</Text></View>

                  {selectedRequest.ownerNote && (
                    <>
                      <View style={styles.sectionDivider} />
                      <Text style={styles.sectionTitle}>Client Notes</Text>
                      <Text style={styles.modalNote}>{selectedRequest.ownerNote}</Text>
                    </>
                  )}
                </ScrollView>
              )}
              <View style={styles.modalFooterActions}>
                {(selectedRequest?.status === 'New' || selectedRequest?.status === 'Viewed') && (
                  <>
                    <TouchableOpacity style={styles.btnOutlineModal} onPress={() => { setDetailsModalVisible(false); openDecline(selectedRequest); }}>
                      <Text style={styles.btnDangerOutlineText}>Decline Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setDetailsModalVisible(false); openSendProposal(selectedRequest); }}>
                      <Text style={styles.btnPrimaryText}>Send Proposal</Text>
                    </TouchableOpacity>
                  </>
                )}
                {selectedRequest?.status === 'Proposal Sent' && (
                  <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setDetailsModalVisible(false); setActivePage('proposals'); }}>
                    <Text style={styles.btnPrimaryText}>View Proposal</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Send Proposal Modal */}
        <Modal visible={sendProposalVisible} transparent animationType="slide" onRequestClose={() => setSendProposalVisible(false)}>
          <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Send Proposal</Text>
                  <Text style={styles.modalSubtitle}>Create a proposal for {selectedRequest?.campaign}</Text>
                </View>
                <TouchableOpacity onPress={() => setSendProposalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <View style={styles.contextBox}>
                  <Text style={styles.contextClient}>{selectedRequest?.client}</Text>
                  <Text style={styles.contextCat}>{selectedRequest?.category}</Text>
                  <View style={styles.contextRow}>
                    <Text style={styles.contextLabel}>Client Budget: <Text style={styles.contextVal}>{selectedRequest?.budget}</Text></Text>
                    <Text style={styles.contextLabel}>Preferred Start: <Text style={styles.contextVal}>{selectedRequest?.startDate}</Text></Text>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Proposal Title *</Text>
                <TextInput style={styles.input} value={propTitle} onChangeText={setPropTitle} placeholder="Enter a proposal title" />

                <View style={styles.inputRow}>
                  <View style={{flex:1, marginRight: 8}}>
                    <Text style={styles.inputLabel}>Proposed Amount *</Text>
                    <TextInput style={styles.input} value={propAmount} onChangeText={setPropAmount} placeholder="e.g. ₹1,40,000" keyboardType="numeric" />
                  </View>
                  <View style={{flex:1, marginLeft: 8}}>
                    <Text style={styles.inputLabel}>Estimated Duration *</Text>
                    <TextInput style={styles.input} value={propDuration} onChangeText={setPropDuration} placeholder="e.g. 2 Months" />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={{flex:1, marginRight: 8}}>
                    <Text style={styles.inputLabel}>Proposed Start Date *</Text>
                    <TextInput style={styles.input} value={propStartDate} onChangeText={setPropStartDate} placeholder="DD MMM YYYY" />
                  </View>
                  <View style={{flex:1, marginLeft: 8}}>
                    <Text style={styles.inputLabel}>Valid Until *</Text>
                    <TextInput style={styles.input} value={propValidUntil} onChangeText={setPropValidUntil} placeholder="DD MMM YYYY" />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Proposal Summary *</Text>
                <TextInput style={[styles.input, styles.textArea]} value={propSummary} onChangeText={setPropSummary} placeholder="Add a short proposal summary" multiline numberOfLines={3} />

                <Text style={styles.inputLabel}>Deliverables *</Text>
                <TextInput style={[styles.input, styles.textArea]} value={propDeliverables} onChangeText={setPropDeliverables} placeholder="Add at least one deliverable" multiline numberOfLines={3} />

                <Text style={styles.inputLabel}>Strategy / Approach (Optional)</Text>
                <TextInput style={[styles.input, styles.textArea]} value={propStrategy} onChangeText={setPropStrategy} placeholder="Your strategy" multiline numberOfLines={3} />

                <Text style={styles.inputLabel}>Payment Terms (Optional)</Text>
                <TextInput style={styles.input} value={propPayment} onChangeText={setPropPayment} placeholder="e.g. 50% Advance" />
              </ScrollView>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal}>
                  <Text style={styles.btnOutlineTextBlack}>Save Draft</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnPrimaryModal, !isProposalValid() && { opacity: 0.5 }]} 
                  disabled={!isProposalValid()}
                  onPress={submitProposal}
                >
                  <Text style={styles.btnPrimaryText}>Submit Proposal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Decline Modal */}
        <Modal visible={declineModalVisible} transparent animationType="fade" onRequestClose={() => setDeclineModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '70%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Decline this request?</Text>
                <TouchableOpacity onPress={() => setDeclineModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {DECLINE_REASONS.map(reason => (
                  <TouchableOpacity key={reason} style={styles.radioRow} onPress={() => setSelectedDeclineReason(reason)}>
                    <View style={[styles.radioOuter, selectedDeclineReason === reason && styles.radioOuterSelected]}>
                      {selectedDeclineReason === reason && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
                {selectedDeclineReason === 'Other' && (
                  <TextInput 
                    style={[styles.input, { marginTop: 12 }]} 
                    placeholder="Please specify" 
                    value={declineOtherText} 
                    onChangeText={setDeclineOtherText} 
                  />
                )}
              </ScrollView>
              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setDeclineModalVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnDangerModal, (!selectedDeclineReason || (selectedDeclineReason === 'Other' && !declineOtherText)) && { opacity: 0.5 }]} 
                  disabled={!selectedDeclineReason || (selectedDeclineReason === 'Other' && !declineOtherText)}
                  onPress={() => setDeclineModalVisible(false)}
                >
                  <Text style={styles.btnPrimaryText}>Decline Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Filter Bottom Sheet */}
        <Modal visible={filterSheetVisible} transparent animationType="slide" onRequestClose={() => setFilterSheetVisible(false)}>
          <View style={styles.bottomSheetOverlay}>
            <TouchableOpacity style={{flex: 1}} onPress={() => setFilterSheetVisible(false)} />
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setFilterSheetVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 16}}>
                <Text style={styles.filterLabel}>Request Status</Text>
                <Text style={styles.filterLabel}>Marketing Service</Text>
                <Text style={styles.filterLabel}>Budget Range</Text>
                <Text style={styles.filterLabel}>Location</Text>
                <Text style={styles.filterLabel}>Start Date</Text>
                <Text style={styles.filterLabel}>Duration</Text>
                <Text style={styles.filterLabel}>Priority</Text>
                <Text style={{color: '#94A3B8', fontStyle: 'italic', marginVertical: 20}}>Filter options placeholder</Text>
              </ScrollView>
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setFilterSheetVisible(false)}>
                  <Text style={styles.btnOutlineTextBlack}>Clear Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setFilterSheetVisible(false)}>
                  <Text style={styles.btnPrimaryText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  headerArea: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff'
  },
  pageTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 14, color: '#64748B', marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row', marginTop: 16, gap: 12,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 42,
  },
  searchInput: {
    flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A',
  },
  filterBtn: {
    width: 42, height: 42, backgroundColor: '#EFF6FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  filterWrapper: {
    marginTop: 12, paddingLeft: 16, paddingBottom: 12,
  },
  filterScroll: {
    paddingRight: 16, gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#1E3A8A', borderColor: '#1E3A8A',
  },
  filterChipText: {
    fontSize: 13, color: '#64748B', fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16, paddingBottom: 115, gap: 12,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, position: 'relative'
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  idText: {
    fontSize: 12, fontWeight: '600', color: '#64748B',
  },
  badgeDirect: {
    backgroundColor: '#F3E8FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  badgeDirectText: {
    color: '#071B3A', fontSize: 10, fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  statusText: {
    fontSize: 10, fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4,
  },
  clientName: {
    fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 2,
  },
  categoryText: {
    fontSize: 12, color: '#64748B', marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12,
  },
  detailCol: {
    width: '46%',
  },
  detailLabel: {
    fontSize: 11, color: '#94A3B8', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13, color: '#1E293B', fontWeight: '600',
  },
  timeText: {
    fontSize: 12, color: '#94A3B8', marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12,
  },
  textAction: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },
  textActionLabel: {
    fontSize: 14, fontWeight: '600', color: '#1E3A8A', marginRight: 4,
  },
  rightActions: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  btnPrimary: {
    backgroundColor: '#071B3A', paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: '600', fontSize: 14,
  },
  btnOutline: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineText: {
    color: '#334155', fontWeight: '600', fontSize: 14,
  },
  moreBtn: {
    padding: 8, marginLeft: -4,
  },
  moreMenu: {
    position: 'absolute', right: 16, bottom: 56, width: 190, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 10,
  },
  menuItem: {
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 14, color: '#334155', fontWeight: '500',
  },
  menuItemDanger: {
    fontSize: 14, color: '#EF4444', fontWeight: '500',
  },
  
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85%', overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13, color: '#64748B', marginTop: 2,
  },
  modalScroll: {
    padding: 16,
  },
  modalCampaignTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginTop: 8, marginBottom: 4,
  },
  sectionDivider: {
    height: 1, backgroundColor: '#F1F5F9', marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row', marginBottom: 8,
  },
  detailLabelM: {
    flex: 1, fontSize: 13, color: '#64748B',
  },
  detailValueM: {
    flex: 2, fontSize: 13, color: '#1E293B', fontWeight: '500',
  },
  modalNote: {
    fontSize: 13, color: '#475569', lineHeight: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8,
  },
  modalFooterActions: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12,
  },
  btnPrimaryModal: {
    flex: 1, backgroundColor: '#071B3A', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineModal: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnDangerModal: {
    flex: 1, backgroundColor: '#EF4444', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineTextBlack: {
    color: '#0F172A', fontWeight: '600', fontSize: 14,
  },
  btnDangerOutlineText: {
    color: '#EF4444', fontWeight: '600', fontSize: 14,
  },

  contextBox: {
    backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16,
  },
  contextClient: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A',
  },
  contextCat: {
    fontSize: 12, color: '#64748B', marginBottom: 8,
  },
  contextRow: {
    flexDirection: 'row', gap: 16,
  },
  contextLabel: {
    fontSize: 12, color: '#64748B',
  },
  contextVal: {
    fontWeight: '600', color: '#1E293B',
  },
  inputLabel: {
    fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12,
  },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: '#0F172A',
  },
  textArea: {
    height: 80, paddingVertical: 10, textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row', justifyContent: 'space-between',
  },

  radioRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#071B3A',
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#071B3A',
  },
  radioText: {
    fontSize: 14, color: '#1E293B',
  },

  bottomSheetOverlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  sheetFooter: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12, backgroundColor: '#fff',
  },
  filterLabel: {
    fontSize: 14, fontWeight: '500', color: '#334155', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },

  emptyState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginTop: 16,
  },
  emptyStateSub: {
    fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center', paddingHorizontal: 20
  },
  toast: {
    position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  toastText: {
    color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 14,
  }
});
