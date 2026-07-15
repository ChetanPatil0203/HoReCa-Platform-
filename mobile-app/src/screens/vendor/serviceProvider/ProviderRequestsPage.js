import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  AlertCircle, Calendar, MapPin, Search, Filter, 
  XCircle, CheckCircle, Clock, FileText, IndianRupee 
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const MOCK_DIRECT_REQUESTS = [
  {
    id: "DIR-802",
    client: "The Meridian Grand",
    service: "AC Deep Cleaning",
    description: "Deep cleaning required for 15 split ACs and 5 window ACs in guest rooms. Need to be completed by this weekend.",
    budget: "₹18,000",
    date: "18 Oct 2026",
    location: "Bandra West",
    urgency: "High"
  },
  {
    id: "DIR-801",
    client: "Cafe Zephyr",
    service: "Plumbing Repair",
    description: "Kitchen sink drain is clogged and leaking. Need immediate assistance.",
    budget: "₹2,500",
    date: "16 Oct 2026",
    location: "Andheri East",
    urgency: "High"
  }
];

const MOCK_MY_QUOTES = [
  {
    id: "QT-101",
    requestId: "DIR-798",
    client: "Sunset Resort",
    quotedAmount: "₹45,000",
    dateSent: "12 Oct 2026",
    status: "Accepted"
  },
  {
    id: "QT-100",
    requestId: "REQ-205",
    client: "The Gourmet Kitchen",
    quotedAmount: "₹25,000",
    dateSent: "10 Oct 2026",
    status: "Quote Sent"
  },
  {
    id: "QT-099",
    requestId: "DIR-795",
    client: "Urban Cafe",
    quotedAmount: "₹8,500",
    dateSent: "08 Oct 2026",
    status: "Viewed"
  },
  {
    id: "QT-098",
    requestId: "REQ-201",
    client: "Spice Route",
    quotedAmount: "₹12,000",
    dateSent: "05 Oct 2026",
    status: "Rejected"
  }
];

