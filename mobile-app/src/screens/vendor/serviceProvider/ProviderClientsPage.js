import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, Platform, TouchableWithoutFeedback
} from 'react-native';
import {
  Search, Filter, Users, User, RefreshCw, AlertCircle, MapPin, 
  Star, ShoppingBag, MessageSquare, MoreVertical, FileText, Gift, XCircle,
  Building, Phone, Mail, FileCheck, Package, CreditCard, Clock3, CheckCircle2, HelpCircle
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: 'Total Clients', value: '34', icon: Users, color: '#3B82F6' },
  { label: 'Active Jobs', value: '8', icon: User, color: '#10B981' },
  { label: 'Repeat Clients', value: '22', icon: RefreshCw, color: '#8B5CF6' },
  { label: 'Outstanding Payments', value: '₹42K', icon: AlertCircle, color: '#EF4444' },
];

const CHIPS = ['All', 'Hotel', 'Restaurant', 'Cafe'];

const MOCK_CLIENTS = [
  {
    id: "CLI-SP-001", name: "The Meridian Grand", initials: "MG", type: "Hotel", location: "Downtown, Metro City",
    rating: "4.8", activeServices: 3, ltv: "₹14.2L", outstanding: "₹15,000", tag: "VIP"
  },
  {
    id: "CLI-SP-002", name: "Café Zephyr", initials: "CZ", type: "Cafe", location: "Westside Hub",
    rating: "4.7", activeServices: 1, ltv: "₹3.8L", outstanding: "₹0", tag: "Regular"
  },
  {
    id: "CLI-SP-003", name: "Azure Palace Hotel", initials: "AP", type: "Hotel", location: "Azure Coast",
    rating: "4.5", activeServices: 2, ltv: "₹8.9L", outstanding: "₹27,000", tag: "Regular"
  }
];

const TRANSACTIONS = [
  {
    id: "TXN-SP-601",
    client: "The Meridian Grand",
    service: "Deep Kitchen Cleaning",
    quantity: "Full property",
    amount: "₹8,500",
    date: "24 Jul 2026, 11:30 AM",
    status: "Paid",
    method: "Bank Transfer",
    reference: "ref-trf-991122"
  },
  {
    id: "TXN-SP-602",
    client: "Azure Palace Hotel",
    service: "AC Maintenance",
    quantity: "15 Units",
    amount: "₹6,000",
    date: "23 Jul 2026, 02:00 PM",
    status: "Pending",
    method: "Net Banking",
    reference: "ref-bank-882233"
  },
  {
    id: "TXN-SP-603",
    client: "Café Zephyr",
    service: "Pest Control & Sanitization",
    quantity: "1 property",
    amount: "₹4,200",
    date: "22 Jul 2026, 10:15 AM",
    status: "Paid",
    method: "UPI",
    reference: "ref-upi-445588"
  },
  {
    id: "TXN-SP-604",
    client: "Spice Route Restaurant",
    service: "Exhaust System Repair",
    quantity: "Main kitchen",
    amount: "₹12,400",
    date: "21 Jul 2026, 04:30 PM",
    status: "Overdue",
    method: "Cash",
    reference: "ref-cash-77331"
  }
];

