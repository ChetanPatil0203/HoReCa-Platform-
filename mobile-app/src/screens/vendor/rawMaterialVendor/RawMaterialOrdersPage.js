import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback
} from 'react-native';
import {
  Menu, Bell, Search, SlidersHorizontal, Package, ChevronRight, X,
  MoreVertical, CheckCircle, Truck, User, Home, ClipboardList,
  Plus, CalendarDays
} from 'lucide-react-native';

const NAVY = '#0A192F';
const GOLD = '#0A192F';
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
  }
];

export default function RawMaterialOrdersPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState('New');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Modals & States
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [packModalVisible, setPackModalVisible] = useState(false);
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [rejectReason, setRejectReason] = useState('');
  
  // Packing form
  const [packQty, setPackQty] = useState('');
  const [packCount, setPackCount] = useState('');
  
  // Dispatch form
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');

  const filteredOrders = orders.filter(o => 
    o.status === activeFilter && 
    (searchQuery === '' || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const counts = STATUS_CHIPS.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.status === status).length;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'Accepted': return { bg: '#F3E8FF', text: '#A855F7' };
      case 'Processing': return { bg: '#FFF7ED', text: '#F97316' };
      case 'Packed': return { bg: '#FEF9C3', text: '#D97706' };
      case 'Dispatched': return { bg: '#EEF2FF', text: '#4F46E5' };
      case 'Delivered': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'Cancelled': 
      case 'Rejected': return { bg: '#FEF2F2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getPaymentColor = (status) => {
    if (status === 'Paid') return '#16A34A';
    if (status === 'Pending' || status === 'Partially Paid') return '#F97316';
    if (status === 'Failed') return '#DC2626';
    return '#64748B'; 
  };

  const updateOrderStatus = (newStatus) => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    closeAllModals();
  };

  const closeAllModals = () => {
    setDetailsModalVisible(false);
    setAcceptModalVisible(false);
    setRejectModalVisible(false);
    setProcessModalVisible(false);
    setPackModalVisible(false);
    setDispatchModalVisible(false);
    setFilterVisible(false);
  };

  const handlePrimaryAction = (order) => {
    setSelectedOrder(order);
    switch(order.status) {
      case 'New': setAcceptModalVisible(true); break;
      case 'Accepted': setProcessModalVisible(true); break;
      case 'Processing': setPackModalVisible(true); break;
      case 'Packed': setDispatchModalVisible(true); break;
      case 'Dispatched': 
      case 'Delivered': 
      case 'Cancelled': 
      case 'Rejected': 
        setDetailsModalVisible(true); 
        break;
    }
  };

  const getPrimaryActionText = (status) => {
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

  const renderMoreMenuOptions = (order) => {
    const options = [];
    if (order.status === 'New') {
      options.push({ label: 'Reject Order', color: '#DC2626', action: () => { setSelectedOrder(order); setRejectModalVisible(true); } });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => {} });
    } else if (order.status === 'Accepted') {
      options.push({ label: 'Contact Customer', color: NAVY, action: () => {} });
      options.push({ label: 'Cancel Order', color: '#DC2626', action: () => updateOrderStatus('Cancelled') });
    } else if (order.status === 'Processing') {
      options.push({ label: 'Contact Customer', color: NAVY, action: () => {} });
      options.push({ label: 'Report Stock Issue', color: NAVY, action: () => {} });
      options.push({ label: 'Cancel Order', color: '#DC2626', action: () => updateOrderStatus('Cancelled') });
    } else if (order.status === 'Packed') {
      options.push({ label: 'Update Packing', color: NAVY, action: () => {} });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => {} });
    } else if (order.status === 'Delivered') {
      options.push({ label: 'Download Invoice', color: NAVY, action: () => {} });
      options.push({ label: 'View Delivery Proof', color: NAVY, action: () => {} });
    }
    return options;
  };

  const renderOrderCard = ({ item }) => {
    const sStyle = getStatusColor(item.status);
    const primaryText = getPrimaryActionText(item.status);
    const moreOptions = renderMoreMenuOptions(item);
    const isMenuOpen = activeMenuId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
              <Text style={[styles.statusText, { color: sStyle.text }]}>{item.status.toUpperCase()}</Text>
            </View>

          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>{item.client}</Text>
          <Text style={styles.customerMeta}>{item.businessType} · {item.location}</Text>
        </View>

        <View style={styles.productRow}>
          <View style={styles.productIconBox}>
            <Package size={16} color={GOLD} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.productName} numberOfLines={1}>{item.product}</Text>
            <Text style={styles.productQty}>{item.qty}</Text>
          </View>
          <Text style={styles.productAmount}>{item.amount}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Delivery</Text>
            <View style={styles.metaValueRow}>
              <CalendarDays size={12} color={MUTED} />
              <Text style={styles.metaValue}>{item.deliveryDate}</Text>
            </View>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Payment</Text>
            <View style={styles.metaValueRow}>
              <CheckCircle size={12} color={getPaymentColor(item.paymentStatus)} />
              <Text style={[styles.metaValue, { color: getPaymentColor(item.paymentStatus) }]}>{item.paymentStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => { setSelectedOrder(item); setDetailsModalVisible(true); }}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          {primaryText && (
            <TouchableOpacity 
              style={[styles.primaryActionBtn, item.status === 'New' && {backgroundColor: GOLD}]}
              onPress={() => handlePrimaryAction(item)}
            >
              {item.status === 'New' && <CheckCircle size={16} color={WHITE} style={{marginRight: 6}} />}
              <Text style={[styles.primaryActionText, item.status === 'New' && {color: WHITE}]}>{primaryText}</Text>
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
      case 'Packed': return 'Orders ready for dispatch will appear here.';
      case 'Dispatched': return 'Orders out for delivery will appear here.';
      case 'Delivered': return 'Completed deliveries will appear here.';
      default: return `No ${activeFilter.toLowerCase()} orders.`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          


          {/* Intro & Actions */}
          <View style={styles.pageIntro}>
            <View style={styles.introLeft}>
              <Text style={styles.pageTitle}>Orders</Text>
              <Text style={styles.pageSubtitle}>Manage incoming and active customer orders</Text>
            </View>
            <View style={styles.introRight}>
              <TouchableOpacity style={styles.iconAction} onPress={() => setSearchActive(!searchActive)}>
                <Search size={20} color={NAVY} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconAction} onPress={() => setFilterVisible(true)}>
                <SlidersHorizontal size={20} color={NAVY} />
              </TouchableOpacity>
            </View>
          </View>
          
          {searchActive && (
            <View style={styles.searchWrap}>
              <Search size={16} color={MUTED} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search orders..."
                placeholderTextColor={MUTED}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}><X size={16} color={MUTED} /></TouchableOpacity>
              )}
            </View>
          )}

          {/* Status Tabs */}
          <View style={styles.tabsWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {STATUS_CHIPS.map(chip => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.tab, activeFilter === chip && styles.tabActive]}
                  onPress={() => setActiveFilter(chip)}
                >
                  <Text style={[styles.tabText, activeFilter === chip && styles.tabTextActive]}>
                    {chip} <Text style={[styles.tabCount, activeFilter === chip && styles.tabCountActive]}>{counts[chip]}</Text>
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredOrders}
            keyExtractor={item => item.id}
            renderItem={renderOrderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ClipboardList size={32} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} orders</Text>
                <Text style={styles.emptyText}>{getEmptyStateText()}</Text>
              </View>
            }
          />

          {/* Bottom Nav */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}><Home size={22} color={MUTED} /><Text style={styles.navLabel}>Home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem}><ClipboardList size={22} color={NAVY} /><Text style={[styles.navLabel, {color: NAVY, fontWeight: '700'}]}>Orders</Text></TouchableOpacity>
            <View style={styles.navItemPlusWrap}>
              <TouchableOpacity style={styles.navItemPlus}><Plus size={24} color={WHITE} /></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.navItem}><Truck size={22} color={MUTED} /><Text style={styles.navLabel}>Deliveries</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem}><User size={22} color={MUTED} /><Text style={styles.navLabel}>Profile</Text></TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>

      {/* --- MODALS --- */}

      {/* Accept Order Confirmation */}
      <Modal visible={acceptModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCenter}>
            <Text style={styles.modalTitle}>Accept this order?</Text>
            {selectedOrder && (
              <View style={styles.modalSummaryBox}>
                <Text style={styles.modalLabel}>Order:</Text><Text style={styles.modalValue}>{selectedOrder.id}</Text>
                <View style={styles.hr} />
                <Text style={styles.modalLabel}>Customer:</Text><Text style={styles.modalValue}>{selectedOrder.client}</Text>
                <View style={styles.hr} />
                <Text style={styles.modalLabel}>Order Total:</Text><Text style={styles.modalValue}>{selectedOrder.amount}</Text>
                <View style={styles.hr} />
                <Text style={styles.modalLabel}>Required Delivery:</Text><Text style={styles.modalValue}>{selectedOrder.deliveryDate}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={closeAllModals}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => updateOrderStatus('Accepted')}><Text style={styles.btnPrimaryText}>Accept Order</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Order Flow */}
      <Modal visible={rejectModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCenter}>
              <Text style={styles.modalTitle}>Reject this order?</Text>
              <Text style={styles.modalLabel}>Reason for rejection (optional)</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. Insufficient stock" value={rejectReason} onChangeText={setRejectReason} multiline />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.btnOutline} onPress={closeAllModals}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: '#DC2626'}]} onPress={() => updateOrderStatus('Rejected')}><Text style={styles.btnPrimaryText}>Reject Order</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Processing Confirmation */}
      <Modal visible={processModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCenter}>
            <Text style={styles.modalTitle}>Start processing this order?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={closeAllModals}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => updateOrderStatus('Processing')}><Text style={styles.btnPrimaryText}>Start Processing</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pack Modal */}
      <Modal visible={packModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCenter}>
              <Text style={styles.modalTitle}>Mark as Packed</Text>
              <Text style={styles.modalLabel}>Packed Quantity</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. 500 kg" value={packQty} onChangeText={setPackQty} />
              <Text style={styles.modalLabel}>Number of Packages</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. 10" value={packCount} onChangeText={setPackCount} keyboardType="numeric" />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.btnOutline} onPress={closeAllModals}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => updateOrderStatus('Packed')}><Text style={styles.btnPrimaryText}>Confirm Packing</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Dispatch Modal */}
      <Modal visible={dispatchModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
              <View style={styles.modalCenter}>
                <Text style={styles.modalTitle}>Ready for Dispatch</Text>
                <Text style={styles.modalLabel}>Driver / Partner Name</Text>
                <TextInput style={styles.modalInput} value={driverName} onChangeText={setDriverName} />
                <Text style={styles.modalLabel}>Mobile Number</Text>
                <TextInput style={styles.modalInput} keyboardType="phone-pad" value={driverMobile} onChangeText={setDriverMobile} />
                <Text style={styles.modalLabel}>Vehicle Number</Text>
                <TextInput style={styles.modalInput} value={vehicleNo} onChangeText={setVehicleNo} />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.btnOutline} onPress={closeAllModals}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => updateOrderStatus('Dispatched')}><Text style={styles.btnPrimaryText}>Confirm Dispatch</Text></TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.bottomSheet, {height: '84%', maxWidth: 580, alignSelf: 'center', width: isMobile ? '90%' : '100%'}]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Order Details</Text>
              <TouchableOpacity onPress={closeAllModals}><X size={24} color={MUTED} /></TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView style={styles.sheetBody}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                  <Text style={{fontSize: 16, fontWeight: '700', color: NAVY}}>{selectedOrder.id}</Text>
                  <View style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedOrder.status).bg}]}>
                    <Text style={[styles.statusText, {color: getStatusColor(selectedOrder.status).text}]}>{selectedOrder.status.toUpperCase()}</Text>
                  </View>
                </View>
                
                <Text style={styles.sectionHeading}>CUSTOMER INFO</Text>
                <Text style={{fontSize: 16, fontWeight: '700', color: NAVY, marginBottom: 4}}>{selectedOrder.client}</Text>
                <Text style={{fontSize: 14, color: MUTED, marginBottom: 8}}>{selectedOrder.businessType} · {selectedOrder.location}</Text>
                <Text style={{fontSize: 14, color: NAVY}}>{selectedOrder.address}</Text>
                
                <View style={[styles.hr, {marginVertical: 16}]} />
                
                <Text style={styles.sectionHeading}>PRODUCT LIST</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                  <Text style={{fontSize: 14, color: NAVY, fontWeight: '600', flex: 1}}>{selectedOrder.product}</Text>
                  <Text style={{fontSize: 14, color: MUTED}}>{selectedOrder.qty}</Text>
                </View>
                <Text style={{fontSize: 14, color: NAVY, fontWeight: '700', textAlign: 'right'}}>{selectedOrder.amount}</Text>
                
                <View style={[styles.hr, {marginVertical: 16}]} />
                
                <Text style={styles.sectionHeading}>PAYMENT & DELIVERY</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                  <Text style={{fontSize: 14, color: MUTED}}>Payment Status</Text>
                  <Text style={{fontSize: 14, color: getPaymentColor(selectedOrder.paymentStatus), fontWeight: '700'}}>{selectedOrder.paymentStatus}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                  <Text style={{fontSize: 14, color: MUTED}}>Required Delivery</Text>
                  <Text style={{fontSize: 14, color: NAVY, fontWeight: '700'}}>{selectedOrder.deliveryDate}</Text>
                </View>
                
                {selectedOrder.note ? (
                  <View style={{marginTop: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8}}>
                    <Text style={{fontSize: 12, fontWeight: '700', color: MUTED, marginBottom: 4}}>NOTE</Text>
                    <Text style={{fontSize: 14, color: NAVY}}>{selectedOrder.note}</Text>
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Bottom Sheet */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.bottomSheet, {height: 'auto', paddingBottom: 40}]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}><X size={24} color={MUTED} /></TouchableOpacity>
            </View>
            <View style={styles.sheetBody}>
              <Text style={styles.modalLabel}>Status</Text>
              {/* Fake filter options for visual */}
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20}}>
                {STATUS_CHIPS.map(chip => (
                  <View key={chip} style={styles.filterChip}><Text style={styles.filterChipText}>{chip}</Text></View>
                ))}
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => setFilterVisible(false)}><Text style={styles.btnOutlineText}>Clear Filters</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setFilterVisible(false)}><Text style={styles.btnPrimaryText}>Apply Filters</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG, maxWidth: 1200, width: '100%', alignSelf: 'center', paddingBottom: 80 },
  
  // Global Header
  globalHeader: { backgroundColor: NAVY, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 60 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: -8, marginRight: 8 },
  logoText: { fontSize: 18, fontWeight: '900', color: WHITE, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 12, fontWeight: '700', color: NAVY },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', borderWidth: 2, borderColor: NAVY },
  
  // Intro
  pageIntro: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 },
  introLeft: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: MUTED },
  introRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconAction: { padding: 8, backgroundColor: WHITE, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 14, paddingHorizontal: 12, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY, ...Platform.select({web: {outlineStyle: 'none'}}) },

  // Tabs
  tabsWrap: { paddingBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 10 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  tabActive: { backgroundColor: GOLD, borderColor: GOLD, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: MUTED },
  tabTextActive: { color: WHITE, fontWeight: '700' },
  tabCount: { fontSize: 12, fontWeight: '600', color: MUTED },
  tabCountActive: { color: WHITE },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1, gap: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: NAVY, marginTop: 12, marginBottom: 4 },
  emptyText: { fontSize: 13, color: MUTED, textAlign: 'center' },

  // Card
  card: { backgroundColor: WHITE, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, zIndex: 10 },
  cardId: { fontSize: 13, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  moreBtn: { padding: 4, marginLeft: 4, marginRight: -4 },
  
  dropdownMenu: { position: 'absolute', top: 30, right: 0, backgroundColor: WHITE, borderRadius: 12, width: 190, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6, zIndex: 100, borderWidth: 1, borderColor: '#F1F5F9', paddingVertical: 6 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { fontSize: 13, fontWeight: '600' },

  customerInfo: { marginBottom: 14 },
  customerName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 2 },
  customerMeta: { fontSize: 13, color: MUTED, fontWeight: '500' },

  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDF5', borderRadius: 12, padding: 12, marginBottom: 14 },
  productIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF5D1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 2 },
  productQty: { fontSize: 12, color: MUTED },
  productAmount: { fontSize: 15, fontWeight: '800', color: NAVY },

  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaCol: { flex: 1 },
  metaLabel: { fontSize: 11, color: MUTED, fontWeight: '700', marginBottom: 6 },
  metaValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaValue: { fontSize: 13, color: NAVY, fontWeight: '600' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center', height: 44, paddingRight: 16 },
  viewDetailsText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 4 },
  primaryActionBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  primaryActionText: { fontSize: 13, fontWeight: '700', color: NAVY },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: WHITE, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 10, color: MUTED, fontWeight: '600', marginTop: 4 },
  navItemPlusWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemPlus: { width: 48, height: 48, borderRadius: 24, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10, 25, 47, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(10, 25, 47, 0.4)', justifyContent: 'flex-end' },
  modalCenter: { backgroundColor: WHITE, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  bottomSheet: { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 20 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: MUTED, marginBottom: 8, marginTop: 16 },
  modalValue: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 4 },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: NAVY, ...Platform.select({web: {outlineStyle: 'none'}}) },
  
  modalSummaryBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 8 },
  hr: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnOutline: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '700', color: NAVY },
  btnPrimary: { flex: 1, height: 44, borderRadius: 12, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: WHITE },

  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  sheetBody: { padding: 20 },
  
  sectionHeading: { fontSize: 11, fontWeight: '800', color: MUTED, letterSpacing: 0.5, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: MUTED },
});