export default function ProviderRequestsPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [activeTab, setActiveTab] = useState('Direct Requests');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Modal states
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Quote Form states
  const [form, setForm] = useState({
    serviceCharge: '',
    visitCharge: '',
    materialCharge: '',
    gst: '',
    discount: '',
    duration: '',
    availableDate: '',
    warranty: '',
    notes: ''
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Accepted': return { bg: '#D1FAE5', text: '#10B981' };
      case 'Quote Sent': return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'Viewed': return { bg: '#E0E7FF', text: '#6366F1' };
      case 'Rejected': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Expired': return { bg: '#F3F4F6', text: '#6B7280' };
      case 'Withdrawn': return { bg: '#FEF3C7', text: '#F59E0B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleOpenQuote = (req) => {
    setSelectedRequest(req);
    setQuoteModalVisible(true);
  };

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    setDetailsModalVisible(true);
  };

  const submitQuote = () => {
    // In a real app, API call goes here
    setQuoteModalVisible(false);
    setForm({
      serviceCharge: '', visitCharge: '', materialCharge: '', 
      gst: '', discount: '', duration: '', availableDate: '', 
      warranty: '', notes: ''
    });
  };

  const renderDirectRequest = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>{item.id}</Text>
        <View style={[styles.urgencyBadge, item.urgency === 'High' ? styles.urgencyHigh : styles.urgencyNormal]}>
          <Text style={[styles.urgencyText, item.urgency === 'High' ? styles.urgencyTextHigh : styles.urgencyTextNormal]}>
            {item.urgency} Urgency
          </Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.serviceName}>{item.service}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <IndianRupee size={14} color="#64748B" />
            <Text style={styles.detailText}>{item.budget}</Text>
          </View>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.cardFooter, isSmallScreen && { flexDirection: 'column' }]}>
        <View style={[styles.actionBtnsLeft, isSmallScreen && { width: '100%', marginBottom: 8 }]}>
          <TouchableOpacity 
            style={[styles.btnOutline, { flex: 1, marginRight: 8 }]}
            onPress={() => handleOpenDetails(item)}
          >
            <Text style={styles.btnOutlineText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnOutlineRed, { flex: 1 }]}>
            <Text style={styles.btnOutlineRedText}>Decline</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.actionBtnsRight, isSmallScreen && { width: '100%' }]}>
          <TouchableOpacity style={[styles.btnPrimary, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.btnPrimaryText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnPrimaryGold, { flex: 1 }]}
            onPress={() => handleOpenQuote(item)}
          >
            <Text style={styles.btnPrimaryGoldText}>Send Quote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderQuote = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.serviceName}>For Request: {item.requestId}</Text>
          
          <View style={styles.quoteInfoRow}>
            <View style={styles.quoteInfoBox}>
              <Text style={styles.quoteInfoLabel}>Amount Quoted</Text>
              <Text style={styles.quoteInfoValue}>{item.quotedAmount}</Text>
            </View>
            <View style={styles.quoteInfoBox}>
              <Text style={styles.quoteInfoLabel}>Date Sent</Text>
              <Text style={styles.quoteInfoValue}>{item.dateSent}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnFull}>
            <Text style={styles.btnFullText}>View Quote Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Requests</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Direct Requests' && styles.activeTab]}
            onPress={() => setActiveTab('Direct Requests')}
          >
            <Text style={[styles.tabText, activeTab === 'Direct Requests' && styles.activeTabText]}>
              Direct Requests
            </Text>
            {activeTab === 'Direct Requests' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'My Quotes' && styles.activeTab]}
            onPress={() => setActiveTab('My Quotes')}
          >
            <Text style={[styles.tabText, activeTab === 'My Quotes' && styles.activeTabText]}>
              My Quotes
            </Text>
            {activeTab === 'My Quotes' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content List */}
        <FlatList
          data={activeTab === 'Direct Requests' ? MOCK_DIRECT_REQUESTS : MOCK_MY_QUOTES}
          keyExtractor={item => item.id}
          renderItem={activeTab === 'Direct Requests' ? renderDirectRequest : renderQuote}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()} found.</Text>
            </View>
          }
        />

        {/* Quote Form Modal */}
        <Modal visible={quoteModalVisible} animationType="slide" transparent={true}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Create Quote</Text>
                <TouchableOpacity onPress={() => setQuoteModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {selectedRequest && (
                  <View style={styles.requestSummaryBox}>
                    <Text style={styles.summaryTitle}>{selectedRequest.service}</Text>
                    <Text style={styles.summaryClient}>{selectedRequest.client}</Text>
                  </View>
                )}

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Service Charge (₹)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="0.00" 
                      keyboardType="numeric"
                      value={form.serviceCharge}
                      onChangeText={(t) => setForm({...form, serviceCharge: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Visit Charge (₹)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="0.00" 
                      keyboardType="numeric"
                      value={form.visitCharge}
                      onChangeText={(t) => setForm({...form, visitCharge: t})}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Material/Parts (₹)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="0.00" 
                      keyboardType="numeric"
                      value={form.materialCharge}
                      onChangeText={(t) => setForm({...form, materialCharge: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Discount (₹)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="0.00" 
                      keyboardType="numeric"
                      value={form.discount}
                      onChangeText={(t) => setForm({...form, discount: t})}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>GST (%)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="18" 
                      keyboardType="numeric"
                      value={form.gst}
                      onChangeText={(t) => setForm({...form, gst: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Est. Duration</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 2 Days" 
                      value={form.duration}
                      onChangeText={(t) => setForm({...form, duration: t})}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Available Date/Time</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Oct 20, 10:00 AM" 
                  value={form.availableDate}
                  onChangeText={(t) => setForm({...form, availableDate: t})}
                />

                <Text style={styles.inputLabel}>Warranty Offered</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 6 Months on Parts" 
                  value={form.warranty}
                  onChangeText={(t) => setForm({...form, warranty: t})}
                />

                <Text style={styles.inputLabel}>Notes / Terms</Text>
                <TextInput 
                  style={styles.textArea} 
                  placeholder="Any conditions or remarks..." 
                  multiline
                  numberOfLines={4}
                  value={form.notes}
                  onChangeText={(t) => setForm({...form, notes: t})}
                />

                <TouchableOpacity style={styles.btnPrimaryLarge} onPress={submitQuote}>
                  <Text style={styles.btnPrimaryLargeText}>Send Quote</Text>
                </TouchableOpacity>
                <View style={{height: 40}}/>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Details Modal */}
        <Modal visible={detailsModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedRequest && (
                <>
                  <Text style={styles.detailSectionTitle}>Client Information</Text>
                  <Text style={styles.detailValue}>{selectedRequest.client}</Text>
                  
                  <Text style={[styles.detailSectionTitle, {marginTop: 20}]}>Service Required</Text>
                  <Text style={styles.detailValue}>{selectedRequest.service}</Text>
                  <Text style={styles.description}>{selectedRequest.description}</Text>

                  <View style={styles.detailGrid}>
                    <View style={styles.detailGridBox}>
                      <Text style={styles.detailLabel}>Client Budget</Text>
                      <Text style={styles.detailValueSmall}>{selectedRequest.budget}</Text>
                    </View>
                    <View style={styles.detailGridBox}>
                      <Text style={styles.detailLabel}>Preferred Date</Text>
                      <Text style={styles.detailValueSmall}>{selectedRequest.date}</Text>
                    </View>
                    <View style={styles.detailGridBox}>
                      <Text style={styles.detailLabel}>Urgency</Text>
                      <Text style={styles.detailValueSmall}>{selectedRequest.urgency}</Text>
                    </View>
                    <View style={styles.detailGridBox}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValueSmall}>{selectedRequest.location}</Text>
                    </View>
                  </View>

                  <View style={{height: 40}}/>
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: NAVY,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  cardId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyHigh: {
    backgroundColor: '#FEE2E2',
  },
  urgencyNormal: {
    backgroundColor: '#F1F5F9',
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  urgencyTextHigh: {
    color: '#EF4444',
  },
  urgencyTextNormal: {
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtnsLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },
  actionBtnsRight: {
    flexDirection: 'row',
    flex: 1,
  },
  btnOutline: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  btnOutlineRed: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineRedText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
  btnPrimary: {
    paddingVertical: 10,
    backgroundColor: NAVY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  btnPrimaryGold: {
    paddingVertical: 10,
    backgroundColor: GOLD,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryGoldText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  btnFull: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnFullText: {
    color: NAVY,
    fontWeight: '600',
    fontSize: 14,
  },
  quoteInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  quoteInfoBox: {
    flex: 1,
  },
  quoteInfoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  quoteInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  sheetBody: {
    padding: 20,
  },
  requestSummaryBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  summaryClient: {
    fontSize: 14,
    color: '#64748B',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  btnPrimaryLarge: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  modalBody: {
    padding: 20,
  },
  detailSectionTitle: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  detailGridBox: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
});