export default function ProviderClientsPage() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('All');
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'transactions'
  
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  
  // Profile Modal
  const [selectedClient, setSelectedClient] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Transaction Detail Modal
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnModalVisible, setTxnModalVisible] = useState(false);

  const filteredClients = activeFilter === 'All' 
    ? clients 
    : clients.filter(c => c.type === activeFilter);

  const getTagColor = (tag) => {
    switch (tag) {
      case 'VIP': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'New': return { bg: '#DBEAFE', text: '#3B82F6' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const openProfile = (client) => {
    setSelectedClient(client);
    setProfileModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle2 };
      case 'Pending': return { bg: '#EFF6FF', text: '#2563EB', icon: Clock3 };
      case 'Overdue': return { bg: '#FEE2E2', text: '#EF4444', icon: AlertCircle };
      default: return { bg: '#F1F5F9', text: '#475569', icon: HelpCircle };
    }
  };

  const renderClientCard = ({ item }) => {
    const tagColors = getTagColor(item.tag);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => openProfile(item)}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.clientName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.typeRow}>
                <Building size={12} color="#64748B" />
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.menuIconBtn}
            onPress={() => setMenuVisibleId(menuVisibleId === item.id ? null : item.id)}
          >
            <MoreVertical size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Floating Menu */}
        {menuVisibleId === item.id && (
          <View style={styles.floatingMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Gift size={16} color="#475569" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Special Service Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <FileText size={16} color="#475569" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Export statements</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Body */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Star size={14} color="#F59E0B" />
            <Text style={styles.infoText}>{item.rating} Rating</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Active Work</Text>
              <Text style={styles.statValue}>{item.activeServices} services</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>LTV</Text>
              <Text style={styles.statValuePrimary}>{item.ltv}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Outstanding</Text>
              <Text style={[styles.statValue, item.outstanding !== "₹0" && {color: '#EF4444'}]}>{item.outstanding}</Text>
            </View>
          </View>

          <View style={[styles.tagBadge, { backgroundColor: tagColors.bg }]}>
            <Text style={[styles.tagText, { color: tagColors.text }]}>{item.tag}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => openProfile(item)}>
            <Text style={styles.btnPrimaryText}>View Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.btnIconOutline}>
              <ShoppingBag size={18} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnIconOutline}>
              <MessageSquare size={18} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionCard = ({ item }) => {
    const statusConfig = getStatusColor(item.status);
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedTxn(item);
          setTxnModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.client.split(' ').map(n=>n[0]).join('')}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.clientName} numberOfLines={1}>{item.client}</Text>
              <Text style={styles.typeText}>{item.id} • {item.service}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <StatusIcon size={12} color={statusConfig.text} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Coverage/Units</Text>
            <Text style={styles.statValuePrimary}>{item.quantity}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Charge</Text>
            <Text style={styles.statValue}>{item.amount}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Payment</Text>
            <Text style={styles.statValue}>{item.method}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <FileText size={14} color="#64748B" />
          <Text style={styles.infoText}>Ref: {item.reference}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Clients</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
            {SUMMARY_DATA.map((item, idx) => (
              <View key={idx} style={styles.summaryCard}>
                <View style={[styles.summaryIconBox, { backgroundColor: item.color + '15' }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'clients' && styles.activeTabButton]}
            onPress={() => setActiveTab('clients')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'clients' && styles.activeTabButtonText]}>All Clients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'transactions' && styles.activeTabButton]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'transactions' && styles.activeTabButtonText]}>Transaction History</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'clients' ? (
          <>
            {/* Filter Chips */}
            <View style={styles.chipsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                {CHIPS.map(chip => (
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
              data={filteredClients}
              keyExtractor={item => item.id}
              renderItem={renderClientCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Users size={48} color="#CBD5E1" />
                  <Text style={styles.emptyText}>No clients found.</Text>
                </View>
              }
            />
          </>
        ) : (
          /* Transaction List */
          <FlatList
            data={TRANSACTIONS}
            keyExtractor={item => item.id}
            renderItem={renderTransactionCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <CreditCard size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No transactions found.</Text>
              </View>
            }
          />
        )}

        {/* Client Profile Modal */}
        <Modal visible={profileModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Client Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedClient && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                
                {/* Header Info */}
                <View style={styles.profileHeaderBox}>
                  <View style={styles.avatarLarge}>
                    <Text style={styles.avatarLargeText}>{selectedClient.initials}</Text>
                  </View>
                  <Text style={styles.profileName}>{selectedClient.name}</Text>
                  <Text style={styles.profileType}>{selectedClient.type} • {selectedClient.location}</Text>
                  <View style={[styles.tagBadge, { backgroundColor: getTagColor(selectedClient.tag).bg, alignSelf: 'center', marginTop: 8 }]}>
                    <Text style={[styles.tagText, { color: getTagColor(selectedClient.tag).text }]}>{selectedClient.tag}</Text>
                  </View>
                </View>

                {/* Contacts */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Contacts</Text>
                  <View style={styles.contactRow}>
                    <Phone size={16} color="#64748B" />
                    <Text style={styles.contactText}>+91 98765 43210 (Manager)</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Mail size={16} color="#64748B" />
                    <Text style={styles.contactText}>ops@{selectedClient.name.toLowerCase().replace(/\s/g, '')}.com</Text>
                  </View>
                </View>

                {/* Placements Summary */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Services History</Text>
                  <View style={styles.historyGrid}>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>Active Work</Text>
                      <Text style={styles.historyVal}>{selectedClient.activeServices} services</Text>
                    </View>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>Last Job</Text>
                      <Text style={styles.historyVal}>16 Jul 2026</Text>
                    </View>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>LTV</Text>
                      <Text style={styles.historyVal}>{selectedClient.ltv}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.linkBtn}>
                    <Text style={styles.linkText}>View Service Orders</Text>
                  </TouchableOpacity>
                </View>

                {/* Frequent Placements */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Frequently Requested Services</Text>
                  <View style={styles.freqItem}>
                    <Package size={16} color="#64748B" />
                    <Text style={styles.freqText}>Deep Kitchen Cleaning</Text>
                    <Text style={styles.freqQty}>75% of services</Text>
                  </View>
                  <View style={styles.freqItem}>
                    <Package size={16} color="#64748B" />
                    <Text style={styles.freqText}>Pest Control & Sanitization</Text>
                    <Text style={styles.freqQty}>30% of services</Text>
                  </View>
                </View>

                {/* Payments & Invoices */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Payments & Invoices</Text>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Outstanding Amount</Text>
                    <Text style={[styles.paymentVal, selectedClient.outstanding !== "₹0" && {color: '#EF4444'}]}>{selectedClient.outstanding}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Terms</Text>
                    <Text style={styles.paymentValText}>Net 15</Text>
                  </View>
                </View>

                <View style={{height: 40}} />
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>

        {/* Transaction Detail Modal */}
        <Modal visible={txnModalVisible} animationType="slide" transparent={true}>
          <TouchableWithoutFeedback onPress={() => setTxnModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContentSmall}>
                  <View style={styles.modalHeaderSmall}>
                    <Text style={styles.modalTitleSmall}>Transaction Details</Text>
                    <TouchableOpacity onPress={() => setTxnModalVisible(false)}>
                      <XCircle size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  {selectedTxn && (
                    <View style={styles.modalBodySmall}>
                      <Text style={styles.modalTxnId}>{selectedTxn.id}</Text>
                      <Text style={styles.modalTxnClient}>{selectedTxn.client}</Text>
                      
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Service Category:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.service}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Coverage/Units:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.quantity}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Billing Amount:</Text>
                        <Text style={[styles.modalTxnVal, {color: '#10B981', fontWeight: 'bold'}]}>{selectedTxn.amount}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Date & Time:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.date}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Payment Method:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.method}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Reference ID:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.reference}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Status:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.status}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryScroll: { paddingHorizontal: 16 },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryIconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  summaryLabel: { fontSize: 13, color: '#64748B' },
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsScroll: { paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8,
  },
  activeChip: { backgroundColor: NAVY },
  chipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeChipText: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 80 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontSize: 15 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', flex: 1 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: NAVY,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { color: GOLD, fontWeight: 'bold', fontSize: 16 },
  titleContainer: { flex: 1, justifyContent: 'center' },
  clientName: { fontSize: 16, fontWeight: '600', color: NAVY, marginBottom: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center' },
  typeText: { fontSize: 12, color: '#64748B', marginLeft: 4 },
  menuIconBtn: { padding: 4 },
  floatingMenu: {
    position: 'absolute', top: 40, right: 16, backgroundColor: '#FFFFFF',
    borderRadius: 8, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 10, minWidth: 180,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  menuItemIcon: { marginRight: 8 },
  menuItemText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  cardBody: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#475569', marginLeft: 8 },
  statsGrid: {
    flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 8,
    padding: 12, marginVertical: 12,
  },
  statCol: { flex: 1 },
  statLabel: { fontSize: 10, color: '#64748B', marginBottom: 4 },
  statValuePrimary: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  statValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  tagBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start',
  },
  tagText: { fontSize: 11, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  btnPrimary: {
    flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginRight: 8,
  },
  btnPrimaryText: { color: NAVY, fontWeight: '600', fontSize: 14 },
  secondaryActions: { flexDirection: 'row' },
  btnIconOutline: {
    width: 44, height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },
  
  // Profile Modal
  modalSafeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 16 },
  profileHeaderBox: {
    alignItems: 'center', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12,
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: NAVY,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarLargeText: { color: GOLD, fontSize: 28, fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  profileType: { fontSize: 14, color: '#64748B' },
  sectionCard: {
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  contactText: { marginLeft: 12, fontSize: 14, color: '#334155' },
  historyGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 12 },
  historyCol: { flex: 1 },
  historyLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  historyVal: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  linkBtn: { paddingVertical: 8, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 4 },
  linkText: { color: '#3B82F6', fontWeight: '500', fontSize: 14 },
  freqItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  freqText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#334155' },
  freqQty: { fontSize: 12, color: '#64748B' },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  paymentLabel: { fontSize: 14, color: '#475569' },
  paymentVal: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  paymentValText: { fontSize: 14, fontWeight: '600', color: NAVY },

  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginHorizontal: 16, marginBottom: 12, maxWidth: 400 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabButtonText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeTabButtonText: { color: NAVY, fontWeight: 'bold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContentSmall: { width: '90%', maxWidth: 450, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  modalHeaderSmall: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitleSmall: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBodySmall: { gap: 12 },
  modalTxnId: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  modalTxnClient: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  modalTxnDetailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 8 },
  modalTxnLabel: { fontSize: 13, color: '#64748B' },
  modalTxnVal: { fontSize: 13, color: NAVY, fontWeight: '500' },
});
