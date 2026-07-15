import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, Linking
} from 'react-native';
import {
  Search, Filter, Truck, MapPin, Phone, CheckCircle, Clock, Navigation, 
  UploadCloud, FileText, ChevronDown, ChevronUp, Package, XCircle, Info, MoreHorizontal, AlertTriangle, Edit
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const STATUS_CHIPS = ['Scheduled', 'Packed', 'Driver Assigned', 'Dispatched', 'In Transit', 'Arrived', 'Delivered'];

const MOCK_DELIVERIES = [
  {
    id: "DEL-8091", orderId: "ORD-941", client: "The Meridian Grand", product: "Premium Basmati Rice", orderedQty: 500, unit: "kg",
    date: "Today, 02:00 PM", amount: "₹45,000", address: "123 Meridian Blvd, Downtown",
    status: "Packed", isDelayed: false,
    driver: null, driverPhone: null, vehicleType: null, vehicleNumber: null,
    history: [
      { status: "Scheduled", date: "14 Jul 2026", time: "09:00 AM", note: "Order processed" },
      { status: "Packed", date: "14 Jul 2026", time: "11:00 AM", note: "Ready for dispatch" }
    ]
  },
  {
    id: "DEL-8092", orderId: "ORD-938", client: "Azure Palace Hotel", product: "Atlantic Salmon", orderedQty: 50, unit: "kg",
    date: "Today, 04:30 PM", amount: "₹60,000", address: "45 Azure Coast Rd",
    status: "Dispatched", isDelayed: false,
    driver: "Suresh P", driverPhone: "9876543210", vehicleType: "Reefer Van", vehicleNumber: "MH14 AB 1234",
    history: [
      { status: "Scheduled", date: "14 Jul 2026", time: "08:00 AM", note: "Order processed" },
      { status: "Packed", date: "14 Jul 2026", time: "10:00 AM", note: "" },
      { status: "Driver Assigned", date: "14 Jul 2026", time: "10:30 AM", note: "Assigned Suresh P" },
      { status: "Dispatched", date: "14 Jul 2026", time: "01:00 PM", note: "Left warehouse" }
    ]
  },
  {
    id: "DEL-8089", orderId: "ORD-935", client: "Café Zephyr", product: "Olive Oil (Extra Virgin)", orderedQty: 20, unit: "L",
    date: "Yesterday", amount: "₹18,500", address: "78 Zephyr Street",
    status: "Delivered", isDelayed: false,
    driver: "Amit Singh", driverPhone: "8765432109", vehicleType: "Bike", vehicleNumber: "MH12 CD 9876",
    history: [
      { status: "Scheduled", date: "13 Jul 2026", time: "10:00 AM", note: "" },
      { status: "Packed", date: "13 Jul 2026", time: "11:00 AM", note: "" },
      { status: "Driver Assigned", date: "13 Jul 2026", time: "11:30 AM", note: "" },
      { status: "Dispatched", date: "13 Jul 2026", time: "12:00 PM", note: "" },
      { status: "In Transit", date: "13 Jul 2026", time: "12:15 PM", note: "" },
      { status: "Arrived", date: "13 Jul 2026", time: "01:00 PM", note: "" },
      { status: "Delivered", date: "13 Jul 2026", time: "01:15 PM", note: "OTP verified" }
    ]
  }
];

export default function RawMaterialDeliveriesPage() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('Packed');
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
  
  // Expandable row state
  const [expandedId, setExpandedId] = useState(null);

  // Modals Data
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  // Assign Driver Modal
  const [assignDriverVisible, setAssignDriverVisible] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', vehicleType: '', vehicleNum: '' });

  // Report Delay Modal
  const [delayModalVisible, setDelayModalVisible] = useState(false);
  const [delayForm, setDelayForm] = useState({ reason: '', notes: '' });

  // Complete Delivery Modal
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeForm, setCompleteForm] = useState({ otp: '', receiver: '', qty: '', notes: '' });

  const filteredDeliveries = deliveries.filter(d => 
    activeFilter === 'All' ? true : d.status === activeFilter || (d.status === 'Partially Delivered' && activeFilter === 'Delivered')
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#8B5CF6';
      case 'Packed': return '#F59E0B';
      case 'Driver Assigned': return '#0EA5E9';
      case 'Dispatched': return '#3B82F6';
      case 'In Transit': return '#6366F1';
      case 'Arrived': return '#14B8A6';
      case 'Delivered': return '#10B981';
      case 'Partially Delivered': return '#84CC16';
      default: return '#64748B';
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
      case 'Scheduled': return 'Packed';
      case 'Packed': return 'Assign Driver';
      case 'Driver Assigned': return 'Dispatched';
      case 'Dispatched': return 'In Transit';
      case 'In Transit': return 'Arrived';
      case 'Arrived': return 'Complete Delivery';
      default: return null;
    }
  };

  const updateDeliveryState = (id, newStatus, updates = {}, historyNote = "") => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === id) {
        const newHistory = [...d.history];
        if (newStatus !== d.status && newStatus !== 'Assign Driver' && newStatus !== 'Complete Delivery') {
          newHistory.push({
            status: newStatus,
            date: "Today",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            note: historyNote
          });
        }
        return { ...d, ...updates, status: (newStatus === 'Assign Driver' || newStatus === 'Complete Delivery') ? d.status : newStatus, history: newHistory };
      }
      return d;
    }));
  };

  const handleUpdateStatusClick = (delivery) => {
    const nextStatus = getNextStatus(delivery.status);
    if (nextStatus === 'Assign Driver') {
      setSelectedDelivery(delivery);
      setDriverForm({ name: '', phone: '', vehicleType: '', vehicleNum: '' });
      setAssignDriverVisible(true);
      return;
    }
    if (nextStatus === 'Complete Delivery') {
      setSelectedDelivery(delivery);
      setCompleteForm({ otp: '', receiver: '', qty: delivery.orderedQty.toString(), notes: '' });
      setCompleteModalVisible(true);
      return;
    }

    if (nextStatus) {
      Alert.alert(
        `Mark as ${nextStatus}?`,
        `Are you sure you want to mark this delivery as ${nextStatus}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Confirm", onPress: () => updateDeliveryState(delivery.id, nextStatus) }
        ]
      );
    }
  };

  const handleCallDriver = (phone) => {
    if (!phone) {
      Alert.alert("Error", "No driver phone number available.");
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const submitAssignDriver = () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.vehicleType) return;
    updateDeliveryState(selectedDelivery.id, 'Driver Assigned', {
      driver: driverForm.name,
      driverPhone: driverForm.phone,
      vehicleType: driverForm.vehicleType,
      vehicleNumber: driverForm.vehicleNum
    }, `Assigned ${driverForm.name}`);
    setAssignDriverVisible(false);
    setExpandedId(null);
    Alert.alert("Success", "Driver assigned successfully.");
  };

  const submitDelay = () => {
    if (!delayForm.reason) return;
    updateDeliveryState(selectedDelivery.id, selectedDelivery.status, {
      isDelayed: true
    }, `Delayed: ${delayForm.reason} - ${delayForm.notes}`);
    setDelayModalVisible(false);
    setExpandedId(null);
  };

  const submitCompletion = () => {
    if (!completeForm.otp || !completeForm.receiver || !completeForm.qty) return;
    
    const deliveredQty = parseInt(completeForm.qty, 10);
    if (isNaN(deliveredQty) || deliveredQty <= 0 || deliveredQty > selectedDelivery.orderedQty) {
      Alert.alert("Error", "Invalid delivered quantity.");
      return;
    }

    const isPartial = deliveredQty < selectedDelivery.orderedQty;
    const finalStatus = isPartial ? 'Partially Delivered' : 'Delivered';

    updateDeliveryState(selectedDelivery.id, finalStatus, {
      deliveredQty: deliveredQty,
      receiverName: completeForm.receiver,
    }, `OTP Verified by ${completeForm.receiver}`);

    setCompleteModalVisible(false);
    setExpandedId(null);
    Alert.alert("Success", `Delivery ${isPartial ? 'partially ' : ''}completed successfully.`);
  };

  const renderDeliveryCard = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const nextStatusText = getNextStatus(item.status);
    const canReportDelay = item.status === 'Dispatched' || item.status === 'In Transit';
    const canComplete = item.status === 'Arrived' || item.status === 'In Transit';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.deliveryId}>{item.id}</Text>
            <Text style={styles.orderId}>Ref: {item.orderId}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
        
        {item.isDelayed && (
          <View style={styles.delayedBanner}>
            <AlertTriangle size={14} color="#EF4444" style={{marginRight: 4}} />
            <Text style={styles.delayedText}>Reported Delayed</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.clientName}>{item.client}</Text>
          
          <View style={styles.infoRow}>
            <Package size={14} color="#64748B" />
            <Text style={styles.infoText}>{item.product} • <Text style={styles.boldInfo}>{item.orderedQty}{item.unit}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>
          
          {item.driver && (
            <View style={styles.infoRow}>
              <Truck size={14} color="#64748B" />
              <Text style={styles.infoText}>{item.driver} • {item.vehicleType} {item.vehicleNumber}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          {nextStatusText && (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => handleUpdateStatusClick(item)}>
              <Text style={styles.btnPrimaryText}>{nextStatusText}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.btnIcon} 
            onPress={() => setExpandedId(isExpanded ? null : item.id)}
          >
            {isExpanded ? <ChevronUp size={24} color={NAVY} /> : <MoreHorizontal size={24} color={NAVY} />}
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedMenu}>
            <View style={styles.expandedGrid}>
              <TouchableOpacity style={styles.expandedBtn} onPress={() => { setSelectedDelivery(item); setDetailsModalVisible(true); }}>
                <Info size={20} color={NAVY} />
                <Text style={styles.expandedBtnText}>Details</Text>
              </TouchableOpacity>
              
              {item.driver && (
                <TouchableOpacity style={styles.expandedBtn} onPress={() => handleCallDriver(item.driverPhone)}>
                  <Phone size={20} color="#10B981" />
                  <Text style={styles.expandedBtnText}>Call Driver</Text>
                </TouchableOpacity>
              )}

              {canReportDelay && !item.isDelayed && (
                <TouchableOpacity style={styles.expandedBtn} onPress={() => { setSelectedDelivery(item); setDelayModalVisible(true); }}>
                  <AlertTriangle size={20} color="#F59E0B" />
                  <Text style={styles.expandedBtnText}>Delay</Text>
                </TouchableOpacity>
              )}

              {canComplete && (
                <TouchableOpacity style={styles.expandedBtn} onPress={() => { setSelectedDelivery(item); setCompleteForm({ otp: '', receiver: '', qty: item.orderedQty.toString(), notes: '' }); setCompleteModalVisible(true); }}>
                  <CheckCircle size={20} color="#10B981" />
                  <Text style={styles.expandedBtnText}>Complete</Text>
                </TouchableOpacity>
              )}

              {(item.status !== 'Delivered' && item.status !== 'Partially Delivered') && item.driver && (
                <TouchableOpacity style={styles.expandedBtn} onPress={() => { 
                  setSelectedDelivery(item); 
                  setDriverForm({ name: item.driver, phone: item.driverPhone, vehicleType: item.vehicleType, vehicleNum: item.vehicleNumber });
                  setAssignDriverVisible(true); 
                }}>
                  <Edit size={20} color="#6366F1" />
                  <Text style={styles.expandedBtnText}>Edit Driver</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Deliveries</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chips */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            <TouchableOpacity 
              style={[styles.chip, activeFilter === 'All' && styles.activeChip]}
              onPress={() => setActiveFilter('All')}
            >
              <Text style={[styles.chipText, activeFilter === 'All' && styles.activeChipText]}>All</Text>
            </TouchableOpacity>
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
          data={filteredDeliveries}
          keyExtractor={item => item.id}
          renderItem={renderDeliveryCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Truck size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No deliveries found in this status.</Text>
            </View>
          }
        />

        {/* Assign / Edit Driver Modal */}
        <Modal visible={assignDriverVisible} transparent={true} animationType="slide">
          <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{driverForm.name ? 'Edit Driver' : 'Assign Driver'}</Text>
                <TouchableOpacity onPress={() => setAssignDriverVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Driver Name *</Text>
                  <TextInput style={styles.inputField} placeholder="e.g. Ramesh Kumar" value={driverForm.name} onChangeText={t => setDriverForm({...driverForm, name: t})} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Driver Mobile Number *</Text>
                  <TextInput style={styles.inputField} placeholder="10-digit number" keyboardType="phone-pad" value={driverForm.phone} onChangeText={t => setDriverForm({...driverForm, phone: t})} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Vehicle Type *</Text>
                  <TextInput style={styles.inputField} placeholder="e.g. Mini Truck, Reefer Van" value={driverForm.vehicleType} onChangeText={t => setDriverForm({...driverForm, vehicleType: t})} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Vehicle Number</Text>
                  <TextInput style={styles.inputField} placeholder="e.g. MH12 AB 1234" value={driverForm.vehicleNum} onChangeText={t => setDriverForm({...driverForm, vehicleNum: t})} />
                </View>

                <TouchableOpacity 
                  style={[styles.btnPrimaryLarge, (!driverForm.name || !driverForm.phone || !driverForm.vehicleType) && {backgroundColor: '#94A3B8'}]}
                  disabled={!driverForm.name || !driverForm.phone || !driverForm.vehicleType}
                  onPress={submitAssignDriver}
                >
                  <Text style={styles.btnPrimaryLargeText}>Save Details</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Report Delay Modal */}
        <Modal visible={delayModalVisible} transparent={true} animationType="slide">
          <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Report Delay</Text>
                <TouchableOpacity onPress={() => setDelayModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Delay Reason *</Text>
                  <TextInput style={styles.inputField} placeholder="e.g. Traffic, Vehicle Problem" value={delayForm.reason} onChangeText={t => setDelayForm({...delayForm, reason: t})} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Additional Notes</Text>
                  <TextInput style={styles.textArea} placeholder="Any specific details..." multiline value={delayForm.notes} onChangeText={t => setDelayForm({...delayForm, notes: t})} />
                </View>

                <TouchableOpacity 
                  style={[styles.btnPrimaryLarge, !delayForm.reason && {backgroundColor: '#94A3B8'}]}
                  disabled={!delayForm.reason}
                  onPress={submitDelay}
                >
                  <Text style={styles.btnPrimaryLargeText}>Report Delay</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Complete Delivery Modal */}
        <Modal visible={completeModalVisible} transparent={true} animationType="slide">
          <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Complete Delivery</Text>
                <TouchableOpacity onPress={() => setCompleteModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Receiver OTP *</Text>
                  <TextInput style={styles.inputField} placeholder="Enter 4-digit OTP" keyboardType="numeric" maxLength={4} value={completeForm.otp} onChangeText={t => setCompleteForm({...completeForm, otp: t})} />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Receiver Name *</Text>
                  <TextInput style={styles.inputField} placeholder="Name of person receiving" value={completeForm.receiver} onChangeText={t => setCompleteForm({...completeForm, receiver: t})} />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Delivered Quantity ({selectedDelivery?.unit}) *</Text>
                  <TextInput style={styles.inputField} keyboardType="numeric" value={completeForm.qty} onChangeText={t => setCompleteForm({...completeForm, qty: t})} />
                  {completeForm.qty !== '' && parseInt(completeForm.qty, 10) < selectedDelivery?.orderedQty && (
                    <Text style={{color: '#F59E0B', fontSize: 12, marginTop: 4}}>Warning: This will mark the order as Partially Delivered.</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Delivery Photo (Required) *</Text>
                  <TouchableOpacity style={styles.uploadBox}>
                    <UploadCloud size={32} color="#94A3B8" />
                    <Text style={styles.uploadText}>Tap to open camera</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.btnPrimaryLarge, (!completeForm.otp || !completeForm.receiver || !completeForm.qty) && {backgroundColor: '#94A3B8'}]}
                  disabled={!completeForm.otp || !completeForm.receiver || !completeForm.qty}
                  onPress={submitCompletion}
                >
                  <Text style={styles.btnPrimaryLargeText}>Submit Proof & Mark Delivered</Text>
                </TouchableOpacity>
                <View style={{height: 20}} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Details Modal (Full Screen) */}
        <Modal visible={detailsModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDelivery && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Destination</Text>
                  <Text style={styles.detailClientName}>{selectedDelivery.client}</Text>
                  <View style={styles.addressBox}>
                    <MapPin size={16} color="#64748B" />
                    <Text style={styles.addressText}>{selectedDelivery.address}</Text>
                  </View>
                </View>

                {selectedDelivery.driver && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Driver Info</Text>
                    <View style={styles.driverBox}>
                      <View style={styles.driverAvatar}>
                        <UserIconPlaceholder />
                      </View>
                      <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>{selectedDelivery.driver}</Text>
                        <Text style={styles.driverVehicle}>{selectedDelivery.vehicleType} • {selectedDelivery.vehicleNumber}</Text>
                      </View>
                      <TouchableOpacity style={styles.circleBtn} onPress={() => handleCallDriver(selectedDelivery.driverPhone)}>
                        <Phone size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Order Summary</Text>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>{selectedDelivery.product}</Text>
                    <Text style={styles.summaryValue}>{selectedDelivery.orderedQty}{selectedDelivery.unit}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryTotalLabel}>Total Value</Text>
                    <Text style={styles.summaryTotalValue}>{selectedDelivery.amount}</Text>
                  </View>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Status Timeline</Text>
                  <View style={styles.timelineBox}>
                    {selectedDelivery.history.map((hist, idx) => (
                      <React.Fragment key={idx}>
                        <View style={styles.timelineItem}>
                          <CheckCircle size={16} color="#10B981" />
                          <View style={{marginLeft: 12, flex: 1}}>
                            <Text style={[styles.timelineText, {marginLeft: 0, fontWeight: 'bold'}]}>{hist.status}</Text>
                            <Text style={styles.timelineSubText}>{hist.date}, {hist.time}</Text>
                            {hist.note ? <Text style={styles.timelineNote}>{hist.note}</Text> : null}
                          </View>
                        </View>
                        {idx !== selectedDelivery.history.length - 1 && <View style={styles.timelineLine} />}
                      </React.Fragment>
                    ))}
                  </View>
                </View>
                <View style={{height: 40}} />
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const UserIconPlaceholder = () => (
  <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center'}}>
    <Info size={20} color="#64748B" />
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  headerActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 8 },
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsScroll: { paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeChip: { backgroundColor: NAVY },
  chipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeChipText: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 80 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontSize: 15 },
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryId: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  orderId: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  delayedBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 8, borderRadius: 6, marginBottom: 12 },
  delayedText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  cardBody: { marginBottom: 16 },
  clientName: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8 },
  boldInfo: { fontWeight: '600', color: '#334155' },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  btnPrimaryText: { color: NAVY, fontWeight: '600', fontSize: 14 },
  btnIcon: {
    width: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedMenu: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expandedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expandedBtn: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  expandedBtnText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },

  // Details Modal
  modalSafeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 16 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoCardTitle: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12 },
  detailClientName: { fontSize: 18, fontWeight: '600', color: NAVY, marginBottom: 8 },
  addressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 },
  addressText: { marginLeft: 8, fontSize: 13, color: '#475569', flex: 1 },
  driverBox: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  driverVehicle: { fontSize: 13, color: '#64748B' },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 14, color: '#334155' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  summaryTotalLabel: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  summaryTotalValue: { fontSize: 15, fontWeight: 'bold', color: '#10B981' },
  timelineBox: { paddingLeft: 8, paddingTop: 4 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineText: { marginLeft: 12, fontSize: 14, color: '#475569' },
  timelineSubText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  timelineNote: { fontSize: 12, color: '#475569', fontStyle: 'italic', marginTop: 4 },
  timelineLine: { width: 2, height: 24, backgroundColor: '#E2E8F0', marginLeft: 7, marginVertical: 4 },

  // Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  sheetBody: { paddingBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#475569', marginBottom: 8 },
  inputField: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadText: { marginTop: 8, fontSize: 14, color: '#64748B' },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
    height: 80,
    textAlignVertical: 'top',
  },
  btnPrimaryLarge: {
    backgroundColor: NAVY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryLargeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
