import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import {
  Search, SlidersHorizontal, Package, ChevronRight, XCircle, MoreVertical, 
  MapPin, CalendarDays, UserRound, Truck
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const STATUS_CHIPS = ['Scheduled', 'Packed', 'Assigned', 'Out for Delivery', 'Delivered', 'Delayed', 'Cancelled'];

const MOCK_DELIVERIES = [
  {
    id: "DEL-8091", orderId: "ORD-941", client: "The Meridian Grand", product: "Premium Basmati Rice", orderedQty: 500, unit: "kg",
    additionalItems: 2, date: "Today", time: "02:00 PM",
    address: "Downtown, Jalgaon", fullAddress: "123 Meridian Blvd, Downtown, Jalgaon",
    status: "Packed", driver: null, driverPhone: null, vehicleType: null, vehicleNumber: null
  },
  {
    id: "DEL-8092", orderId: "ORD-938", client: "Azure Palace Hotel", product: "Atlantic Salmon", orderedQty: 50, unit: "kg",
    additionalItems: 0, date: "Today", time: "04:30 PM",
    address: "Azure Coast Rd, Pune", fullAddress: "45 Azure Coast Rd, Pune",
    status: "Out for Delivery", driver: "Suresh P", driverPhone: "9876543210", vehicleType: "Reefer Van", vehicleNumber: "MH14 AB 1234"
  },
  {
    id: "DEL-8089", orderId: "ORD-935", client: "Café Zephyr", product: "Olive Oil (Extra Virgin)", orderedQty: 20, unit: "L",
    additionalItems: 0, date: "Yesterday", time: "01:00 PM",
    address: "Zephyr Street, Mumbai", fullAddress: "78 Zephyr Street, Mumbai",
    status: "Delivered", driver: "Amit Singh", driverPhone: "8765432109", vehicleType: "Bike", vehicleNumber: "MH12 CD 9876"
  }
];

export default function RawMaterialDeliveriesPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState('All');
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
  
  // Modals & Menus
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  const [assignDriverVisible, setAssignDriverVisible] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', vehicleNum: '', dispatchTime: '', deliveryTime: '', note: '' });
  
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const filteredDeliveries = deliveries.filter(d => activeFilter === 'All' ? true : d.status === activeFilter);
  
  const counts = STATUS_CHIPS.reduce((acc, status) => {
    acc[status] = deliveries.filter(d => d.status === status).length;
    return acc;
  }, { 'All': deliveries.length });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'Packed': return { bg: '#FFFBEB', text: '#D97706' };
      case 'Assigned': return { bg: '#F3E8FF', text: '#A855F7' };
      case 'Out for Delivery': return { bg: '#EEF2FF', text: '#4F46E5' };
      case 'Delivered': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'Delayed': return { bg: '#FEF2F2', text: '#DC2626' };
      case 'Cancelled': return { bg: '#F1F5F9', text: '#64748B' };
      default: return { bg: '#F8FAFC', text: '#64748B' };
    }
  };

  const getDriverStyle = (driver) => {
    if (driver) return { bg: '#ECFDF5', text: '#059669', icon: <Truck size={14} color="#059669" /> };
    return { bg: '#FFF7ED', text: '#EA580C', icon: <UserRound size={14} color="#EA580C" /> };
  };

  const getPrimaryAction = (status) => {
    switch (status) {
      case 'Scheduled': return 'Prepare Order';
      case 'Packed': return 'Assign Driver';
      case 'Assigned': return 'Dispatch Order';
      case 'Out for Delivery': return 'Track Delivery';
      case 'Delivered': return 'View Proof';
      case 'Delayed': return 'Update Delivery';
      default: return null;
    }
  };

  const getMoreMenuOptions = (status) => {
    switch(status) {
      case 'Packed': return ['Reschedule Delivery', 'Cancel Delivery'];
      case 'Assigned': return ['Change Driver', 'Contact Driver', 'Reschedule Delivery'];
      case 'Out for Delivery': return ['Contact Driver', 'Report Delay'];
      case 'Delivered': return ['View Delivery Note'];
      default: return [];
    }
  };

  const handleAction = (delivery, action) => {
    setActiveMenuId(null);
    setSelectedDelivery(delivery);
    
    if (action === 'details') {
      setDetailsModalVisible(true);
    } else if (action === 'Assign Driver' || action === 'Change Driver') {
      setDriverForm({ name: delivery.driver || '', phone: delivery.driverPhone || '', vehicleNum: delivery.vehicleNumber || '', dispatchTime: '', deliveryTime: '', note: '' });
      setAssignDriverVisible(true);
    } else if (action === 'Dispatch Order') {
      setDispatchModalVisible(true);
    } else if (action === 'Reschedule Delivery') {
      setRescheduleModalVisible(true);
    } else if (action === 'Cancel Delivery') {
      setCancelReason('');
      setCancelModalVisible(true);
    }
    // Track, View Proof, Report Delay omitted for brevity
  };

  const updateDeliveryStatus = (newStatus, extras = {}) => {
    setDeliveries(prev => prev.map(d => d.id === selectedDelivery.id ? { ...d, status: newStatus, ...extras } : d));
  };

  const submitAssignDriver = () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.vehicleNum) return;
    updateDeliveryStatus('Assigned', { driver: driverForm.name, driverPhone: driverForm.phone, vehicleNumber: driverForm.vehicleNum });
    setAssignDriverVisible(false);
  };

  const submitDispatch = () => {
    updateDeliveryStatus('Out for Delivery');
    setDispatchModalVisible(false);
  };

  const renderDeliveryCard = ({ item }) => {
    const sStyle = getStatusStyle(item.status);
    const dStyle = getDriverStyle(item.driver);
    const primaryAction = getPrimaryAction(item.status);
    const isMenuOpen = activeMenuId === item.id;
    const menuOptions = getMoreMenuOptions(item.status);

    return (
      <View style={[styles.card, isMenuOpen && { zIndex: 999, elevation: 10 }]}>
        {/* Top Row */}
        <View style={[styles.cardTop, isMenuOpen && { zIndex: 999 }]}>
          <View>
            <Text style={styles.deliveryId}>{item.id}</Text>
            <Text style={styles.orderRef}>Ref: {item.orderId}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
              <Text style={[styles.statusText, { color: sStyle.text }]}>{item.status.toUpperCase()}</Text>
            </View>
            
            {menuOptions.length > 0 && (
              <View style={{position: 'relative', marginLeft: 4}}>
                <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                  <MoreVertical size={20} color={MUTED} />
                </TouchableOpacity>
                {isMenuOpen && (
                  <View style={styles.dropdownMenu}>
                    {menuOptions.map((opt, i) => (
                      <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => handleAction(item, opt)}>
                        <Text style={[styles.dropdownText, (opt === 'Cancel Delivery' || opt === 'Report Delay') && {color: '#EF4444'}]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Customer Box */}
        <View style={styles.customerBox}>
          <Text style={styles.customerName}>{item.client}</Text>
          <View style={styles.customerMetaRow}>
            <MapPin size={14} color={MUTED} style={{marginRight: 6}} />
            <Text style={styles.customerMetaText} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>

        {/* Product Box */}
        <View style={styles.productBox}>
          <View style={styles.productIconBox}>
            <Package size={18} color="#D4AF37" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.productName} numberOfLines={1}>{item.product} · <Text style={{fontWeight: 'bold'}}>{item.orderedQty} {item.unit}</Text></Text>
            {item.additionalItems > 0 && <Text style={styles.productSub}>+{item.additionalItems} more items</Text>}
          </View>
        </View>

        {/* Time and Driver Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <CalendarDays size={16} color={MUTED} style={{marginRight: 6}} />
            <Text style={styles.infoText}>{item.date} · {item.time}</Text>
          </View>
          <View style={[styles.driverBadge, {backgroundColor: dStyle.bg}]}>
            {dStyle.icon}
            <Text style={[styles.driverBadgeText, {color: dStyle.text}]}>Driver: {item.driver ? item.driver : 'Unassigned'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.textActionBtn} onPress={() => handleAction(item, 'details')}>
            <Text style={styles.textActionText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          {primaryAction && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleAction(item, primaryAction)}>
              <Text style={styles.primaryActionText}>{primaryAction}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderLeft}>
              <Text style={styles.pageTitle}>Deliveries</Text>
              <Text style={styles.pageSubtitle}>Manage scheduled and active order deliveries</Text>
            </View>
            <View style={styles.pageHeaderActions}>
              <TouchableOpacity style={styles.iconBtn}><Search size={22} color={NAVY} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><SlidersHorizontal size={22} color={NAVY} /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {['All', ...STATUS_CHIPS].map(chip => (
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

          <FlatList
            data={filteredDeliveries}
            keyExtractor={item => item.id}
            renderItem={renderDeliveryCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Truck size={32} color="#CBD5E1" />
                <Text style={styles.emptyText}>No {activeFilter.toLowerCase()} deliveries</Text>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Assign Driver Modal */}
      <Modal visible={assignDriverVisible} animationType="fade" transparent={true} onRequestClose={() => setAssignDriverVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setAssignDriverVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 480, width: '100%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Assign Driver</Text>
                    <TouchableOpacity onPress={() => setAssignDriverVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody}>
                    {selectedDelivery && (
                      <View style={styles.contextBox}>
                        <Text style={styles.contextTitle}>{selectedDelivery.id} · {selectedDelivery.client}</Text>
                        <Text style={styles.contextSub}>{selectedDelivery.date} · {selectedDelivery.time}</Text>
                      </View>
                    )}
                    <Text style={styles.inputLabel}>Driver Name</Text>
                    <TextInput style={styles.input} value={driverForm.name} onChangeText={t => setDriverForm({...driverForm, name: t})} />
                    
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <TextInput style={styles.input} keyboardType="phone-pad" value={driverForm.phone} onChangeText={t => setDriverForm({...driverForm, phone: t})} />
                    
                    <Text style={styles.inputLabel}>Vehicle Number</Text>
                    <TextInput style={styles.input} value={driverForm.vehicleNum} onChangeText={t => setDriverForm({...driverForm, vehicleNum: t})} />
                    
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Expected Dispatch Time</Text>
                        <TextInput style={styles.input} value={driverForm.dispatchTime} onChangeText={t => setDriverForm({...driverForm, dispatchTime: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Expected Delivery Time</Text>
                        <TextInput style={styles.input} value={driverForm.deliveryTime} onChangeText={t => setDriverForm({...driverForm, deliveryTime: t})} />
                      </View>
                    </View>
                  </ScrollView>
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setAssignDriverVisible(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalPrimary} onPress={submitAssignDriver}>
                      <Text style={styles.btnModalPrimaryText}>Assign Driver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Dispatch Modal */}
      <Modal visible={dispatchModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDispatchModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDispatchModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 400, width: '100%'}]}>
                <View style={styles.modalBody}>
                  <Text style={styles.confirmTitle}>Dispatch this delivery?</Text>
                  {selectedDelivery && (
                    <View style={styles.confirmDetailsBox}>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Delivery:</Text><Text style={styles.confirmValue}>{selectedDelivery.id}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Customer:</Text><Text style={styles.confirmValue}>{selectedDelivery.client}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Driver:</Text><Text style={styles.confirmValue}>{selectedDelivery.driver}</Text></View>
                      <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Vehicle:</Text><Text style={styles.confirmValue}>{selectedDelivery.vehicleNumber}</Text></View>
                    </View>
                  )}
                </View>
                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnModalOutline} onPress={() => setDispatchModalVisible(false)}>
                    <Text style={styles.btnModalOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnModalPrimary} onPress={submitDispatch}>
                    <Text style={styles.btnModalPrimaryText}>Confirm Dispatch</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '95%'} : {maxWidth: 560, width: '100%'}, {maxHeight: '85%'}]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Delivery Details</Text>
                  <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                </View>
                {selectedDelivery && (
                  <ScrollView style={styles.modalBody}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
                      <View>
                        <Text style={styles.deliveryId}>{selectedDelivery.id}</Text>
                        <Text style={styles.orderRef}>Ref: {selectedDelivery.orderId}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(selectedDelivery.status).bg }]}>
                        <Text style={[styles.statusText, { color: getStatusStyle(selectedDelivery.status).text }]}>{selectedDelivery.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>CUSTOMER</Text>
                      <Text style={styles.detailValue}>{selectedDelivery.client}</Text>
                      <Text style={styles.detailSubValue}>{selectedDelivery.fullAddress}</Text>
                    </View>

                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>PRODUCTS</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.detailValue}>{selectedDelivery.product}</Text>
                        <Text style={styles.detailSubValue}>{selectedDelivery.orderedQty} {selectedDelivery.unit}</Text>
                      </View>
                      {selectedDelivery.additionalItems > 0 && <Text style={styles.detailSubValue}>+ {selectedDelivery.additionalItems} more items</Text>}
                    </View>

                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>SCHEDULE & DRIVER</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                        <Text style={styles.detailSubValue}>Scheduled</Text>
                        <Text style={styles.detailValue}>{selectedDelivery.date} · {selectedDelivery.time}</Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                        <Text style={styles.detailSubValue}>Assigned Driver</Text>
                        <Text style={styles.detailValue}>{selectedDelivery.driver || 'Unassigned'}</Text>
                      </View>
                      {selectedDelivery.driver && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.detailSubValue}>Vehicle</Text>
                          <Text style={styles.detailValue}>{selectedDelivery.vehicleNumber}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{height: 20}} />
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  activeTab: { backgroundColor: NAVY, borderColor: NAVY, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: MUTED },
  activeTabText: { color: WHITE },

  listContent: { paddingHorizontal: 16, paddingBottom: 115 },
  
  card: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#E6EBF2' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, zIndex: 10 },
  deliveryId: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  orderRef: { fontSize: 13, color: MUTED, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  moreBtn: { padding: 4, marginRight: -4 },
  dropdownMenu: { position: 'absolute', top: 30, right: 0, backgroundColor: WHITE, borderRadius: 12, width: 170, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, zIndex: 100, borderWidth: 1, borderColor: '#E8EDF4', paddingVertical: 4 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { fontSize: 13, fontWeight: '600', color: NAVY },
  
  customerBox: { marginBottom: 12 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  customerMetaRow: { flexDirection: 'row', alignItems: 'center' },
  customerMetaText: { fontSize: 13, color: MUTED, fontWeight: '500', flex: 1 },
  
  productBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  productIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  productName: { fontSize: 14, color: NAVY },
  productSub: { fontSize: 12, color: MUTED, marginTop: 2 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  infoCol: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  
  driverBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  driverBadgeText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 16 },
  textActionText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  primaryActionBtn: { backgroundColor: GOLD, paddingHorizontal: 16, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  primaryActionText: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: MUTED, marginTop: 12 },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  confirmDetailsBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, gap: 10 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },
  confirmValue: { fontSize: 13, color: NAVY, fontWeight: 'bold' },

  contextBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 16 },
  contextTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  contextSub: { fontSize: 12, color: MUTED },
  
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },
  
  modalFooterActions: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },
  
  detailBlock: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 11, fontWeight: 'bold', color: MUTED, marginBottom: 8, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailSubValue: { fontSize: 14, color: MUTED }
});
