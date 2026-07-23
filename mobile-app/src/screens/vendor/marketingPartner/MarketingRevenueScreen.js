import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, 
  Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, 
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  FilePlus2, IndianRupee, Clock3, TriangleAlert, Search, 
  SlidersHorizontal, ChevronRight, MoreVertical, Pencil, Copy, 
  Trash2, Download, CheckCircle, XCircle, BellRing, Receipt, 
  CreditCard, X 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const PURPLE = '#071B3A';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const GRAY = '#64748B';
const RED = '#EF4444';
const ORANGE = '#F59E0B';
const WHITE = '#FFFFFF';
const MUTED = '#94A3B8';
const LIGHT_BG = '#F8FAFC';

const MOCK_INVOICES = [
  { 
    id: 'INV-26001', client: 'Azure Palace Hotel', type: 'Campaign Fee', 
    amount: '₹50,000', date: '01 Jul 2026', due: '15 Jul 2026', status: 'Sent' 
  },
  { 
    id: 'INV-26002', client: 'Cafe Zephyr Group', type: 'Photography Fee', 
    amount: '₹12,000', date: '15 Jun 2026', due: '30 Jun 2026', status: 'Paid', paidOn: '30 Jun 2026' 
  },
  { 
    id: 'INV-26003', client: 'Spice Route Restaurant', type: 'Printing Fee', 
    amount: '₹8,500', date: '01 Jun 2026', due: '15 Jun 2026', status: 'Overdue' 
  },
  { 
    id: 'INV-26004', client: 'The Urban Spa', type: 'Monthly Retainer', 
    amount: '₹20,000', date: '10 Jul 2026', due: '25 Jul 2026', status: 'Partially Paid' 
  },
  { 
    id: 'INV-26005', client: 'Neon Lights Studio', type: 'Event Coverage', 
    amount: '₹35,000', date: '20 Jul 2026', due: '05 Aug 2026', status: 'Draft' 
  },
];

