import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput
} from 'react-native';
import {
  Search, Filter, Package, Clock, Truck, CheckCircle,
  XCircle, ChevronRight, MapPin, Phone, FileText, FileSignature
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const STATUS_CHIPS = ['New', 'Accepted', 'Processing', 'Packed', 'Ready to Dispatch', 'Out for Delivery', 'Delivered', 'Cancelled'];

const MOCK_ORDERS = [
  {
    id: "ORD-941",
    client: "The Meridian Grand",
    businessType: "Hotel",
    product: "Premium Basmati Rice",
    qty: "500kg",
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
    product: "Atlantic Salmon",
    qty: "50kg",
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
    product: "Olive Oil (Extra Virgin)",
    qty: "20L",
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
  const isSmallScreen = width < 360;

  const [activeFilter, setActiveFilter] = useState('New');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionType, setActionType] = useState(''); // 'reject' or 'update_status'
  const [reason, setReason] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const filteredOrders = orders.filter(o => o.status === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#3B82F6';
      case 'Accepted': return '#10B981';
      case 'Processing': return '#F59E0B';
      case 'Packed': return '#8B5CF6';
      case 'Ready to Dispatch': return '#D4AF37';
      case 'Out for Delivery': return '#3B82F6';
      case 'Delivered': return '#10B981';
      case 'Cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getNextActionText = (status) => {
    switch(status) {
      case 'New': return 'Accept Order';
      case 'Accepted': return 'Start Processing';
      case 'Processing': return 'Mark Packed';
      case 'Packed': return 'Ready for Dispatch';
      case 'Ready to Dispatch': return 'Create / Assign Delivery';
      case 'Out for Delivery': return 'View Delivery';
      case 'Delivered': return 'View Order Details';
      default: return 'Update Status';
    }
  };

  const handleAction = (order, action) => {
    setSelectedOrder(order);
    if (action === 'details') {
      setDetailsModalVisible(true);
    } else {
      setActionType(action);
      setNewStatus(''); // Reset selected status when opening
      setActionSheetVisible(true);
    }
  };

  const handleUpdateStatus = () => {
    if (!newStatus || !selectedOrder) return;

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      )
    );

    setActionSheetVisible(false);
    setNewStatus('');
  };

  const renderOrderCard = ({ item }) => {
    const isNew = item.status === 'New';
    const actionText = getNextActionText(item.status);
    const isViewOnly = item.status === 'Out for Delivery' || item.status === 'Delivered' || item.status === 'Cancelled';

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        activeOpacity={0.7}
        onPress={() => handleAction(item, 'details')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.clientRow}>
            <Text style={styles.clientName}>{item.client}</Text>
            <View style={styles.busTypeBadge}>
              <Text style={styles.busTypeText}>{item.businessType}</Text>
            </View>
          </View>

          <View style={styles.productRow}>
            <View style={styles.productThumb}>
              <Package size={20} color={GOLD} />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{item.product}</Text>
              <Text style={styles.productQty}>Qty: {item.qty}</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Delivery: {item.deliveryDate}</Text>
            <Text style={styles.metaText}>Payment: {item.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          {isNew ? (
            <View style={[styles.actionRow, isSmallScreen && { flexDirection: 'column' }]}>
              <TouchableOpacity 
                style={[styles.btnReject, isSmallScreen && { marginBottom: 8, width: '100%' }]} 
                onPress={() => handleAction(item, 'reject')}
              >
                <Text style={styles.btnRejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnPrimary, isSmallScreen && { width: '100%' }]} 
                onPress={() => handleAction(item, 'update_status')}
              >
                <Text style={styles.btnPrimaryText}>{actionText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionRow}>
              {!isViewOnly && (
                <TouchableOpacity 
                  style={[styles.btnPrimary, { width: '100%' }]} 
                  onPress={() => handleAction(item, 'update_status')}
                >
                  <Text style={styles.btnPrimaryText}>{actionText}</Text>
                </TouchableOpacity>
              )}
              {isViewOnly && (
                <TouchableOpacity 
                  style={[styles.btnOutline, { width: '100%' }]} 
                  onPress={() => handleAction(item, 'details')}
                >
                  <Text style={styles.btnOutlineText}>{actionText}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={22} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={22} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {STATUS_CHIPS.map(chip => (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, activeFilter === chip && styles.activeChip]}
                onPress={() => setActiveFilter(chip)}
              >
                <Text style={[styles.chipText, activeFilter === chip && styles.activeChipText]}>
                  {chip}
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
              <Package size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No {activeFilter.toLowerCase()} orders found.</Text>
            </View>
          }
        />

        {/* Details Modal */}
        <Modal visible={detailsModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalSafeArea}>
            {selectedOrder && (
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Order {selectedOrder.id}</Text>
                  <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                    <XCircle size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Client</Text>
                    <Text style={styles.detailValue}>{selectedOrder.client}</Text>
                    <View style={styles.addressBox}>
                      <MapPin size={16} color="#64748B" />
                      <Text style={styles.addressText}>{selectedOrder.address}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Products</Text>
                    <View style={styles.productLineItem}>
                      <Text style={styles.lineItemName}>{selectedOrder.product}</Text>
                      <Text style={styles.lineItemQty}>{selectedOrder.qty}</Text>
                      <Text style={styles.lineItemPrice}>{selectedOrder.amount}</Text>
                    </View>
                  </View>

                  {selectedOrder.note ? (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Client Note</Text>
                      <Text style={styles.noteText}>{selectedOrder.note}</Text>
                    </View>
                  ) : null}

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Timeline</Text>
                    <View style={styles.timelineItem}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={styles.timelineText}>Order Placed</Text>
                    </View>
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: getStatusColor(selectedOrder.status) }]} />
                      <Text style={[styles.timelineText, { fontWeight: 'bold' }]}>Current: {selectedOrder.status}</Text>
                    </View>
                  </View>

                  <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.quickActionBtn}>
                      <FileSignature size={18} color={NAVY} />
                      <Text style={styles.quickActionText}>Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionBtn}>
                      <Truck size={18} color={NAVY} />
                      <Text style={styles.quickActionText}>Delivery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionBtn}>
                      <Phone size={18} color={NAVY} />
                      <Text style={styles.quickActionText}>Contact</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.btnPrimaryLargeModal} onPress={() => {
                    setDetailsModalVisible(false);
                    if (selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled') {
                      setTimeout(() => {
                        handleAction(selectedOrder, 'update_status');
                      }, 300);
                    }
                  }}>
                    <Text style={styles.btnPrimaryText}>
                      {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' ? 'Update Status' : 'Close'}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ height: 40 }} />
                </ScrollView>
              </View>
            )}
          </SafeAreaView>
        </Modal>

        {/* Action Bottom Sheet (Mocked with Modal) */}
        <Modal visible={actionSheetVisible} transparent={true} animationType="fade">
          <View style={styles.sheetOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {actionType === 'reject' ? 'Reject Order' : 'Update Status'}
                </Text>
                <TouchableOpacity onPress={() => setActionSheetVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetBody}>
                {actionType === 'reject' ? (
                  <>
                    <Text style={styles.inputLabel}>Reason for rejection</Text>
                    <TextInput
                      style={styles.textArea}
                      placeholder="E.g. Out of stock..."
                      multiline
                      value={reason}
                      onChangeText={setReason}
                    />
                    <TouchableOpacity style={[styles.btnPrimaryLargeModal, { backgroundColor: '#EF4444' }]} onPress={() => setActionSheetVisible(false)}>
                      <Text style={styles.btnPrimaryText}>Confirm Rejection</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>Select next status</Text>
                    <View style={styles.statusOptions}>
                      {['Accepted', 'Processing', 'Packed', 'Ready to Dispatch', 'Out for Delivery', 'Delivered'].map(s => (
                        <TouchableOpacity
                          key={s}
                          style={[styles.statusOptionBtn, newStatus === s && { backgroundColor: GOLD }]}
                          onPress={() => setNewStatus(s)}
                        >
                          <Text style={[styles.statusOptionText, newStatus === s && { color: '#FFFFFF' }]}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.btnPrimaryLargeModal} onPress={handleUpdateStatus}>
                      <Text style={styles.btnPrimaryText}>Update</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
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
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsScroll: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: GOLD,
  },
  chipText: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 16,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
    marginRight: 8,
  },
  busTypeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  busTypeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  productThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  productQty: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnReject: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnRejectText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: GOLD,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  btnOutline: {
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: NAVY,
    fontWeight: '600',
    fontSize: 14,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  modalBody: {
    padding: 16,
  },
  detailSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 8,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  productLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lineItemName: {
    flex: 2,
    fontSize: 14,
    color: '#334155',
  },
  lineItemQty: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  lineItemPrice: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
    textAlign: 'right',
  },
  noteText: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  timelineText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#334155',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: NAVY,
  },
  btnPrimaryLargeModal: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: GOLD,
    borderRadius: 12,
    alignItems: 'center',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  sheetBody: {
    paddingBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 15,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusOptionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  statusOptionText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  }
});
