import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, Platform, TouchableWithoutFeedback, TextInput, ActivityIndicator
} from 'react-native';
import { Search, Filter, Users, User, RefreshCw, CircleAlert as AlertCircle, MapPin, Star, ShoppingBag, MessageSquare, EllipsisVertical as MoreVertical, FileText, Gift, CircleX as XCircle, Building, Phone, Mail, FileCheck, Package, CreditCard, Clock3, CircleCheck as CheckCircle2, CircleHelp as HelpCircle, X } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorClientsApi, fetchVendorRequirements } from '../../../services/api.service';

const NAVY = '#071B3A';
const GOLD = '#D4AF37';

const CHIPS = ['All', 'Hotel', 'Restaurant', 'Cafe'];

export default function MarketingClientsScreen({ setActivePage }) {
  const { width } = useWindowDimensions();
  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [activeFilter, setActiveFilter] = useState('All');
  const [clients, setClients] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'transactions'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  
  // Profile Modal
  const [selectedClient, setSelectedClient] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Transaction Detail Modal
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnModalVisible, setTxnModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!supplierId) { setLoading(false); return; }
      try {
        const [reqsRes, clientsRes] = await Promise.all([
          fetchVendorRequirements(supplierId),
          fetchVendorClientsApi(supplierId)
        ]);

        const reqsList = reqsRes?.data || reqsRes || [];
        const clientApiList = clientsRes?.data || clientsRes || [];

        setRequirements(Array.isArray(reqsList) ? reqsList : []);

        const clientMap = new Map();

        if (Array.isArray(clientApiList)) {
          clientApiList.forEach(c => {
            if (c.id) clientMap.set(c.id, c);
          });
        }

        if (Array.isArray(reqsList)) {
          reqsList.forEach(r => {
            const bizName = r.owner?.bizName || r.clientName || 'Marketing Client';
            const clientId = r.owner?.id || bizName;
            if (!clientMap.has(clientId)) {
              clientMap.set(clientId, {
                id: clientId,
                name: bizName,
                initials: bizName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase(),
                type: r.owner?.category || 'Restaurant',
                location: r.location || 'Location Specified',
                rating: '5.0',
                activeServices: 1,
                ltv: r.budget ? `₹${Number(r.budget || 0).toLocaleString('en-IN')}` : '₹0',
                outstanding: r.status === 'pending' || r.status === 'in_progress' ? (r.budget ? `₹${Number(r.budget || 0).toLocaleString('en-IN')}` : '₹0') : '₹0',
                tag: 'Active',
                business: bizName,
                city: r.location || 'City',
                phone: r.owner?.phone || 'N/A',
                email: r.owner?.email || 'N/A',
                address: r.location || 'Address Specified',
                reqCount: 1
              });
            } else {
              const existing = clientMap.get(clientId);
              existing.reqCount = (existing.reqCount || 1) + 1;
              existing.activeServices += 1;
              if (existing.reqCount > 1) existing.tag = 'Repeat';
            }
          });
        }

        setClients(Array.from(clientMap.values()));
      } catch (err) {
        console.warn('Error loading marketing client data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [supplierId]);

  const activeJobsCount = requirements.filter(r => r.status === 'in_progress' || r.status === 'pending' || r.status === 'scheduled' || r.status === 'accepted').length;
  const repeatClientsCount = clients.filter(c => (c.reqCount || 0) > 1 || c.tag === 'Repeat').length;
  
  const SUMMARY_DATA = [
    { label: 'Total Clients', value: String(clients.length), icon: Users, color: '#3B82F6' },
    { label: 'Active Projects', value: String(activeJobsCount), icon: User, color: '#10B981' },
    { label: 'Repeat Clients', value: String(repeatClientsCount), icon: RefreshCw, color: '#8B5CF6' },
    { label: 'Outstanding Payments', value: `₹${requirements.reduce((acc, r) => acc + (r.status === 'pending' || r.status === 'in_progress' ? Number(r.budget || 0) : 0), 0).toLocaleString('en-IN')}`, icon: AlertCircle, color: '#EF4444' },
  ];

  const filteredClients = clients.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.type === activeFilter;
    const matchesSearch = !searchQuery.trim() || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.business?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <Text style={styles.menuItemText}>Special Campaign Offer</Text>
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
              <Text style={styles.statLabel}>Active Projects</Text>
              <Text style={styles.statValue}>{item.activeServices} campaign</Text>
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
            <Text style={styles.statLabel}>Deliverables</Text>
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
          {isSearchOpen ? (
            <View style={styles.searchBarHeader}>
              <Search size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInputHeader}
                placeholder="Search clients by name, business, city..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                <X size={20} color={NAVY} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>Clients</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setIsSearchOpen(true)} accessibilityRole="button">
                  <Search size={20} color={NAVY} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Summary Cards Grid (2 cards per row) */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryGrid}>
            {SUMMARY_DATA.map((item, idx) => (
              <View key={idx} style={styles.summaryCard}>
                <View style={styles.summaryCardHeader}>
                  <View style={[styles.summaryIconBox, { backgroundColor: item.color + '15' }]}>
                    <item.icon size={18} color={item.color} />
                  </View>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
                <Text style={styles.summaryLabel} numberOfLines={1}>{item.label}</Text>
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

        {activeTab === 'clients' ? (
          <>
            {/* Filter Chips */}
            <View style={styles.chipsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                {CHIPS.map((chip) => (
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

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={NAVY} />
              </View>
            ) : (
              <FlatList
                data={filteredClients}
                keyExtractor={(item) => item.id}
                renderItem={renderClientCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Users size={48} color="#94A3B8" />
                    <Text style={styles.emptyTitle}>No clients found</Text>
                    <Text style={styles.emptySub}>
                      {searchQuery ? 'Try matching your search parameters.' : 'Your campaign clients will appear here once booked.'}
                    </Text>
                  </View>
                }
              />
            )}
          </>
        ) : (
          <FlatList
            data={[]}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No transaction history</Text>
                <Text style={styles.emptySub}>Past payment receipts and invoices will be listed here.</Text>
              </View>
            }
          />
        )}

        {/* Client Profile Modal */}
        <Modal visible={profileModalVisible} transparent animationType="slide" onRequestClose={() => setProfileModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setProfileModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Client Profile</Text>
                    <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                      <XCircle size={22} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {selectedClient && (
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                      <View style={styles.modalProfileTop}>
                        <View style={styles.modalAvatar}>
                          <Text style={styles.modalAvatarText}>{selectedClient.initials}</Text>
                        </View>
                        <Text style={styles.modalClientName}>{selectedClient.name}</Text>
                        <Text style={styles.modalClientType}>{selectedClient.type} · {selectedClient.city}</Text>
                      </View>

                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Contact Details</Text>
                        <View style={styles.modalDetailRow}>
                          <Phone size={16} color="#64748B" style={styles.modalIcon} />
                          <Text style={styles.modalDetailText}>{selectedClient.phone}</Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                          <Mail size={16} color="#64748B" style={styles.modalIcon} />
                          <Text style={styles.modalDetailText}>{selectedClient.email}</Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                          <MapPin size={16} color="#64748B" style={styles.modalIcon} />
                          <Text style={styles.modalDetailText}>{selectedClient.address}</Text>
                        </View>
                      </View>

                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Relationship Summary</Text>
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridItem}>
                            <Text style={styles.modalGridLabel}>Total Bookings</Text>
                            <Text style={styles.modalGridVal}>{selectedClient.reqCount || 1}</Text>
                          </View>
                          <View style={styles.modalGridItem}>
                            <Text style={styles.modalGridLabel}>Lifetime Value</Text>
                            <Text style={[styles.modalGridVal, { color: NAVY }]}>{selectedClient.ltv}</Text>
                          </View>
                          <View style={styles.modalGridItem}>
                            <Text style={styles.modalGridLabel}>Outstanding</Text>
                            <Text style={[styles.modalGridVal, selectedClient.outstanding !== '₹0' && { color: '#EF4444' }]}>{selectedClient.outstanding}</Text>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Transaction Detail Modal */}
        <Modal visible={txnModalVisible} transparent animationType="fade" onRequestClose={() => setTxnModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setTxnModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContentSmall}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Transaction Detail</Text>
                    <TouchableOpacity onPress={() => setTxnModalVisible(false)}>
                      <XCircle size={22} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {selectedTxn && (
                    <View style={{ padding: 16 }}>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Client:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.client}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Campaign:</Text>
                        <Text style={styles.modalTxnVal}>{selectedTxn.service}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Amount:</Text>
                        <Text style={[styles.modalTxnVal, { fontWeight: 'bold', color: NAVY }]}>{selectedTxn.amount}</Text>
                      </View>
                      <View style={styles.modalTxnDetailRow}>
                        <Text style={styles.modalTxnLabel}>Reference:</Text>
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY },
  headerActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 8 },
  searchBarHeader: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  searchInputHeader: { flex: 1, fontSize: 14, color: NAVY, paddingVertical: 4 },
  
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },

  chipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsScroll: { paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeChip: { backgroundColor: NAVY },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  activeChipText: { color: '#FFFFFF', fontWeight: '600' },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabButtonText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  activeTabButtonText: { color: NAVY, fontWeight: 'bold' },

  listContainer: { padding: 16, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  titleContainer: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  typeText: { fontSize: 12, color: '#64748B', marginLeft: 4 },
  menuIconBtn: { padding: 4 },
  
  floatingMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  menuItemIcon: { marginRight: 10 },
  menuItemText: { fontSize: 13, color: '#334155', fontWeight: '500' },

  cardBody: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#64748B', marginLeft: 6 },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  statValuePrimary: { fontSize: 13, fontWeight: 'bold', color: '#10B981' },

  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 11, fontWeight: '600' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  btnPrimary: {
    backgroundColor: NAVY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  secondaryActions: { flexDirection: 'row', gap: 8 },
  btnIconOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginTop: 16 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4, paddingHorizontal: 32 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 20,
  },
  modalContentSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalBody: { flexShrink: 1 },
  modalProfileTop: { alignItems: 'center', marginBottom: 20 },
  modalAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  modalAvatarText: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  modalClientName: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalClientType: { fontSize: 13, color: '#64748B', marginTop: 2 },
  modalSection: { marginBottom: 20 },
  modalSectionTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 10 },
  modalDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalIcon: { marginRight: 10 },
  modalDetailText: { fontSize: 13, color: '#475569' },
  modalGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12 },
  modalGridItem: { flex: 1, alignItems: 'center' },
  modalGridLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  modalGridVal: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  modalTxnDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTxnLabel: { fontSize: 13, color: '#64748B' },
  modalTxnVal: { fontSize: 13, color: NAVY, fontWeight: '500' },
});
