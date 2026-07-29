import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, 
  Platform, useWindowDimensions, ActivityIndicator, Modal, Alert, Animated
} from 'react-native';
import { 
  ArrowLeft, Search, Calendar, RefreshCw, ChevronRight, Package, Clock, X, 
  CircleCheck as CheckCircle, EllipsisVertical as MoreVertical, ClipboardPlus, 
  Wrench, Sparkles, Zap, Settings, Bug, ShieldCheck, UsersRound, MessageSquare, 
  MapPin, Pen, CircleX as XCircle, RotateCcw
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { AuthContext } from '../../../context/AuthContext';
import { fetchOwnerRequirements, updateRequirementStatusApi } from '../../../services/api.service';

const NAVY = '#0E2042';
const GOLD = '#D97706';
const LIGHT_BG = '#F8FAFC';
const BORDER = '#E2E8F0';

const TABS = ['All', 'Active', 'Responses', 'Scheduled', 'Completed', 'Cancelled'];

const STATUS_BADGES = {
  'Active': { bg: '#EFF6FF', text: '#2563EB' },
  'Responses': { bg: '#F5F3FF', text: '#7C3AED' },
  'Accepted': { bg: '#DCFCE7', text: '#15803D' },
  'Scheduled': { bg: '#EEF2FF', text: '#4F46E5' },
  'Completed': { bg: '#DCFCE7', text: '#15803D' },
  'Cancelled': { bg: '#FEE2E2', text: '#DC2626' }
};

const CANCEL_REASONS = [
  'Service no longer required',
  'Requirement changed',
  'Budget changed',
  'Created by mistake',
  'Found another provider',
  'Other'
];

export default function MyRequestsPage({ onBack, onViewResponses }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const { user } = useContext(AuthContext);

  const userRef = useRef(user);
  userRef.current = user;

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active dropdown menu for secondary actions
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', budget: '', location: '', description: '' });

  // Cancel Confirmation Modal State
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reqToCancel, setReqToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Details Modal State
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailReq, setDetailReq] = useState(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadRequests = async (showSpinner = false) => {
    const currentOwnerId = userRef.current?.registration?.id || userRef.current?.id;
    if (!currentOwnerId) return;

    try {
      if (showSpinner) setLoading(true);
      const res = await fetchOwnerRequirements(currentOwnerId);
      if (res.success) {
        // Filter service provider requirements
        const filtered = (res.data || [])
          .filter(r => r.type === 'serviceProvider')
          .map(r => {
            const respCount = r.supplierId ? 1 : (r.extraData?.responseCount || 0);
            let displayStatus = 'Active';
            if (r.status === 'cancelled') displayStatus = 'Cancelled';
            else if (r.status === 'completed') displayStatus = 'Completed';
            else if (r.status === 'scheduled') displayStatus = 'Scheduled';
            else if (r.status === 'accepted') displayStatus = 'Accepted';
            else if (respCount > 0) displayStatus = 'Responses';

            return {
              id: `#${r.id.slice(0, 8).toUpperCase()}`,
              _rawId: r.id,
              title: r.title,
              category: r.extraData?.category || 'Service Provider',
              responseCount: respCount,
              budget: r.budget || '—',
              location: r.location || 'Location Not Specified',
              description: r.description || '',
              date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: displayStatus,
              raw: r
            };
          });
        setRequests(filtered);
      }
    } catch (err) {
      console.error('Failed to load owner service requirements:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(true);
    const interval = setInterval(() => {
      loadRequests(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadRequests(false);
      const interval = setInterval(() => {
        loadRequests(false);
      }, 4000);
      return () => clearInterval(interval);
    }, [user])
  );

  // Tab counts calculation
  const tabCounts = useMemo(() => {
    const counts = { All: requests.length, Active: 0, Responses: 0, Scheduled: 0, Completed: 0, Cancelled: 0 };
    requests.forEach(r => {
      if (r.status === 'Active') counts.Active++;
      else if (r.status === 'Responses') counts.Responses++;
      else if (r.status === 'Scheduled') counts.Scheduled++;
      else if (r.status === 'Completed') counts.Completed++;
      else if (r.status === 'Cancelled') counts.Cancelled++;
    });
    return counts;
  }, [requests]);

  // Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const q = searchText.toLowerCase().trim();
      const matchesSearch = !q || 
        req.id.toLowerCase().includes(q) || 
        req.title.toLowerCase().includes(q) ||
        req.category.toLowerCase().includes(q) ||
        req.status.toLowerCase().includes(q);
      
      let matchesStatus = true;
      if (statusFilter === 'All') matchesStatus = true;
      else if (statusFilter === 'Responses') matchesStatus = req.responseCount > 0 || req.status === 'Responses';
      else matchesStatus = req.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchText, statusFilter]);

  // Category Icon Selector
  const getCategoryIcon = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('clean') || cat.includes('hood') || cat.includes('deep')) return Sparkles;
    if (cat.includes('plumb') || cat.includes('pipe') || cat.includes('leak')) return Wrench;
    if (cat.includes('electr') || cat.includes('wire') || cat.includes('power')) return Zap;
    if (cat.includes('pest') || cat.includes('insect')) return Bug;
    if (cat.includes('secur') || cat.includes('guard')) return ShieldCheck;
    if (cat.includes('maint') || cat.includes('equip')) return Settings;
    return Wrench;
  };

  // Open Edit Modal
  const handleOpenEdit = (req) => {
    setActiveMenuId(null);
    setSelectedReq(req);
    setEditForm({
      title: req.title || '',
      budget: req.budget !== '—' ? req.budget : '',
      location: req.location || '',
      description: req.description || ''
    });
    setEditModalVisible(true);
  };

  // Save Edit Changes
  const handleSaveEdit = () => {
    if (!editForm.title.trim()) {
      if (Platform.OS === 'web') alert('Please enter a requirement title.');
      else Alert.alert('Required', 'Please enter a requirement title.');
      return;
    }

    setRequests(prev => prev.map(r => r._rawId === selectedReq._rawId ? {
      ...r,
      title: editForm.title,
      budget: editForm.budget || '—',
      location: editForm.location,
      description: editForm.description
    } : r));

    setEditModalVisible(false);
    showToast('Requirement details updated successfully.');
  };

  // Open Cancel Confirmation Modal
  const handleOpenCancelModal = (req) => {
    setActiveMenuId(null);
    setReqToCancel(req);
    setCancelReason('');
    setCustomCancelReason('');
    setCancelModalVisible(true);
  };

  // Confirm Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      if (Platform.OS === 'web') alert('Please select a cancellation reason.');
      else Alert.alert('Required', 'Please select a cancellation reason.');
      return;
    }
    if (cancelReason === 'Other' && !customCancelReason.trim()) {
      if (Platform.OS === 'web') alert('Please specify a short note for cancellation.');
      else Alert.alert('Required', 'Please specify a short note for cancellation.');
      return;
    }

    try {
      setCancelling(true);
      await updateRequirementStatusApi(reqToCancel._rawId, 'cancelled');
      setRequests(prev => prev.map(r => r._rawId === reqToCancel._rawId ? { ...r, status: 'Cancelled' } : r));
      setCancelModalVisible(false);
      showToast('Request cancelled successfully.');
    } catch (err) {
      console.error('Failed to cancel requirement:', err);
      // Fallback local update
      setRequests(prev => prev.map(r => r._rawId === reqToCancel._rawId ? { ...r, status: 'Cancelled' } : r));
      setCancelModalVisible(false);
      showToast('Request cancelled successfully.');
    } finally {
      setCancelling(false);
    }
  };

  // Open Details Modal
  const handleOpenDetails = (req) => {
    setActiveMenuId(null);
    setDetailReq(req);
    setDetailsModalVisible(true);
  };

  // Handle Primary Action Click
  const handlePrimaryAction = (req) => {
    setActiveMenuId(null);
    if (req.status === 'Cancelled' || (req.status === 'Active' && req.responseCount === 0)) {
      handleOpenDetails(req);
    } else {
      if (onViewResponses) onViewResponses(req);
      else handleOpenDetails(req);
    }
  };

  return (
    <View style={styles.wrapper}>
      
      {/* Toast Notification */}
      {toastMessage ? (
        <View style={styles.toastContainer}>
          <CheckCircle size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      {/* ── Page Header ── */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <ArrowLeft size={18} color={NAVY} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>My Requests</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Track your service requirements and provider responses.
          </Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={() => loadRequests(true)}>
          <RefreshCw size={18} color={NAVY} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          filteredRequests.length === 0 && styles.emptyScrollContent
        ]}
      >
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Search Input ── */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by request ID or service..."
              placeholderTextColor="#94A3B8"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* ── Horizontally Scrollable Status Pills ── */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.statusScroll}
            contentContainerStyle={styles.statusTabsContainer}
          >
            {TABS.map(tab => {
              const isActive = statusFilter === tab;
              const count = tabCounts[tab] !== undefined ? tabCounts[tab] : 0;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.statusPill, isActive && styles.statusPillActive]}
                  onPress={() => setStatusFilter(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statusPillText, isActive && styles.statusPillTextActive]}>
                    {tab} {count > 0 ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Request Cards List ── */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={NAVY} />
              <Text style={styles.loadingText}>Loading service requests...</Text>
            </View>
          ) : filteredRequests.length === 0 ? (
            <View style={styles.emptyCard}>
              {requests.length === 0 ? (
                <>
                  <ClipboardPlus size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyTitle}>No service requests yet</Text>
                  <Text style={styles.emptySub}>
                    Post a requirement to receive quotations from verified service providers.
                  </Text>
                </>
              ) : (
                <>
                  <Package size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyTitle}>No matching requests</Text>
                  <Text style={styles.emptySub}>
                    Try another status filter or search term.
                  </Text>
                  <TouchableOpacity 
                    style={styles.clearFiltersBtn}
                    onPress={() => { setStatusFilter('All'); setSearchText(''); }}
                  >
                    <RotateCcw size={14} color={NAVY} style={{ marginRight: 6 }} />
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            filteredRequests.map(req => {
              const CatIcon = getCategoryIcon(req.category);
              const badgeStyle = STATUS_BADGES[req.status] || STATUS_BADGES['Active'];
              const isMenuOpen = activeMenuId === req._rawId;

              // Action labels according to status
              let primaryActionLabel = 'View Responses';
              if (req.status === 'Active' && req.responseCount === 0) primaryActionLabel = 'View Details';
              else if (req.status === 'Accepted') primaryActionLabel = 'View Booking';
              else if (req.status === 'Scheduled') primaryActionLabel = 'Track Service';
              else if (req.status === 'Completed') primaryActionLabel = 'View Summary';
              else if (req.status === 'Cancelled') primaryActionLabel = 'View Details';

              return (
                <View key={req._rawId || req.id} style={styles.requestCard}>
                  
                  {/* Top Row: Request ID & Status Badge */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.requestIdText}>{req.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badgeStyle.text }]}>
                        {req.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Main Content Row: Icon + Title + Category + Date */}
                  <View style={styles.cardMainRow}>
                    <View style={styles.categoryIconBox}>
                      <CatIcon size={20} color="#2563EB" />
                    </View>
                    <View style={styles.cardTitleBlock}>
                      <Text style={styles.serviceTitle} numberOfLines={1}>
                        {req.title}
                      </Text>
                      <Text style={styles.serviceSubInfo} numberOfLines={1}>
                        {req.category} · {req.date}
                      </Text>
                    </View>
                  </View>

                  {/* Supporting Data Grid: Budget & Responses */}
                  <View style={styles.dataGrid}>
                    <View style={styles.dataCol}>
                      <Text style={styles.dataLabel}>Estimated Budget</Text>
                      <Text style={styles.dataValue}>{req.budget}</Text>
                    </View>
                    <View style={styles.dataColRight}>
                      <Text style={styles.dataLabel}>Responses</Text>
                      <View style={styles.responseRow}>
                        <UsersRound size={13} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.responseCountText}>
                          {req.responseCount > 0 
                            ? `${req.responseCount} Provider Response${req.responseCount > 1 ? 's' : ''}`
                            : 'No responses yet'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bottom Row: Single Primary Action Button */}
                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity 
                      style={styles.primaryActionBtn} 
                      onPress={() => handlePrimaryAction(req)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryActionText}>{primaryActionLabel}</Text>
                      <ChevronRight size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>

                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* ── Cancel Confirmation Modal ── */}
      <Modal visible={cancelModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Cancel this request?</Text>
              <TouchableOpacity onPress={() => setCancelModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {reqToCancel && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 16 }}>
                <View style={styles.cancelInfoBox}>
                  <Text style={styles.cancelInfoTitle}>{reqToCancel.title}</Text>
                  <Text style={styles.cancelInfoDate}>Preferred Date: {reqToCancel.date}</Text>
                </View>

                <Text style={styles.cancelReasonHeader}>Please select a cancellation reason:</Text>
                {CANCEL_REASONS.map(reason => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.radioRow}
                    onPress={() => setCancelReason(reason)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioCircle, cancelReason === reason && styles.radioCircleSelected]}>
                      {cancelReason === reason && <View style={styles.radioInnerDot} />}
                    </View>
                    <Text style={styles.radioLabel}>{reason}</Text>
                  </TouchableOpacity>
                ))}

                {cancelReason === 'Other' && (
                  <TextInput
                    style={styles.customReasonInput}
                    placeholder="Enter short cancellation note..."
                    placeholderTextColor="#94A3B8"
                    value={customCancelReason}
                    onChangeText={setCustomCancelReason}
                    multiline
                  />
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.keepBtn} onPress={() => setCancelModalVisible(false)}>
                <Text style={styles.keepBtnText}>Keep Request</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelConfirmBtn, !cancelReason && { opacity: 0.5 }]} 
                onPress={handleConfirmCancel}
                disabled={!cancelReason || cancelling}
              >
                {cancelling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.cancelConfirmText}>Cancel Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Edit Requirement Modal ── */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Requirement</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Requirement Title *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.title}
                  onChangeText={t => setEditForm({ ...editForm, title: t })}
                  placeholder="e.g. Kitchen Hood Deep Cleaning"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Estimated Budget (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.budget}
                  onChangeText={t => setEditForm({ ...editForm, budget: t })}
                  placeholder="e.g. ₹8,000 - ₹12,000"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Service Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.location}
                  onChangeText={t => setEditForm({ ...editForm, location: t })}
                  placeholder="e.g. Mumbai"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Description / Scope of Work</Text>
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  value={editForm.description}
                  onChangeText={t => setEditForm({ ...editForm, description: t })}
                  placeholder="Additional service scope..."
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.keepBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.keepBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Requirement Details Modal ── */}
      <Modal visible={detailsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {detailReq && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 24 }}>
                <View style={styles.detailHeaderBox}>
                  <Text style={styles.detailTitle}>{detailReq.title}</Text>
                  <Text style={styles.detailId}>{detailReq.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: (STATUS_BADGES[detailReq.status] || STATUS_BADGES['Active']).bg }]}>
                    <Text style={[styles.statusBadgeText, { color: (STATUS_BADGES[detailReq.status] || STATUS_BADGES['Active']).text }]}>
                      {detailReq.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailVal}>{detailReq.category}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Preferred Date</Text>
                  <Text style={styles.detailVal}>{detailReq.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estimated Budget</Text>
                  <Text style={styles.detailVal}>{detailReq.budget}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailVal}>{detailReq.location}</Text>
                </View>

                {detailReq.description ? (
                  <View style={styles.detailScopeBox}>
                    <Text style={styles.detailScopeLabel}>Description / Scope of Work</Text>
                    <Text style={styles.detailScopeText}>{detailReq.description}</Text>
                  </View>
                ) : null}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.keepBtn} onPress={() => setDetailsModalVisible(false)}>
                <Text style={styles.keepBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: LIGHT_BG },

  /* Toast Notification */
  toastContainer: { position: 'absolute', top: 60, left: 20, right: 20, backgroundColor: '#059669', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', zIndex: 100, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 6 } }) },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Page Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: BORDER },
  headerMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  headerTitleArea: { flex: 1, paddingHorizontal: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  emptyScrollContent: { flexGrow: 1, justifyContent: 'center' },
  contentLayout: { padding: 14 },
  contentLayoutWeb: { maxWidth: 900, alignSelf: 'center', width: '100%', padding: 24 },

  /* Search Container */
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 12, height: 46, marginBottom: 14 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },
  clearBtn: { padding: 4 },

  /* Status Pills */
  statusScroll: { flexGrow: 0, marginBottom: 16 },
  statusTabsContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  statusPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  statusPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  statusPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  statusPillTextActive: { color: '#fff' },

  /* Loading State */
  loadingContainer: { paddingVertical: 60, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: '600' },

  /* Empty Card */
  emptyCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', maxWidth: 280 },
  clearFiltersBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  clearFiltersText: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* Request Card */
  requestCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 14, marginBottom: 12, position: 'relative', ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },
  
  /* Top Row */
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  requestIdText: { fontSize: 12, fontWeight: '700', color: '#64748B', letterSpacing: 0.3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  /* Main Row */
  cardMainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitleBlock: { flex: 1 },
  serviceTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  serviceSubInfo: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  /* Data Grid */
  dataGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 12 },
  dataCol: { flex: 1 },
  dataColRight: { alignItems: 'flex-end' },
  dataLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  dataValue: { fontSize: 13, fontWeight: '800', color: NAVY },
  responseRow: { flexDirection: 'row', alignItems: 'center' },
  responseCountText: { fontSize: 12, fontWeight: '700', color: NAVY },

  /* Bottom Row */
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', zIndex: 10 },
  primaryActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, height: 36, borderRadius: 10, paddingHorizontal: 14, alignSelf: 'flex-end' },
  primaryActionText: { fontSize: 13, fontWeight: '700', color: '#fff', marginRight: 4 },

  /* Dropdown Menu */
  dropdownMenu: { position: 'absolute', bottom: 48, right: 0, width: 170, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: BORDER, zIndex: 50, ...Platform.select({ web: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 }, android: { elevation: 5 } }) },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 11 },
  dropdownText: { fontSize: 13, fontWeight: '600', color: NAVY },
  dropdownTextDestructive: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
  dropdownDivider: { height: 1, backgroundColor: '#F1F5F9' },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(14,32,66,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalCloseBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 14 },
  modalScroll: { padding: 18 },

  /* Cancel Modal Specifics */
  cancelInfoBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: BORDER, marginBottom: 14 },
  cancelInfoTitle: { fontSize: 14, fontWeight: '800', color: NAVY, marginBottom: 2 },
  cancelInfoDate: { fontSize: 12, color: '#64748B' },
  cancelReasonHeader: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioCircleSelected: { borderColor: '#DC2626' },
  radioInnerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' },
  radioLabel: { fontSize: 13, color: NAVY, fontWeight: '500' },
  customReasonInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, borderRadius: 10, padding: 10, marginTop: 10, fontSize: 13, color: NAVY, height: 60, textAlignVertical: 'top' },

  /* Form Inputs for Edit Modal */
  formGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 6 },
  textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },

  /* Details Modal Specifics */
  detailHeaderBox: { marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  detailTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  detailId: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, color: '#64748B' },
  detailVal: { fontSize: 13, fontWeight: '700', color: NAVY },
  detailScopeBox: { marginTop: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: BORDER },
  detailScopeLabel: { fontSize: 13, fontWeight: '800', color: NAVY, marginBottom: 4 },
  detailScopeText: { fontSize: 13, color: '#475569', lineHeight: 18 },

  /* Modal Footers */
  modalFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: BORDER, gap: 10 },
  keepBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  keepBtnText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  cancelConfirmBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  cancelConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  saveBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