export default function MarketingRevenueScreen() {
  const [activePeriod, setActivePeriod] = useState('Month');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals visibility
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const openMoreMenu = (invoice) => {
    setSelectedInvoice(invoice);
    setMoreMenuVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return { bg: '#F1F5F9', text: '#64748B' };
      case 'Sent': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'Partially Paid': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Paid': return { bg: '#D1FAE5', text: '#059669' };
      case 'Overdue': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Cancelled': return { bg: '#F1F5F9', text: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderInvoiceCard = ({ item }) => {
    const stat = getStatusColor(item.status);

    const renderPrimaryAction = () => {
      if (item.status === 'Draft') {
        return (
          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.primaryActionText}>Continue Editing</Text>
          </TouchableOpacity>
        );
      }
      if (item.status === 'Sent' || item.status === 'Overdue') {
        const btnBg = item.status === 'Overdue' ? '#FEF2F2' : '#F5F3FF';
        const textCol = item.status === 'Overdue' ? RED : PURPLE;
        return (
          <TouchableOpacity 
            style={[styles.primaryActionBtn, { backgroundColor: btnBg }]} 
            onPress={() => { setSelectedInvoice(item); setReminderModalVisible(true); }}>
            <BellRing size={16} color={textCol} style={{ marginRight: 6 }} />
            <Text style={[styles.primaryActionText, { color: textCol }]}>Send Reminder</Text>
          </TouchableOpacity>
        );
      }
      if (item.status === 'Partially Paid') {
        return (
          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => { setSelectedInvoice(item); setPaymentModalVisible(true); }}>
            <Text style={styles.primaryActionText}>Record Payment</Text>
          </TouchableOpacity>
        );
      }
      return null;
    };

    return (
      <View style={[styles.card, !isMobile && { width: '48%', marginRight: '2%' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.invoiceId}>{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: stat.bg }]}>
            <Text style={[styles.badgeText, { color: stat.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.clientText}>{item.client}</Text>
        <Text style={styles.typeText}>{item.type}</Text>
        
        <Text style={styles.amountText}>{item.amount}</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateCol}>
            <Text style={styles.dateLabel}>Issued</Text>
            <Text style={styles.dateVal}>{item.date}</Text>
          </View>
          <View style={[styles.dateCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.dateLabel}>{item.status === 'Paid' ? 'Paid on' : 'Due'}</Text>
            <Text style={[styles.dateVal, item.status === 'Overdue' && { color: RED }]}>
              {item.status === 'Paid' ? item.paidOn : item.due}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedInvoice(item); setViewModalVisible(true); }}>
            <Text style={styles.textActionText}>View Invoice</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          
          <View style={styles.footerRight}>
            {renderPrimaryAction()}
            <TouchableOpacity style={styles.moreBtn} onPress={() => openMoreMenu(item)}>
              <MoreVertical size={20} color={MUTED} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // -------------------------------------------------------------
  // Modals
  // -------------------------------------------------------------

  const renderMoreMenu = () => {
    if (!selectedInvoice) return null;
    return (
      <Modal visible={moreMenuVisible} transparent animationType="fade" onRequestClose={() => setMoreMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMoreMenuVisible(false)}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContent}>
                
                {selectedInvoice.status === 'Draft' ? (
                  <>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setCreateModalVisible(true); }}>
                      <Pencil size={18} color={NAVY} /><Text style={styles.menuText}>Edit Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                      <Copy size={18} color={NAVY} /><Text style={styles.menuText}>Duplicate Invoice</Text>
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
                      <Trash2 size={18} color={RED} /><Text style={[styles.menuText, { color: RED }]}>Delete Draft</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.menuItem}>
                      <Download size={18} color={NAVY} /><Text style={styles.menuText}>Download PDF</Text>
                    </TouchableOpacity>
                    
                    {selectedInvoice.status === 'Sent' && (
                      <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setPaymentModalVisible(true); }}>
                        <CheckCircle size={18} color={NAVY} /><Text style={styles.menuText}>Mark as Paid</Text>
                      </TouchableOpacity>
                    )}
                    {selectedInvoice.status === 'Partially Paid' && (
                      <TouchableOpacity style={styles.menuItem}>
                        <Receipt size={18} color={NAVY} /><Text style={styles.menuText}>View Payments</Text>
                      </TouchableOpacity>
                    )}
                    {selectedInvoice.status === 'Paid' && (
                      <TouchableOpacity style={styles.menuItem}>
                        <Receipt size={18} color={NAVY} /><Text style={styles.menuText}>View Payment Receipt</Text>
                      </TouchableOpacity>
                    )}
                    {selectedInvoice.status === 'Overdue' && (
                      <TouchableOpacity style={styles.menuItem} onPress={() => { setMoreMenuVisible(false); setPaymentModalVisible(true); }}>
                        <CreditCard size={18} color={NAVY} /><Text style={styles.menuText}>Record Payment</Text>
                      </TouchableOpacity>
                    )}
                    
                    {selectedInvoice.status !== 'Paid' && selectedInvoice.status !== 'Cancelled' && (
                      <>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
                          <XCircle size={18} color={RED} /><Text style={[styles.menuText, { color: RED }]}>Cancel Invoice</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
                
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderCreateModal = () => (
    <Modal visible={createModalVisible} transparent animationType="slide">
      <View style={styles.bottomSheetOverlay}>
        <KeyboardAvoidingView style={styles.modalCentered} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Invoice</Text>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.inputLabel}>Client Business *</Text>
            <TextInput style={styles.input} placeholder="Select Client..." />
            
            <View style={isMobile ? null : styles.row}>
              <View style={isMobile ? null : styles.col}>
                <Text style={styles.inputLabel}>Invoice Date *</Text>
                <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
              </View>
              <View style={isMobile ? null : styles.col}>
                <Text style={styles.inputLabel}>Due Date *</Text>
                <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
              </View>
            </View>

            <Text style={styles.sectionHeading}>Invoice Items</Text>
            <View style={styles.itemBox}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput style={styles.input} placeholder="e.g. Campaign Management Fee" />
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <TextInput style={styles.input} placeholder="1" keyboardType="numeric" />
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Rate (₹)</Text>
                  <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.addMoreBtn}><Text style={styles.addMoreText}>+ Add Another Item</Text></TouchableOpacity>

            <View style={styles.totalsBox}>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalVal}>₹0.00</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Tax</Text><Text style={styles.totalVal}>₹0.00</Text></View>
              <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8 }]}>
                <Text style={[styles.totalLabel, { fontWeight: 'bold', color: NAVY }]}>Total Amount</Text>
                <Text style={[styles.totalVal, { fontWeight: 'bold', color: NAVY }]}>₹0.00</Text>
              </View>
            </View>

          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.btnOutlineTextBlack}>Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.btnPrimaryText}>Create & Send Invoice</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderReminderModal = () => (
    <Modal visible={reminderModalVisible} transparent animationType="fade">
      <View style={styles.bottomSheetOverlay}>
        <View style={styles.dialogContent}>
          <View style={styles.dialogHeader}>
            <Text style={styles.dialogTitle}>Send payment reminder?</Text>
          </View>
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text style={styles.dialogText}>Invoice: <Text style={{fontWeight:'bold', color: NAVY}}>{selectedInvoice?.id}</Text></Text>
            <Text style={styles.dialogText}>Client: {selectedInvoice?.client}</Text>
            <Text style={styles.dialogText}>Amount Due: <Text style={{fontWeight:'bold', color: NAVY}}>{selectedInvoice?.amount}</Text></Text>
            <Text style={styles.dialogText}>Due Date: {selectedInvoice?.due}</Text>
            
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Message (Optional)</Text>
            <TextInput style={styles.textArea} multiline placeholder={`Payment for invoice ${selectedInvoice?.id} is pending.`} />
          </View>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setReminderModalVisible(false)}>
              <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setReminderModalVisible(false)}>
              <Text style={styles.btnPrimaryText}>Send Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal visible={paymentModalVisible} transparent animationType="slide">
      <View style={styles.bottomSheetOverlay}>
        <KeyboardAvoidingView style={[styles.modalCentered, { maxWidth: 450 }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Record Payment</Text>
            <TouchableOpacity onPress={() => setPaymentModalVisible(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.inputLabel}>Payment Amount (₹) *</Text>
            <TextInput style={styles.input} placeholder="e.g. 50000" keyboardType="numeric" />
            
            <Text style={styles.inputLabel}>Payment Date *</Text>
            <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
            
            <Text style={styles.inputLabel}>Payment Method *</Text>
            <TextInput style={styles.input} placeholder="e.g. Bank Transfer, UPI..." />
            
            <Text style={styles.inputLabel}>Transaction Reference</Text>
            <TextInput style={styles.input} placeholder="e.g. UTR Number" />
          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setPaymentModalVisible(false)}>
              <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => setPaymentModalVisible(false)}>
              <Text style={styles.btnPrimaryText}>Record Payment</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderViewModal = () => (
    <Modal visible={viewModalVisible} transparent animationType="slide">
      <View style={styles.bottomSheetOverlay}>
        <View style={styles.modalCentered}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invoice Details</Text>
            <TouchableOpacity onPress={() => setViewModalVisible(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={styles.invoiceIdLarge}>{selectedInvoice?.id}</Text>
                <Text style={styles.dateVal}>Issued: {selectedInvoice?.date}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(selectedInvoice?.status).bg, alignSelf: 'flex-start' }]}>
                <Text style={[styles.badgeText, { color: getStatusColor(selectedInvoice?.status).text }]}>{selectedInvoice?.status}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={styles.inputLabel}>Billed To</Text>
              <Text style={styles.profName}>{selectedInvoice?.client}</Text>
              <Text style={styles.profRole}>123 Business Avenue, City</Text>
            </View>

            <View style={styles.itemBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={styles.inputLabel}>{selectedInvoice?.type}</Text>
                <Text style={styles.inputLabel}>{selectedInvoice?.amount}</Text>
              </View>
              <Text style={styles.profRole}>Qty: 1  |  Rate: {selectedInvoice?.amount}</Text>
            </View>

            <View style={styles.totalsBox}>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalVal}>{selectedInvoice?.amount}</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Tax</Text><Text style={styles.totalVal}>₹0.00</Text></View>
              <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8 }]}>
                <Text style={[styles.totalLabel, { fontWeight: 'bold', color: NAVY }]}>Total Amount</Text>
                <Text style={[styles.totalVal, { fontWeight: 'bold', color: NAVY }]}>{selectedInvoice?.amount}</Text>
              </View>
            </View>

          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setViewModalVisible(false)}>
              <Text style={styles.btnOutlineTextBlack}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal}>
              <Text style={styles.btnPrimaryText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isMobile ? (width < 340 ? 12 : 16) : 24 }]}>
        
        <View style={[styles.header, width < 340 && { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={{ flex: 1, paddingRight: width < 340 ? 0 : 12, marginBottom: width < 340 ? 12 : 0 }}>
            <Text style={styles.pageTitle}>Revenue & Invoices</Text>
            <Text style={styles.pageSubtitle}>Track agency earnings, invoices and client payments</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setCreateModalVisible(true)}>
            <FilePlus2 size={18} color={WHITE} />
            <Text style={styles.addBtnText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodRow}>
          {['Month', 'Quarter', 'Year', 'Custom'].map(p => (
            <TouchableOpacity key={p} style={[styles.periodBtn, activePeriod === p && styles.periodBtnActive]} onPress={() => setActivePeriod(p)}>
              <Text style={[styles.periodText, activePeriod === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Financial Overview</Text>
          <View style={styles.overviewCols}>
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}><IndianRupee size={18} color={GREEN} /></View>
              <Text style={styles.overviewVal}>₹8,50,000</Text>
              <Text style={styles.overviewLabel}>Revenue Collected</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}><Clock3 size={18} color={ORANGE} /></View>
              <Text style={styles.overviewVal}>₹1,20,000</Text>
              <Text style={styles.overviewLabel}>Pending Payments</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}><TriangleAlert size={18} color={RED} /></View>
              <Text style={styles.overviewVal}>₹40,000</Text>
              <Text style={styles.overviewLabel}>Overdue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search size={18} color={MUTED} />
            <TextInput style={styles.searchInput} placeholder="Search invoices by ID, client..." />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={NAVY} />
          </TouchableOpacity>
        </View>

        <View style={styles.pillsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {['All', 'Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue'].map(f => (
              <TouchableOpacity key={f} style={[styles.pill, activeStatus === f && styles.pillActive]} onPress={() => setActiveStatus(f)}>
                <Text style={[styles.pillText, activeStatus === f && styles.pillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Invoices</Text>
            <Text style={styles.sectionSubtitle}>Manage issued invoices and payment status</Text>
          </View>
        </View>

        <FlatList
          data={MOCK_INVOICES.filter(i => activeStatus === 'All' || i.status === activeStatus)}
          keyExtractor={item => item.id}
          renderItem={renderInvoiceCard}
          scrollEnabled={false}
          numColumns={isMobile ? 1 : 2}
          key={isMobile ? 'mobile' : 'desktop'}
          columnWrapperStyle={!isMobile && styles.cardRow}
        />

      </ScrollView>

      {renderCreateModal()}
      {renderMoreMenu()}
      {renderViewModal()}
      {renderReminderModal()}
      {renderPaymentModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, paddingBottom: 16, backgroundColor: LIGHT_BG },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: GRAY },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, height: 42, borderRadius: 10, gap: 8, justifyContent: 'center' },
  addBtnText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },
  
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%' },

  periodRow: { flexDirection: 'row', backgroundColor: WHITE, borderRadius: 10, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', alignSelf: 'flex-start' },
  periodBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  periodBtnActive: { backgroundColor: NAVY },
  periodText: { fontSize: 13, color: GRAY, fontWeight: '600' },
  periodTextActive: { color: WHITE },

  overviewCard: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  overviewCardTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 16, textAlign: 'center' },
  overviewCols: { flexDirection: 'row', alignItems: 'center' },
  overviewCol: { flex: 1, alignItems: 'center' },
  overviewDivider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  overviewVal: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  overviewLabel: { fontSize: 12, color: GRAY },

  searchFilterRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingHorizontal: 14, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY },
  filterBtn: { width: 44, height: 44, backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },

  pillsWrap: { marginBottom: 24 },
  pillsScroll: { gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  pillTextActive: { color: WHITE },

  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: GRAY },

  cardRow: { justifyContent: 'flex-start' },
  card: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  invoiceId: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  
  clientText: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  typeText: { fontSize: 13, color: GRAY, marginBottom: 12 },
  amountText: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 16 },

  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dateCol: { flex: 1 },
  dateLabel: { fontSize: 11, color: GRAY, textTransform: 'uppercase', marginBottom: 4, fontWeight: '600' },
  dateVal: { fontSize: 13, color: NAVY, fontWeight: '500' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  textActionText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryActionBtn: { backgroundColor: NAVY, paddingHorizontal: 12, height: 36, borderRadius: 8, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  primaryActionText: { color: WHITE, fontSize: 12, fontWeight: 'bold' },
  moreBtn: { padding: 4 },

  // Modals & Menus
  menuOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  menuContent: { backgroundColor: WHITE, borderRadius: 14, width: 220, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, gap: 12 },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },

  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCentered: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '90%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalScroll: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, paddingTop: 12, fontSize: 14, color: NAVY, marginBottom: 16, minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  modalFooterActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: WHITE, gap: 12 },
  btnOutlineModal: { paddingHorizontal: 16, height: 44, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnOutlineTextBlack: { color: NAVY, fontWeight: 'bold', fontSize: 14 },
  btnPrimaryModal: { paddingHorizontal: 20, height: 44, borderRadius: 10, justifyContent: 'center', backgroundColor: NAVY },
  btnPrimaryText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginTop: 8, marginBottom: 12 },
  itemBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  addMoreBtn: { alignSelf: 'flex-start', marginBottom: 24 },
  addMoreText: { fontSize: 13, fontWeight: 'bold', color: PURPLE },
  
  totalsBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalLabel: { fontSize: 14, color: GRAY, fontWeight: '500' },
  totalVal: { fontSize: 14, color: NAVY, fontWeight: '600' },

  dialogContent: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden' },
  dialogHeader: { padding: 20, paddingBottom: 10 },
  dialogTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  dialogText: { fontSize: 14, color: GRAY, marginBottom: 4 },

  invoiceIdLarge: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  profName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  profRole: { fontSize: 14, color: GRAY },
});
