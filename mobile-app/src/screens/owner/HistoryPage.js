import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Platform, useWindowDimensions, Modal, SafeAreaView
} from 'react-native';
import {
  History, Search, SlidersHorizontal, Package, UsersRound, Wrench, Megaphone,
  ChevronRight, ListChecks, Clock3, CircleCheck, CircleAlert, EllipsisVertical as MoreVertical,
  Download, X, RotateCcw, Star, Calendar, FileText, Check, Activity
} from 'lucide-react-native';
import { fetchOwnerActivityHistoryApi } from '../../services/api.service';
import { AuthContext } from '../../context/AuthContext';

const NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG_COLOR = '#F5F7FA';
const BORDER = '#E3E9F1';
const TEXT_MUTED = '#71829B';

// Pillar Definitions & Color Accents
const PILLARS = [
  { id: 'all', label: 'All', icon: Activity, color: NAVY },
  { id: 'raw-material', label: 'Raw Material', icon: Package, color: '#D97706' },
  { id: 'manpower', label: 'Manpower', icon: UsersRound, color: '#9333EA' },
  { id: 'service', label: 'Services', icon: Wrench, color: '#2563EB' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#7C3AED' }
];

const PILLAR_BADGES = {
  'raw-material': { label: 'RAW MATERIAL', color: '#D97706', bg: '#FFFBEB' },
  'manpower': { label: 'MANPOWER', color: '#9333EA', bg: '#F3E8FF' },
  'service': { label: 'SERVICE', color: '#2563EB', bg: '#EFF6FF' },
  'marketing': { label: 'MARKETING', color: '#7C3AED', bg: '#F5F3FF' }
};

const STATUS_BADGES = {
  'Delivered': { bg: 'transparent', text: '#10B981' },
  'Completed': { bg: 'transparent', text: '#10B981' },
  'Active': { bg: 'transparent', text: '#2563EB' },
  'In Progress': { bg: 'transparent', text: '#F59E0B' },
  'Running': { bg: 'transparent', text: '#10B981' },
  'Paused': { bg: 'transparent', text: '#8B5CF6' },
  'Cancelled': { bg: 'transparent', text: '#EF4444' }
};

// Secondary status filter list per pillar
const STATUS_FILTERS_BY_PILLAR = {
  'all': ['All', 'In Progress', 'Completed', 'Cancelled'],
  'raw-material': ['All', 'Delivered', 'In Progress', 'Cancelled'],
  'manpower': ['All', 'Active', 'Completed', 'Cancelled'],
  'service': ['All', 'Completed', 'In Progress', 'Cancelled'],
  'marketing': ['All', 'Completed', 'Running', 'Paused', 'Cancelled']
};

// Default Mock History Data (Empty by default, populated strictly from backend DB)
const INITIAL_HISTORY = [];

export default function HistoryPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const auth = useContext(AuthContext);
  const user = auth?.user || {};

  const [historyData, setHistoryData] = useState([]);
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilters, setShowStatusFilters] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync history with backend database
  useEffect(() => {
    let isMounted = true;
    const loadBackendHistory = async () => {
      try {
        const ownerId = user?.id || user?.registration?.id || user?.userId;
        if (!ownerId) return;
        const res = await fetchOwnerActivityHistoryApi(ownerId);
        if (res && res.success && res.data) {
          const { orders = [], requirements = [] } = res.data;

          if (orders.length > 0 || requirements.length > 0) {
            const mappedOrders = orders.map(ord => ({
              id: `ORD-${(ord.id || '').toString().slice(-4).padStart(4, '0')}`,
              pillar: 'raw-material',
              title: ord.items && ord.items[0] ? `${ord.items[0].product?.name || 'Raw Material'} x ${ord.items[0].quantity}` : 'Raw Material Order',
              vendor: ord.supplier?.bizName || 'Supplier Wholesaler',
              qty: ord.items ? `${ord.items.length} items` : '1 Item',
              amount: `₹${parseFloat(ord.totalAmount || 0).toLocaleString('en-IN')}`,
              date: new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: ord.status === 'confirmed' ? 'Delivered' : ord.status ? (ord.status.charAt(0).toUpperCase() + ord.status.slice(1)) : 'In Progress',
              actionText: 'View Order',
              timeline: [
                `Order Status: ${(ord.status || 'pending').toUpperCase()}`,
                `Delivery Address: ${ord.deliveryAddress || 'Branch Address'}`,
                `Payment Method: ${(ord.paymentMethod || 'COD').toUpperCase()}`
              ]
            }));

            const mappedReqs = requirements.map(r => {
              let pillar = 'service';
              let actionText = 'View Service';
              if (r.type === 'manpower') { pillar = 'manpower'; actionText = 'View Hiring'; }
              else if (r.type === 'marketing') { pillar = 'marketing'; actionText = 'View Campaign'; }

              let status = 'In Progress';
              if (r.status === 'completed' || r.status === 'accepted') status = 'Completed';
              else if (r.status === 'cancelled') status = 'Cancelled';
              else if (r.supplierId) status = 'Completed';
              else status = (r.status || 'pending').charAt(0).toUpperCase() + (r.status || 'pending').slice(1);

              return {
                id: `REQ-${(r.id || '').toString().slice(-4).padStart(4, '0')}`,
                pillar,
                title: r.title || 'Requirement Post',
                vendor: r.supplier?.bizName || 'Verified Provider',
                qty: r.extraData?.numberOfStaff ? `${r.extraData.numberOfStaff} Staff` : '1 Requirement',
                amount: r.budget ? (r.budget.toString().startsWith('₹') ? r.budget : `₹${r.budget}`) : '₹15,000',
                date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                status,
                actionText,
                timeline: [
                  `Requirement Status: ${status.toUpperCase()}`,
                  `Location: ${r.location || 'Branch Premises'}`
                ]
              };
            });

            if (isMounted) {
              setHistoryData([...mappedOrders, ...mappedReqs]);
            }
          }
        }
      } catch (err) {
        console.log('Error loading backend history:', err);
      }
    };

    loadBackendHistory();
    return () => { isMounted = false; };
  }, [user?.id, user?.registrationId]);

  // Overview Counts
  const overviewCounts = useMemo(() => {
    const total = historyData.length;
    const completed = historyData.filter(d => d.status === 'Completed' || d.status === 'Delivered').length;
    const inProgress = total - completed - historyData.filter(d => d.status === 'Cancelled').length;
    return { total, inProgress, completed };
  }, [historyData]);

  // Secondary status filters available for active pillar
  const availableStatuses = STATUS_FILTERS_BY_PILLAR[selectedPillar] || STATUS_FILTERS_BY_PILLAR['all'];

  // Pillar filter selection handler
  const handleSelectPillar = (pillarId) => {
    setSelectedPillar(pillarId);
    setSelectedStatus('All');
  };

  // Filtered History Data
  const filteredHistory = useMemo(() => {
    return historyData.filter(rec => {
      // Pillar filter
      if (selectedPillar !== 'all' && rec.pillar !== selectedPillar) return false;

      // Status filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'In Progress') {
          if (rec.status === 'Completed' || rec.status === 'Delivered' || rec.status === 'Cancelled') return false;
        } else if (selectedStatus === 'Completed') {
          if (rec.status !== 'Completed' && rec.status !== 'Delivered') return false;
        } else if (selectedStatus === 'Cancelled') {
          if (rec.status !== 'Cancelled') return false;
        } else {
          if (rec.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        }
      }

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          rec.id.toLowerCase().includes(q) ||
          rec.title.toLowerCase().includes(q) ||
          rec.vendor.toLowerCase().includes(q) ||
          (rec.candidate && rec.candidate.toLowerCase().includes(q)) ||
          rec.status.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [historyData, selectedPillar, selectedStatus, searchQuery]);

  // Open Details Modal
  const handleOpenDetails = (rec) => {
    setSelectedRecord(rec);
    setDetailsModalVisible(true);
  };

  const handleDownloadInvoice = (record) => {
    if (!record) return;

    const invId = record.id || 'INV-001';
    const itemTitle = record.title || 'Order Activity Record';
    const supplier = record.subtitle || 'HoReCa Partner';
    const amount = record.amount || '₹0';
    const date = record.date || new Date().toLocaleDateString('en-IN');
    const customerName = user?.businessName || user?.tradeName || user?.name || user?.email || 'HoReCa Business Partner';
    const pillar = record.pillar || 'RAW MATERIAL';
    const status = record.status || 'Confirmed';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${invId}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; margin: 0; padding: 32px; background: #F8FAFC; }
          .invoice-box { max-width: 750px; margin: auto; padding: 36px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #081A3A; padding-bottom: 20px; margin-bottom: 28px; }
          .brand { font-size: 24px; font-weight: 900; color: #081A3A; letter-spacing: -0.5px; }
          .brand span { color: #D97706; }
          .inv-title { font-size: 22px; font-weight: 900; color: #081A3A; text-align: right; }
          .inv-sub { font-size: 13px; color: #64748B; margin-top: 2px; }
          .grid { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 20px; }
          .col { flex: 1; }
          .col-title { font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .col-val { font-size: 14px; font-weight: 700; color: #0F172A; line-height: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
          th { background: #F1F5F9; color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase; text-align: left; padding: 12px 16px; border-radius: 6px; }
          td { padding: 14px 16px; font-size: 14px; color: #0F172A; border-bottom: 1px solid #F1F5F9; }
          .total-box { display: flex; justify-content: flex-end; }
          .total-card { width: 280px; background: #F8FAFC; padding: 16px; border-radius: 12px; border: 1px solid #E2E8F0; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #64748B; }
          .total-final { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #081A3A; border-top: 2px solid #081A3A; padding-top: 10px; margin-top: 8px; }
          .status-badge { display: inline-block; background: #DCFCE7; color: #15803D; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8; }
          @media print {
            body { background: none; padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="brand">HORECA<span>HUB</span></div>
              <div class="inv-sub">Official Tax Invoice & Order Receipt</div>
            </div>
            <div>
              <div class="inv-title">TAX INVOICE</div>
              <div class="inv-sub">Ref: ${invId}</div>
            </div>
          </div>

          <div class="grid">
            <div class="col">
              <div class="col-title">Billed To</div>
              <div class="col-val">${customerName}</div>
            </div>
            <div class="col">
              <div class="col-title">Supplier / Vendor</div>
              <div class="col-val">${supplier}</div>
            </div>
            <div class="col" style="text-align: right;">
              <div class="col-title">Invoice Date</div>
              <div class="col-val">${date}</div>
              <div style="margin-top: 8px;"><span class="status-badge">${status}</span></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Pillar</th>
                <th>Description / Item</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${pillar}</strong></td>
                <td>${itemTitle}</td>
                <td style="text-align: right;"><strong>${amount}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-card">
              <div class="total-row"><span>Subtotal</span><span>${amount}</span></div>
              <div class="total-row"><span>Taxes & Delivery</span><span>Included</span></div>
              <div class="total-final"><span>Total Amount</span><span>${amount}</span></div>
            </div>
          </div>

          <div class="footer">
            Thank you for using HoReCa Platform. Verified Order Receipt & Tax Invoice.
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
      } else {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      showToast(`Downloading invoice for ${invId}...`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Toast Notification */}
      {toastMessage ? (
        <View style={styles.toastContainer}>
          <Check size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.mainLayout, !isMobile && styles.mainLayoutWeb]}>

          {/* ── Page Header ── */}
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <History size={22} color={NAVY} style={{ marginRight: 8 }} />
                <Text style={styles.pageTitle}>Activity History</Text>
              </View>
            </View>
          </View>

          {/* ── History Overview Summary Card ── */}
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardTitle}>History Overview</Text>

            <View style={styles.overviewColsRow}>
              {/* Total Records */}
              <TouchableOpacity
                style={styles.overviewColItem}
                onPress={() => { setSelectedPillar('all'); setSelectedStatus('All'); }}
                activeOpacity={0.8}
              >
                <View style={[styles.overviewIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <ListChecks size={18} color="#2563EB" />
                </View>
                <Text style={styles.overviewCountVal}>{overviewCounts.total}</Text>
                <Text style={styles.overviewLabelText}>Total Records</Text>
              </TouchableOpacity>

              <View style={styles.overviewDividerLine} />

              {/* In Progress */}
              <TouchableOpacity
                style={styles.overviewColItem}
                onPress={() => setSelectedStatus('In Progress')}
                activeOpacity={0.8}
              >
                <View style={[styles.overviewIconBox, { backgroundColor: '#FFFBEB' }]}>
                  <Clock3 size={18} color="#D97706" />
                </View>
                <Text style={styles.overviewCountVal}>{overviewCounts.inProgress}</Text>
                <Text style={styles.overviewLabelText}>In Progress</Text>
              </TouchableOpacity>

              <View style={styles.overviewDividerLine} />

              {/* Completed */}
              <TouchableOpacity
                style={styles.overviewColItem}
                onPress={() => setSelectedStatus('Completed')}
                activeOpacity={0.8}
              >
                <View style={[styles.overviewIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <CircleCheck size={18} color="#15803D" />
                </View>
                <Text style={styles.overviewCountVal}>{overviewCounts.completed}</Text>
                <Text style={styles.overviewLabelText}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Search Container ── */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search history by ID, title or provider..."
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

          {/* ── Secondary Status Filters ── */}
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

          {/* ── History Record Cards List ── */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyCardContainer}>
              {historyData.length === 0 ? (
                <>
                  <History size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyCardTitle}>No activity history yet</Text>
                  <Text style={styles.emptyCardSub}>
                    Your completed orders, hiring requests, services and campaigns will appear here.
                  </Text>
                </>
              ) : (
                <>
                  <FileText size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyCardTitle}>No matching history records</Text>
                  <Text style={styles.emptyCardSub}>
                    Try another pillar, status or search term.
                  </Text>
                  <TouchableOpacity
                    style={styles.clearFiltersBtn}
                    onPress={() => { setSearchQuery(''); setSelectedPillar('all'); setSelectedStatus('All'); }}
                  >
                    <RotateCcw size={14} color={NAVY} style={{ marginRight: 6 }} />
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            filteredHistory.map(rec => {
              const pillarBadge = PILLAR_BADGES[rec.pillar] || { label: 'OTHER', color: NAVY, bg: '#F1F5F9' };
              const statusStyle = STATUS_BADGES[rec.status] || { bg: 'transparent', text: '#2563EB' };

              return (
                <View key={rec.id} style={styles.historyCard}>

                  {/* Top Row: Record ID + Pillar Badge + Status Badge */}
                  <View style={styles.cardTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.recordIdText}>{rec.id}</Text>
                      <View style={[styles.pillarTag, { backgroundColor: pillarBadge.bg }]}>
                        <Text style={[styles.pillarTagText, { color: pillarBadge.color }]}>
                          {pillarBadge.label}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                        {rec.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Main Title & Provider */}
                  <Text style={styles.cardTitleText}>{rec.title}</Text>
                  <Text style={styles.cardVendorText}>{rec.vendor}</Text>

                  {/* Meta Summary Row */}
                  <View style={styles.summaryMetaRow}>
                    {rec.qty ? <Text style={styles.metaItemText}>Quantity: {rec.qty}</Text> : null}
                    {rec.candidate ? <Text style={styles.metaItemText}>Staff: {rec.candidate}</Text> : null}
                    {rec.rating ? <Text style={styles.metaItemText}>Rating: {rec.rating}</Text> : null}
                    {rec.reach ? <Text style={styles.metaItemText}>Result: {rec.reach}</Text> : null}
                  </View>

                  {/* Bottom Row: Date/Amount on Left + Compact Primary Action Button on Right */}
                  <View style={styles.cardBottomRow}>
                    <View>
                      <Text style={styles.dateText}>{rec.date}</Text>
                      {rec.amount ? <Text style={styles.amountText}>{rec.amount}</Text> : null}
                    </View>

                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => handleOpenDetails(rec)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryActionText}>{rec.actionText}</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* ── History Details Modal ── */}
      <Modal visible={detailsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '84%', display: 'flex', flexDirection: 'column' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Activity Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={true}>
                <View style={styles.modalHeaderBox}>
                  <Text style={styles.modalIdText}>{selectedRecord.id}</Text>
                  <Text style={styles.modalRecordTitle}>{selectedRecord.title}</Text>
                  <Text style={styles.modalVendorText}>{selectedRecord.vendor}</Text>
                </View>

                <View style={styles.modalDetailsGrid}>
                  <View style={styles.modalCell}>
                    <Text style={styles.modalCellLabel}>Pillar</Text>
                    <Text style={styles.modalCellValue}>
                      {(PILLAR_BADGES[selectedRecord.pillar] || {}).label || selectedRecord.pillar}
                    </Text>
                  </View>

                  <View style={styles.modalCell}>
                    <Text style={styles.modalCellLabel}>Status</Text>
                    <Text style={styles.modalCellValue}>{selectedRecord.status}</Text>
                  </View>

                  {selectedRecord.amount ? (
                    <View style={styles.modalCell}>
                      <Text style={styles.modalCellLabel}>Total Amount / Budget</Text>
                      <Text style={styles.modalCellValue}>{selectedRecord.amount}</Text>
                    </View>
                  ) : null}

                  <View style={styles.modalCell}>
                    <Text style={styles.modalCellLabel}>Date</Text>
                    <Text style={styles.modalCellValue}>{selectedRecord.date}</Text>
                  </View>
                </View>

                {/* Timeline */}
                {selectedRecord.timeline && selectedRecord.timeline.length > 0 && (
                  <View style={styles.timelineBox}>
                    <Text style={styles.timelineTitle}>Activity Progress & Timeline</Text>
                    {selectedRecord.timeline.map((step, idx) => (
                      <View key={idx} style={styles.timelineRow}>
                        <View style={[styles.timelineDot, idx === 0 && styles.timelineDotActive]} />
                        <Text style={[styles.timelineStepText, idx === 0 && styles.timelineStepTextActive]}>
                          {step}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalOutlineBtn}
                onPress={() => {
                  handleDownloadInvoice(selectedRecord);
                }}
              >
                <Download size={15} color={NAVY} style={{ marginRight: 6 }} />
                <Text style={styles.modalOutlineText}>Download Invoice</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Text style={styles.modalPrimaryText}>Close</Text>
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
              Select a category to view specific history records:
            </Text>

            <View style={styles.filterOptionsList}>
              {PILLARS.map(p => {
                const IconComp = p.icon;
                const isSelected = selectedPillar === p.id;
                const count = p.id === 'all'
                  ? historyData.length
                  : historyData.filter(d => d.pillar === p.id).length;

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
                      <CircleCheck size={18} color={NAVY} />
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
  safeArea: { flex: 1, backgroundColor: BG_COLOR },
  container: { flex: 1, backgroundColor: BG_COLOR },
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
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY },
  pageSubtitle: { fontSize: 13, color: TEXT_MUTED },

  /* History Overview Summary Card */
  overviewCard: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: BORDER, padding: 16, marginBottom: 16, ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },
  overviewCardTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 14, textAlign: 'center' },
  overviewColsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  overviewColItem: { flex: 1, alignItems: 'center' },
  overviewDividerLine: { width: 1, height: 38, backgroundColor: '#E2E8F0' },
  overviewIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  overviewCountVal: { fontSize: 20, fontWeight: '900', color: NAVY, marginBottom: 2 },
  overviewLabelText: { fontSize: 12, color: TEXT_MUTED, fontWeight: '600' },

  /* Search Container */
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },
  filterIconButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  filterIconButtonActive: { backgroundColor: NAVY },

  /* Pillar Filters */
  pillarScroll: { flexGrow: 0, marginBottom: 12 },
  pillarContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  pillarPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  pillarPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillarPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  pillarPillTextActive: { color: '#fff' },

  /* Secondary Status Filters */
  statusScroll: { flexGrow: 0, marginBottom: 16 },
  statusContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  statusPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  statusPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  statusPillTextActive: { color: '#fff' },

  /* Empty State Card */
  emptyCardContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 30, alignItems: 'center', justifyContent: 'center', maxHeight: 250 },
  emptyCardTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptyCardSub: { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', maxWidth: 280 },
  clearFiltersBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  clearFiltersText: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* History Record Card */
  historyCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 14, marginBottom: 12, position: 'relative', ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  recordIdText: { fontSize: 12, fontWeight: '700', color: '#64748B', marginRight: 8 },
  pillarTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pillarTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  cardTitleText: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  cardVendorText: { fontSize: 13, color: TEXT_MUTED, fontWeight: '500', marginBottom: 8 },

  summaryMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 8, marginBottom: 12 },
  metaItemText: { fontSize: 12, fontWeight: '600', color: NAVY },

  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', zIndex: 10 },
  dateText: { fontSize: 11, color: TEXT_MUTED, fontWeight: '500' },
  amountText: { fontSize: 13, fontWeight: '800', color: NAVY },

  primaryActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, height: 36, borderRadius: 10, paddingHorizontal: 14, alignSelf: 'flex-end' },
  primaryActionText: { fontSize: 13, fontWeight: '700', color: '#fff', marginRight: 4 },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '92%', maxWidth: 540, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalCloseBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 14 },
  modalScroll: { padding: 18, flexShrink: 1 },

  modalHeaderBox: { marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalIdText: { fontSize: 12, fontWeight: '700', color: TEXT_MUTED, marginBottom: 2 },
  modalRecordTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  modalVendorText: { fontSize: 13, color: TEXT_MUTED },

  modalDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: BORDER },
  modalCell: { width: '48%' },
  modalCellLabel: { fontSize: 11, color: TEXT_MUTED, fontWeight: '600', marginBottom: 2 },
  modalCellValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  timelineBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  timelineTitle: { fontSize: 13, fontWeight: '800', color: NAVY, marginBottom: 10 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8', marginTop: 5, marginRight: 10 },
  timelineDotActive: { backgroundColor: NAVY },
  timelineStepText: { fontSize: 12, color: '#475569', flex: 1 },
  timelineStepTextActive: { color: NAVY, fontWeight: '700' },

  modalFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: BORDER, gap: 10 },
  modalOutlineBtn: { flex: 1, flexDirection: 'row', height: 42, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  modalOutlineText: { fontSize: 13, fontWeight: '700', color: NAVY },
  modalPrimaryBtn: { flex: 1, height: 42, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' }
});
