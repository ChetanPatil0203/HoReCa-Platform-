import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator, Image
} from 'react-native';
import { Search, SlidersHorizontal, Package, ChevronRight, X, CircleX as XCircle, CircleCheck as CheckCircle, Truck, User, Home, ClipboardList, Plus, MapPin, CalendarDays, UserRound, RefreshCw, Copy, Phone, EllipsisVertical as MoreVertical, UserCheck } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorOrders } from '../../../services/api.service';
import { API_BASE_URL } from '../../../config/api';

const NAVY = '#071B3A';
const GOLD = '#071B3A';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const STATUS_CHIPS = ['All', 'Scheduled', 'Out for Delivery', 'Delivered', 'Cancelled'];

const getProductImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.substring(0, API_BASE_URL.length - 4) : API_BASE_URL;
  return `${baseUrl}${url}`;
};

// Map a vendor order (status=shipped/delivered) to a delivery card shape
const mapDelivery = (o) => {
  const firstItem = (o.items || [])[0];
  const dbToUiStatus = {
    shipped: 'Out for Delivery',
    delivered: 'Delivered',
    confirmed: 'Scheduled',
    cancelled: 'Cancelled',
  };
  const productImage = firstItem?.product?.imageUrl || firstItem?.product?.image || null;

  return {
    id: `#${o.id.slice(0, 8).toUpperCase()}`,
    _rawId: o.id,
    orderId: `#${o.id.slice(0, 8).toUpperCase()}`,
    client: o.owner?.bizName || o.owner?.ownerName || 'Client',
    location: o.owner?.city || o.deliveryAddress || '—',
    product: firstItem?.product?.name || 'Mixed Items',
    qty: `${(o.items || []).reduce((s, i) => s + (i.quantity || 0), 0)} ${firstItem?.product?.unit || ''}`.trim(),
    productImage: productImage ? getProductImageUrl(productImage) : null,
    amount: `₹${parseFloat(o.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
    status: dbToUiStatus[o.status] || o.status,
    driver: o.driverName || null,
    driverMobile: o.driverMobile || null,
    vehicleNo: o.vehicleNo || null,
  };
};

export default function RawMaterialDeliveriesPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useContext(AuthContext);
  const supplierId = user?.id;

  const [activeFilter, setActiveFilter] = useState('All');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDeliveries = async () => {
    if (!supplierId) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const res = await fetchVendorOrders(supplierId);
      if (res?.success) {
        // Show orders that are in delivery lifecycle
        const deliveryStatuses = ['confirmed', 'shipped', 'delivered', 'cancelled'];
        const filtered = (res.data || []).filter(o => deliveryStatuses.includes(o.status));
        setDeliveries(filtered.map(mapDelivery));
      } else {
        setError(res?.message || 'Failed to load deliveries.');
      }
    } catch (err) {
      console.error('RawMaterialDeliveriesPage: error:', err);
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDeliveries(); }, [supplierId]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [clientFilter, setClientFilter] = useState('All');
  const [tempClientFilter, setTempClientFilter] = useState('All');
  
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

  const filteredDeliveries = deliveries.filter(d => {
    if (activeFilter !== 'All' && d.status !== activeFilter) return false;
    if (clientFilter !== 'All' && d.client !== clientFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.id.toLowerCase().includes(q) && 
          !d.orderId.toLowerCase().includes(q) && 
          !d.client.toLowerCase().includes(q) && 
          !d.product.toLowerCase().includes(q) && 
          !(d.driver && d.driver.toLowerCase().includes(q))) return false;
    }
    return true;
  });
  
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
      case 'Packed': return 'Assign Driver';
      case 'Assigned': return 'Dispatch Order';
      case 'Out for Delivery': return 'Track Delivery';
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
    const primaryAction = getPrimaryAction(item.status);

    return (
      <View style={[styles.card, !isMobile && styles.cardDesktop]}>
        {/* Top row with Order ID and Status Badge */}
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.cardId}>{item.id}</Text>
            <TouchableOpacity onPress={() => Alert.alert('Copied ID', `Copied Order ID: ${item.id}`)} style={{ padding: 4 }}>
              <Copy size={11} color={MUTED} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: sStyle.bg, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: sStyle.text }} />
            <Text style={[styles.statusText, { color: sStyle.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer Row */}
        <View style={styles.customerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{item.client}</Text>
            <Text style={styles.customerMeta}>{item.location}</Text>
          </View>
        </View>

        {/* Product Row (Compact) */}
        <View style={styles.productRowCompact}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <View style={styles.productIconBoxCompact}>
              {item.productImage ? (
                <Image source={{ uri: item.productImage }} style={styles.productImageActual} />
              ) : (
                <Package size={13} color="#D97706" />
              )}
            </View>
            <Text style={styles.productNameCompact} numberOfLines={1}>
              {item.product}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.productQtyCompact}>{item.qty}</Text>
            <Text style={styles.productAmountCompact}>{item.amount}</Text>
          </View>
        </View>

        {/* Driver info box */}
        <View style={styles.driverStatusBox}>
          <Truck size={12} color={MUTED} />
          <Text style={styles.driverStatusText}>
            Driver: <Text style={{ fontWeight: '700', color: NAVY }}>{item.driver || 'Not Assigned'}</Text>
          </Text>
        </View>

        {/* Card Footer (Delivery Date & Action Buttons) */}
        <View style={styles.cardFooterCompact}>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryLabelCompact}>Delivery Date</Text>
            <Text style={styles.deliveryValCompact} numberOfLines={1}>{item.date}</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.viewDetailsBtnCompact}
              onPress={() => handleAction(item, 'details')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailsTextCompact}>Details</Text>
            </TouchableOpacity>

            {primaryAction && (
              <TouchableOpacity
                style={styles.primaryActionBtnCompact}
                onPress={() => handleAction(item, primaryAction)}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryActionTextCompact}>{primaryAction}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>

          <FlatList
            ListHeaderComponent={
              <View>
                <View style={styles.pageHeader}>
                  <View style={styles.pageHeaderLeft}>
                    <Text style={styles.pageTitle}>Deliveries</Text>
                  </View>
                </View>

                {/* Search and Filters */}
                <View style={styles.searchFilterContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={[styles.searchBox, { flex: 1, marginBottom: 0 }]}>
                      <Search size={18} color={MUTED} style={{ marginRight: 8 }} />
                      <TextInput 
                        style={styles.searchInput} 
                        placeholder="Search deliveries..." 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                      {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}><XCircle size={16} color={MUTED} /></TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={{ 
                        marginLeft: 12, 
                        width: 44, 
                        height: 44, 
                        borderRadius: 12, 
                        backgroundColor: WHITE, 
                        borderWidth: 1, 
                        borderColor: '#E2E8F0', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }} 
                      onPress={() => setFilterVisible(true)}
                    >
                      <SlidersHorizontal size={20} color={NAVY} />
                    </TouchableOpacity>
                  </View>
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
                </View>
              </View>
            }
            data={filteredDeliveries}
            keyExtractor={item => item.id}
            numColumns={isMobile ? 1 : 2}
            key={isMobile ? 'one-col' : 'two-col'}
            renderItem={renderDeliveryCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Truck size={32} color="#CBD5E1" />
                <Text style={styles.emptyTextTitle}>No {activeFilter.toLowerCase()} deliveries</Text>
                <Text style={styles.emptyTextSub}>Active delivery schedules will show up here.</Text>
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedDelivery && getMoreMenuOptions(selectedDelivery.status).length > 0 && (
                      <View style={{ position: 'relative', zIndex: 1001, marginRight: 12 }}>
                        <TouchableOpacity
                          style={{ padding: 6 }}
                          onPress={() => setActiveMenuId(activeMenuId === selectedDelivery.id ? null : selectedDelivery.id)}
                        >
                          <MoreVertical size={18} color={NAVY} />
                        </TouchableOpacity>
                        {activeMenuId === selectedDelivery.id && (
                          <View style={[styles.dropdownMenu, { top: 32, right: 0 }]}>
                            {getMoreMenuOptions(selectedDelivery.status).map((opt, idx) => (
                              <TouchableOpacity
                                key={idx}
                                style={styles.dropdownItem}
                                onPress={() => {
                                  setActiveMenuId(null);
                                  handleAction(selectedDelivery, opt);
                                }}
                              >
                                <Text style={[styles.dropdownText]}>{opt}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                    <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                      <XCircle size={24} color={MUTED} />
                    </TouchableOpacity>
                  </View>
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

      {/* Filter Bottom Sheet */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.bottomSheet, {height: 'auto', paddingBottom: 40}]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
            </View>
            <View style={styles.sheetBody}>
              <Text style={styles.inputLabel}>Client / Hotel</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20}}>
                {['All', ...Array.from(new Set(deliveries.map(d => d.client).filter(Boolean)))].map(cl => (
                  <TouchableOpacity 
                    key={cl} 
                    style={[styles.filterChip, tempClientFilter === cl && styles.filterChipActive]} 
                    onPress={() => setTempClientFilter(cl)}
                  >
                    <Text style={[styles.filterChipText, tempClientFilter === cl && styles.filterChipTextActive]}>{cl}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnModalOutline} onPress={() => { setTempClientFilter('All'); setClientFilter('All'); setFilterVisible(false); }}><Text style={styles.btnModalOutlineText}>Clear Filters</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnModalPrimary} onPress={() => { setClientFilter(tempClientFilter); setFilterVisible(false); }}><Text style={styles.btnModalPrimaryText}>Apply Filters</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG, maxWidth: 1200, width: '100%', alignSelf: 'center' },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: MUTED },
  pageHeaderActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 8 },

  tabsContainer: { paddingBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 8 },
  tab: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 24, 
    backgroundColor: WHITE, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 1
  },
  activeTab: { 
    backgroundColor: '#0F172A', 
    borderColor: '#0F172A', 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 6, 
    elevation: 3 
  },
  tabText: { fontSize: 13, fontWeight: '600', color: MUTED },
  activeTabText: { color: WHITE, fontWeight: '700' },

  listContent: { paddingBottom: 115 },
  
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3E9F1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 16
  },
  cardDesktop: {
    maxWidth: '48.8%',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardId: { fontSize: 11, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  moreBtn: { padding: 4, borderRadius: 6, backgroundColor: '#F1F5F9' },

  customerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  customerName: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  customerMeta: { fontSize: 12, color: MUTED, fontWeight: '500' },

  productRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7'
  },
  productIconBoxCompact: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  productImageActual: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  productNameCompact: { fontSize: 12, fontWeight: '700', color: NAVY, flex: 1 },
  productQtyCompact: { fontSize: 11, color: MUTED, fontWeight: '600', marginRight: 4 },
  productAmountCompact: { fontSize: 12, color: NAVY, fontWeight: '800' },

  driverStatusBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, backgroundColor: '#F8FAFC', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6 },
  driverStatusText: { fontSize: 11, color: MUTED },

  cardFooterCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 2
  },
  deliveryLabelCompact: { fontSize: 9, color: MUTED, fontWeight: '700', textTransform: 'uppercase', marginBottom: 1 },
  deliveryValCompact: { fontSize: 12, color: NAVY, fontWeight: '600' },

  actionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  viewDetailsBtnCompact: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: WHITE },
  viewDetailsTextCompact: { fontSize: 11, fontWeight: '700', color: NAVY },

  primaryActionBtnCompact: {
    backgroundColor: NAVY,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80
  },
  primaryActionTextCompact: { fontSize: 11, fontWeight: '700', color: WHITE },

  dropdownMenu: {
    position: 'absolute',
    top: 24,
    right: 0,
    backgroundColor: WHITE,
    borderRadius: 8,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    zIndex: 1000
  },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdownText: { fontSize: 11, fontWeight: '600' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTextTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 6 },
  emptyTextSub: { fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 18 },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalBody: { padding: 24 },
  
  confirmTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  confirmDetailsBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 14, gap: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },
  confirmValue: { fontSize: 13, color: '#0F172A', fontWeight: '700' },

  contextBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, marginBottom: 18, borderWidth: 1, borderColor: '#F1F5F9' },
  contextTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  contextSub: { fontSize: 12, color: MUTED, fontWeight: '500' },
  
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, height: 46, fontSize: 14, color: '#0F172A' },
  
  modalFooterActions: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  btnModalPrimary: { 
    flex: 1, 
    height: 46, 
    backgroundColor: '#0F172A', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  btnModalPrimaryText: { fontSize: 14, fontWeight: '800', color: WHITE },
  
  detailBlock: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 11, fontWeight: '800', color: MUTED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  detailSubValue: { fontSize: 14, color: MUTED, fontWeight: '500' },
  searchFilterContainer: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: WHITE, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    height: 48, 
    marginBottom: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: WHITE, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  sheetBody: { padding: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8, marginBottom: 8 },
  filterChipActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterChipTextActive: { color: WHITE, fontWeight: '700' },
});
