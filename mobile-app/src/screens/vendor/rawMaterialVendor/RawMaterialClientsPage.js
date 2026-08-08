import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, TouchableWithoutFeedback
} from 'react-native';
import { 
  Search, Filter, Users, User, RefreshCw, CircleAlert as AlertCircle, 
  MapPin, Star, EllipsisVertical as MoreVertical, FileText, Gift, 
  CircleX as XCircle, Building, Phone, Mail, Package, CreditCard, 
  Clock3, CircleCheck as CheckCircle2, CircleHelp as HelpCircle, ChevronRight, X
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorOrders } from '../../../services/api.service';

const COLORS = {
  primaryNavy: '#071B3A',
  secondaryNavy: '#102A4C',
  gold: '#F2C230',
  orange: '#F59E0B',
  bg: '#F6F8FB',
  white: '#FFFFFF',
  border: '#E3E9F1',
  primaryText: '#091B3A',
  secondaryText: '#71829B',
  success: '#16B77A',
  blue: '#3B82F6',
  purple: '#7C5CFC',
  error: '#EF4444',
};

const CHIPS = ['All', 'Hotel', 'Restaurant', 'Cafe'];

// Transactions are derived from real orders — no hardcoded data
const TRANSACTIONS = [];

export default function RawMaterialClientsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useContext(AuthContext);
  const supplierId = user?.id;

  const [activeFilter, setActiveFilter] = useState('All');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load clients by deriving unique owners from vendor orders
  useEffect(() => {
    const load = async () => {
      if (!supplierId) { setLoading(false); return; }
      try {
        const res = await fetchVendorOrders(supplierId);
        if (res?.success) {
          const seen = new Set();
          const derived = [];
          for (const o of (res.data || [])) {
            const owner = o.owner;
            if (owner && !seen.has(owner.id)) {
              seen.add(owner.id);
              const ownerOrders = (res.data || []).filter(x => x.owner?.id === owner.id);
              const totalSpendNum = ownerOrders.reduce((s, x) => s + parseFloat(x.totalAmount || 0), 0);
              derived.push({
                id: owner.id,
                name: owner.bizName || owner.ownerName || 'Client',
                initials: (owner.bizName || owner.ownerName || 'C').slice(0, 2).toUpperCase(),
                type: owner.businessType || 'Hotel',
                location: owner.city || owner.address || 'Pune',
                address: owner.address || '—',
                phone: owner.mobile || '—',
                email: owner.email || '—',
                tag: ownerOrders.length > 3 ? 'VIP' : ownerOrders.length > 1 ? 'Repeat Client' : 'Active',
                orders: ownerOrders.length,
                totalSpend: `₹${totalSpendNum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
                outstanding: '₹0',
                lastOrder: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
                rating: 4.5,
              });
            }
          }
          setClients(derived);
        }
      } catch (e) {
        console.error('RawMaterialClientsPage: load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [supplierId]);

  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnModalVisible, setTxnModalVisible] = useState(false);

  const filteredClients = clients.filter(c => {
    const matchType = activeFilter === 'All' || c.type === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.location && c.location.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  const getTagColor = (tag) => {
    switch (tag) {
      case 'VIP': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'Repeat Client': return { bg: '#F3EFEF', text: COLORS.purple };
      case 'Active': return { bg: '#E8F8F1', text: COLORS.success };
      default: return { bg: '#E9EEF5', text: COLORS.secondaryText };
    }
  };

  const openProfile = (client) => {
    setSelectedClient(client);
    setProfileModalVisible(true);
  };

  const renderClientCard = ({ item }) => {
    const tagColors = getTagColor(item.tag);

    return (
      <TouchableOpacity 
        style={styles.clientCard} 
        activeOpacity={0.88} 
        onPress={() => openProfile(item)}
      >
        {/* Card Header: Avatar + Meta + Action Menu */}
        <View style={styles.clientCardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View style={styles.clientMeta}>
            <Text style={styles.clientName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.clientSubText} numberOfLines={1}>{item.type} · {item.location}</Text>
          </View>
          <TouchableOpacity 
            style={styles.moreBtn}
            onPress={(e) => {
              e.stopPropagation();
              setMenuVisibleId(menuVisibleId === item.id ? null : item.id);
            }}
          >
            <MoreVertical size={18} color={COLORS.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Action Menu overlay */}
        {menuVisibleId === item.id && (
          <View style={styles.floatingMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisibleId(null)}>
              <FileText size={14} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
              <Text style={styles.menuItemText}>Download Statement</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Metrics Row */}
        <View style={styles.clientMetricsRow}>
          <View style={styles.ratingBadge}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 3 }} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.dotSeparator}>·</Text>
          <Text style={styles.metricStat}>{item.orders} Orders</Text>
          {item.totalSpend && item.totalSpend !== '₹0' && (
            <>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.metricSpend}>{item.totalSpend} Total</Text>
            </>
          )}
          {item.outstanding && item.outstanding !== '₹0' && (
            <View style={styles.outstandingBadge}>
              <Text style={styles.outstandingText}>Due {item.outstanding}</Text>
            </View>
          )}
        </View>

        {/* Bottom Row */}
        <View style={styles.clientCardBottom}>
          <Text style={styles.lastOrderText}>
            {item.lastOrder !== '—' ? `Last Order: ${item.lastOrder}` : 'No orders yet'}
          </Text>
          <View style={styles.viewActionBtn}>
            <Text style={styles.viewActionText}>View Client</Text>
            <ChevronRight size={14} color={COLORS.primaryNavy} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return { bg: '#E8F8F1', text: COLORS.success, icon: CheckCircle2 };
      case 'Pending': return { bg: '#EFF6FF', text: COLORS.blue, icon: Clock3 };
      case 'Overdue': return { bg: '#FEF2F2', text: COLORS.error, icon: AlertCircle };
      default: return { bg: '#E9EEF5', text: COLORS.secondaryText, icon: HelpCircle };
    }
  };

  const renderTransactionCard = ({ item }) => {
    const statusConfig = getStatusColor(item.status);
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity 
        style={styles.txnCard}
        activeOpacity={0.85}
        onPress={() => {
          setSelectedTxn(item);
          setTxnModalVisible(true);
        }}
      >
        <View style={styles.txnTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.txnClientName} numberOfLines={1}>{item.client}</Text>
            <Text style={styles.txnSubText}>{item.id} · {item.product}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <StatusIcon size={12} color={statusConfig.text} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.txnBottom}>
          <Text style={styles.txnAmount}>{item.amount}</Text>
          <Text style={styles.txnDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const activeCount = clients.filter(c => (c.orders || 0) > 0).length;
  const repeatCount = clients.filter(c => (c.orders || 0) > 1).length;

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Search Input Bar (Toggled via search icon) */}
      {showSearch && (
        <View style={styles.searchBarBox}>
          <Search size={16} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients by name or city"
            placeholderTextColor={COLORS.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Summary Cards Grid (2x2 Compact Grid) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryGrid}>
          {[
            { label: 'Total Clients', value: String(clients.length), icon: Users, color: COLORS.blue, bg: '#EFF6FF' },
            { label: 'Active', value: String(activeCount), icon: User, color: COLORS.success, bg: '#E8F8F1' },
            { label: 'Repeat', value: String(repeatCount), icon: RefreshCw, color: COLORS.purple, bg: '#F3EFEF' },
            { label: 'Outstanding', value: '₹0', icon: AlertCircle, color: COLORS.error, bg: '#FEF2F2' },
          ].map((item, idx) => (
            <View 
              key={idx} 
              style={[
                styles.summaryCard, 
                isMobile ? styles.summaryCardMobile : styles.summaryCardDesktop
              ]}
            >
              <View style={styles.summaryCardTop}>
                <View style={[styles.summaryIconBox, { backgroundColor: item.bg }]}>
                  <item.icon size={18} color={item.color} />
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
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

      {/* Filter Chips */}
      {activeTab === 'clients' && (
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
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Top App Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Clients</Text>
        </View>

        {activeTab === 'clients' ? (
          <FlatList
            data={filteredClients}
            keyExtractor={item => item.id}
            renderItem={renderClientCard}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Users size={40} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No clients yet</Text>
                <Text style={styles.emptySubtitle}>Customers who place orders with you will appear here.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={TRANSACTIONS}
            keyExtractor={item => item.id}
            renderItem={renderTransactionCard}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <CreditCard size={40} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No transactions found</Text>
                <Text style={styles.emptySubtitle}>Your completed transaction records will appear here.</Text>
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
                <XCircle size={24} color={COLORS.secondaryText} />
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
                    <Phone size={16} color={COLORS.secondaryText} />
                    <Text style={styles.contactText}>+91 {selectedClient.phone || '98765 43210'}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Mail size={16} color={COLORS.secondaryText} />
                    <Text style={styles.contactText}>{selectedClient.email || `orders@${selectedClient.name.toLowerCase().replace(/\s/g, '')}.com`}</Text>
                  </View>
                </View>

                {/* Orders Summary */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Order History</Text>
                  <View style={styles.historyGrid}>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>Total Orders</Text>
                      <Text style={styles.historyVal}>{selectedClient.orders}</Text>
                    </View>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>Last Order</Text>
                      <Text style={styles.historyVal}>{selectedClient.lastOrder}</Text>
                    </View>
                    <View style={styles.historyCol}>
                      <Text style={styles.historyLabel}>Total Spend</Text>
                      <Text style={styles.historyVal}>{selectedClient.totalSpend}</Text>
                    </View>
                  </View>
                </View>

                {/* Payments & Invoices */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Payments & Invoices</Text>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Outstanding Amount</Text>
                    <Text style={[styles.paymentVal, selectedClient.outstanding !== "₹0" && {color: COLORS.error}]}>{selectedClient.outstanding}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Terms</Text>
                    <Text style={styles.paymentValText}>Net 30</Text>
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
                      <XCircle size={20} color={COLORS.secondaryText} />
                    </TouchableOpacity>
                  </View>
                  {selectedTxn && (
                    <View style={styles.modalBodySmall}>
                      <Text style={styles.modalTxnId}>{selectedTxn.id}</Text>
                      <Text style={styles.modalTxnClient}>{selectedTxn.client}</Text>
                      
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Product:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.product}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Total Amount:</Text>
                        <Text style={[styles.modalTxnVal, {color: COLORS.success, fontWeight: 'bold'}]}>{selectedTxn.amount}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Date & Time:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.date}</Text>
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
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  
  // Page Header
  header: { 
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primaryNavy },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { 
    padding: 8, 
    marginLeft: 8, 
    borderRadius: 8, 
    backgroundColor: '#F1F5F9' 
  },
  activeIconBtn: { backgroundColor: '#E2E8F0' },
  
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primaryText,
    padding: 0,
  },

  listHeader: { marginBottom: 4 },

  // Summary Cards (2x2 Compact Grid, Height ~90px)
  summaryContainer: {
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    minHeight: 90,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryCardMobile: {
    width: '48.5%',
  },
  summaryCardDesktop: {
    width: '23.5%',
  },
  summaryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: { fontSize: 22, fontWeight: '700', color: COLORS.primaryNavy },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: COLORS.secondaryText },

  // Tab Switcher (Compact Height ~44px)
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E9EEF5', 
    padding: 4, 
    borderRadius: 12, 
    marginBottom: 12, 
    maxWidth: 400 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 9, 
    alignItems: 'center', 
    borderRadius: 9 
  },
  activeTabButton: { 
    backgroundColor: COLORS.white, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  tabButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.secondaryText },
  activeTabButtonText: { color: COLORS.primaryNavy, fontWeight: '700' },

  // Client Type Filter Chips
  chipsContainer: {
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  chipsScroll: { gap: 8 },
  chip: {
    paddingHorizontal: 15, 
    paddingVertical: 7,
    borderRadius: 18, 
    backgroundColor: '#E9EEF5',
  },
  activeChip: { backgroundColor: COLORS.primaryNavy },
  chipText: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '600' },
  activeChipText: { color: COLORS.white },

  // Client List Content
  listContent: { 
    paddingHorizontal: 18, 
    paddingTop: 14, 
    paddingBottom: 140 
  },

  // Compact Client Card (Height ~115px)
  clientCard: {
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 14,
    marginBottom: 11, 
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, 
    shadowRadius: 4, 
    elevation: 1,
  },
  clientCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: COLORS.primaryNavy,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
  },
  avatarText: { color: COLORS.gold, fontWeight: '700', fontSize: 15 },
  clientMeta: { flex: 1, justifyContent: 'center' },
  clientName: { fontSize: 15, fontWeight: '700', color: COLORS.primaryText, marginBottom: 2 },
  clientSubText: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '500' },
  moreBtn: { padding: 4 },
  
  floatingMenu: {
    position: 'absolute', top: 44, right: 14, backgroundColor: COLORS.white,
    borderRadius: 10, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 5, zIndex: 20, minWidth: 170,
    borderWidth: 1, borderColor: COLORS.border,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10 },
  menuItemText: { fontSize: 13, color: COLORS.primaryText, fontWeight: '500' },

  clientMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '700', color: COLORS.primaryText },
  dotSeparator: { fontSize: 12, color: '#CBD5E1', marginHorizontal: 6 },
  metricStat: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '500' },
  metricSpend: { fontSize: 12, fontWeight: '700', color: COLORS.primaryNavy },
  outstandingBadge: { marginLeft: 'auto', backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  outstandingText: { fontSize: 11, fontWeight: '700', color: COLORS.error },

  clientCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastOrderText: { fontSize: 11, color: COLORS.secondaryText, fontWeight: '500' },
  viewActionBtn: { flexDirection: 'row', alignItems: 'center' },
  viewActionText: { fontSize: 12, fontWeight: '700', color: COLORS.primaryNavy },

  // Transaction History Card
  txnCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  txnTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  txnClientName: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText },
  txnSubText: { fontSize: 11, color: COLORS.secondaryText, marginTop: 1 },
  txnBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txnAmount: { fontSize: 14, fontWeight: '700', color: COLORS.success },
  txnDate: { fontSize: 11, color: COLORS.secondaryText },

  // Badges
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '700' },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: '700', color: COLORS.primaryNavy },
  emptySubtitle: { marginTop: 4, fontSize: 13, color: COLORS.secondaryText, textAlign: 'center', maxWidth: 260 },

  // Profile Modal
  modalSafeArea: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primaryNavy },
  modalBody: { padding: 16 },
  profileHeaderBox: {
    alignItems: 'center', backgroundColor: COLORS.white, padding: 20, borderRadius: 16,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryNavy,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  avatarLargeText: { color: COLORS.gold, fontSize: 26, fontWeight: '700' },
  profileName: { fontSize: 19, fontWeight: '700', color: COLORS.primaryNavy, marginBottom: 2 },
  profileType: { fontSize: 13, color: COLORS.secondaryText },
  sectionCard: {
    backgroundColor: COLORS.white, padding: 14, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.secondaryText, textTransform: 'uppercase', marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  contactText: { marginLeft: 10, fontSize: 13, color: COLORS.primaryText },
  historyGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10, marginBottom: 8 },
  historyCol: { flex: 1 },
  historyLabel: { fontSize: 11, color: COLORS.secondaryText, marginBottom: 2 },
  historyVal: { fontSize: 13, fontWeight: '700', color: COLORS.primaryNavy },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  paymentLabel: { fontSize: 13, color: COLORS.secondaryText },
  paymentVal: { fontSize: 13, fontWeight: '700', color: COLORS.primaryNavy },
  paymentValText: { fontSize: 13, color: COLORS.primaryText, fontWeight: '500' },

  // Transaction Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContentSmall: { width: '90%', maxWidth: 420, backgroundColor: COLORS.white, borderRadius: 16, padding: 18 },
  modalHeaderSmall: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitleSmall: { fontSize: 16, fontWeight: '700', color: COLORS.primaryNavy },
  modalBodySmall: { gap: 10 },
  modalTxnId: { fontSize: 11, fontWeight: '700', color: COLORS.secondaryText, textTransform: 'uppercase' },
  modalTxnClient: { fontSize: 17, fontWeight: '700', color: COLORS.primaryNavy, marginBottom: 6 },
  modalTxnDetailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 6 },
  modalTxnLabel: { fontSize: 13, color: COLORS.secondaryText },
  modalTxnVal: { fontSize: 13, color: COLORS.primaryNavy, fontWeight: '500' },
});
