import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, ActivityIndicator, Alert
} from 'react-native';
import {
  Search, SlidersHorizontal, Package, ChevronRight, X,
  CheckCircle, Truck, User, Home, ClipboardList,
  Plus, CalendarDays, RefreshCw, MoreVertical, AlertCircle, Eye, Calendar,
  PackageCheck, Info, UserCheck, ShieldCheck, HelpCircle
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorOrders, vendorRespondOrder, updateOrderStatusApi } from '../../../services/api.service';

const NAVY = '#071B3A';
const GOLD = '#D4AF37';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

// Horizontally scrollable premium pills labels
const TAB_CHIPS = ['New', 'Confirmed', 'Preparing', 'Ready', 'On the Way', 'Delivered', 'Cancelled'];

// Maps DB status to the corresponding frontend UI state
const DB_TO_UI_STATUS = {
  pending: 'New',
  confirmed: 'Confirmed',
  processing: 'Preparing',
  packed: 'Ready to Dispatch',
  shipped: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Maps frontend UI state to DB status for backend representation
const UI_TO_DB_STATUS = {
  'New': 'pending',
  'Confirmed': 'confirmed',
  'Preparing': 'processing',
  'Ready to Dispatch': 'packed',
  'Out for Delivery': 'shipped',
  'Delivered': 'delivered',
  'Cancelled': 'cancelled',
};

const mapOrder = (o) => {
  const items = o.items || [];
  const firstItem = items[0];
  const productName = firstItem?.product?.name || 'Mixed Items';
  const unit = firstItem?.product?.unit || '';
  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return {
    id: `#${o.id.slice(0, 8).toUpperCase()}`,
    _rawId: o.id,
    status: DB_TO_UI_STATUS[o.status] || 'New',
    client: o.owner?.bizName || o.owner?.ownerName || 'Unknown Client',
    businessType: o.owner?.businessType || 'Hotel',
    location: o.owner?.city || '',
    address: o.owner?.address || o.deliveryAddress || '',
    product: productName,
    qty: `${totalQty} ${unit}`.trim(),
    itemsCount: items.length,
    amount: `₹${parseFloat(o.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    deliveryDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
    paymentStatus: o.paymentStatus || (o.paymentMethod === 'prepaid' ? 'Paid' : 'Payment Pending'),
    note: o.notes || '',
    itemsList: items.map(it => ({
      name: it.product?.name || 'Item',
      qty: `${it.quantity || 0} ${it.product?.unit || ''}`.trim(),
      price: `₹${parseFloat(it.price || 0).toFixed(0)}`,
      total: `₹${(parseFloat(it.price || 0) * (it.quantity || 0)).toFixed(0)}`,
      status: 'Pending' // Initial progress item state
    })),
    driver: o.driverName || 'Not Assigned',
    driverMobile: o.driverMobile || '',
    vehicleNo: o.vehicleNo || '',
    preparationProgress: o.preparationProgress || 0,
    supplierId: o.supplierId,
    _dbStatus: o.status,
  };
};

export default function RawMaterialOrdersPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { user } = useContext(AuthContext);
  const supplierId = user?.id;

  const [activeTab, setActiveTab] = useState('New');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderRef = useRef(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Search & Filter Panel states
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');

  // Modals Visibility
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [prepareModalVisible, setPrepareModalVisible] = useState(false);
  const [prepProgressModalVisible, setPrepProgressModalVisible] = useState(false);
  const [readyModalVisible, setReadyModalVisible] = useState(false);
  const [arrangeDeliveryModalVisible, setArrangeDeliveryModalVisible] = useState(false);

  // Reject Form states
  const [rejectReason, setRejectReason] = useState('Product unavailable');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Prep Progress Form
  const [prepItems, setPrepItems] = useState([]);

  // Arrange Delivery Form states
  const [deliveryMode, setDeliveryMode] = useState('Vendor Delivery');
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [dispatchTime, setDispatchTime] = useState('Today · 04:00 PM');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Toast feedback simulation
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const loadOrders = async (silent = false) => {
    if (!supplierId) {
      setLoading(false);
      setError('Vendor ID not found. Please login again.');
      return;
    }
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      const res = await fetchVendorOrders(supplierId);
      if (res?.success) {
        setOrders((res.data || []).map(mapOrder));
      } else {
        setError(res?.message || 'Failed to load orders.');
      }
    } catch (err) {
      console.error('RawMaterialOrdersPage: fetchVendorOrders error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [supplierId]);

  // Tab mapping logic to resolve DB states
  const getTabMappedStatus = (tab) => {
    switch (tab) {
      case 'New': return 'New';
      case 'Confirmed': return 'Confirmed';
      case 'Preparing': return 'Preparing';
      case 'Ready': return 'Ready to Dispatch';
      case 'On the Way': return 'Out for Delivery';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
      default: return 'New';
    }
  };

  const filteredOrders = orders.filter(o => {
    const statusMatch = o.status === getTabMappedStatus(activeTab);
    const searchMatch = searchQuery === '' || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase());

    const custTypeMatch = selectedCustomerType === 'All' || o.businessType === selectedCustomerType;
    const payStatusMatch = selectedPaymentStatus === 'All' || o.paymentStatus === selectedPaymentStatus;

    return statusMatch && searchMatch && custTypeMatch && payStatusMatch;
  });

  const counts = TAB_CHIPS.reduce((acc, tab) => {
    const targetStatus = getTabMappedStatus(tab);
    acc[tab] = orders.filter(o => o.status === targetStatus).length;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' }; // Blue
      case 'Confirmed': return { bg: '#EEF2FF', text: '#6366F1', border: '#C7D2FE' }; // Indigo
      case 'Preparing': return { bg: '#FFF7ED', text: '#F97316', border: '#FFEDD5' }; // Orange
      case 'Ready to Dispatch': return { bg: '#FAF5FF', text: '#9333EA', border: '#F3E8FF' }; // Purple
      case 'Out for Delivery': return { bg: '#F0FDFA', text: '#0D9488', border: '#CCFBF1' }; // Teal
      case 'Delivered': return { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7' }; // Green
      case 'Cancelled': return { bg: '#FEF2F2', text: '#DC2626', border: '#FEE2E2' }; // Red
      default: return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
    }
  };

  const getPaymentBadge = (status) => {
    if (status === 'Paid') return { bg: '#ECFDF5', text: '#10B981' };
    if (status === 'Payment Pending' || status === 'Pending') return { bg: '#FFF7ED', text: '#F97316' };
    return { bg: '#F1F5F9', text: '#64748B' };
  };

  const updateOrderStatus = async (orderId, newStatus, extraFields = {}) => {
    try {
      const dbStatus = UI_TO_DB_STATUS[newStatus];
      if (dbStatus) {
        const rawOrder = orders.find(o => o.id === orderId);
        if (rawOrder && rawOrder._rawId) {
          if (newStatus === 'Confirmed' || newStatus === 'Cancelled') {
            const action = newStatus === 'Confirmed' ? 'confirmed' : 'cancelled';
            await vendorRespondOrder(rawOrder._rawId, supplierId, action);
          } else {
            await updateOrderStatusApi(rawOrder._rawId, dbStatus);
          }
        }
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, ...extraFields } : o));
    } catch (err) {
      console.error('Failed to sync status with backend:', err);
      // Fallback local update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, ...extraFields } : o));
    }
    closeAllModals();
  };

  const closeAllModals = () => {
    setDetailsModalVisible(false);
    setConfirmModalVisible(false);
    setRejectModalVisible(false);
    setPrepareModalVisible(false);
    setPrepProgressModalVisible(false);
    setReadyModalVisible(false);
    setArrangeDeliveryModalVisible(false);
    setFilterVisible(false);
    setActiveMenuId(null);
  };

  // Primary contextual button handler
  const handlePrimaryAction = (order) => {
    orderRef.current = order;
    setSelectedOrder(order);

    switch (order.status) {
      case 'New':
        setConfirmModalVisible(true);
        break;
      case 'Confirmed':
        setPrepareModalVisible(true);
        break;
      case 'Preparing':
        setReadyModalVisible(true);
        break;
      case 'Ready to Dispatch':
        setArrangeDeliveryModalVisible(true);
        break;
      case 'Out for Delivery':
        showToast('Directing to delivery tracking...');
        break;
      case 'Delivered':
        orderRef.current = order;
        setSelectedOrder(order);
        setDetailsModalVisible(true);
        break;
      default:
        orderRef.current = order;
        setSelectedOrder(order);
        setDetailsModalVisible(true);
        break;
    }
  };

  // Actions for dots dropdown context menu
  const renderMoreMenuOptions = (order) => {
    const options = [];
    if (order.status === 'New') {
      options.push({ label: 'Reject Order', color: '#DC2626', action: () => { setSelectedOrder(order); orderRef.current = order; setRejectModalVisible(true); } });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => Alert.alert('Customer Info', `Contact name: ${order.client}`) });
    } else if (order.status === 'Confirmed') {
      options.push({ label: 'Contact Customer', color: NAVY, action: () => Alert.alert('Customer Info', `Contact name: ${order.client}`) });
      options.push({ label: 'Cancel Order', color: '#DC2626', action: () => updateOrderStatus(order.id, 'Cancelled') });
    } else if (order.status === 'Preparing') {
      options.push({ label: 'Update Preparation', color: NAVY, action: () => { setSelectedOrder(order); orderRef.current = order; setPrepItems(order.itemsList); setPrepProgressModalVisible(true); } });
      options.push({ label: 'Report Item Unavailable', color: '#DC2626', action: () => showToast('Stock alert reported to client.') });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => Alert.alert('Customer Info', `Contact: ${order.client}`) });
      options.push({ label: 'Cancel Order', color: '#DC2626', action: () => updateOrderStatus(order.id, 'Cancelled') });
    } else if (order.status === 'Ready to Dispatch') {
      options.push({ label: 'Assign Driver', color: NAVY, action: () => { setSelectedOrder(order); orderRef.current = order; setArrangeDeliveryModalVisible(true); } });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => Alert.alert('Customer Info', `Contact: ${order.client}`) });
      options.push({ label: 'Cancel Order', color: '#DC2626', action: () => updateOrderStatus(order.id, 'Cancelled') });
    } else if (order.status === 'Out for Delivery') {
      options.push({ label: 'Contact Driver', color: NAVY, action: () => Alert.alert('Driver Info', `Driver: ${order.driver}\nMobile: ${order.driverMobile}`) });
      options.push({ label: 'Contact Customer', color: NAVY, action: () => Alert.alert('Customer Info', `Contact: ${order.client}`) });
      options.push({ label: 'Mark as Delivered', color: '#16A34A', action: () => { updateOrderStatus(order.id, 'Delivered'); showToast('Order marked as delivered successfully.'); } });
      options.push({ label: 'Report Delay', color: '#D97706', action: () => showToast('Delay alert sent.') });
    } else if (order.status === 'Delivered') {
      options.push({ label: 'Download Invoice', color: NAVY, action: () => showToast('Downloading invoice PDF...') });
      options.push({ label: 'View Delivery Proof', color: NAVY, action: () => showToast('Loading delivery image...') });
    }
    return options;
  };

  const getPrimaryActionText = (status) => {
    switch (status) {
      case 'New': return 'Confirm Order';
      case 'Confirmed': return 'Start Preparing';
      case 'Preparing': return 'Mark Ready';
      case 'Ready to Dispatch': return 'Arrange Delivery';
      case 'Out for Delivery': return 'Track Delivery';
      case 'Delivered': return 'View Summary';
      default: return null;
    }
  };

  const handleUpdateItemStatus = (idx, newStatus) => {
    const updated = [...prepItems];
    updated[idx].status = newStatus;
    setPrepItems(updated);
  };

  const savePrepProgress = () => {
    const packedCount = prepItems.filter(i => i.status === 'Packed' || i.status === 'Available').length;
    const progress = Math.round((packedCount / prepItems.length) * 100);
    updateOrderStatus(selectedOrder.id, 'Preparing', { itemsList: prepItems, preparationProgress: progress });
    showToast('Preparation progress updated.');
  };

  const handleConfirmOrder = () => {
    updateOrderStatus(selectedOrder.id, 'Confirmed');
    showToast('Order confirmed successfully.');
  };

  const handleRejectOrder = () => {
    const finalReason = rejectReason === 'Other' ? customRejectReason : rejectReason;
    updateOrderStatus(selectedOrder.id, 'Cancelled', { rejectReason: finalReason });
    showToast('Order rejected successfully.');
  };

  const handleStartPreparing = () => {
    updateOrderStatus(selectedOrder.id, 'Preparing', { preparationProgress: 10 });
    showToast('Order preparation started.');
  };

  const handleMarkReady = () => {
    updateOrderStatus(selectedOrder.id, 'Ready to Dispatch', { preparationProgress: 100 });
    showToast('Order is ready for dispatch.');
  };

  const handleArrangeDelivery = () => {
    updateOrderStatus(selectedOrder.id, 'Out for Delivery', {
      driver: driverName || 'Suresh Patil',
      driverMobile: driverMobile || '9876543210',
      vehicleNo: vehicleNo || 'MH-12-PQ-4567',
      deliveryNote: deliveryNote,
      deliveryMode: deliveryMode
    });
    showToast('Delivery arranged successfully.');
  };

  const renderOrderCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    const primaryText = getPrimaryActionText(item.status);
    const moreOptions = renderMoreMenuOptions(item);
    const isMenuOpen = activeMenuId === item.id;
    const paymentBadge = getPaymentBadge(item.paymentStatus);

    return (
      <View style={[styles.card, !isMobile && styles.cardDesktop]}>
        {/* Top bar with Order ID and Status Badge */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border, borderWidth: 1 }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer Basic Info */}
        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>{item.client}</Text>
          <Text style={styles.customerMeta}>{item.businessType} · {item.location}</Text>
        </View>

        {/* Summarised product layout */}
        <View style={styles.productRow}>
          <View style={styles.productIconBox}>
            <Package size={16} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.product}
            </Text>
            <Text style={styles.productQty}>
              {item.qty} {item.itemsCount > 1 ? `+${item.itemsCount - 1} more items` : ''}
            </Text>
          </View>
        </View>

        {/* Preparing Progress Bar */}
        {item.status === 'Preparing' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Preparation</Text>
              <Text style={styles.progressValue}>{item.preparationProgress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${item.preparationProgress}%` }]} />
            </View>
          </View>
        )}

        {/* Ready assignment status */}
        {item.status === 'Ready to Dispatch' && (
          <View style={styles.driverStatusBox}>
            <Truck size={14} color={MUTED} />
            <Text style={styles.driverStatusText}>Driver: <Text style={{ fontWeight: '700', color: NAVY }}>Not Assigned</Text></Text>
          </View>
        )}

        {/* Out for delivery status */}
        {item.status === 'Out for Delivery' && (
          <View style={styles.driverStatusBox}>
            <UserCheck size={14} color={MUTED} />
            <Text style={styles.driverStatusText}>Driver: <Text style={{ fontWeight: '700', color: NAVY }}>{item.driver}</Text></Text>
          </View>
        )}

        {/* Amount & Date split row */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Order Total</Text>
            <Text style={styles.metaValue}>{item.amount}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Requested Delivery</Text>
            <Text style={styles.metaValue}>{item.deliveryDate}</Text>
          </View>
        </View>

        {/* Payment and action row */}
        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.paymentBadge, { backgroundColor: paymentBadge.bg }]}>
              <Text style={[styles.paymentBadgeText, { color: paymentBadge.text }]}>{item.paymentStatus}</Text>
            </View>
            <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => { orderRef.current = item; setSelectedOrder(item); setDetailsModalVisible(true); }}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ChevronRight size={14} color={NAVY} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {primaryText && (
              <TouchableOpacity
                style={[styles.primaryActionBtn, item.status === 'New' && { backgroundColor: GOLD }]}
                onPress={() => handlePrimaryAction(item)}
              >
                <Text style={[styles.primaryActionText, item.status === 'New' && { color: WHITE }]}>{primaryText}</Text>
              </TouchableOpacity>
            )}

            {moreOptions.length > 0 && (
              <View style={{ position: 'relative' }}>
                <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                  <MoreVertical size={16} color={NAVY} />
                </TouchableOpacity>

                {isMenuOpen && (
                  <View style={styles.dropdownMenu}>
                    {moreOptions.map((opt, oIdx) => (
                      <TouchableOpacity
                        key={oIdx}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setActiveMenuId(null);
                          opt.action();
                        }}
                      >
                        <Text style={[styles.dropdownText, { color: opt.color }]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Orders</Text>
              <Text style={styles.headerSubtitle}>Manage incoming and active customer orders</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchActive(!searchActive)}>
                <Search size={18} color={NAVY} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setFilterVisible(true)}>
                <SlidersHorizontal size={18} color={NAVY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar inside header if active */}
          {searchActive && (
            <View style={styles.searchBarContainer}>
              <Search size={16} color={MUTED} />
              <TextInput
                style={styles.searchField}
                placeholder="Search by ID, customer, product, location, payment..."
                placeholderTextColor={MUTED}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={MUTED} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Horizontally scrollable status navigation bar */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
              {TAB_CHIPS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab} <Text style={[styles.tabCount, activeTab === tab && styles.tabCountActive]}>{counts[tab] || 0}</Text>
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Real responsive cards listing layout */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={GOLD} />
            </View>
          ) : (
            <FlatList
              data={filteredOrders}
              keyExtractor={item => item.id}
              renderItem={renderOrderCard}
              numColumns={isMobile ? 1 : 2}
              key={isMobile ? 'mobile-list' : 'desktop-grid'}
              contentContainerStyle={styles.cardsGridContent}
              columnWrapperStyle={!isMobile ? styles.gridRowStyle : null}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={() => loadOrders(true)}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconBox}>
                    <ClipboardList size={24} color={MUTED} />
                  </View>
                  <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} orders</Text>
                  <Text style={styles.emptySubtitle}>New customer orders will appear here.</Text>
                  <TouchableOpacity style={styles.refreshBtn} onPress={() => loadOrders()}>
                    <RefreshCw size={14} color={NAVY} style={{ marginRight: 6 }} />
                    <Text style={styles.refreshBtnText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}

          {/* Bottom mobile-only tab navigation */}
          {isMobile && (
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}><Home size={20} color={MUTED} /><Text style={styles.navLabel}>Home</Text></TouchableOpacity>
              <TouchableOpacity style={styles.navItem}><ClipboardList size={20} color={NAVY} /><Text style={[styles.navLabel, { color: NAVY, fontWeight: '700' }]}>Orders</Text></TouchableOpacity>
              <View style={styles.navPlusWrap}>
                <TouchableOpacity style={styles.navPlusBtn}><Plus size={20} color={WHITE} /></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.navItem}><Truck size={20} color={MUTED} /><Text style={styles.navLabel}>Deliveries</Text></TouchableOpacity>
              <TouchableOpacity style={styles.navItem}><User size={20} color={MUTED} /><Text style={styles.navLabel}>Profile</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* ================================================================= */}
      {/* MODALS IMPLEMENTATION */}
      {/* ================================================================= */}

      {/* 1. Confirm Order Modal */}
      <Modal visible={confirmModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCenterCard}>
            <Text style={styles.modalTitle}>Confirm this order?</Text>
            {selectedOrder && (
              <View style={styles.summaryTable}>
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Order ID</Text>
                  <Text style={styles.summaryTableValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Customer</Text>
                  <Text style={styles.summaryTableValue}>{selectedOrder.client}</Text>
                </View>
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Products</Text>
                  <Text style={styles.summaryTableValue} numberOfLines={1}>{selectedOrder.product} · {selectedOrder.qty}</Text>
                </View>
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Order Total</Text>
                  <Text style={[styles.summaryTableValue, { fontWeight: '700' }]}>{selectedOrder.amount}</Text>
                </View>
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Delivery Date</Text>
                  <Text style={styles.summaryTableValue}>{selectedOrder.deliveryDate}</Text>
                </View>
              </View>
            )}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirmOrder}>
                <Text style={styles.btnPrimaryText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Reject Order Modal */}
      <Modal visible={rejectModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCenterCard}>
              <Text style={styles.modalTitle}>Reject this order?</Text>
              <Text style={styles.inputLabel}>Reason for rejection</Text>
              
              <View style={styles.reasonsContainer}>
                {['Product unavailable', 'Insufficient stock', 'Delivery location not serviceable', 'Delivery date not possible', 'Pricing issue', 'Other'].map(r => (
                  <TouchableOpacity key={r} style={styles.reasonOption} onPress={() => setRejectReason(r)}>
                    <View style={styles.radioOuter}>
                      {rejectReason === r && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.reasonText}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {rejectReason === 'Other' && (
                <TextInput
                  style={styles.rejectInputText}
                  placeholder="Provide details..."
                  placeholderTextColor={MUTED}
                  value={customRejectReason}
                  onChangeText={setCustomRejectReason}
                />
              )}

              <View style={styles.modalActionsRow}>
                <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                  <Text style={styles.btnSecondaryText}>Keep Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: '#DC2626' }]} onPress={handleRejectOrder}>
                  <Text style={styles.btnPrimaryText}>Reject Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 3. Start Preparing Modal */}
      <Modal visible={prepareModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCenterCard}>
            <Text style={styles.modalTitle}>Start preparing this order?</Text>
            <Text style={styles.modalDesc}>Products will be collected, weighed, checked and packed.</Text>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleStartPreparing}>
                <Text style={styles.btnPrimaryText}>Start Preparing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Update Preparation Progress Checklist Modal */}
      <Modal visible={prepProgressModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCenterCard, { maxWidth: 520, maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Update Prep Items</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 12 }}>
              {prepItems.map((item, idx) => (
                <View key={idx} style={styles.prepItemRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.prepItemName}>{item.name}</Text>
                    <Text style={styles.prepItemQty}>{item.qty}</Text>
                  </View>
                  <View style={styles.prepItemActions}>
                    {['Pending', 'Available', 'Packed'].map(st => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.prepBadge, item.status === st && styles.prepBadgeActive]}
                        onPress={() => handleUpdateItemStatus(idx, st)}
                      >
                        <Text style={[styles.prepBadgeText, item.status === st && styles.prepBadgeTextActive]}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={savePrepProgress}>
                <Text style={styles.btnPrimaryText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5. Mark Ready Modal */}
      <Modal visible={readyModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCenterCard}>
            <Text style={styles.modalTitle}>Mark order ready to dispatch?</Text>
            <Text style={styles.modalDesc}>Ensure all items are packed, final quantity is checked, and delivery date is set.</Text>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleMarkReady}>
                <Text style={styles.btnPrimaryText}>Confirm Ready</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 6. Arrange Delivery Modal */}
      <Modal visible={arrangeDeliveryModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.modalCenterCard, { marginVertical: 32 }]}>
                <Text style={styles.modalTitle}>Arrange Delivery</Text>
                
                <Text style={styles.inputLabel}>Delivery Mode</Text>
                <View style={styles.deliveryModeRow}>
                  {['Vendor Delivery', 'Third-Party Delivery', 'Customer Pickup'].map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.deliveryModeBtn, deliveryMode === m && styles.deliveryModeBtnActive]}
                      onPress={() => setDeliveryMode(m)}
                    >
                      <Text style={[styles.deliveryModeText, deliveryMode === m && styles.deliveryModeTextActive]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {deliveryMode !== 'Customer Pickup' && (
                  <>
                    <Text style={styles.inputLabel}>Driver Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. Suresh Patil"
                      value={driverName}
                      onChangeText={setDriverName}
                    />

                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. 9876543210"
                      keyboardType="phone-pad"
                      value={driverMobile}
                      onChangeText={setDriverMobile}
                    />

                    <Text style={styles.inputLabel}>Vehicle Number</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. MH-12-PQ-4567"
                      value={vehicleNo}
                      onChangeText={setVehicleNo}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Dispatch Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={dispatchTime}
                  onChangeText={setDispatchTime}
                />

                <Text style={styles.inputLabel}>Delivery Note</Text>
                <TextInput
                  style={[styles.modalInput, { height: 60 }]}
                  placeholder="Additional instructions..."
                  multiline
                  value={deliveryNote}
                  onChangeText={setDeliveryNote}
                />

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={closeAllModals}>
                    <Text style={styles.btnSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleArrangeDelivery}>
                    <Text style={styles.btnPrimaryText}>Arrange & Dispatch</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 7. Order Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={closeAllModals}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.detailsCard}>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsHeaderTitle}>Order Details</Text>
                  <TouchableOpacity onPress={closeAllModals}>
                    <X size={20} color={MUTED} />
                  </TouchableOpacity>
                </View>

                {orderRef.current && (
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.detailsBody}>
                    <View style={styles.detailsMetaTop}>
                      <Text style={styles.detailsOrderId}>{orderRef.current.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderRef.current.status).bg, borderColor: getStatusColor(orderRef.current.status).border, borderWidth: 1 }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(orderRef.current.status).text }]}>
                          {orderRef.current.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.sectionHeading}>CUSTOMER INFO</Text>
                    <Text style={styles.customerNameMain}>{orderRef.current.client}</Text>
                    <Text style={styles.customerMetaText}>{orderRef.current.businessType} · {orderRef.current.location}</Text>
                    <Text style={styles.customerAddressText}>{orderRef.current.address}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionHeading}>PRODUCT LIST</Text>
                    {orderRef.current.itemsList.map((item, index) => (
                      <View key={index} style={styles.detailsProductRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailsProdName}>{item.name}</Text>
                          <Text style={styles.detailsProdQty}>{item.qty} × {item.price}</Text>
                        </View>
                        <Text style={styles.detailsProdPrice}>{item.total}</Text>
                      </View>
                    ))}

                    <View style={styles.detailsSummaryBox}>
                      <View style={styles.summarySplit}>
                        <Text style={styles.summarySplitLabel}>Subtotal</Text>
                        <Text style={styles.summarySplitVal}>{orderRef.current.amount}</Text>
                      </View>
                      <View style={styles.summarySplit}>
                        <Text style={styles.summarySplitLabel}>Delivery Fee</Text>
                        <Text style={styles.summarySplitVal}>₹0</Text>
                      </View>
                      <View style={styles.summarySplit}>
                        <Text style={styles.summarySplitLabel}>Taxes</Text>
                        <Text style={styles.summarySplitVal}>Included</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.summarySplit}>
                        <Text style={[styles.summarySplitLabel, { fontWeight: '700', color: NAVY }]}>Grand Total</Text>
                        <Text style={[styles.summarySplitVal, { fontWeight: '700', color: NAVY, fontSize: 16 }]}>{orderRef.current.amount}</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionHeading}>DELIVERY & PAYMENT</Text>
                    <View style={styles.detailsInfoRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.infoRowLabel}>Payment Method</Text>
                        <Text style={styles.infoRowVal}>{orderRef.current.paymentStatus}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.infoRowLabel}>Expected Date</Text>
                        <Text style={styles.infoRowVal}>{orderRef.current.deliveryDate}</Text>
                      </View>
                    </View>

                    {orderRef.current.note ? (
                      <View style={styles.noteBox}>
                        <Text style={styles.noteLabel}>Special Instructions</Text>
                        <Text style={styles.noteText}>{orderRef.current.note}</Text>
                      </View>
                    ) : null}

                    {orderRef.current.driver !== 'Not Assigned' && (
                      <View style={styles.driverNoteBox}>
                        <Text style={styles.noteLabel}>Driver Details</Text>
                        <Text style={styles.noteText}>Name: {orderRef.current.driver}</Text>
                        {orderRef.current.driverMobile ? (
                          <Text style={styles.noteText}>Contact: {orderRef.current.driverMobile}</Text>
                        ) : null}
                        {orderRef.current.vehicleNo ? (
                          <Text style={styles.noteText}>Vehicle No: {orderRef.current.vehicleNo}</Text>
                        ) : null}
                      </View>
                    )}
                    
                    <View style={{ height: 32 }} />
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 8. Filters Overlay Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlayBottom}>
          <View style={styles.filterBottomSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <X size={20} color={MUTED} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              <Text style={styles.filterLabel}>Customer Type</Text>
              <View style={styles.filterChipsRow}>
                {['All', 'Hotel', 'Restaurant', 'Cafe'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterChipPill, selectedCustomerType === type && styles.filterChipPillActive]}
                    onPress={() => setSelectedCustomerType(type)}
                  >
                    <Text style={[styles.filterChipText, selectedCustomerType === type && styles.filterChipTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Payment Status</Text>
              <View style={styles.filterChipsRow}>
                {['All', 'Paid', 'Payment Pending', 'Pending'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.filterChipPill, selectedPaymentStatus === status && styles.filterChipPillActive]}
                    onPress={() => setSelectedPaymentStatus(status)}
                  >
                    <Text style={[styles.filterChipText, selectedPaymentStatus === status && styles.filterChipTextActive]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.modalActionsRow, { marginTop: 24 }]}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => {
                    setSelectedCustomerType('All');
                    setSelectedPaymentStatus('All');
                    setFilterVisible(false);
                  }}
                >
                  <Text style={styles.btnSecondaryText}>Clear Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setFilterVisible(false)}>
                  <Text style={styles.btnPrimaryText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1, maxWidth: 1200, width: '100%', alignSelf: 'center', backgroundColor: BG },
  
  // Header styles
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: NAVY },
  headerSubtitle: { fontSize: 13, color: MUTED, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: BG },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchField: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },

  // Tabs status chips
  tabsContainer: { paddingVertical: 12, backgroundColor: BG },
  tabsContent: { paddingHorizontal: 16, gap: 8 },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: MUTED },
  tabTextActive: { color: WHITE, fontWeight: '700' },
  tabCount: { fontSize: 11, fontWeight: '600', color: MUTED },
  tabCountActive: { color: GOLD },

  // Loader container
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },

  // Cards layout listing
  cardsGridContent: { paddingHorizontal: 16, paddingBottom: 120, flexGrow: 1, gap: 12 },
  gridRowStyle: { justifyContent: 'space-between', gap: 16 },

  // Premium Cards Design
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    flex: 1,
    marginVertical: 4,
  },
  cardDesktop: {
    maxWidth: '48.8%',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardId: { fontSize: 12, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  customerInfo: { marginBottom: 12 },
  customerName: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  customerMeta: { fontSize: 12, color: MUTED, fontWeight: '500' },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12
  },
  productIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFF5D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  productName: { fontSize: 13, fontWeight: '700', color: NAVY },
  productQty: { fontSize: 11, color: MUTED },

  // Progress Bar for preparation
  progressContainer: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  progressLabel: { fontSize: 11, fontWeight: '700', color: MUTED },
  progressValue: { fontSize: 11, fontWeight: '700', color: NAVY },
  progressBarBg: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3, backgroundColor: '#F97316' },

  // Driver Status info
  driverStatusBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8 },
  driverStatusText: { fontSize: 11, color: MUTED },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metaCol: { flex: 1 },
  metaLabel: { fontSize: 10, color: MUTED, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 13, color: NAVY, fontWeight: '600' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12
  },
  paymentBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  paymentBadgeText: { fontSize: 10, fontWeight: '700' },
  
  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  viewDetailsText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  primaryActionBtn: {
    backgroundColor: NAVY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primaryActionText: { fontSize: 12, fontWeight: '700', color: WHITE },
  moreBtn: { padding: 6, marginLeft: 4, borderRadius: 6, backgroundColor: BG },

  // Dropdown options popup
  dropdownMenu: {
    position: 'absolute',
    bottom: 36,
    right: 0,
    backgroundColor: WHITE,
    borderRadius: 8,
    width: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    zIndex: 100
  },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdownText: { fontSize: 12, fontWeight: '600' },

  // Empty state container styles
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, alignSelf: 'center' },
  emptyIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: MUTED, marginBottom: 16, textAlign: 'center' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: WHITE },
  refreshBtnText: { fontSize: 12, fontWeight: '700', color: NAVY },

  // Fixed bottom navigation mobile-only
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    zIndex: 50
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 9, color: MUTED, marginTop: 2 },
  navPlusWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navPlusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },

  // Modals generic popup overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.4)', justifyContent: 'flex-end' },
  modalCenterCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 12 },
  modalDesc: { fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 18 },

  // Summary list inside confirmation
  summaryTable: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, gap: 8, marginBottom: 16 },
  summaryTableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTableLabel: { fontSize: 12, color: MUTED, fontWeight: '500' },
  summaryTableValue: { fontSize: 12, color: NAVY, fontWeight: '600' },

  // Reject modal reasons style
  reasonsContainer: { gap: 6, marginBottom: 12 },
  reasonOption: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  radioOuter: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: MUTED, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: NAVY },
  reasonText: { fontSize: 12, color: NAVY },
  rejectInputText: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 8, fontSize: 12, color: NAVY, marginBottom: 12 },

  // Prep Checklist inside modal
  prepItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  prepItemName: { fontSize: 12, fontWeight: '700', color: NAVY },
  prepItemQty: { fontSize: 11, color: MUTED },
  prepItemActions: { flexDirection: 'row', gap: 4 },
  prepBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: '#F1F5F9' },
  prepBadgeActive: { backgroundColor: NAVY },
  prepBadgeText: { fontSize: 9, fontWeight: '700', color: MUTED },
  prepBadgeTextActive: { color: WHITE },

  // Modal actions
  modalActionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnSecondary: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  btnSecondaryText: { fontSize: 13, fontWeight: '700', color: NAVY },
  btnPrimary: { flex: 1, height: 40, backgroundColor: NAVY, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: WHITE },

  // Arrange Delivery input styles
  inputLabel: { fontSize: 11, fontWeight: '700', color: MUTED, marginTop: 12, marginBottom: 4 },
  deliveryModeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  deliveryModeBtn: { flex: 1, paddingVertical: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  deliveryModeBtnActive: { backgroundColor: NAVY, borderColor: NAVY },
  deliveryModeText: { fontSize: 11, color: NAVY, fontWeight: '600' },
  deliveryModeTextActive: { color: WHITE },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 38, fontSize: 13, color: NAVY },

  // Details Modal (centered card layout)
  detailsCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    width: '92%',
    maxWidth: 600,
    maxHeight: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden'
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  detailsHeaderTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  detailsBody: { padding: 16 },
  detailsMetaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailsOrderId: { fontSize: 14, fontWeight: '700', color: NAVY },

  sectionHeading: { fontSize: 10, fontWeight: '800', color: MUTED, letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  customerNameMain: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  customerMetaText: { fontSize: 12, color: MUTED, marginBottom: 4 },
  customerAddressText: { fontSize: 12, color: NAVY, lineHeight: 16 },

  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },

  detailsProductRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  detailsProdName: { fontSize: 12, fontWeight: '700', color: NAVY },
  detailsProdQty: { fontSize: 11, color: MUTED },
  detailsProdPrice: { fontSize: 12, fontWeight: '700', color: NAVY },

  detailsSummaryBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginTop: 12 },
  summarySplit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summarySplitLabel: { fontSize: 12, color: MUTED },
  summarySplitVal: { fontSize: 12, color: NAVY, fontWeight: '600' },

  detailsInfoRow: { flexDirection: 'row', gap: 16 },
  infoRowLabel: { fontSize: 10, color: MUTED, fontWeight: '500' },
  infoRowVal: { fontSize: 12, color: NAVY, fontWeight: '700' },

  noteBox: { backgroundColor: '#FFFDF5', padding: 10, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#FEF08A' },
  driverNoteBox: { backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  noteLabel: { fontSize: 10, fontWeight: '800', color: MUTED, marginBottom: 2 },
  noteText: { fontSize: 12, color: NAVY, lineHeight: 16 },

  // Filters bottom sheet
  filterBottomSheet: { backgroundColor: WHITE, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterTitle: { fontSize: 15, fontWeight: '800', color: NAVY },
  filterLabel: { fontSize: 12, fontWeight: '700', color: MUTED, marginTop: 16, marginBottom: 8 },
  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChipPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: BG, borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 12, color: MUTED, fontWeight: '600' },
  filterChipTextActive: { color: WHITE },

  // Toast alert feedback
  toast: { position: 'absolute', top: 32, left: 16, right: 16, backgroundColor: '#071B3A', padding: 12, borderRadius: 8, zIndex: 1000, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  toastText: { color: WHITE, fontSize: 12, fontWeight: '700', textAlign: 'center' }
});
