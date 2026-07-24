import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  useWindowDimensions, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, Alert 
} from 'react-native';
import { 
  Search, SlidersHorizontal, ChevronRight, MoreVertical, 
  XCircle, Send, CheckCircle, MapPin, FileText
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const GREEN = '#10B981';

const INITIAL_REQUESTS = [];

const TABS = ['New', 'Quote Sent', 'Accepted', 'Declined', 'Closed'];

export default function ProviderRequestsPage() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [activeTab, setActiveTab] = useState('New');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Modals state
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewQuoteModalVisible, setViewQuoteModalVisible] = useState(false);

  // Form states
  const [quoteForm, setQuoteForm] = useState({ 
    amount: '', pricingType: 'Fixed', visitCharge: '', date: '', time: '', compTime: '', warranty: '', workIncl: '', terms: '', validity: '' 
  });
  const [declineReason, setDeclineReason] = useState('Location not serviceable');
  const [declineOther, setDeclineOther] = useState('');

  const showToast = (msg) => {
    if (Platform.OS === 'web') { window.alert(msg); }
    else { Alert.alert('Success', msg); }
  };

  const getFilteredRequests = () => {
    return requests.filter(r => {
      if (r.status !== activeTab) return false;
      if (search && !r.service.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.client.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  };

  const filteredRequests = getFilteredRequests();
  
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => counts[t] = 0);
    requests.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
    return counts;
  }, [requests]);

  const handleSendQuote = () => {
    if (!quoteForm.amount || !quoteForm.date || !quoteForm.compTime || !quoteForm.workIncl || !quoteForm.terms || !quoteForm.validity) {
      if (Platform.OS === 'web') { window.alert('Please fill all required fields.'); }
      else { Alert.alert('Required', 'Please fill all required fields.'); }
      return;
    }
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Quote Sent', priorityBadge: 'Quote Sent' } : r));
    setQuoteModalVisible(false);
    showToast('Quotation submitted successfully.');
  };

  const handleConfirmDecline = () => {
    if (declineReason === 'Other' && !declineOther.trim()) {
      if (Platform.OS === 'web') { window.alert('Please specify a reason.'); }
      else { Alert.alert('Required', 'Please specify a reason.'); }
      return;
    }
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Declined', priorityBadge: 'Declined' } : r));
    setDeclineModalVisible(false);
    showToast('Direct request declined.');
  };

  const renderBadge = (item) => {
    // Show one meaningful badge based on status/priority
    let text = item.priorityBadge || item.status;
    let bg = '#F1F5F9'; let color = '#64748B';
    
    if (text === 'New') { bg = '#EFF6FF'; color = '#2563EB'; }
    else if (text === 'High Priority') { bg = '#FEF2F2'; color = '#EF4444'; }
    else if (text === 'Quote Sent') { bg = '#F5F3FF'; color = '#7C3AED'; }
    else if (text === 'Accepted') { bg = '#ECFDF5'; color = '#059669'; }
    else if (text === 'Declined') { bg = '#FEF2F2'; color = '#DC2626'; }
    else if (text === 'Closed') { bg = '#F1F5F9'; color = '#64748B'; }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusBadgeText, { color }]}>{text.toUpperCase()}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.cardHeaderRow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.reqId}>{item.id}</Text>
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceBadgeText}>{item.source}</Text>
          </View>
        </View>
        {renderBadge(item)}
      </View>
      
      {/* Service & Client */}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.service}</Text>
      <Text style={styles.clientInfo} numberOfLines={1}>
        <Text style={{fontWeight: '600', color: NAVY}}>{item.client}</Text> · {item.businessType}
      </Text>
      <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>

      {/* 2-Column Details */}
      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Preferred Date</Text>
          <Text style={styles.infoValue}>{item.date}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.infoValue}>{item.budget}</Text>
        </View>
      </View>

      <Text style={styles.requestedText}>Requested {item.requestedAt}</Text>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.detailsBtn} onPress={() => { setSelectedRequest(item); setDetailsModalVisible(true); }}>
          <Text style={styles.detailsBtnText}>View Details</Text>
          <ChevronRight size={16} color={NAVY} />
        </TouchableOpacity>
        
        <View style={styles.actionRight}>
          {item.status === 'New' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: NAVY }]} onPress={() => { setSelectedRequest(item); setQuoteForm({ amount: '', pricingType: 'Fixed', visitCharge: '', date: '', time: '', compTime: '', warranty: '', workIncl: '', terms: '', validity: '' }); setQuoteModalVisible(true); }}>
              <Text style={styles.primaryBtnText}>Send Quote</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Quote Sent' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#7C3AED' }]} onPress={() => { setSelectedRequest(item); setViewQuoteModalVisible(true); }}>
              <Text style={styles.primaryBtnText}>View Quote</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Accepted' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: GREEN }]} onPress={() => showToast('Opening work record...')}>
              <Text style={styles.primaryBtnText}>Open Work</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={() => setActiveMenuId(null)}>
      <View style={[styles.mainWrapper, isLargeScreen && styles.mainWrapperDesktop]}>
        
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Direct Requests</Text>
            <Text style={styles.pageSubtitle}>Service requests sent directly to your business</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowSearch(!showSearch)}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterModalVisible(true)}>
              <SlidersHorizontal size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchRow}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search direct requests..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
        )}

        {/* Tabs */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                <View style={[styles.badgePill, activeTab === tab && styles.badgePillActive]}>
                  <Text style={[styles.badgeText, activeTab === tab && styles.badgeTextActive]}>{tabCounts[tab]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List */}
        <FlatList
          data={filteredRequests}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}><Search size={24} color="#94A3B8" /></View>
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} requests</Text>
              <Text style={styles.emptySub}>Direct requests matching this status will appear here.</Text>
            </View>
          )}
        />
      </View>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} transparent animationType="fade" onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Direct Request Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            {selectedRequest && (
              <ScrollView style={{padding: 20}}>
                <Text style={styles.detailTitle}>{selectedRequest.service}</Text>
                <Text style={styles.detailClient}>{selectedRequest.client} · {selectedRequest.businessType}</Text>
                
                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Schedule & Budget</Text>
                  <Text style={styles.boxValue}>{selectedRequest.date} ({selectedRequest.time})</Text>
                  <Text style={styles.boxValue}>{selectedRequest.budget}</Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Request Details</Text>
                  <Text style={styles.boxValue}>ID: {selectedRequest.id}</Text>
                  <Text style={styles.boxValue}>Source: {selectedRequest.source}</Text>
                  <Text style={styles.boxValue}>Status: {selectedRequest.status}</Text>
                </View>

                <Text style={styles.boxLabel}>Scope of Work</Text>
                <Text style={styles.detailDesc}>{selectedRequest.description}</Text>

                {selectedRequest.attachments > 0 && (
                  <View style={styles.attachmentBox}>
                    <FileText size={16} color="#2563EB" />
                    <Text style={styles.attachText}>{selectedRequest.attachments} Attachment(s) Available</Text>
                  </View>
                )}
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              {selectedRequest?.status === 'New' && (
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setDetailsModalVisible(false); setDeclineModalVisible(true); }}>
                  <Text style={[styles.modalCancelText, {color: '#EF4444'}]}>Decline Request</Text>
                </TouchableOpacity>
              )}
              {selectedRequest?.status === 'New' ? (
                <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={() => { setDetailsModalVisible(false); setQuoteForm({ amount: '', pricingType: 'Fixed', visitCharge: '', date: '', time: '', compTime: '', warranty: '', workIncl: '', terms: '', validity: '' }); setQuoteModalVisible(true); }}>
                  <Text style={styles.modalSubmitText}>Send Quote</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={() => setDetailsModalVisible(false)}>
                  <Text style={styles.modalSubmitText}>Close</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Quote Modal */}
      <Modal visible={quoteModalVisible} transparent animationType="slide" onRequestClose={() => setQuoteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '100%', alignItems: 'center'}}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Send Quote</Text>
                  <Text style={styles.modalSubtitle}>Submit your quotation for {selectedRequest?.service}</Text>
                </View>
                <TouchableOpacity onPress={() => setQuoteModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 20}} keyboardShouldPersistTaps="handled">
                <View style={styles.quoteContextBox}>
                  <Text style={styles.qcClient}>{selectedRequest?.client}</Text>
                  <Text style={styles.qcMeta}>{selectedRequest?.location}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                    <Text style={styles.qcMeta}>Budget: <Text style={{fontWeight: '700', color: NAVY}}>{selectedRequest?.budget}</Text></Text>
                    <Text style={styles.qcMeta}>Date: <Text style={{fontWeight: '700', color: NAVY}}>{selectedRequest?.date}</Text></Text>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Quoted Amount (₹) *</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={quoteForm.amount} onChangeText={t => setQuoteForm({...quoteForm, amount: t})} placeholder="e.g. 18000" />
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Pricing Type *</Text>
                    <TextInput style={styles.input} value={quoteForm.pricingType} onChangeText={t => setQuoteForm({...quoteForm, pricingType: t})} placeholder="e.g. Fixed" />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Available Date *</Text>
                    <TextInput style={styles.input} value={quoteForm.date} onChangeText={t => setQuoteForm({...quoteForm, date: t})} placeholder="e.g. 24 Jul 2026" />
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Est. Comp. Time *</Text>
                    <TextInput style={styles.input} value={quoteForm.compTime} onChangeText={t => setQuoteForm({...quoteForm, compTime: t})} placeholder="e.g. 2 Days" />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Work Included *</Text>
                  <TextInput style={[styles.input, {height: 60, textAlignVertical: 'top'}]} multiline value={quoteForm.workIncl} onChangeText={t => setQuoteForm({...quoteForm, workIncl: t})} placeholder="Describe what is included..." />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Payment Terms *</Text>
                    <TextInput style={styles.input} value={quoteForm.terms} onChangeText={t => setQuoteForm({...quoteForm, terms: t})} placeholder="e.g. 50% Advance" />
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Valid Until *</Text>
                    <TextInput style={styles.input} value={quoteForm.validity} onChangeText={t => setQuoteForm({...quoteForm, validity: t})} placeholder="e.g. 30 Jul 2026" />
                  </View>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setQuoteModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={handleSendQuote}><Text style={styles.modalSubmitText}>Send Quote</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* View Quote Modal */}
      <Modal visible={viewQuoteModalVisible} transparent animationType="fade" onRequestClose={() => setViewQuoteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submitted Quotation</Text>
              <TouchableOpacity onPress={() => setViewQuoteModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            {selectedRequest && (
              <ScrollView style={{padding: 20}}>
                <Text style={styles.boxLabel}>Request</Text>
                <Text style={styles.boxValue}>{selectedRequest.service}</Text>
                <Text style={styles.detailClient}>{selectedRequest.client}</Text>

                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Quoted Amount</Text>
                  <Text style={styles.boxValue}>₹18,000 (Fixed)</Text>
                  <View style={{height: 12}} />
                  <Text style={styles.boxLabel}>Availability</Text>
                  <Text style={styles.boxValue}>24 Jul 2026 (Est. 2 Days)</Text>
                </View>
                
                <Text style={styles.boxLabel}>Payment Terms</Text>
                <Text style={styles.boxValue}>50% Advance, 50% on completion</Text>
                <View style={{height: 12}} />
                <Text style={styles.boxLabel}>Quote Status</Text>
                <Text style={[styles.boxValue, {color: '#7C3AED'}]}>Awaiting Client Response</Text>
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={() => setViewQuoteModalVisible(false)}>
                <Text style={styles.modalSubmitText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Decline Request Modal */}
      <Modal visible={declineModalVisible} transparent animationType="fade" onRequestClose={() => setDeclineModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {maxWidth: 400}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decline this direct request?</Text>
              <TouchableOpacity onPress={() => setDeclineModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={{padding: 20}}>
              {["Service not available", "Preferred date unavailable", "Budget not suitable", "Location not serviceable", "Current workload is full", "Other"].map(rsn => (
                <TouchableOpacity key={rsn} style={styles.radioRow} onPress={() => setDeclineReason(rsn)}>
                  <View style={[styles.radioCircle, declineReason === rsn && styles.radioActive]} />
                  <Text style={styles.radioText}>{rsn}</Text>
                </TouchableOpacity>
              ))}
              {declineReason === 'Other' && (
                <TextInput style={[styles.input, {marginTop: 8}]} placeholder="Please specify reason" value={declineOther} onChangeText={setDeclineOther} />
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setDeclineModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: '#EF4444'}]} onPress={handleConfirmDecline}><Text style={styles.modalSubmitText}>Decline Request</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Bottom Sheet */}
      <Modal visible={filterModalVisible} transparent animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
        <View style={[styles.modalOverlay, {justifyContent: 'flex-end', padding: 0}]}>
          <View style={[styles.modalCard, {borderRadius: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxWidth: '100%', maxHeight: '60%'}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={{padding: 20}}>
              <Text style={styles.label}>Request Status</Text>
              <View style={styles.chipsContainer}>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>New</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Quote Sent</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Accepted</Text></View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setFilterModalVisible(false)}><Text style={styles.modalCancelText}>Clear Filters</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={() => setFilterModalVisible(false)}><Text style={styles.modalSubmitText}>Apply Filters</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  mainWrapper: { flex: 1, width: '100%', alignSelf: 'center' },
  mainWrapperDesktop: { maxWidth: 1100, paddingHorizontal: 24 },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  searchRow: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  tabScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  tabItemActive: { backgroundColor: NAVY, borderColor: NAVY, shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B', marginRight: 8 },
  tabTextActive: { color: '#fff' },
  badgePill: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgePillActive: { backgroundColor: '#334155' },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  badgeTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 120 },

  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reqId: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginRight: 8 },
  sourceBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sourceBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#64748B' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  clientInfo: { fontSize: 15, color: '#475569', marginBottom: 2 },
  locationText: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 16 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  requestedText: { fontSize: 12, color: '#94A3B8', marginBottom: 16 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, minHeight: 44 },
  detailsBtnText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryBtn: { paddingHorizontal: 16, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  moreMenu: { position: 'absolute', bottom: 44, right: 0, width: 200, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, zIndex: 100 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
  menuTextDestructive: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(3,15,38,0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', width: '100%', maxWidth: 540, maxHeight: '85%', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalSubmitBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  detailTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailClient: { fontSize: 15, color: '#64748B', marginBottom: 20 },
  detailBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 16 },
  boxLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  boxValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  detailDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginTop: 4, marginBottom: 20 },
  attachmentBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginTop: 12 },
  attachText: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginLeft: 8 },

  quoteContextBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 20 },
  qcClient: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  qcTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  qcMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },

  formGroup: { marginBottom: 16 },
  formRow: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 12 },
  radioActive: { borderColor: NAVY, backgroundColor: NAVY },
  radioText: { fontSize: 14, color: NAVY },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' }
});
