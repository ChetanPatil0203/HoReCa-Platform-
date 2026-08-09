import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, ActivityIndicator, Alert, Animated, Image
} from 'react-native';
import { Search, SlidersHorizontal, Package, ChevronRight, X, CircleCheck as CheckCircle, Truck, User, Home, ClipboardList, Plus, CalendarDays, RefreshCw, EllipsisVertical as MoreVertical, CircleAlert as AlertCircle, Eye, Calendar, PackageCheck, Info, UserCheck, ShieldCheck, CircleHelp as HelpCircle, Copy, Phone, Clock, FileText } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorOrders, vendorRespondOrder, updateOrderStatusApi } from '../../../services/api.service';
import { API_BASE_URL } from '../../../config/api';

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

const getProductImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.substring(0, API_BASE_URL.length - 4) : API_BASE_URL;
  return `${baseUrl}${url}`;
};

const mapOrder = (o) => {
  const items = o.items || [];
  const firstItem = items[0];
  const productName = firstItem?.product?.name || 'Mixed Items';
  const unit = firstItem?.product?.unit || '';
  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const productImage = firstItem?.product?.imageUrl || firstItem?.product?.image || null;

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
    productImage: productImage ? getProductImageUrl(productImage) : null,
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
    _rawDate: o.createdAt,
    paymentMethod: o.paymentMethod || 'cod',
  };
};

