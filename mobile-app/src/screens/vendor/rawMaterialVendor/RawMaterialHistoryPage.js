import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Alert
} from 'react-native';
import {
  Search, SlidersHorizontal, Package, ChevronRight, X, XCircle,
  MoreVertical, CheckCircle, Truck, User, Home, ClipboardList,
  Plus, Calendar, IndianRupee, Boxes, CreditCard, ArrowUpRight,
  ChevronDown, FileSpreadsheet, Download, FileText
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#071B3A';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const MOCK_HISTORY = [
  {
    id: "ORD-2026-1024",
    type: "Order",
    client: "Hotel Blue Sapphire",
    product: "Basmati Rice",
    quantity: "100 kg",
    amount: "₹8,500",
    date: "23 Jul 2026, 10:30 AM",
    rawDate: "2026-07-23T10:30:00",
    status: "Delivered",
    icon: ClipboardList,
    color: '#10B981',
    details: "Basmati Rice order has been successfully delivered to Hotel Blue Sapphire.",
    notes: "Delivery confirmed by staff member at receiving dock. Temp constraints maintained."
  },
  {
    id: "INV-2026-309",
    type: "Inventory",
    product: "Sunflower Oil",
    client: "-",
    change: "Added 50 L",
    quantity: "50 L",
    amount: "-",
    date: "23 Jul 2026, 09:15 AM",
    rawDate: "2026-07-23T09:15:00",
    status: "Updated",
    icon: Boxes,
    color: '#8B5CF6',
    details: "Inventory level updated. 50 L of Sunflower Oil added to stock.",
    notes: "Batch #SF-OIL-2026B. Expiry check verified."
  },
  {
    id: "PAY-2026-441",
    type: "Payment",
    client: "Cafe Coffee Day",
    product: "-",
    quantity: "-",
    amount: "₹12,750",
    date: "22 Jul 2026, 04:30 PM",
    rawDate: "2026-07-22T16:30:00",
    status: "Paid",
    icon: IndianRupee,
    color: '#F59E0B',
    details: "Payment of ₹12,750 received from Cafe Coffee Day.",
    notes: "Cleared via online bank transfer. Reference ref-bank-998822."
  },
  {
    id: "DEL-2026-208",
    type: "Delivery",
    client: "Royal Orchid Hotel",
    product: "Premium Dairy Kit",
    quantity: "15 units",
    amount: "-",
    driver: "Ramesh Kumar",
    vehicle: "MH12 XY 4567",
    date: "22 Jul 2026, 02:00 PM",
    rawDate: "2026-07-22T14:00:00",
    status: "Completed",
    icon: Truck,
    color: '#3B82F6',
    details: "Delivery DEL-2026-208 completed by driver Ramesh Kumar to Royal Orchid Hotel.",
    notes: "Signed invoice uploaded. Vehicle: MH12 XY 4567."
  },
  {
    id: "INV-2026-288",
    type: "Inventory",
    product: "Fresh Paneer",
    client: "-",
    quantity: "-",
    amount: "-",
    date: "21 Jul 2026, 11:20 AM",
    rawDate: "2026-07-21T11:20:00",
    status: "Archived",
    icon: Boxes,
    color: '#EF4444',
    details: "Fresh Paneer product has been archived due to seasonal catalog update.",
    notes: "Archived by store admin. Product code: RM-DAI-PN-09."
  },
  {
    id: "ORD-2026-1017",
    type: "Order",
    client: "The Grand Palace",
    product: "Red Onion",
    quantity: "200 kg",
    amount: "₹4,200",
    date: "20 Jul 2026, 03:10 PM",
    rawDate: "2026-07-20T15:10:00",
    status: "Cancelled",
    icon: ClipboardList,
    color: '#64748B',
    details: "Order ORD-2026-1017 from The Grand Palace for Red Onion has been cancelled.",
    notes: "Cancelled by buyer due to logistical scheduling conflict."
  }
];

