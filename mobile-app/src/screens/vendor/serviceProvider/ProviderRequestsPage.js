import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { 
  Calendar, MapPin, Search, Filter, 
  XCircle, FileText, IndianRupee, Bell, AlertCircle, Bookmark, ClipboardList, ChevronRight
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const LIGHT_BG = '#F8FAFC';
const WHITE = '#FFFFFF';

const MOCK_DIRECT_REQUESTS = {
  'New': [
    {
      id: "REQ-310",
      client: "The Meridian Hotel",
      service: "AC Deep Cleaning",
      description: "Deep cleaning required for 15 split ACs and 5 window ACs in guest rooms. Need to be completed by this weekend.",
      budget: "₹15,000 – ₹20,000",
      date: "24 Jul 2026",
      location: "Bandra West",
      fullLocation: "Bandra West, Mumbai",
      priority: "High",
      status: "New",
      attachments: ["Photos.zip", "ScopeOfWork.pdf"]
    }
  ],
  'Responded': [],
  'Accepted': [],
  'Declined': [],
  'Closed': []
};

export default function ProviderRequestsPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  
  // Try to constrain modal max width on tablets/web
  const modalWidth = Math.min(width * 0.9, 520);

  const [activeTab, setActiveTab] = useState('New');
  const [requests, setRequests] = useState(MOCK_DIRECT_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    amount: '', date: '', duration: '', teamSize: '', 
    description: '', services: '', additional: '', 
    terms: '', validUntil: ''
  });

  const TABS = ['New', 'Responded', 'Accepted', 'Declined', 'Closed'];

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    setDetailsModalVisible(true);
  };

  const handleOpenQuote = (req = selectedRequest) => {
    if(!req) return;
    setSelectedRequest(req);
    setDetailsModalVisible(false); // Close details if open
    setQuoteModalVisible(true);
  };

  const handleOpenDecline = (req = selectedRequest) => {
    if(!req) return;
    setSelectedRequest(req);
    setDetailsModalVisible(false);
    setDeclineModalVisible(true);
  };

  const submitQuote = () => {
    if(!quoteForm.amount || !quoteForm.date || !quoteForm.duration || !quoteForm.description || !quoteForm.validUntil) {
      alert("Please fill all required fields");
      return;
    }
    
    // Move to Responded
    const updatedReq = { ...selectedRequest, status: 'Responded' };
    setRequests(prev => ({
      ...prev,
      'New': prev['New'].filter(r => r.id !== selectedRequest.id),
      'Responded': [...prev['Responded'], updatedReq]
    }));
    
    setQuoteModalVisible(false);
    setQuoteForm({ amount: '', date: '', duration: '', teamSize: '', description: '', services: '', additional: '', terms: '', validUntil: '' });
  };

  const submitDecline = () => {
    const updatedReq = { ...selectedRequest, status: 'Declined' };
    setRequests(prev => ({
      ...prev,
      'New': prev['New'].filter(r => r.id !== selectedRequest.id),
      'Declined': [...prev['Declined'], updatedReq]
    }));
    setDeclineModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { bg: '#DBEAFE', text: '#1D4ED8' }; // Soft blue
      case 'Responded': return { bg: '#FFEDD5', text: '#C2410C' }; // Soft orange
      case 'Accepted': return { bg: '#DCFCE7', text: '#15803D' }; // Soft green
      case 'Declined': return { bg: '#FEE2E2', text: '#B91C1C' }; // Soft red
      default: return { bg: '#F1F5F9', text: '#64748B' }; // Soft gray
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Medium': return { bg: '#FFEDD5', text: '#F59E0B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const renderDirectRequest = ({ item }) => {
    const sColor = getStatusColor(item.status);
    const pColor = getPriorityColor(item.priority);

    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardId}>{item.id}</Text>
            <View style={styles.directBadge}>
              <Text style={styles.directBadgeText}>DIRECT REQUEST</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
            <Text style={[styles.statusText, { color: sColor.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        {/* Main Info */}
        <View style={styles.cardBody}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
          <Text style={styles.businessText} numberOfLines={1}>{item.client} · {item.location}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <IndianRupee size={14} color="#64748B" />
              <Text style={styles.metaText}>{item.budget}</Text>
            </View>
          </View>
          
          {item.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: pColor.bg }]}>
              <Text style={[styles.priorityText, { color: pColor.text }]}>{item.priority} Priority</Text>
            </View>
          )}
        </View>
        
        {/* Footer Actions */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnViewDetails} onPress={() => handleOpenDetails(item)}>
            <Text style={styles.btnViewDetailsText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          
          {item.status === 'New' && (
            <TouchableOpacity style={styles.btnPrimaryGold} onPress={() => handleOpenQuote(item)}>
              <Text style={styles.btnPrimaryGoldText}>Send Quote</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Requests</Text>
            <Text style={styles.headerSubtitle}>Service requests sent directly to your business</Text>
          </View>
        </View>

        {/* Status Tabs */}
        <View style={styles.tabWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
            {TABS.map((tab) => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tabPill, activeTab === tab && styles.activeTabPill]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabPillText, activeTab === tab && styles.activeTabPillText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content List */}
        <FlatList
          data={requests[activeTab]}
          keyExtractor={item => item.id}
          renderItem={renderDirectRequest}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <ClipboardList size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No requests</Text>
              <Text style={styles.emptyText}>Service requests will appear here.</Text>
            </View>
          }
        />

        {/* View Details Center Modal */}
        <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '85%' }]}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Request Details</Text>
                      <Text style={styles.modalSubtitle}>{selectedRequest?.id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                      <XCircle size={24} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    {selectedRequest && (
                      <>
                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Service</Text>
                          <Text style={styles.modalValue}>{selectedRequest.service}</Text>
                        </View>
                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Business</Text>
                          <Text style={styles.modalValue}>{selectedRequest.client}</Text>
                        </View>
                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Location</Text>
                          <Text style={styles.modalValue}>{selectedRequest.fullLocation}</Text>
                        </View>
                        
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Preferred Date</Text>
                            <Text style={styles.modalValue}>{selectedRequest.date}</Text>
                          </View>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Budget</Text>
                            <Text style={styles.modalValue}>{selectedRequest.budget}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Status</Text>
                            <Text style={styles.modalValue}>{selectedRequest.status}</Text>
                          </View>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Priority</Text>
                            <Text style={[styles.modalValue, {color: getPriorityColor(selectedRequest.priority).text}]}>{selectedRequest.priority} Priority</Text>
                          </View>
                        </View>

                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Request Notes</Text>
                          <Text style={styles.modalDescText}>{selectedRequest.description}</Text>
                        </View>
                        
                        {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                          <View style={styles.modalDataBlock}>
                            <Text style={styles.modalLabel}>Attachments</Text>
                            {selectedRequest.attachments.map((att, i) => (
                              <Text key={i} style={styles.attachmentText}>• {att}</Text>
                            ))}
                          </View>
                        )}
                        <View style={{height: 20}}/>
                      </>
                    )}
                  </ScrollView>
                  
                  {selectedRequest?.status === 'New' && (
                    <View style={styles.modalFooterActions}>
                      <TouchableOpacity style={styles.btnOutlineRed} onPress={() => handleOpenDecline(selectedRequest)}>
                        <Text style={styles.btnOutlineRedText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnPrimaryGoldFull} onPress={() => handleOpenQuote(selectedRequest)}>
                        <Text style={styles.btnPrimaryGoldText}>Send Quote</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Send Quote Center Modal */}
        <Modal visible={quoteModalVisible} animationType="fade" transparent={true} onRequestClose={() => setQuoteModalVisible(false)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlayCenter}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', alignItems: 'center'}}>
                <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '85%' }]}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Send Quote</Text>
                      <Text style={styles.modalSubtitle}>Create a quotation for {selectedRequest?.service}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setQuoteModalVisible(false)}>
                      <XCircle size={24} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    {selectedRequest && (
                      <View style={styles.quoteContextBox}>
                        <Text style={styles.quoteContextTitle}>{selectedRequest.client}</Text>
                        <Text style={styles.quoteContextSub}>Budget: {selectedRequest.budget}  •  Pref. Date: {selectedRequest.date}</Text>
                      </View>
                    )}

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Quote Amount *</Text>
                        <View style={styles.inputPrefixBox}>
                          <Text style={styles.inputPrefix}>₹</Text>
                          <TextInput style={styles.inputWithPrefix} keyboardType="numeric" value={quoteForm.amount} onChangeText={(t) => setQuoteForm({...quoteForm, amount: t})} />
                        </View>
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Service Date *</Text>
                        <TextInput style={styles.input} placeholder="e.g. 24 Jul 2026" value={quoteForm.date} onChangeText={(t) => setQuoteForm({...quoteForm, date: t})} />
                      </View>
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Est. Duration *</Text>
                        <TextInput style={styles.input} placeholder="e.g. 4 Hours" value={quoteForm.duration} onChangeText={(t) => setQuoteForm({...quoteForm, duration: t})} />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Team Size</Text>
                        <TextInput style={styles.input} placeholder="e.g. 2" keyboardType="numeric" value={quoteForm.teamSize} onChangeText={(t) => setQuoteForm({...quoteForm, teamSize: t})} />
                      </View>
                    </View>
                    
                    <Text style={styles.inputLabel}>Quote Description *</Text>
                    <TextInput style={styles.textArea} placeholder="Brief description of work to be done..." multiline numberOfLines={3} value={quoteForm.description} onChangeText={(t) => setQuoteForm({...quoteForm, description: t})} />
                    
                    <Text style={styles.inputLabel}>Valid Until *</Text>
                    <TextInput style={styles.input} placeholder="e.g. 30 Jul 2026" value={quoteForm.validUntil} onChangeText={(t) => setQuoteForm({...quoteForm, validUntil: t})} />

                    <View style={{height: 20}}/>
                  </ScrollView>
                  
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnOutline} onPress={() => setQuoteModalVisible(false)}>
                      <Text style={styles.btnOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnPrimaryGoldFull, { opacity: (quoteForm.amount && quoteForm.date && quoteForm.duration && quoteForm.description && quoteForm.validUntil) ? 1 : 0.6 }]} onPress={submitQuote}>
                      <Text style={styles.btnPrimaryGoldText}>Submit Quote</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Decline Confirmation Modal */}
        <Modal visible={declineModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDeclineModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Decline this request?</Text>
              <Text style={styles.confirmText}>You will no longer be able to send a quote unless the request is reopened.</Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity style={[styles.btnOutline, { flex: 1, marginRight: 12 }]} onPress={() => setDeclineModalVisible(false)}>
                  <Text style={styles.btnOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnPrimaryRed, { flex: 1 }]} onPress={submitDecline}>
                  <Text style={styles.btnPrimaryRedText}>Decline Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  container: { flex: 1 },
  
  header: { 
    minHeight: 85, paddingTop: 30, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, backgroundColor: WHITE,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    zIndex: 10
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  
  tabWrapper: { backgroundColor: LIGHT_BG, paddingVertical: 16 },
  tabContainer: { paddingHorizontal: 20, gap: 10 },
  tabPill: { 
    paddingVertical: 8, paddingHorizontal: 16, 
    borderRadius: 20, backgroundColor: WHITE, 
    borderWidth: 1, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center'
  },
  activeTabPill: { backgroundColor: NAVY, borderColor: NAVY },
  tabPillText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeTabPillText: { color: GOLD },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  
  card: { 
    backgroundColor: WHITE, borderRadius: 16, padding: 14, marginBottom: 12, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: '#E8EDF4'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardId: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8' },
  directBadge: { backgroundColor: '#F3E8FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  directBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#7E22CE' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  
  cardBody: { marginBottom: 12 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  businessText: { fontSize: 13, color: '#475569', fontWeight: '500', marginBottom: 10 },
  
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: '#1E293B', fontWeight: '600' },
  
  priorityBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 10, fontWeight: 'bold' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnViewDetails: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  btnViewDetailsText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  
  btnPrimaryGold: { backgroundColor: GOLD, paddingHorizontal: 16, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryGoldText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },
  
  // Center Modal Styles
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  modalSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  
  modalBody: { flexShrink: 1 },
  modalDataBlock: { marginBottom: 16 },
  modalLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
  modalValue: { fontSize: 15, color: '#1E293B', fontWeight: '500' },
  modalDescText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  attachmentText: { fontSize: 14, color: '#3B82F6', marginBottom: 4, fontWeight: '500' },
  
  modalGrid: { flexDirection: 'row', marginBottom: 16 },
  modalGridCol: { flex: 1, paddingRight: 8 },
  
  modalFooterActions: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btnOutlineRed: { flex: 1, height: 44, borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnOutlineRedText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  btnOutline: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnOutlineText: { color: '#475569', fontWeight: 'bold', fontSize: 14 },
  btnPrimaryGoldFull: { flex: 1.5, height: 44, backgroundColor: GOLD, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  // Quote Modal Specific
  quoteContextBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  quoteContextTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  quoteContextSub: { fontSize: 12, color: '#64748B' },
  
  formRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  formCol: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },
  inputPrefixBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, backgroundColor: WHITE, overflow: 'hidden' },
  inputPrefix: { paddingHorizontal: 12, color: '#64748B', fontWeight: '600', fontSize: 14, backgroundColor: '#F8FAFC', height: '100%', textAlignVertical: 'center', borderRightWidth: 1, borderRightColor: '#E2E8F0' },
  inputWithPrefix: { flex: 1, height: 44, paddingHorizontal: 12, fontSize: 14, color: NAVY },
  textArea: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: NAVY, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  
  // Decline Confirmation Specific
  confirmBox: { backgroundColor: WHITE, borderRadius: 20, padding: 24, width: '100%', maxWidth: 320, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 8, textAlign: 'center' },
  confirmText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  confirmActions: { flexDirection: 'row', width: '100%' },
  btnPrimaryRed: { backgroundColor: '#EF4444', height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryRedText: { color: WHITE, fontSize: 14, fontWeight: 'bold' }
});