const FadeInCard = ({ children, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 350,
      delay: Math.min(index * 80, 600),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  return (
    <Animated.View style={{ opacity: animatedValue, transform: [{ translateY }], flex: 1 }}>
      {children}
    </Animated.View>
  );
};

const ScalePressable = ({ children, onPress, style }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedProgressBar = ({ progress, barBgStyle, barFillStyle }) => {
  const animatedWidth = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthPercent = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={barBgStyle}>
      <Animated.View style={[barFillStyle, { width: widthPercent }]} />
    </View>
  );
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

  // Pulsing animation for status indicator dots
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderRef = useRef(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Search & Filter Panel states
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedDeliverySchedule, setSelectedDeliverySchedule] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');

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
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg) => {
    setToastMessage(msg);
    toastAnim.setValue(0);
    Animated.spring(toastAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setToastMessage(null);
      });
    }, 2800);
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

    let dateMatch = true;
    if (selectedDeliverySchedule !== 'All' && o._rawDate) {
      const orderDate = new Date(o._rawDate);
      const today = new Date();
      if (selectedDeliverySchedule === 'Today') {
        dateMatch = orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      } else if (selectedDeliverySchedule === 'Tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateMatch = orderDate.getDate() === tomorrow.getDate() && orderDate.getMonth() === tomorrow.getMonth() && orderDate.getFullYear() === tomorrow.getFullYear();
      } else if (selectedDeliverySchedule === 'This Week') {
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dateMatch = diffDays <= 7;
      }
    }

    const payMethodMatch = selectedPaymentMethod === 'All' || o.paymentMethod.toLowerCase() === selectedPaymentMethod.toLowerCase();

    return statusMatch && searchMatch && custTypeMatch && payStatusMatch && dateMatch && payMethodMatch;
  });

  const counts = TAB_CHIPS.reduce((acc, tab) => {
    const targetStatus = getTabMappedStatus(tab);
    acc[tab] = orders.filter(o => o.status === targetStatus).length;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { bg: 'transparent', text: '#3B82F6', border: 'transparent', accent: '#3B82F6' }; // Blue
      case 'Confirmed': return { bg: 'transparent', text: '#6366F1', border: 'transparent', accent: '#6366F1' }; // Indigo
      case 'Preparing': return { bg: 'transparent', text: '#F97316', border: 'transparent', accent: '#F97316' }; // Orange
      case 'Ready to Dispatch': return { bg: 'transparent', text: '#9333EA', border: 'transparent', accent: '#9333EA' }; // Purple
      case 'Out for Delivery': return { bg: 'transparent', text: '#0D9488', border: 'transparent', accent: '#0D9488' }; // Teal
      case 'Delivered': return { bg: 'transparent', text: '#16A34A', border: 'transparent', accent: '#16A34A' }; // Green
      case 'Cancelled': return { bg: 'transparent', text: '#DC2626', border: 'transparent', accent: '#DC2626' }; // Red
      default: return { bg: 'transparent', text: '#64748B', border: 'transparent', accent: '#64748B' };
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

  const getPrimaryActionIcon = (status) => {
    switch (status) {
      case 'New': return CheckCircle;
      case 'Confirmed': return Package;
      case 'Preparing': return PackageCheck;
      case 'Ready to Dispatch': return Truck;
      case 'Out for Delivery': return Truck;
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

  const renderOrderCard = ({ item, index }) => {
    const statusStyle = getStatusColor(item.status);
    const primaryText = getPrimaryActionText(item.status);
    const PrimaryIcon = getPrimaryActionIcon(item.status);
    const moreOptions = renderMoreMenuOptions(item);
    const isMenuOpen = activeMenuId === item.id;

    return (
      <FadeInCard index={index}>
        <View style={[styles.card, !isMobile && styles.cardDesktop]}>
          {/* Top row with Order ID and Status Badge */}
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.cardId}>{item.id}</Text>
              <TouchableOpacity onPress={() => showToast(`Copied Order ID: ${item.id}`)} style={{ padding: 4 }}>
                <Copy size={11} color={MUTED} />
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 999 }}>
              {/* Compact Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0 }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {/* Customer Row */}
          <View style={styles.customerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{item.client}</Text>
              <Text style={styles.customerMeta}>{item.businessType} · {item.location}</Text>
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
                {item.product} {item.itemsCount > 1 ? `+${item.itemsCount - 1} items` : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.productQtyCompact}>{item.qty}</Text>
              <Text style={styles.productAmountCompact}>{item.amount}</Text>
            </View>
          </View>

          {/* Preparing Progress Bar */}
          {item.status === 'Preparing' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Preparation Progress</Text>
                <Text style={styles.progressValue}>{item.preparationProgress}%</Text>
              </View>
              <AnimatedProgressBar
                progress={item.preparationProgress}
                barBgStyle={styles.progressBarBg}
                barFillStyle={styles.progressBarFill}
              />
            </View>
          )}

          {/* Ready / Driver assignment status */}
          {item.status === 'Ready to Dispatch' && (
            <View style={styles.driverStatusBox}>
              <Truck size={12} color={MUTED} />
              <Text style={styles.driverStatusText}>Driver: <Text style={{ fontWeight: '700', color: NAVY }}>Not Assigned</Text></Text>
            </View>
          )}

          {/* Out for delivery status */}
          {item.status === 'Out for Delivery' && (
            <View style={styles.driverStatusBox}>
              <UserCheck size={12} color={MUTED} />
              <Text style={styles.driverStatusText}>Driver: <Text style={{ fontWeight: '700', color: NAVY }}>{item.driver}</Text></Text>
            </View>
          )}

          {/* Card Footer (Delivery Date & Main Action Buttons) */}
          <View style={[styles.cardFooterCompact, isMobile && primaryText && { flexDirection: 'column', alignItems: 'stretch', gap: 10 }]}>
            <View style={isMobile && primaryText ? { marginBottom: 2 } : { flex: 1 }}>
              <Text style={styles.deliveryLabelCompact}>Requested Delivery</Text>
              <Text style={styles.deliveryValCompact} numberOfLines={1}>{item.deliveryDate}</Text>
            </View>
            
            <View style={[styles.actionsContainer, isMobile && primaryText && { width: '100%', justifyContent: 'space-between', gap: 8 }]}>
              <TouchableOpacity
                style={[styles.viewDetailsBtnCompact, isMobile && primaryText && { flex: 1, paddingVertical: 10 }]}// slightly more padding on mobile for better tap target when stacked
                onPress={() => { orderRef.current = item; setSelectedOrder(item); setDetailsModalVisible(true); }}
                activeOpacity={0.7}
              >
                <Text style={styles.viewDetailsTextCompact}>Details</Text>
              </TouchableOpacity>

              {primaryText && (
                <ScalePressable
                  style={[styles.primaryActionBtnCompact, isMobile && { flex: 1.6, paddingVertical: 10 }]}
                  onPress={() => handlePrimaryAction(item)}
                >
                  <Text style={styles.primaryActionTextCompact}>{primaryText}</Text>
                </ScalePressable>
              )}
            </View>
          </View>

        </View>
      </FadeInCard>
    );
  };

  const translateY = toastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {toastMessage && (
        <Animated.View style={[styles.toast, { opacity: toastAnim, transform: [{ translateY }] }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.container}>
          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Orders</Text>
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
              renderItem={({ item, index }) => renderOrderCard({ item, index })}
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

        </View>

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
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
              <View style={[styles.modalCenterCard, styles.arrangeDeliveryCard, { width: isMobile ? '94%' : '90%', maxWidth: 540 }]}>
                
                {/* Header */}
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderTitleGroup}>
                    <View style={styles.modalHeaderIconContainer}>
                      <Truck size={22} color={NAVY} />
                    </View>
                    <View>
                      <Text style={styles.modalHeaderTitleText}>Arrange Delivery</Text>
                      <Text style={styles.modalHeaderSubText}>Enter driver & dispatch details</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={closeAllModals} style={styles.modalCloseButton} activeOpacity={0.7}>
                    <X size={18} color={MUTED} />
                  </TouchableOpacity>
                </View>

                {/* Form Fields Grid */}
                <View style={styles.formContainer}>
                  {/* Row 1: Driver Name & Mobile */}
                  <View style={[styles.formGridRow, isMobile && styles.formGridRowMobile]}>
                    <View style={styles.formInputGroup}>
                      <Text style={styles.formLabel}>Driver Name</Text>
                      <View style={styles.inputIconWrapper}>
                        <User size={16} color={MUTED} style={styles.inputIconLeft} />
                        <TextInput
                          style={styles.formTextInputWithIcon}
                          placeholder="e.g. Suresh Patil"
                          placeholderTextColor="#94A3B8"
                          value={driverName}
                          onChangeText={setDriverName}
                        />
                      </View>
                    </View>

                    <View style={styles.formInputGroup}>
                      <Text style={styles.formLabel}>Mobile Number</Text>
                      <View style={styles.inputIconWrapper}>
                        <Phone size={16} color={MUTED} style={styles.inputIconLeft} />
                        <TextInput
                          style={styles.formTextInputWithIcon}
                          placeholder="e.g. 9876543210"
                          placeholderTextColor="#94A3B8"
                          keyboardType="phone-pad"
                          value={driverMobile}
                          onChangeText={setDriverMobile}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Row 2: Vehicle Number & Dispatch Time */}
                  <View style={[styles.formGridRow, isMobile && styles.formGridRowMobile]}>
                    <View style={styles.formInputGroup}>
                      <Text style={styles.formLabel}>Vehicle Number</Text>
                      <View style={styles.inputIconWrapper}>
                        <Truck size={16} color={MUTED} style={styles.inputIconLeft} />
                        <TextInput
                          style={styles.formTextInputWithIcon}
                          placeholder="e.g. MH-12-PQ-4567"
                          placeholderTextColor="#94A3B8"
                          value={vehicleNo}
                          onChangeText={setVehicleNo}
                        />
                      </View>
                    </View>

                    <View style={styles.formInputGroup}>
                      <Text style={styles.formLabel}>Dispatch Time</Text>
                      <View style={styles.inputIconWrapper}>
                        <Clock size={16} color={MUTED} style={styles.inputIconLeft} />
                        <TextInput
                          style={styles.formTextInputWithIcon}
                          placeholder="Today · 04:00 PM"
                          placeholderTextColor="#94A3B8"
                          value={dispatchTime}
                          onChangeText={setDispatchTime}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Row 3: Delivery Note */}
                  <View style={styles.formInputGroupFull}>
                    <Text style={styles.formLabel}>Delivery Note / Special Instructions</Text>
                    <View style={[styles.inputIconWrapper, { alignItems: 'flex-start', paddingTop: 10 }]}>
                      <FileText size={16} color={MUTED} style={[styles.inputIconLeft, { marginTop: 2 }]} />
                      <TextInput
                        style={[styles.formTextInputWithIcon, styles.formTextArea]}
                        placeholder="Additional instructions for driver or customer..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={3}
                        value={deliveryNote}
                        onChangeText={setDeliveryNote}
                      />
                    </View>
                  </View>
                </View>

                {/* Modal Footer Actions */}
                <View style={[styles.modalFooterRow, isMobile && styles.modalFooterRowMobile]}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={closeAllModals} activeOpacity={0.7}>
                    <Text style={styles.modalCancelBtnText} numberOfLines={1}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleArrangeDelivery} activeOpacity={0.85}>
                    <Truck size={16} color={WHITE} />
                    <Text style={styles.modalConfirmBtnText} numberOfLines={1}>Confirm & Dispatch</Text>
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {orderRef.current && (
                      <TouchableOpacity 
                        onPress={() => Alert.alert('Call Customer', `Dialing ${orderRef.current.client}...`)}
                        style={{ padding: 6, marginRight: 8 }}
                      >
                        <Phone size={18} color="#3B82F6" />
                      </TouchableOpacity>
                    )}

                    {selectedOrder && renderMoreMenuOptions(selectedOrder).length > 0 && (
                      <View style={{ position: 'relative', zIndex: 1001, marginRight: 8 }}>
                        <TouchableOpacity
                          style={{ padding: 6 }}
                          onPress={() => setActiveMenuId(activeMenuId === selectedOrder.id ? null : selectedOrder.id)}
                        >
                          <MoreVertical size={18} color={NAVY} />
                        </TouchableOpacity>
                        {activeMenuId === selectedOrder.id && (
                          <View style={[styles.dropdownMenu, { top: 32, right: 0 }]}>
                            {renderMoreMenuOptions(selectedOrder).map((opt, idx) => (
                              <TouchableOpacity
                                key={idx}
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

                    <TouchableOpacity onPress={closeAllModals} style={{ padding: 6 }}>
                      <X size={20} color={MUTED} />
                    </TouchableOpacity>
                  </View>
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
      <Modal visible={filterVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCenterCard, { maxHeight: '85%' }]}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <X size={20} color={MUTED} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              <Text style={styles.filterLabel}>Delivery Schedule</Text>
              <View style={styles.filterChipsRow}>
                {['All', 'Today', 'Tomorrow', 'This Week'].map(sched => (
                  <TouchableOpacity
                    key={sched}
                    style={[styles.filterChipPill, selectedDeliverySchedule === sched && styles.filterChipPillActive]}
                    onPress={() => setSelectedDeliverySchedule(sched)}
                  >
                    <Text style={[styles.filterChipText, selectedDeliverySchedule === sched && styles.filterChipTextActive]}>{sched}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Payment Method</Text>
              <View style={styles.filterChipsRow}>
                {['All', 'COD', 'Online', 'Credit'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[styles.filterChipPill, selectedPaymentMethod === method && styles.filterChipPillActive]}
                    onPress={() => setSelectedPaymentMethod(method)}
                  >
                    <Text style={[styles.filterChipText, selectedPaymentMethod === method && styles.filterChipTextActive]}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>

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

              <View style={[styles.modalActionsRow, { marginTop: 24, marginBottom: 20 }]}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => {
                    setSelectedCustomerType('All');
                    setSelectedPaymentStatus('All');
                    setSelectedDeliverySchedule('All');
                    setSelectedPaymentMethod('All');
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
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },

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
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3E9F1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
    marginVertical: 6,
    overflow: 'hidden',
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
  phoneBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },

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

  progressContainer: { marginBottom: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  progressLabel: { fontSize: 10, fontWeight: '700', color: MUTED },
  progressValue: { fontSize: 10, fontWeight: '700', color: NAVY },
  progressBarBg: { height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2, backgroundColor: '#F97316' },

  driverStatusBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, backgroundColor: '#F8FAFC', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6 },
  driverStatusText: { fontSize: 11, color: MUTED },

  cardFooterCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 2,
    gap: 8,
  },
  deliveryLabelCompact: { fontSize: 9, color: MUTED, fontWeight: '700', textTransform: 'uppercase', marginBottom: 1 },
  deliveryValCompact: { fontSize: 12, color: NAVY, fontWeight: '600' },

  actionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  viewDetailsBtnCompact: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center' },
  viewDetailsTextCompact: { fontSize: 11, fontWeight: '700', color: NAVY },

  primaryActionBtnCompact: {
    backgroundColor: NAVY,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Empty state container styles
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, alignSelf: 'center' },
  emptyIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: MUTED, marginBottom: 16, textAlign: 'center' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: WHITE },
  refreshBtnText: { fontSize: 12, fontWeight: '700', color: NAVY },


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

  // Arrange Delivery Modal Responsive Styles
  arrangeDeliveryCard: {
    padding: 22,
    borderRadius: 20,
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalHeaderIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalHeaderTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.2,
  },
  modalHeaderSubText: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  formContainer: {
    gap: 12,
    marginBottom: 16,
  },
  formGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGridRowMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  formInputGroup: {
    flex: 1,
  },
  formInputGroupFull: {
    width: '100%',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 6,
  },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIconLeft: {
    marginRight: 8,
  },
  formTextInputWithIcon: {
    flex: 1,
    height: 42,
    fontSize: 13,
    color: NAVY,
    fontWeight: '500',
  },
  formTextArea: {
    height: 64,
    paddingTop: 4,
    textAlignVertical: 'top',
  },

  modalFooterRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalFooterRowMobile: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: WHITE,
    alignItems: 'center',
    justify: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    textAlign: 'center',
  },
  modalConfirmBtn: {
    flex: 1.5,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 6,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalConfirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: WHITE,
    textAlign: 'center',
  },

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