const SUMMARY_CARDS = [
  { label: 'Completed Orders', value: '124', icon: CheckCircle, color: '#10B981' },
  { label: 'Delivered Orders', value: '120', icon: Truck, color: '#3B82F6' },
  { label: 'Inventory Updates', value: '42', icon: Boxes, color: '#8B5CF6' },
  { label: 'Total Revenue', value: '₹1,85,500', icon: IndianRupee, color: '#F59E0B' }
];

const TABS = ['All', 'Orders', 'Deliveries', 'Inventory', 'Payments'];

export default function RawMaterialHistoryPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // State Variables
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Custom Date range state
  const [customStartDate, setCustomStartDate] = useState('2026-07-20');
  const [customEndDate, setCustomEndDate] = useState('2026-07-23');

  // Expanded items for mobile view
  const [expandedItems, setExpandedItems] = useState({});

  // UI States
  const [exportMenuVisible, setExportMenuVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // Helper for status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
      case 'Paid':
        return { bg: '#F0FDF4', text: '#16A34A' };
      case 'Updated':
        return { bg: '#F3E8FF', text: '#A855F7' };
      case 'Archived':
        return { bg: '#FEF2F2', text: '#EF4444' };
      case 'Cancelled':
        return { bg: '#F1F5F9', text: '#64748B' };
      default:
        return { bg: '#EFF6FF', text: '#3B82F6' };
    }
  };

  // Toast trigger helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleExport = (format) => {
    setExportMenuVisible(false);
    triggerToast("History report exported successfully.");
    Alert.alert("Export Successful", `History report exported as ${format} successfully.`);
  };

  // Toggle expanded details in mobile mode
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Main filter function
  const filteredHistory = MOCK_HISTORY.filter(item => {
    // 1. Tab Filter
    if (activeTab !== 'All') {
      const typeMap = {
        'Orders': 'Order',
        'Deliveries': 'Delivery',
        'Inventory': 'Inventory',
        'Payments': 'Payment'
      };
      if (item.type !== typeMap[activeTab]) return false;
    }

    // 2. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchClient = item.client && item.client.toLowerCase().includes(q);
      const matchProduct = item.product && item.product.toLowerCase().includes(q);
      if (!matchId && !matchClient && !matchProduct) return false;
    }

    // 3. Date Filter
    const today = new Date("2026-07-23T23:59:59"); // Mock "current date"
    const itemDate = new Date(item.rawDate);

    if (dateFilter === 'Today') {
      return itemDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'This Week') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return itemDate >= oneWeekAgo && itemDate <= today;
    } else if (dateFilter === 'This Month') {
      return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'Custom Range') {
      if (!customStartDate || !customEndDate) return true;
      const start = new Date(customStartDate + "T00:00:00");
      const end = new Date(customEndDate + "T23:59:59");
      return itemDate >= start && itemDate <= end;
    }

    return true;
  });

  const renderHistoryItem = ({ item }) => {
    const sStyle = getStatusColor(item.status);
    const isExpanded = !!expandedItems[item.id];

    if (isMobile) {
      // Mobile render: Keep primary details visible, secondary inside expandable content.
      return (
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardHeaderPress} onPress={() => toggleExpand(item.id)}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.activityIconBox, { backgroundColor: item.color + '15' }]}>
                <item.icon size={18} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.activityId}>{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}><Text style={[styles.statusText, { color: sStyle.text }]}>{item.status}</Text></View>
                </View>
                <Text style={styles.activityClient}>{item.type === 'Inventory' ? item.product : item.client}</Text>
                <Text style={styles.activityTime}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              <View style={styles.expandGrid}>
                {item.product !== '-' && item.type !== 'Inventory' && (
                  <View style={styles.expandRow}><Text style={styles.expandLabel}>Product:</Text><Text style={styles.expandValue}>{item.product}</Text></View>
                )}
                {item.quantity !== '-' && (
                  <View style={styles.expandRow}><Text style={styles.expandLabel}>Quantity:</Text><Text style={styles.expandValue}>{item.quantity}</Text></View>
                )}
                {item.amount !== '-' && (
                  <View style={styles.expandRow}><Text style={styles.expandLabel}>Amount:</Text><Text style={styles.expandValue}>{item.amount}</Text></View>
                )}
                {item.driver && (
                  <View style={styles.expandRow}><Text style={styles.expandLabel}>Driver:</Text><Text style={styles.expandValue}>{item.driver}</Text></View>
                )}
                {item.change && (
                  <View style={styles.expandRow}><Text style={styles.expandLabel}>Inventory Log:</Text><Text style={styles.expandValue}>{item.change}</Text></View>
                )}
              </View>
              <TouchableOpacity style={styles.btnExpandDetail} onPress={() => setSelectedItem(item)}>
                <Text style={styles.btnExpandDetailText}>View Details</Text>
                <ChevronRight size={14} color={WHITE} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.btnExpandToggle} onPress={() => toggleExpand(item.id)}>
            <Text style={styles.btnExpandToggleText}>{isExpanded ? "Show Less" : "Expand Details"}</Text>
            <ChevronDown size={14} color={MUTED} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
        </View>
      );
    }

    // Tablet/Desktop render: Clean horizontal list card layout
    return (
      <View style={styles.horizontalRow}>
        <View style={styles.rowPartIcon}>
          <View style={[styles.activityIconBox, { backgroundColor: item.color + '15' }]}>
            <item.icon size={18} color={item.color} />
          </View>
        </View>
        <View style={styles.rowPartInfo}>
          <Text style={styles.activityId}>{item.id}</Text>
          <Text style={styles.activityTypeLabel}>{item.type}</Text>
        </View>
        <View style={styles.rowPartTarget}>
          <Text style={styles.activityClientText} numberOfLines={1}>{item.type === 'Inventory' ? item.product : item.client}</Text>
          <Text style={styles.activitySubText}>{item.type === 'Inventory' ? 'Inventory Update' : item.product !== '-' ? item.product : 'Payment Log'}</Text>
        </View>
        <View style={styles.rowPartDate}>
          <Text style={styles.activityDateText}>{item.date}</Text>
        </View>
        <View style={styles.rowPartQuantity}>
          <Text style={styles.activityQtyText}>{item.amount !== '-' ? item.amount : item.quantity !== '-' ? item.quantity : item.change || '-'}</Text>
        </View>
        <View style={styles.rowPartStatus}>
          <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}><Text style={[styles.statusText, { color: sStyle.text }]}>{item.status}</Text></View>
        </View>
        <View style={styles.rowPartAction}>
          <TouchableOpacity style={styles.btnViewDetailTable} onPress={() => setSelectedItem(item)}>
            <Text style={styles.btnViewDetailTableText}>View Details</Text>
            <ChevronRight size={14} color={NAVY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Visual Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <CheckCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <View style={styles.container}>
        
        {/* Page Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSubtitle}>View completed orders, deliveries, inventory updates and payments.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.btnExport} onPress={() => setExportMenuVisible(true)}>
              <Download size={18} color={WHITE} style={{ marginRight: 6 }} />
              <Text style={styles.btnExportText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Filter & Search query section */}
        <View style={styles.controlSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color={MUTED} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by order ID, product, client or delivery ID..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}><X size={16} color={MUTED} /></TouchableOpacity>
              )}
            </View>

            <View style={styles.dateSelectorContainer}>
              <Text style={styles.labelSmall}>Date Filter:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelectorScroll}>
                {['Today', 'This Week', 'This Month', 'Custom Range'].map(opt => (
                  <TouchableOpacity 
                    key={opt}
                    style={[styles.dateFilterChip, dateFilter === opt && styles.dateFilterChipActive]}
                    onPress={() => {
                      setDateFilter(opt);
                      if (opt === 'Custom Range') {
                        setShowDatePickerModal(true);
                      }
                    }}
                  >
                    <Text style={[styles.dateFilterChipText, dateFilter === opt && styles.dateFilterChipTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* If custom range filter is active, show inputs inline */}
          {dateFilter === 'Custom Range' && (
            <View style={styles.customDateDisplayRow}>
              <Calendar size={14} color={NAVY} style={{ marginRight: 6 }} />
              <Text style={styles.customDateDisplayText}>
                Date Range: <Text style={{fontWeight: 'bold'}}>{customStartDate}</Text> to <Text style={{fontWeight: 'bold'}}>{customEndDate}</Text>
              </Text>
              <TouchableOpacity onPress={() => setShowDatePickerModal(true)} style={styles.btnModifyRange}>
                <Text style={styles.btnModifyRangeText}>Change Range</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            {SUMMARY_CARDS.map((card, idx) => (
              <View key={idx} style={[styles.summaryCard, { width: isMobile ? (width - 48) / 2 : (width - 64) / 4 }]}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.summaryIconBox, { backgroundColor: card.color + '15' }]}>
                    <card.icon size={18} color={card.color} />
                  </View>
                </View>
                <Text style={styles.summaryValue}>{card.value}</Text>
                <Text style={styles.summaryLabel}>{card.label}</Text>
              </View>
            ))}
          </View>

          {/* Filter Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* History List */}
          <View style={styles.listContainer}>
            <FlatList
              data={filteredHistory}
              keyExtractor={item => item.id}
              renderItem={renderHistoryItem}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Boxes size={32} color="#CBD5E1" />
                  <Text style={styles.emptyText}>No history records match the criteria.</Text>
                </View>
              }
            />
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Export Options Modal */}
      <Modal visible={exportMenuVisible} animationType="fade" transparent onRequestClose={() => setExportMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setExportMenuVisible(false)}>
          <View style={styles.exportMenuCard}>
            <Text style={styles.modalTitle}>Export History Report</Text>
            <Text style={styles.exportSubtitle}>Choose the format to download the complete report:</Text>
            <View style={styles.exportList}>
              <TouchableOpacity style={styles.exportOptionRow} onPress={() => handleExport('PDF')}>
                <FileText size={20} color="#EF4444" style={{ marginRight: 12 }} />
                <Text style={styles.exportOptionText}>Export as PDF Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportOptionRow} onPress={() => handleExport('CSV')}>
                <FileSpreadsheet size={20} color="#10B981" style={{ marginRight: 12 }} />
                <Text style={styles.exportOptionText}>Export as CSV Sheet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportOptionRow} onPress={() => handleExport('Excel')}>
                <FileSpreadsheet size={20} color="#3B82F6" style={{ marginRight: 12 }} />
                <Text style={styles.exportOptionText}>Export as Excel Sheet</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnCancelModal} onPress={() => setExportMenuVisible(false)}>
              <Text style={styles.btnCancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Date Range Picker Modal */}
      <Modal visible={showDatePickerModal} animationType="fade" transparent onRequestClose={() => setShowDatePickerModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDatePickerModal(false)}>
            <TouchableWithoutFeedback>
              <View style={styles.datePickerCard}>
                <Text style={styles.modalTitle}>Set Custom Date Range</Text>
                
                <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
                <TextInput 
                  style={styles.dateInput} 
                  placeholder="e.g. 2026-07-20" 
                  value={customStartDate} 
                  onChangeText={setCustomStartDate}
                />

                <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
                <TextInput 
                  style={styles.dateInput} 
                  placeholder="e.g. 2026-07-23" 
                  value={customEndDate} 
                  onChangeText={setCustomEndDate}
                />

                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnModalOutline} onPress={() => { setDateFilter('This Month'); setShowDatePickerModal(false); }}>
                    <Text style={styles.btnModalOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnModalPrimary} onPress={() => setShowDatePickerModal(false)}>
                    <Text style={styles.btnModalPrimaryText}>Apply Range</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={selectedItem !== null} animationType="fade" transparent onRequestClose={() => setSelectedItem(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedItem(null)}>
          <TouchableWithoutFeedback>
            <View style={styles.detailsModalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>History Record Details</Text>
                <TouchableOpacity onPress={() => setSelectedItem(null)}><XCircle size={22} color={MUTED} /></TouchableOpacity>
              </View>

              {selectedItem && (
                <ScrollView style={styles.detailsModalBody}>
                  <View style={styles.detailHeaderBox}>
                    <View style={[styles.activityIconBoxLarge, { backgroundColor: selectedItem.color + '15' }]}>
                      <selectedItem.icon size={26} color={selectedItem.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailTitleId}>{selectedItem.id}</Text>
                      <Text style={styles.detailTitleType}>{selectedItem.type} Record</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedItem.status).bg }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(selectedItem.status).text }]}>{selectedItem.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>General Information</Text>
                    {selectedItem.client !== '-' && (
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Client:</Text><Text style={styles.detailValue}>{selectedItem.client}</Text></View>
                    )}
                    {selectedItem.product !== '-' && (
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Product:</Text><Text style={styles.detailValue}>{selectedItem.product}</Text></View>
                    )}
                    {selectedItem.quantity !== '-' && (
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Quantity:</Text><Text style={styles.detailValue}>{selectedItem.quantity}</Text></View>
                    )}
                    {selectedItem.amount !== '-' && (
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Amount:</Text><Text style={styles.detailValue}>{selectedItem.amount}</Text></View>
                    )}
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Date & Time:</Text><Text style={styles.detailValue}>{selectedItem.date}</Text></View>
                  </View>

                  {/* Show delivery info if type is Delivery */}
                  {selectedItem.type === 'Delivery' && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Delivery Details</Text>
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Assigned Driver:</Text><Text style={styles.detailValue}>{selectedItem.driver}</Text></View>
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Vehicle Number:</Text><Text style={styles.detailValue}>{selectedItem.vehicle}</Text></View>
                    </View>
                  )}

                  {/* Show change logs if type is Inventory */}
                  {selectedItem.change && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Inventory Logs</Text>
                      <View style={styles.detailRow}><Text style={styles.detailLabel}>Update Action:</Text><Text style={styles.detailValue}>{selectedItem.change}</Text></View>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Summary Logs</Text>
                    <Text style={styles.detailSummaryText}>{selectedItem.details}</Text>
                  </View>

                  <View style={[styles.detailSection, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>
                    <Text style={styles.detailNotesText}>{selectedItem.notes || 'No additional notes registered.'}</Text>
                  </View>

                  <View style={{ height: 20 }} />
                </ScrollView>
              )}

              <TouchableOpacity style={styles.btnDismissModal} onPress={() => setSelectedItem(null)}>
                <Text style={styles.btnDismissModalText}>Close Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1 },
  
  // Header
  header: { 
    minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, backgroundColor: WHITE,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY },
  headerSubtitle: { fontSize: 13, color: MUTED, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  btnExport: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, height: 40, borderRadius: 10 },
  btnExportText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  // Controls (Search & Date filter)
  controlSection: { backgroundColor: WHITE, padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  searchRow: { gap: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY },
  dateSelectorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  labelSmall: { fontSize: 12, color: MUTED, fontWeight: '600', marginRight: 8 },
  dateSelectorScroll: { gap: 8 },
  dateFilterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F5F9' },
  dateFilterChipActive: { backgroundColor: NAVY },
  dateFilterChipText: { fontSize: 12, color: MUTED, fontWeight: '500' },
  dateFilterChipTextActive: { color: WHITE },

  customDateDisplayRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#FFFBEB', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FEF3C7' },
  customDateDisplayText: { fontSize: 12, color: '#B45309', flex: 1 },
  btnModifyRange: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#F59E0B' },
  btnModifyRangeText: { color: WHITE, fontSize: 11, fontWeight: 'bold' },

  scrollContent: { padding: 16 },

  // Summary Grid
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: {
    backgroundColor: WHITE, padding: 12, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#E6EBF2',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryIconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  summaryLabel: { fontSize: 11, color: MUTED },

  // Filter Tabs
  tabsContainer: { paddingBottom: 16 },
  tabsScroll: { gap: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  activeTab: { backgroundColor: GOLD, borderColor: GOLD, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: MUTED },
  activeTabText: { color: WHITE, fontWeight: 'bold' },

  // List & Cards (Mobile)
  listContainer: { gap: 12 },
  card: { backgroundColor: WHITE, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E6EBF2', elevation: 1 },
  cardHeaderPress: { flex: 1 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start' },
  activityIconBox: { width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  activityId: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  activityClient: { fontSize: 15, fontWeight: '600', color: NAVY, marginTop: 2 },
  activityTime: { fontSize: 12, color: MUTED, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  expandedContent: { marginTop: 12 },
  expandGrid: { gap: 6, marginBottom: 12 },
  expandRow: { flexDirection: 'row', justifyContent: 'space-between' },
  expandLabel: { fontSize: 12, color: MUTED },
  expandValue: { fontSize: 12, fontWeight: '600', color: NAVY },
  btnExpandDetail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 36, backgroundColor: NAVY, borderRadius: 8, marginTop: 8 },
  btnExpandDetailText: { color: WHITE, fontSize: 12, fontWeight: 'bold', marginRight: 4 },
  btnExpandToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8, marginTop: 12 },
  btnExpandToggleText: { fontSize: 12, color: MUTED, marginRight: 4, fontWeight: '500' },

  // Desktop Card/Table layout
  horizontalRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8, borderWidth: 1, borderColor: '#E6EBF2' },
  rowPartIcon: { width: 50 },
  rowPartInfo: { width: 140 },
  activityTypeLabel: { fontSize: 11, color: MUTED, marginTop: 2, textTransform: 'uppercase', fontWeight: 'bold' },
  rowPartTarget: { flex: 2, paddingRight: 10 },
  activityClientText: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  activitySubText: { fontSize: 12, color: MUTED, marginTop: 2 },
  rowPartDate: { flex: 1.5 },
  activityDateText: { fontSize: 13, color: NAVY },
  rowPartQuantity: { flex: 1.2 },
  activityQtyText: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  rowPartStatus: { flex: 1.2 },
  rowPartAction: { width: 120, alignItems: 'flex-end' },
  btnViewDetailTable: { flexDirection: 'row', alignItems: 'center' },
  btnViewDetailTableText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 4 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: MUTED, marginTop: 12, textAlign: 'center' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  
  // Date range modal
  datePickerCard: { backgroundColor: WHITE, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  dateInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6 },
  modalFooterActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  // Export menu
  exportMenuCard: { backgroundColor: WHITE, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  exportSubtitle: { fontSize: 13, color: MUTED, marginBottom: 20 },
  exportList: { gap: 12, marginBottom: 24 },
  exportOptionRow: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  exportOptionText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnCancelModal: { height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  btnCancelModalText: { fontSize: 14, fontWeight: '700', color: NAVY },

  // Details side panel modal
  detailsModalCard: { backgroundColor: WHITE, borderRadius: 24, padding: 24, width: '100%', maxWidth: 500, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  detailsModalBody: { paddingVertical: 16 },
  detailHeaderBox: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  activityIconBoxLarge: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  detailTitleId: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  detailTitleType: { fontSize: 12, color: MUTED, textTransform: 'uppercase', fontWeight: 'bold', marginTop: 2 },
  detailSection: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 8 },
  detailSectionTitle: { fontSize: 12, fontWeight: 'bold', color: MUTED, textTransform: 'uppercase', marginBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: MUTED },
  detailValue: { fontSize: 13, fontWeight: '600', color: NAVY },
  detailSummaryText: { fontSize: 14, color: NAVY, lineHeight: 20 },
  detailNotesText: { fontSize: 13, color: MUTED, fontStyle: 'italic', lineHeight: 18 },
  btnDismissModal: { height: 48, backgroundColor: NAVY, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  btnDismissModalText: { color: WHITE, fontWeight: 'bold', fontSize: 15 },

  // Toast
  toastBanner: { position: 'absolute', top: 50, left: 16, right: 16, backgroundColor: '#10B981', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', zIndex: 1000, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
  toastText: { color: WHITE, fontWeight: 'bold', fontSize: 14 }
});
