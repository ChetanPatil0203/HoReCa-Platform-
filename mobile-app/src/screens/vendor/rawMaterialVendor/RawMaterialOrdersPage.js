import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import {
  Search, SlidersHorizontal, Package, ChevronRight, XCircle, MoreVertical
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const STATUS_CHIPS = ['New', 'Accepted', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];

const MOCK_ORDERS = [
  {
    id: "ORD-941",
    client: "The Meridian Grand",
    businessType: "Hotel",
    location: "Jalgaon",
    product: "Premium Basmati Rice",
    qty: "500 kg",
    amount: "₹45,000",
    deliveryDate: "15 Jul 2026",
    paymentStatus: "Paid",
    status: "New",
    note: "Deliver to the rear loading dock.",
    address: "123 Meridian Blvd, Downtown"
  },
  {
    id: "ORD-938",
    client: "Azure Palace Hotel",
    businessType: "Hotel",
    location: "Pune",
    product: "Atlantic Salmon",
    qty: "50 kg",
    amount: "₹60,000",
    deliveryDate: "14 Jul 2026",
    paymentStatus: "Pending",
    status: "Processing",
    note: "Keep packed in extra ice.",
    address: "45 Azure Coast Rd"
  },
  {
    id: "ORD-935",
    client: "Café Zephyr",
    businessType: "Restaurant",
    location: "Mumbai",
    product: "Olive Oil (Extra Virgin)",
    qty: "20 L",
    amount: "₹18,500",
    deliveryDate: "12 Jul 2026",
    paymentStatus: "Paid",
    status: "Delivered",
    note: "",
    address: "78 Zephyr Street"
  }
];

export default function RawMaterialOrdersPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState('New');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [actionType, setActionType] = useState(''); 
  const [rejectReason, setRejectReason] = useState('');
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredOrders = orders.filter(o => o.status === activeFilter);
  
  // Status Counts
  const counts = STATUS_CHIPS.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.status === status).length;
    return acc;
  }, {});

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'Accepted': return { bg: '#F3E8FF', text: '#A855F7' };
      case 'Processing': return { bg: '#FFF7ED', text: '#F97316' };
      case 'Packed': return { bg: '#FEF9C3', text: '#EAB308' };
      case 'Dispatched': return { bg: '#EEF2FF', text: '#6366F1' };
      case 'Delivered': return { bg: '#F0FDF4', text: '#22C55E' };
      case 'Cancelled': 
      case 'Rejected': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getPaymentColor = (status) => {
    if (status === 'Paid') return '#10B981';
    if (status === 'Pending' || status === 'Partially Paid') return '#F59E0B';
    if (status === 'Failed') return '#EF4444';
    return '#64748B'; // COD
  };

  const getNextActionText = (status) => {
    switch(status) {
      case 'New': return 'Accept Order';
      case 'Accepted': return 'Start Processing';
      case 'Processing': return 'Mark as Packed';
      case 'Packed': return 'Ready for Dispatch';
      case 'Dispatched': return 'Track Delivery';
      case 'Delivered': return 'View Summary';
      default: return null;
    }
  };

  const handleAction = (order, type) => {
    setActiveMenuId(null);
    setSelectedOrder(order);
    setActionType(type);
    
    if (type === 'details' || type === 'summary') {
      setDetailsModalVisible(true);
    } else if (type === 'Reject Order') {
      setRejectReason('');
      setRejectModalVisible(true);
    } else {
      setConfirmModalVisible(true);
    }
  };

  const handleConfirmAction = () => {
    if (!selectedOrder) return;
    
    let newStatus = selectedOrder.status;
    if (actionType === 'Accept Order') newStatus = 'Accepted';
    if (actionType === 'Start Processing') newStatus = 'Processing';
    if (actionType === 'Mark as Packed') newStatus = 'Packed';
    if (actionType === 'Ready for Dispatch') newStatus = 'Dispatched';
    
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setConfirmModalVisible(false);
    setDetailsModalVisible(false);
  };

  const handleRejectAction = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'Rejected' } : o));
    setRejectModalVisible(false);
    setDetailsModalVisible(false);
  };

  const renderOrderCard = ({ item }) => {
    const sStyle = getStatusStyle(item.status);
    const actionText = getNextActionText(item.status);
    const isMenuOpen = activeMenuId === item.id;

    return (
      <View style={[styles.orderCard, isMenuOpen && { zIndex: 999, elevation: 10 }]}>
        {/* Top Row */}
        <View style={[styles.cardTop, isMenuOpen && { zIndex: 999 }]}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
              <Text style={[styles.statusText, { color: sStyle.text }]}>{item.status.toUpperCase()}</Text>
            </View>
            
            {item.status === 'New' && (
              <View style={{position: 'relative'}}>
                <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                  <MoreVertical size={20} color={MUTED} />
                </TouchableOpacity>
                {isMenuOpen && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleAction(item, 'Reject Order')}>
                      <Text style={[styles.dropdownText, {color: '#EF4444'}]}>Reject Order</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Customer */}
        <View style={styles.customerBox}>
          <Text style={styles.customerName}>{item.client}</Text>
          <Text style={styles.customerMeta}>{item.businessType} {item.location ? `· ${item.location}` : ''}</Text>
        </View>

        {/* Product Summary */}
        <View style={styles.productSummaryBox}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10}}>
            <Package size={20} color="#D4AF37" style={{marginRight: 12}} />
            <View>
              <Text style={styles.productName} numberOfLines={1}>{item.product}</Text>
              <Text style={styles.productQty}>{item.qty}</Text>
            </View>
          </View>
          <Text style={styles.productAmount}>{item.amount}</Text>
        </View>

        {/* Delivery & Payment */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Delivery</Text>
            <Text style={styles.metaValue}>{item.deliveryDate}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Payment</Text>
            <Text style={[styles.metaValue, { color: getPaymentColor(item.paymentStatus) }]}>{item.paymentStatus}</Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.textActionBtn} onPress={() => handleAction(item, 'details')}>
            <Text style={styles.textActionText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          {actionText && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleAction(item, actionText)}>
              <Text style={styles.primaryActionText}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const getEmptyStateText = () => {
    switch (activeFilter) {
      case 'New': return 'New customer orders will appear here.';
      case 'Accepted': return 'Accepted orders will appear here.';
      case 'Processing': return 'Orders currently being prepared will appear here.';
      case 'Packed': return 'Packed orders ready for dispatch will appear here.';
      case 'Dispatched': return 'Orders out for delivery will appear here.';
      case 'Delivered': return 'Successfully delivered orders will appear here.';
      default: return `No ${activeFilter.toLowerCase()} orders found.`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderLeft}>
              <Text style={styles.pageTitle}>Orders</Text>
              <Text style={styles.pageSubtitle}>Manage incoming and active customer orders</Text>
            </View>
            <View style={styles.pageHeaderActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Search size={22} color={NAVY} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <SlidersHorizontal size={22} color={NAVY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {STATUS_CHIPS.map(chip => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.tab, activeFilter === chip && styles.activeTab]}
                  onPress={() => setActiveFilter(chip)}
                >
                  <Text style={[styles.tabText, activeFilter === chip && styles.activeTabText]}>
                    {chip} {counts[chip] > 0 ? counts[chip] : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* List */}
          <FlatList
            data={filteredOrders}
            keyExtractor={item => item.id}
            renderItem={renderOrderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Package size={32} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} orders</Text>
                <Text style={styles.emptyText}>{getEmptyStateText()}</Text>
              </View>
            }
          />

        </View>
      </TouchableWithoutFeedback>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} animationType="fade" transparent={true} onRequestClose={() => setConfirmModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 400, width: '100%'}]}>
                <View style={styles.modalBody}>
                  <Text style={styles.confirmTitle}>{actionType}?</Text>
                  
                  {selectedOrder && actionType === 'Accept Order' && (
                    <View style={styles.confirmDetailsBox}>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Order:</Text><Text style={styles.confirmValue}>{selectedOrder.id}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Customer:</Text><Text style={styles.confirmValue}>{selectedOrder.client}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Order Total:</Text><Text style={styles.confirmValue}>{selectedOrder.amount}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Required Delivery:</Text><Text style={styles.confirmValue}>{selectedOrder.deliveryDate}</Text></View>
                    </View>
                  )}
                  {selectedOrder && actionType !== 'Accept Order' && (
                    <Text style={styles.confirmDesc}>Are you sure you want to proceed with {selectedOrder.id}?</Text>
                  )}
                </View>
                
                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnModalOutline} onPress={() => setConfirmModalVisible(false)}>
                    <Text style={styles.btnModalOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmAction}>
                    <Text style={styles.btnModalPrimaryText}>{actionType === 'Accept Order' ? 'Accept Order' : 'Confirm'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Reject Modal */}
      <Modal visible={rejectModalVisible} animationType="fade" transparent={true} onRequestClose={() => setRejectModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setRejectModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 400, width: '100%'}]}>
                  <View style={styles.modalBody}>
                    <Text style={styles.confirmTitle}>Reject this order?</Text>
                    <Text style={styles.inputLabel}>Select reason (optional)</Text>
                    <TextInput 
                      style={styles.textArea} 
                      placeholder="E.g. Product unavailable or insufficient stock..."
                      multiline
                      value={rejectReason}
                      onChangeText={setRejectReason}
                    />
                  </View>
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setRejectModalVisible(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnModalPrimary, {backgroundColor: '#EF4444'}]} onPress={handleRejectAction}>
                      <Text style={[styles.btnModalPrimaryText, {color: WHITE}]}>Reject Order</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '95%'} : {maxWidth: 560, width: '100%'}, {maxHeight: '85%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                      <XCircle size={24} color={MUTED} />
                    </TouchableOpacity>
                  </View>
                  
                  {selectedOrder && (
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
                        <Text style={styles.orderId}>{selectedOrder.id}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(selectedOrder.status).bg }]}>
                          <Text style={[styles.statusText, { color: getStatusStyle(selectedOrder.status).text }]}>{selectedOrder.status.toUpperCase()}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>CUSTOMER</Text>
                        <Text style={styles.detailValue}>{selectedOrder.client}</Text>
                        <Text style={styles.detailSubValue}>{selectedOrder.businessType} · {selectedOrder.location}</Text>
                        <Text style={[styles.detailSubValue, {marginTop: 4}]}>{selectedOrder.address}</Text>
                      </View>

                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>ORDERED PRODUCTS</Text>
                        <View style={styles.detailProductRow}>
                          <View style={{flex: 1}}><Text style={styles.detailValue}>{selectedOrder.product}</Text></View>
                          <Text style={styles.detailSubValue}>{selectedOrder.qty}</Text>
                        </View>
                      </View>

                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>PAYMENT & DELIVERY</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                          <Text style={styles.detailSubValue}>Total Amount</Text>
                          <Text style={styles.detailValue}>{selectedOrder.amount}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                          <Text style={styles.detailSubValue}>Required Delivery</Text>
                          <Text style={styles.detailValue}>{selectedOrder.deliveryDate}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.detailSubValue}>Payment Status</Text>
                          <Text style={[styles.detailValue, {color: getPaymentColor(selectedOrder.paymentStatus)}]}>{selectedOrder.paymentStatus}</Text>
                        </View>
                      </View>

                      {selectedOrder.note ? (
                        <View style={styles.detailBlock}>
                          <Text style={styles.detailLabel}>CUSTOMER NOTES</Text>
                          <Text style={styles.detailSubValue}>{selectedOrder.note}</Text>
                        </View>
                      ) : null}

                      <View style={{height: 20}} />
                    </ScrollView>
                  )}
                  
                  {selectedOrder && getNextActionText(selectedOrder.status) && (
                    <View style={styles.modalFooterActionsVertical}>
                      <TouchableOpacity style={styles.btnModalPrimary} onPress={() => handleAction(selectedOrder, getNextActionText(selectedOrder.status))}>
                        <Text style={styles.btnModalPrimaryText}>{getNextActionText(selectedOrder.status)}</Text>
                      </TouchableOpacity>
                      {selectedOrder.status === 'New' && (
                        <TouchableOpacity style={styles.btnModalOutlineCenter} onPress={() => handleAction(selectedOrder, 'Reject Order')}>
                          <Text style={[styles.btnModalOutlineText, {color: '#EF4444'}]}>Reject Order</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG, maxWidth: 1200, width: '100%', alignSelf: 'center' },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: MUTED },
  pageHeaderActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 8 },

  tabsContainer: { paddingBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  activeTab: { backgroundColor: GOLD, borderColor: GOLD, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: NAVY },
  activeTabText: { color: WHITE },

  listContent: { paddingHorizontal: 16, paddingBottom: 115 },
  
  orderCard: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#E6EBF2' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, zIndex: 10 },
  orderId: { fontSize: 13, fontWeight: 'bold', color: MUTED },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  moreBtn: { padding: 4 },
  dropdownMenu: { position: 'absolute', top: 30, right: 0, backgroundColor: WHITE, borderRadius: 12, width: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, zIndex: 100, borderWidth: 1, borderColor: '#E8EDF4', paddingVertical: 4 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { fontSize: 13, fontWeight: '600' },
  
  customerBox: { marginBottom: 14 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  customerMeta: { fontSize: 13, color: MUTED, fontWeight: '500' },
  
  productSummaryBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12, marginBottom: 14 },
  productName: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  productQty: { fontSize: 12, color: MUTED },
  productAmount: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  
  metaRow: { flexDirection: 'row', marginBottom: 16 },
  metaCol: { flex: 1 },
  metaLabel: { fontSize: 11, color: MUTED, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
  metaValue: { fontSize: 13, color: NAVY, fontWeight: '600' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 16 },
  textActionText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  primaryActionBtn: { backgroundColor: GOLD, paddingHorizontal: 16, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  primaryActionText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginTop: 16, marginBottom: 4 },
  emptyText: { fontSize: 14, color: MUTED, textAlign: 'center' },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  confirmDesc: { fontSize: 14, color: MUTED, lineHeight: 20 },
  confirmDetailsBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, gap: 10 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },
  confirmValue: { fontSize: 13, color: NAVY, fontWeight: 'bold' },

  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 8 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, minHeight: 80, fontSize: 14, color: NAVY, textAlignVertical: 'top' },
  
  modalFooterActions: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  modalFooterActionsVertical: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineCenter: { height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  detailBlock: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 11, fontWeight: 'bold', color: MUTED, marginBottom: 8, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailSubValue: { fontSize: 14, color: MUTED },
  detailProductRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
