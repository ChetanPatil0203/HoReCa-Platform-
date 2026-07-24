import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Alert, Modal, Pressable, Platform, 
  KeyboardAvoidingView, ScrollView, useWindowDimensions 
} from 'react-native';
import { 
  BriefcaseBusiness, Info, SlidersHorizontal, ArrowUpDown,
  TriangleAlert, Clock as Clock3, MapPin, Wrench, ChevronRight, 
  Send, X, Search, MoreVertical, XCircle, FileText
} from 'lucide-react-native';

const NAVY = '#081A3A';
const BG = '#F8FAFC';
const BRAND_GREEN = '#10B981';

// INITIAL FEED
const INITIAL_FEED = [];

const CATEGORIES = ["All", "Cleaning", "Repair", "Maintenance", "Plumbing", "Electrical", "Pest Control", "Fire & Safety"];

export default function ProviderFeedWallPage() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [feedItems, setFeedItems] = useState(INITIAL_FEED);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hideInfo, setHideInfo] = useState(false);

  // Modals state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({ amount: '', pricingType: 'Fixed Price', startDate: '', compTime: '', workIncl: '', terms: '', validity: '' });
  const [declineReason, setDeclineReason] = useState('Service category not supported');
  const [declineOther, setDeclineOther] = useState('');

  const showToast = (msg) => {
    if (Platform.OS === 'web') { window.alert(msg); }
    else { Alert.alert('Success', msg); }
  };

  const handleOpenDetails = (item) => { setSelectedItem(item); setDetailsModalVisible(true); setActiveMenuId(null); };
  const handleOpenQuote = (item) => { 
    setSelectedItem(item); setQuoteForm({ amount: '', pricingType: 'Fixed Price', startDate: '', compTime: '', workIncl: '', terms: '', validity: '' }); 
    setQuoteModalVisible(true); setDetailsModalVisible(false); setActiveMenuId(null); 
  };
  const handleOpenDecline = (item) => { setSelectedItem(item); setDeclineModalVisible(true); setDetailsModalVisible(false); setActiveMenuId(null); };

  const handleSendQuote = () => {
    if (!quoteForm.amount || !quoteForm.startDate || !quoteForm.compTime || !quoteForm.workIncl || !quoteForm.terms || !quoteForm.validity) {
      if (Platform.OS === 'web') { window.alert('Please fill all required fields.'); }
      else { Alert.alert('Validation Error', 'Please fill all required fields.'); }
      return;
    }
    
    setFeedItems(prev => prev.map(item => item.id === selectedItem.id ? { ...item, status: 'Quote Sent' } : item));
    setQuoteModalVisible(false);
    showToast('Quotation submitted successfully.');
  };

  const handleConfirmDecline = () => {
    if (declineReason === 'Other' && !declineOther.trim()) {
      if (Platform.OS === 'web') { window.alert('Please specify a reason.'); }
      else { Alert.alert('Validation Error', 'Please specify a reason.'); }
      return;
    }
    setFeedItems(prev => prev.filter(item => item.id !== selectedItem.id));
    setDeclineModalVisible(false);
    showToast('Opportunity declined.');
  };

  const renderBadge = (priority, status) => {
    if (status === 'Quote Sent') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#F3F0FF' }]}>
          <Text style={[styles.priorityText, { color: '#7C3AED' }]}>Quote Sent</Text>
        </View>
      );
    }
    if (priority === 'High Priority') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#FEF2F2' }]}>
          <TriangleAlert size={12} color="#EF4444" style={{marginRight: 4}} />
          <Text style={[styles.priorityText, { color: '#EF4444' }]}>High Priority</Text>
        </View>
      );
    }
    if (priority === 'Closing Soon') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#FFF7ED' }]}>
          <Clock3 size={12} color="#F97316" style={{marginRight: 4}} />
          <Text style={[styles.priorityText, { color: '#F97316' }]}>Closing Soon</Text>
        </View>
      );
    }
    if (priority === 'New') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.priorityText, { color: '#2563EB' }]}>New</Text>
        </View>
      );
    }
    return null;
  };

  const filteredItems = feedItems.filter(item => {
    if (activeCategory !== 'All' && !item.category.includes(activeCategory)) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.reqId}>{item.id}</Text>
        {renderBadge(item.priority, item.status)}
      </View>
      
      <Text style={styles.cardTitle}>{item.title}</Text>
      
      <Text style={styles.clientInfo} numberOfLines={1}>
        <Text style={{fontWeight: '600', color: '#1E293B'}}>{item.businessName}</Text> · {item.businessType}
      </Text>
      
      <View style={styles.locCatRow}>
        <View style={styles.locCatBadge}>
          <MapPin size={12} color="#64748B" style={{marginRight: 4}} />
          <Text style={styles.locCatText}>{item.location}</Text>
        </View>
        <View style={styles.locCatBadge}>
          <Wrench size={12} color="#64748B" style={{marginRight: 4}} />
          <Text style={styles.locCatText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.budgetRow}>
        <View style={styles.budgetCol}>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetValue}>{item.budget}</Text>
        </View>
        <View style={styles.budgetCol}>
          <Text style={styles.budgetLabel}>Required By</Text>
          <Text style={styles.budgetValue}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.postedRow}>
        <Text style={styles.postedText}>Posted {item.postedAt}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.detailsBtn} onPress={() => handleOpenDetails(item)}>
          <Text style={styles.detailsBtnText}>View Details</Text>
          <ChevronRight size={16} color={NAVY} />
        </TouchableOpacity>
        
        <View style={styles.actionRight}>
          {item.status === 'Quote Sent' ? (
            <TouchableOpacity style={styles.quoteBtnSolid} onPress={() => showToast("Viewing quote...")}>
              <Text style={styles.quoteBtnText}>View Quote</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.quoteBtnSolid} onPress={() => handleOpenQuote(item)}>
              <Send size={14} color="#fff" />
              <Text style={styles.quoteBtnText}>Send Quote</Text>
            </TouchableOpacity>
          )}

          <View>
            <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}>
              <MoreVertical size={18} color="#64748B" />
            </TouchableOpacity>
            
            {activeMenuId === item.id && (
              <View style={styles.moreMenu}>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuText}>Save Opportunity</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenDecline(item)}>
                  <Text style={styles.menuTextDestructive}>Decline Opportunity</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={() => setActiveMenuId(null)}>
      <View style={[styles.mainWrapper, isLargeScreen && styles.mainWrapperDesktop]}>
        
        <View style={styles.pageHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <BriefcaseBusiness size={24} color={NAVY} style={{marginRight: 8}} />
            <View>
              <Text style={styles.pageTitle}>Service Opportunities</Text>
              <Text style={styles.pageSubtitle}>Common service requirements from Hotels, Restaurants and Cafes</Text>
            </View>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Feed</Text>
          </View>
        </View>

        {!hideInfo && (
          <View style={styles.infoNote}>
            <View style={{flexDirection: 'row', flex: 1, paddingRight: 16}}>
              <Info size={16} color="#0284C7" style={{marginTop: 2, marginRight: 8}} />
              <Text style={styles.infoNoteText}>
                <Text style={{fontWeight: '700'}}>Common Feed</Text> — Send a quote to express interest. Final selection is confirmed by the client.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setHideInfo(true)} style={{padding: 4}}>
              <X size={16} color="#0284C7" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.searchBarRow}>
          <View style={styles.searchInputWrap}>
            <Search size={16} color="#94A3B8" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search service opportunities..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
            <SlidersHorizontal size={18} color={NAVY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <ArrowUpDown size={18} color={NAVY} />
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <BriefcaseBusiness size={32} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No service opportunities available</Text>
              <Text style={styles.emptySub}>Try changing your search or filters.</Text>
            </View>
          )}
        />
      </View>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} transparent animationType="fade" onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Service Opportunity Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><X size={20} color="#64748B" /></TouchableOpacity>
            </View>
            {selectedItem && (
              <ScrollView style={{padding: 20}}>
                <Text style={styles.detailTitle}>{selectedItem.title}</Text>
                <Text style={styles.detailClient}>{selectedItem.businessName} · {selectedItem.businessType}</Text>
                
                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Request Source</Text>
                  <Text style={styles.boxValue}>Common Feed</Text>
                </View>

                <View style={styles.detailRowGrid}>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Requirement ID</Text><Text style={styles.boxValue}>{selectedItem.id}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Category</Text><Text style={styles.boxValue}>{selectedItem.category}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Location</Text><Text style={styles.boxValue}>{selectedItem.location}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Budget</Text><Text style={styles.boxValue}>{selectedItem.budget}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Required Date</Text><Text style={styles.boxValue}>{selectedItem.date}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Preferred Time</Text><Text style={styles.boxValue}>{selectedItem.time}</Text></View>
                </View>

                <Text style={styles.boxLabel}>Complete Description & Scope of Work</Text>
                <Text style={styles.detailDesc}>{selectedItem.description}</Text>

                <View style={{flexDirection: 'row', gap: 16, marginTop: 16}}>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Quantity / Units</Text><Text style={styles.boxValue}>{selectedItem.qty}</Text></View>
                  <View style={styles.dGridItem}><Text style={styles.boxLabel}>Required Certifications</Text><Text style={styles.boxValue}>{selectedItem.certification}</Text></View>
                </View>

                {selectedItem.attachments > 0 && (
                  <View style={styles.attachmentBox}>
                    <FileText size={16} color="#2563EB" />
                    <Text style={styles.attachText}>{selectedItem.attachments} Attachment(s) Available</Text>
                  </View>
                )}
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => handleOpenDecline(selectedItem)}>
                <Text style={styles.modalCancelText}>Decline Opportunity</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => handleOpenQuote(selectedItem)}>
                <Send size={16} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.modalSubmitText}>Send Quote</Text>
              </TouchableOpacity>
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
                  <Text style={styles.modalSub}>Submit your quotation for {selectedItem?.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setQuoteModalVisible(false)}><X size={20} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 20}} keyboardShouldPersistTaps="handled">
                <View style={styles.quoteContextBox}>
                  <Text style={styles.qcClient}>{selectedItem?.businessName}</Text>
                  <Text style={styles.qcTitle}>{selectedItem?.title}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                    <Text style={styles.qcMeta}>Client Budget: <Text style={{fontWeight: '700', color: NAVY}}>{selectedItem?.budget}</Text></Text>
                    <Text style={styles.qcMeta}>Required By: <Text style={{fontWeight: '700', color: NAVY}}>{selectedItem?.date}</Text></Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Quoted Amount (₹) *</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={quoteForm.amount} onChangeText={t => setQuoteForm({...quoteForm, amount: t})} placeholder="e.g. 25000" />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Estimated Start Date *</Text>
                    <TextInput style={styles.input} value={quoteForm.startDate} onChangeText={t => setQuoteForm({...quoteForm, startDate: t})} placeholder="e.g. 21 Jun 2026" />
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Est. Completion Time *</Text>
                    <TextInput style={styles.input} value={quoteForm.compTime} onChangeText={t => setQuoteForm({...quoteForm, compTime: t})} placeholder="e.g. 2 Days" />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Work Included *</Text>
                  <TextInput style={[styles.input, {height: 60, textAlignVertical: 'top'}]} multiline value={quoteForm.workIncl} onChangeText={t => setQuoteForm({...quoteForm, workIncl: t})} placeholder="Describe what is included in this quote..." />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Payment Terms *</Text>
                    <TextInput style={styles.input} value={quoteForm.terms} onChangeText={t => setQuoteForm({...quoteForm, terms: t})} placeholder="e.g. 50% Advance" />
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Quote Valid Until *</Text>
                    <TextInput style={styles.input} value={quoteForm.validity} onChangeText={t => setQuoteForm({...quoteForm, validity: t})} placeholder="e.g. 30 Jun 2026" />
                  </View>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setQuoteModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSendQuote}>
                  <Send size={16} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.modalSubmitText}>Submit Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Decline Modal */}
      <Modal visible={declineModalVisible} transparent animationType="fade" onRequestClose={() => setDeclineModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {maxWidth: 400}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decline this opportunity?</Text>
              <TouchableOpacity onPress={() => setDeclineModalVisible(false)}><X size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <View style={{padding: 20}}>
              {["Service category not supported", "Location not serviceable", "Required date unavailable", "Budget not suitable", "Current workload is full", "Other"].map(rsn => (
                <TouchableOpacity key={rsn} style={styles.radioRow} onPress={() => setDeclineReason(rsn)}>
                  <View style={[styles.radioCircle, declineReason === rsn && styles.radioActive]} />
                  <Text style={styles.radioText}>{rsn}</Text>
                </TouchableOpacity>
              ))}
              {declineReason === 'Other' && (
                <TextInput style={[styles.input, {marginTop: 8}]} placeholder="Please specify reason" value={declineOther} onChangeText={setDeclineOther} />
              )}
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setDeclineModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: '#EF4444'}]} onPress={handleConfirmDecline}>
                <Text style={styles.modalSubmitText}>Decline Opportunity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Bottom Sheet (Mock) */}
      <Modal visible={filterModalVisible} transparent animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
        <View style={[styles.modalOverlay, {justifyContent: 'flex-end', padding: 0}]}>
          <View style={[styles.modalCard, {borderRadius: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxWidth: '100%', maxHeight: '60%'}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}><X size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={{padding: 20}}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.chipsContainer}>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>High Priority</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Normal</Text></View>
              </View>
              <Text style={[styles.label, {marginTop: 16}]}>Quote Status</Text>
              <View style={styles.chipsContainer}>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Not Responded</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Quote Sent</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Saved</Text></View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalCancelText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalSubmitText}>Apply Filters</Text>
              </TouchableOpacity>
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
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  liveText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },

  infoNote: { flexDirection: 'row', backgroundColor: '#F0F9FF', marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 12, alignItems: 'flex-start' },
  infoNoteText: { fontSize: 13, color: '#0369A1', lineHeight: 18 },

  searchBarRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 12 },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY },
  filterBtn: { width: 44, height: 44, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  catScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  catChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  catChipTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 120 },

  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reqId: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: 'bold' },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 6 },
  clientInfo: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  
  locCatRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  locCatBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  locCatText: { fontSize: 12, color: '#475569', fontWeight: '500' },

  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  budgetCol: { flex: 1 },
  budgetLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  budgetValue: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  postedRow: { marginBottom: 16 },
  postedText: { fontSize: 12, color: '#94A3B8' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, minHeight: 44 },
  detailsBtnText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quoteBtnSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: BRAND_GREEN, paddingHorizontal: 16, height: 40, borderRadius: 10 },
  quoteBtnText: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginLeft: 6 },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  moreMenu: { position: 'absolute', bottom: 44, right: 0, width: 200, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, zIndex: 100 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
  menuTextDestructive: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9' },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748B', marginTop: 16, marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(3,15,38,0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', width: '100%', maxWidth: 520, maxHeight: '85%', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalSub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalSubmitBtn: { flex: 1, flexDirection: 'row', paddingVertical: 12, borderRadius: 10, backgroundColor: BRAND_GREEN, alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  detailTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailClient: { fontSize: 15, color: '#64748B', marginBottom: 20 },
  detailBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 16 },
  boxLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  boxValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  detailRowGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  dGridItem: { width: '45%' },
  detailDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginTop: 4, marginBottom: 20 },
  attachmentBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginTop: 24 },
  attachText: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginLeft: 8 },

  quoteContextBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 20 },
  qcClient: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  qcTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  qcMeta: { fontSize: 12, color: '#64748B' },

  formGroup: { marginBottom: 16 },
  formRow: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 12 },
  radioActive: { borderColor: BRAND_GREEN, backgroundColor: BRAND_GREEN },
  radioText: { fontSize: 14, color: NAVY },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipText: { fontSize: 13, color: '#475569' }
});
