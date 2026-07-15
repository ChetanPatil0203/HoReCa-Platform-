import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { 
  Mail, FileText, Briefcase, MapPin, 
  Calendar, Clock, DollarSign, Activity, 
  X, CheckCircle, AlertCircle, Bookmark, Eye, Tag
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
    location: "Mumbai, MH", 
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
    location: "Mumbai, MH", 
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

const MY_PROPOSALS = [
  { 
    id: "PRP-201", 
    requirement: "REQ-101", 
    client: "Azure Palace Hotel", 
    campaign: "Summer Season Social Media Launch", 
    source: "Broadcast", 
    proposedAmount: "₹50,000", 
    submittedDate: "12 Jul 2026", 
    status: "Sent" 
  },
  { 
    id: "PRP-202", 
    requirement: "DIR-001", 
    client: "The Meridian Hotels", 
    campaign: "Wedding Season Social Ads", 
    source: "Direct", 
    proposedAmount: "₹1,40,000", 
    submittedDate: "14 Jul 2026", 
    status: "Draft" 
  },
  { 
    id: "PRP-199", 
    requirement: "REQ-095", 
    client: "Spice Route Restaurant", 
    campaign: "New Menu Launch PR", 
    source: "Broadcast", 
    proposedAmount: "₹25,000", 
    submittedDate: "01 Jul 2026", 
    status: "Accepted" 
  }
];

const DECLINE_REASONS = [
  "Service not offered",
  "Budget not suitable",
  "Timeline not possible",
  "Location not serviceable",
  "Agency capacity full",
  "Other"
];

export default function MarketingRequestsScreen({ setActivePage, handleSendProposal }) {
  const [activeTab, setActiveTab] = useState("Direct Requests");
  
  // Modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState(null);

  const openDetails = (req) => {
    setSelectedRequest(req);
    setDetailsModalVisible(true);
  };

  const openDecline = (req) => {
    setSelectedRequest(req);
    setDeclineModalVisible(true);
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['Direct Requests', 'My Proposals'].map((tab) => (
        <TouchableOpacity 
          key={tab} 
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDirectRequestCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeDirect}><Text style={styles.badgeDirectText}>Direct Request</Text></View>
        <Text style={styles.idText}>{item.id}</Text>
      </View>
      
      <Text style={styles.cardTitle}>{item.campaign}</Text>
      
      <View style={styles.detailsGrid}>
        <View style={styles.detailCol}><Briefcase size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.client}</Text></View>
        <View style={styles.detailCol}><Activity size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.category}</Text></View>
        <View style={styles.detailCol}><DollarSign size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.budget}</Text></View>
        <View style={styles.detailCol}><MapPin size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.location}</Text></View>
        <View style={styles.detailCol}><Calendar size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>Starts {item.startDate}</Text></View>
        <View style={styles.detailCol}><Clock size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.duration}</Text></View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.timeText}>Requested {item.requestedTime}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'New' ? '#DBEAFE' : '#F1F5F9' }]}>
          <Text style={[styles.statusText, { color: item.status === 'New' ? '#1D4ED8' : '#475569' }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => openDetails(item)}>
          <Text style={styles.btnOutlineText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => handleSendProposal(item)}>
          <Text style={styles.btnPrimaryText}>Send Proposal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDangerOutline} onPress={() => openDecline(item)}>
          <Text style={styles.btnDangerOutlineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return { bg: '#D1FAE5', text: '#059669' };
      case 'Rejected': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Draft': return { bg: '#F3F4F6', text: '#4B5563' };
      case 'Sent': return { bg: '#DBEAFE', text: '#1D4ED8' };
      default: return { bg: '#FEF3C7', text: '#D97706' };
    }
  };

  const renderProposalCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.idText}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.campaign}</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailCol}><Tag size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>Req: {item.requirement}</Text></View>
          <View style={styles.detailCol}><Briefcase size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.client}</Text></View>
          <View style={styles.detailCol}><DollarSign size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.proposedAmount}</Text></View>
          <View style={styles.detailCol}><Calendar size={14} color="#64748B" /><Text style={styles.detailText} numberOfLines={1}>{item.submittedDate}</Text></View>
        </View>

        <View style={styles.footerRow}>
          <View style={[styles.typeBadge, { backgroundColor: item.source === 'Direct' ? '#FCE7F3' : '#E0E7FF' }]}>
            <Text style={[styles.typeBadgeText, { color: item.source === 'Direct' ? '#BE185D' : '#4338CA' }]}>{item.source}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>{item.status === 'Draft' ? 'Edit Draft' : 'View Proposal'}</Text>
          </TouchableOpacity>
          {item.status !== 'Draft' && item.status !== 'Accepted' && item.status !== 'Rejected' && (
             <TouchableOpacity style={styles.btnDangerOutline}>
               <Text style={styles.btnDangerOutlineText}>Withdraw</Text>
             </TouchableOpacity>
          )}
          {item.status === 'Accepted' && (
             <TouchableOpacity style={styles.btnPrimary}>
               <Text style={styles.btnPrimaryText}>View Feedback</Text>
             </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderDetailsModal = () => (
    <Modal visible={detailsModalVisible} animationType="slide" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request Details</Text>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><X size={24} color="#0F172A" /></TouchableOpacity>
          </View>
          
          {selectedRequest && (
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                 <Text style={styles.modalSectionTitle}>Campaign Information</Text>
                 <Text style={styles.modalDataLabel}>Campaign Title</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.campaign}</Text>
                 
                 <Text style={styles.modalDataLabel}>Client Business</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.client}</Text>

                 <View style={{flexDirection: 'row', marginTop: 12}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Requirement ID</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.id}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Marketing Type</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.type}</Text>
                    </View>
                 </View>
                 
                 <Text style={[styles.modalDataLabel, {marginTop: 12}]}>Category</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.category}</Text>
              </View>

              <View style={styles.modalSection}>
                 <Text style={styles.modalSectionTitle}>Scope & Requirements</Text>
                 <Text style={styles.modalDataLabel}>Objective</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.objective}</Text>

                 <Text style={styles.modalDataLabel}>Target Audience</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.targetAudience}</Text>

                 <Text style={styles.modalDataLabel}>Platforms / Media</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.platforms}</Text>
                 
                 <Text style={styles.modalDataLabel}>Deliverables</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.deliverables}</Text>
              </View>

              <View style={styles.modalSection}>
                 <Text style={styles.modalSectionTitle}>Logistics</Text>
                 <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Budget</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.budget}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Location</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.location}</Text>
                    </View>
                 </View>
                 <View style={{flexDirection: 'row', marginTop: 12}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Start Date</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.startDate}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalDataLabel}>Duration</Text>
                      <Text style={styles.modalDataValue}>{selectedRequest.duration}</Text>
                    </View>
                 </View>
              </View>

              <View style={styles.modalSection}>
                 <Text style={styles.modalSectionTitle}>Additional Notes</Text>
                 <Text style={styles.modalDataValue}>{selectedRequest.ownerNote}</Text>
                 {selectedRequest.attachments > 0 && (
                   <View style={styles.attachmentBox}>
                     <FileText size={16} color="#475569" />
                     <Text style={styles.attachmentText}>{selectedRequest.attachments} Attachments Included</Text>
                   </View>
                 )}
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
             <TouchableOpacity style={styles.btnPrimaryFull} onPress={() => { setDetailsModalVisible(false); handleSendProposal(selectedRequest); }}>
               <Text style={styles.btnPrimaryText}>Send Proposal</Text>
             </TouchableOpacity>
             <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
               <TouchableOpacity style={styles.btnOutlineFull} onPress={() => { setDetailsModalVisible(false); openDecline(selectedRequest); }}>
                 <Text style={styles.btnDangerOutlineText}>Decline</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.btnOutlineFull}>
                 <Text style={styles.btnOutlineText}>Contact Owner</Text>
               </TouchableOpacity>
             </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDeclineModal = () => (
    <Modal visible={declineModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDeclineModalVisible(false)}>
      <View style={styles.bottomSheetOverlay}>
        <TouchableOpacity style={{flex: 1}} onPress={() => setDeclineModalVisible(false)} />
        <View style={styles.bottomSheetContainer}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Decline Request</Text>
          <Text style={styles.sheetSubtitle}>Please select a reason for declining this request. The client will be notified.</Text>

          <View style={styles.radioGroup}>
            {DECLINE_REASONS.map((reason, idx) => (
              <TouchableOpacity key={idx} style={styles.radioRow} onPress={() => setSelectedDeclineReason(reason)}>
                <View style={styles.radioCircle}>
                  {selectedDeclineReason === reason && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sheetFooter}>
             <TouchableOpacity style={styles.btnOutlineFull} onPress={() => setDeclineModalVisible(false)}>
               <Text style={styles.btnOutlineText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.btnDangerFull, !selectedDeclineReason && { opacity: 0.5 }]} 
               disabled={!selectedDeclineReason}
               onPress={() => setDeclineModalVisible(false)}
             >
               <Text style={styles.btnDangerText}>Confirm Decline</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderTabs()}
      
      {activeTab === 'Direct Requests' ? (
        <FlatList
          data={DIRECT_REQUESTS}
          keyExtractor={(item) => item.id}
          renderItem={renderDirectRequestCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={MY_PROPOSALS}
          keyExtractor={(item) => item.id}
          renderItem={renderProposalCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderDetailsModal()}
      {renderDeclineModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  tabContainer: {
    flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14, fontWeight: '600', color: '#64748B',
  },
  tabTextActive: {
    color: '#8B5CF6',
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  badgeDirect: {
    backgroundColor: '#FCE7F3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  badgeDirectText: {
    color: '#BE185D', fontSize: 10, fontWeight: 'bold',
  },
  idText: {
    fontSize: 12, fontWeight: 'bold', color: '#64748B',
  },
  cardTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16,
  },
  detailCol: {
    width: '45%', flexDirection: 'row', alignItems: 'center',
  },
  detailText: {
    fontSize: 12, color: '#475569', marginLeft: 6, flex: 1,
  },
  footerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  timeText: {
    fontSize: 12, color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  statusText: {
    fontSize: 10, fontWeight: 'bold',
  },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10, fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16,
  },
  btnPrimary: {
    flex: 1, backgroundColor: '#8B5CF6', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  btnOutline: {
    flex: 1, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  btnDangerOutline: {
    flex: 1, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
  },
  btnDangerOutlineText: {
    color: '#EF4444', fontWeight: 'bold', fontSize: 13,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff', borderRadius: 16, width: '100%', maxHeight: height * 0.85, overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
  },
  modalScroll: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
  },
  modalDataLabel: {
    fontSize: 12, color: '#64748B', marginBottom: 4,
  },
  modalDataValue: {
    fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 12,
  },
  attachmentBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginTop: 8,
  },
  attachmentText: {
    fontSize: 13, color: '#475569', marginLeft: 8, fontWeight: '500',
  },
  modalFooter: {
    padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#fff',
  },
  btnPrimaryFull: {
    backgroundColor: '#8B5CF6', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
  },
  btnOutlineFull: {
    flex: 1, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
  },
  
  // Bottom Sheet
  bottomSheetOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24,
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14, color: '#64748B', marginBottom: 24,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  radioCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B5CF6',
  },
  radioText: {
    fontSize: 15, color: '#334155',
  },
  sheetFooter: {
    flexDirection: 'row', gap: 12,
  },
  btnDangerFull: {
    flex: 1, backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 8, alignItems: 'center',
  },
  btnDangerText: {
    color: '#fff', fontWeight: 'bold', fontSize: 14,
  }
});
