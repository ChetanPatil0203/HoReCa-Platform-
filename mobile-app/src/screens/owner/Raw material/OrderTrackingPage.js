import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Platform, useWindowDimensions, SafeAreaView, Modal
} from 'react-native';
import {
  Truck, Search, CircleCheck as CheckCircle, Clock, MapPin, MessageSquare,
  Package, ArrowLeft, UsersRound, Wrench, Megaphone, ChevronRight, X,
  RotateCcw, Activity, ShieldCheck, CircleAlert, Phone, User, SlidersHorizontal
} from 'lucide-react-native';
import { fetchOwnerActivityHistoryApi, fetchOwnerTrackingApi } from '../../../services/api.service';
import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#0E2042';
const GOLD = '#D97706';
const LIGHT_BG = '#F8FAFC';
const BORDER = '#E2E8F0';

// ── Pillars Definition ──
const PILLARS = [
  { id: 'all', label: 'All', icon: Activity, color: NAVY },
  { id: 'raw-material', label: 'Raw Material', icon: Package, color: '#D97706' },
  { id: 'manpower', label: 'Manpower', icon: UsersRound, color: '#9333EA' },
  { id: 'service', label: 'Services', icon: Wrench, color: '#2563EB' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#7C3AED' }
];

// ── Dynamic Status Filters Mapping per Pillar ──
const STATUS_FILTERS_BY_PILLAR = {
  'all': ['All', 'Active', 'Completed', 'Needs Attention'],
  'raw-material': ['All', 'Confirmed', 'Preparing', 'Ready', 'On the Way', 'Delivered'],
  'manpower': ['All', 'Responses', 'Candidate Selected', 'Joining Scheduled', 'Active', 'Completed'],
  'service': ['All', 'Quote Accepted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
  'marketing': ['All', 'Proposals', 'Agency Selected', 'Scheduled', 'Running', 'Completed', 'Paused']
};

// ── Status Badges Styling ──
const STATUS_STYLES = {
  // Raw Material
  'Confirmed': { bg: '#EFF6FF', text: '#2563EB' },
  'Preparing': { bg: '#FFFBEB', text: '#D97706' },
  'Ready': { bg: '#F3E8FF', text: '#9333EA' },
  'On the Way': { bg: '#EFF6FF', text: '#2563EB' },
  'Delivered': { bg: '#DCFCE7', text: '#15803D' },

  // Manpower
  'Responses': { bg: '#FFFBEB', text: '#D97706' },
  'Candidate Selected': { bg: '#EFF6FF', text: '#2563EB' },
  'Joining Scheduled': { bg: '#F3E8FF', text: '#9333EA' },
  'Active': { bg: '#DCFCE7', text: '#15803D' },
  'Completed': { bg: '#DCFCE7', text: '#15803D' },

  // Service
  'Quote Accepted': { bg: '#EFF6FF', text: '#2563EB' },
  'Scheduled': { bg: '#EEF2FF', text: '#4F46E5' },
  'In Progress': { bg: '#F5F3FF', text: '#7C3AED' },
  'Cancelled': { bg: '#FEE2E2', text: '#DC2626' },

  // Marketing
  'Proposals': { bg: '#FFFBEB', text: '#D97706' },
  'Agency Selected': { bg: '#EFF6FF', text: '#2563EB' },
  'Running': { bg: '#DCFCE7', text: '#15803D' },
  'Paused': { bg: '#FEE2E2', text: '#DC2626' }
};

// ── Mock Initial Tracking Records (Empty by default, loaded strictly from backend DB) ──
const INITIAL_RECORDS = [];

export default function OrderTrackingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const auth = useContext(AuthContext);
  const user = auth?.user || {};

  const [records, setRecords] = useState([]);
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilters, setShowStatusFilters] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Selected record for details modal
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Sync tracking records with backend database
  useEffect(() => {
    let isMounted = true;
    const loadTrackingRecords = async () => {
      try {
        const ownerId = user?.id || user?.registration?.id || user?.userId;
        if (!ownerId) return;
        const res = await fetchOwnerTrackingApi(ownerId);
        if (res && res.success && res.data) {
          const { orders = [], requirements = [] } = res.data;

          const mappedOrders = orders.map(ord => {
            const statusLower = (ord.status || '').toLowerCase();
            let currentStepIndex = 1;
            let status = ord.status ? (ord.status.charAt(0).toUpperCase() + ord.status.slice(1)) : 'In Progress';

            if (statusLower === 'delivered' || statusLower === 'completed') {
              currentStepIndex = 3;
              status = 'Delivered';
            } else if (statusLower === 'shipped' || statusLower === 'on the way' || statusLower === 'dispatched' || statusLower === 'on_the_way') {
              currentStepIndex = 2;
              status = 'On the Way';
            } else if (statusLower === 'preparing' || statusLower === 'processing') {
              currentStepIndex = 1;
              status = 'Preparing';
            } else if (statusLower === 'confirmed' || statusLower === 'accepted') {
              currentStepIndex = 0;
              status = 'Confirmed';
            }

            return {
              id: `ORD-${(ord.id || '').toString().slice(-4).padStart(4, '0')}`,
              pillar: 'raw-material',
              title: ord.items && ord.items[0] ? `${ord.items[0].product?.name || 'Raw Material'} x ${ord.items[0].quantity}` : 'Raw Material Order',
              vendor: ord.supplier?.bizName || 'Supplier Wholesaler',
              status,
              date: new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              amount: `₹${parseFloat(ord.totalAmount || 0).toLocaleString('en-IN')}`,
              actionText: 'Track Delivery',
              steps: ['Confirmed', 'Preparing', 'On the Way', 'Delivered'],
              currentStepIndex,
              updates: [
                { message: `Order status is ${status}`, location: ord.deliveryAddress || 'Warehouse', time: 'Just now' }
              ]
            };
          });

          const mappedReqs = requirements.map(r => {
            let pillar = 'service';
            let actionText = 'Track Service';
            let steps = ['Quote Accepted', 'Scheduled', 'In Progress', 'Completed'];

            if (r.type === 'manpower') {
              pillar = 'manpower';
              actionText = 'Track Joining';
              steps = ['Responses', 'Selected', 'Joining Scheduled', 'Active'];
            } else if (r.type === 'marketing') {
              pillar = 'marketing';
              actionText = 'Track Campaign';
              steps = [];
            }

            let status = 'In Progress';
            let currentStepIndex = 1;
            const rStatusLower = (r.status || '').toLowerCase();

            if (rStatusLower === 'completed' || rStatusLower === 'accepted' || r.supplierId) {
              status = 'Completed';
              currentStepIndex = 3;
            } else if (rStatusLower === 'cancelled') {
              status = 'Cancelled';
              currentStepIndex = 0;
            } else {
              status = (r.status || 'pending').charAt(0).toUpperCase() + (r.status || 'pending').slice(1);
              currentStepIndex = 1;
            }

            return {
              id: `REQ-${(r.id || '').toString().slice(-4).padStart(4, '0')}`,
              pillar,
              title: r.title || 'Requirement Post',
              vendor: r.supplier?.bizName || 'Verified Provider',
              status,
              date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              amount: r.budget ? (r.budget.toString().startsWith('₹') ? r.budget : `₹${r.budget}`) : null,
              progress: pillar === 'marketing' ? (rStatusLower === 'completed' ? 100 : 50) : undefined,
              actionText,
              steps,
              currentStepIndex,
              updates: [
                { message: `Requirement status: ${status}`, location: r.location || 'Branch', time: 'Just now' }
              ]
            };
          });

          if (isMounted) {
            setRecords([...mappedOrders, ...mappedReqs]);
          }
        }
      } catch (err) {
        console.log('Error loading backend tracking:', err);
      }
    };

    loadTrackingRecords();
    return () => { isMounted = false; };
  }, []);

  // Available status filters based on current pillar
  const availableStatuses = STATUS_FILTERS_BY_PILLAR[selectedPillar] || STATUS_FILTERS_BY_PILLAR['all'];

  // Change Pillar Handler
  const handleSelectPillar = (pillarId) => {
    setSelectedPillar(pillarId);
    setSelectedStatus('All');
  };

  // Filtering records
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Pillar filter
      if (selectedPillar !== 'all' && rec.pillar !== selectedPillar) return false;

      // Status filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Active') {
          if (rec.status === 'Completed' || rec.status === 'Delivered' || rec.status === 'Cancelled') return false;
        } else if (selectedStatus === 'Completed') {
          if (rec.status !== 'Completed' && rec.status !== 'Delivered') return false;
        } else if (selectedStatus === 'Needs Attention') {
          if (rec.status !== 'Cancelled' && rec.status !== 'Paused') return false;
        } else {
          if (rec.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        }
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          rec.id.toLowerCase().includes(q) ||
          rec.title.toLowerCase().includes(q) ||
          rec.vendor.toLowerCase().includes(q) ||
          rec.status.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [records, selectedPillar, selectedStatus, searchQuery]);

  // Pillar counts map
  const pillarCounts = useMemo(() => {
    const counts = { all: records.length, 'raw-material': 0, manpower: 0, service: 0, marketing: 0 };
    records.forEach(r => {
      if (counts[r.pillar] !== undefined) counts[r.pillar]++;
    });
    return counts;
  }, [records]);

  // Open Record Details
  const handleOpenRecordDetails = (rec) => {
    setDetailRecord(rec);
    setDetailModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Toast Notification */}
      {toastMsg ? (
        <View style={styles.toastContainer}>
          <CheckCircle size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.mainLayout, !isMobile && styles.mainLayoutWeb]}>

          {/* ── Page Header ── */}
          <View style={styles.header}>
            <View style={styles.headerIconBox}>
              <Activity size={22} color={NAVY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Tracking</Text>
              <Text style={styles.pageSubtitle}>
                Track your orders, staffing, services and campaigns.
              </Text>
            </View>
          </View>

          {/* ── Search Input ── */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tracking records..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4, marginRight: 4 }}>
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.filterIconButton, selectedPillar !== 'all' && styles.filterIconButtonActive]}
              onPress={() => setFilterModalVisible(true)}
              activeOpacity={0.7}
              accessibilityLabel="Filter categories"
            >
              <SlidersHorizontal size={16} color={selectedPillar !== 'all' ? '#fff' : NAVY} />
            </TouchableOpacity>
          </View>

          {/* ── Dynamic Status Filter Pills ── */}
          {showStatusFilters ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statusScroll}
              contentContainerStyle={styles.statusContainer}
            >
              {availableStatuses.map(status => {
                const isActive = selectedStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusPill, isActive && styles.statusPillActive]}
                    onPress={() => setSelectedStatus(status)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.statusPillText, isActive && styles.statusPillTextActive]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : null}

          {/* ── Tracking Cards List ── */}
          {filteredRecords.length === 0 ? (
            <View style={styles.emptyCard}>
              {selectedPillar === 'raw-material' ? (
                <Package size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              ) : selectedPillar === 'manpower' ? (
                <UsersRound size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              ) : selectedPillar === 'service' ? (
                <Wrench size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              ) : selectedPillar === 'marketing' ? (
                <Megaphone size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              ) : (
                <Activity size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
              )}

              <Text style={styles.emptyTitle}>
                {selectedPillar === 'raw-material' ? 'No active material orders' :
                  selectedPillar === 'manpower' ? 'No active staffing requirements' :
                    selectedPillar === 'service' ? 'No scheduled service work' :
                      selectedPillar === 'marketing' ? 'No active marketing campaigns' :
                        'No active tracking records'}
              </Text>
              <Text style={styles.emptySub}>
                Your active orders, staffing, services and campaigns will appear here.
              </Text>

              {(searchQuery || selectedStatus !== 'All') ? (
                <TouchableOpacity
                  style={styles.clearFiltersBtn}
                  onPress={() => { setSearchQuery(''); setSelectedStatus('All'); }}
                >
                  <RotateCcw size={14} color={NAVY} style={{ marginRight: 6 }} />
                  <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            filteredRecords.map(rec => {
              const pillarInfo = PILLARS.find(p => p.id === rec.pillar) || PILLARS[0];
              const PillarIcon = pillarInfo.icon;
              const statusStyle = STATUS_STYLES[rec.status] || { bg: '#EFF6FF', text: '#2563EB' };

              return (
                <View key={rec.id} style={styles.trackingCard}>

                  {/* Top Row: Record ID + Pillar Badge + Status Badge */}
                  <View style={styles.cardTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.recordIdText}>{rec.id}</Text>
                      <View style={[styles.pillarTag, { backgroundColor: `${pillarInfo.color}15` }]}>
                        <PillarIcon size={12} color={pillarInfo.color} style={{ marginRight: 4 }} />
                        <Text style={[styles.pillarTagText, { color: pillarInfo.color }]}>
                          {pillarInfo.label}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                        {rec.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Primary Title & Vendor */}
                  <Text style={styles.cardTitle}>{rec.title}</Text>
                  <Text style={styles.cardVendor}>{rec.vendor}</Text>

                  {/* Middle Info Details */}
                  <View style={styles.detailsGrid}>
                    {rec.date ? (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Schedule / Date</Text>
                        <Text style={styles.detailValue}>{rec.date}</Text>
                      </View>
                    ) : null}

                    {rec.driver ? (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Driver</Text>
                        <Text style={styles.detailValue}>{rec.driver}</Text>
                      </View>
                    ) : null}

                    {rec.candidate ? (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Candidate</Text>
                        <Text style={styles.detailValue}>{rec.candidate}</Text>
                      </View>
                    ) : null}

                    {rec.team ? (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Assigned Team</Text>
                        <Text style={styles.detailValue}>{rec.team}</Text>
                      </View>
                    ) : null}

                    {rec.amount ? (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Order Total</Text>
                        <Text style={styles.detailValue}>{rec.amount}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Marketing Progress Bar (if available) */}
                  {rec.pillar === 'marketing' && rec.progress !== undefined ? (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeaderRow}>
                        <Text style={styles.progressLabel}>Campaign Progress</Text>
                        <Text style={styles.progressVal}>{rec.progress}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${rec.progress}%` }]} />
                      </View>
                    </View>
                  ) : null}

                  {/* Status Stepper Milestone Dots (for Raw Material, Manpower, Service) */}
                  {rec.steps && rec.steps.length > 0 ? (
                    <View style={styles.stepperContainer}>
                      {rec.steps.map((step, idx) => {
                        const isDone = idx <= rec.currentStepIndex;
                        const isCurrent = idx === rec.currentStepIndex;
                        return (
                          <View key={step} style={styles.stepperItem}>
                            <View style={[
                              styles.stepperDot,
                              isDone && styles.stepperDotDone,
                              isCurrent && styles.stepperDotCurrent
                            ]}>
                              {isDone ? <CheckCircle size={10} color="#fff" /> : null}
                            </View>
                            <Text style={[
                              styles.stepperText,
                              isDone && styles.stepperTextDone,
                              isCurrent && styles.stepperTextCurrent
                            ]}>
                              {step}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}

                  {/* Bottom Row: Right-aligned Compact Primary Action Button */}
                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => handleOpenRecordDetails(rec)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryActionText}>{rec.actionText}</Text>
                      <ChevronRight size={15} color="#fff" />
                    </TouchableOpacity>
                  </View>

                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* ── Tracking Details Modal ── */}
      <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%', display: 'flex', flexDirection: 'column' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Tracking Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {detailRecord && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={true}>
                <View style={styles.modalRecordTop}>
                  <Text style={styles.modalId}>{detailRecord.id}</Text>
                  <Text style={styles.modalRecordTitle}>{detailRecord.title}</Text>
                  <Text style={styles.modalVendor}>{detailRecord.vendor}</Text>
                </View>

                <View style={styles.modalStatusRow}>
                  <Text style={styles.modalLabel}>Current Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: (STATUS_STYLES[detailRecord.status] || { bg: '#EFF6FF', text: '#2563EB' }).bg }]}>
                    <Text style={[styles.statusBadgeText, { color: (STATUS_STYLES[detailRecord.status] || { bg: '#EFF6FF', text: '#2563EB' }).text }]}>
                      {detailRecord.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {detailRecord.contact ? (
                  <View style={styles.contactBox}>
                    <Phone size={16} color={NAVY} style={{ marginRight: 8 }} />
                    <Text style={styles.contactText}>Contact: {detailRecord.contact}</Text>
                  </View>
                ) : null}

                {/* Timeline Updates */}
                {detailRecord.updates && detailRecord.updates.length > 0 && (
                  <View style={styles.timelineSection}>
                    <Text style={styles.timelineSectionTitle}>ACTIVITY TIMELINE</Text>
                    {detailRecord.updates.map((upd, idx) => (
                      <View key={idx} style={styles.timelineRow}>
                        <View style={[styles.timelineDot, idx === 0 && styles.timelineDotLatest]} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.timelineMessage, idx === 0 && styles.timelineMessageLatest]}>
                            {upd.message}
                          </Text>
                          {upd.location ? (
                            <View style={styles.locationRow}>
                              <MapPin size={11} color="#64748B" style={{ marginRight: 4 }} />
                              <Text style={styles.locationText}>{upd.location}</Text>
                            </View>
                          ) : null}
                          <Text style={styles.timeText}>{upd.time}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCloseFooterBtn}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.modalCloseFooterText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalContactFooterBtn}
                onPress={() => {
                  setDetailModalVisible(false);
                  showToast(`Connecting to ${detailRecord?.vendor || 'vendor'}...`);
                }}
              >
                <MessageSquare size={15} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.modalContactFooterText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Category Filter Popup Modal ── */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.filterModalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.filterModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.filterModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SlidersHorizontal size={18} color={NAVY} style={{ marginRight: 8 }} />
                <Text style={styles.filterModalTitle}>Filter Category</Text>
              </View>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterModalSubtitle}>
              Select a category to view specific tracking records:
            </Text>

            <View style={styles.filterOptionsList}>
              {PILLARS.map(p => {
                const IconComp = p.icon;
                const isSelected = selectedPillar === p.id;
                const count = pillarCounts[p.id] || 0;

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.filterOptionItem, isSelected && styles.filterOptionItemSelected]}
                    onPress={() => {
                      setSelectedPillar(p.id);
                      setSelectedStatus('All');
                      setFilterModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.filterOptionIconBox, { backgroundColor: isSelected ? NAVY : '#F1F5F9' }]}>
                        <IconComp size={16} color={isSelected ? '#fff' : p.color} />
                      </View>
                      <Text style={[styles.filterOptionLabel, isSelected && styles.filterOptionLabelSelected]}>
                        {p.label}
                      </Text>
                      {count > 0 ? (
                        <View style={[styles.filterCountBadge, isSelected && styles.filterCountBadgeSelected]}>
                          <Text style={[styles.filterCountText, isSelected && styles.filterCountTextSelected]}>
                            {count}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {isSelected && (
                      <CheckCircle size={18} color={NAVY} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 115 },

  /* Category Filter Popup Modal */
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    ...Platform.select({
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 8 }
    })
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY
  },
  filterModalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16
  },
  filterOptionsList: {
    gap: 8
  },
  filterOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff'
  },
  filterOptionItemSelected: {
    borderColor: NAVY,
    backgroundColor: '#F8FAFC'
  },
  filterOptionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  filterOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155'
  },
  filterOptionLabelSelected: {
    color: NAVY,
    fontWeight: '800'
  },
  filterCountBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8
  },
  filterCountBadgeSelected: {
    backgroundColor: NAVY
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  filterCountTextSelected: {
    color: '#fff'
  },

  mainLayout: { padding: 14 },
  mainLayoutWeb: { maxWidth: 900, alignSelf: 'center', width: '100%', padding: 24 },

  /* Toast Notification */
  toastContainer: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#059669', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', zIndex: 100, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 6 } }) },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Page Header */
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 13, color: '#64748B' },

  /* Pillar Pills */
  pillarScroll: { flexGrow: 0, marginBottom: 14 },
  pillarContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  pillarPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  pillarPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillarPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  pillarPillTextActive: { color: '#fff' },

  /* Search Container */
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },
  filterIconButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  filterIconButtonActive: { backgroundColor: NAVY },

  /* Dynamic Status Pills */
  statusScroll: { flexGrow: 0, marginBottom: 16 },
  statusContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  statusPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  statusPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  statusPillTextActive: { color: '#fff' },

  /* Empty State Card */
  emptyCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 32, alignItems: 'center', justifyContent: 'center', maxHeight: 260 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', maxWidth: 300 },
  clearFiltersBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  clearFiltersText: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* Tracking Card */
  trackingCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 14, marginBottom: 12, position: 'relative', ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  recordIdText: { fontSize: 12, fontWeight: '700', color: '#64748B', marginRight: 8 },
  pillarTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pillarTagText: { fontSize: 11, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  cardTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  cardVendor: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 10 },

  detailsGrid: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  detailItem: { width: '47%' },
  detailLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* Marketing Progress */
  progressContainer: { marginBottom: 12 },
  progressHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: NAVY },
  progressVal: { fontSize: 12, fontWeight: '800', color: '#7C3AED' },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 3 },

  /* Stepper Indicators */
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 12 },
  stepperItem: { alignItems: 'center', flex: 1 },
  stepperDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepperDotDone: { backgroundColor: '#16B77A' },
  stepperDotCurrent: { backgroundColor: NAVY },
  stepperText: { fontSize: 9, color: '#94A3B8', fontWeight: '500', textAlign: 'center' },
  stepperTextDone: { color: NAVY },
  stepperTextCurrent: { color: NAVY, fontWeight: '800' },

  /* Bottom Action Row */
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', zIndex: 10 },
  primaryActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, height: 36, borderRadius: 10, paddingHorizontal: 14, alignSelf: 'flex-end' },
  primaryActionText: { fontSize: 13, fontWeight: '700', color: '#fff', marginRight: 4 },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(14, 32, 66, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '92%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalCloseBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 14 },
  modalScroll: { padding: 18, flexShrink: 1 },

  modalRecordTop: { marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalId: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 2 },
  modalRecordTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  modalVendor: { fontSize: 13, color: '#64748B' },

  modalStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalLabel: { fontSize: 13, color: '#64748B' },

  contactBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: BORDER, marginBottom: 16 },
  contactText: { fontSize: 13, fontWeight: '700', color: NAVY },

  timelineSection: { marginTop: 8 },
  timelineSectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5E1', marginTop: 4, marginRight: 12 },
  timelineDotLatest: { backgroundColor: NAVY },
  timelineMessage: { fontSize: 13, color: '#475569', marginBottom: 2 },
  timelineMessageLatest: { color: NAVY, fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  locationText: { fontSize: 11, color: '#64748B' },
  timeText: { fontSize: 11, color: '#94A3B8' },

  modalFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: BORDER, gap: 10 },
  modalCloseFooterBtn: { flex: 1, height: 42, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  modalCloseFooterText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  modalContactFooterBtn: { flex: 1.5, flexDirection: 'row', height: 42, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  modalContactFooterText: { fontSize: 13, fontWeight: '700', color: '#fff' }
});
