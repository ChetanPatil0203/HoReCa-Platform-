import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, Platform, TouchableWithoutFeedback, TextInput, ActivityIndicator
} from 'react-native';
import {
  Users, UserCheck, Repeat, CreditCard, Search, RefreshCw, ChevronRight, X,
  Building2, Phone, Mail, Calendar, CheckCircle2, Clock, AlertCircle, ArrowUpRight,
  User, Briefcase, DollarSign, Filter, Layers, FileText
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorRequirements, fetchVendorCandidatesApi, fetchVendorClientsApi } from '../../../services/api.service';

const NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG = '#F5F7FA';
const CARD_BG = '#FFFFFF';
const BORDER = '#E3E9F1';
const TEXT_MAIN = '#091B3A';
const TEXT_MUTED = '#71829B';
const SUCCESS = '#16B77A';
const WARNING = '#F59E0B';
const ERROR = '#EF4444';
const INFO = '#3B82F6';

const SEEDED_CLIENTS = [
  {
    id: 'CLI-101',
    initials: 'MC',
    name: 'Meridian Cafe',
    owner: 'Chetan Patil',
    type: 'Cafe',
    city: 'Jalgaon',
    activeStaff: 4,
    totalHires: 12,
    outstanding: 18000,
    lastActivity: 'Candidate Joined',
    lastActivityTime: 'Today · 10:30 AM',
    status: 'Active',
    clientSince: '15 Jan 2026',
    phone: '+91 98765 43210',
    email: 'ops@meridiancafe.com',
    deployments: [
      { id: 'DEP-101', role: 'Head Chef', candidate: 'Ramesh Pawar', joiningDate: '28 Jul 2026', status: 'Active' },
      { id: 'DEP-102', role: 'Mixologist', candidate: 'Vikram Shinde', joiningDate: '20 Jul 2026', status: 'Active' },
      { id: 'DEP-103', role: 'Commis Chef', candidate: 'Sunil Jadhav', joiningDate: '15 Jun 2026', status: 'Active' }
    ],
    transactions: [
      { id: 'TXN-8801', requirement: 'Head Chef Hiring', amount: 35000, date: '28 Jul 2026', status: 'Paid' },
      { id: 'TXN-8802', requirement: 'Mixologist Hiring', amount: 18000, date: '20 Jul 2026', status: 'Pending' }
    ]
  },
  {
    id: 'CLI-102',
    initials: 'RH',
    name: 'Royal Palace Hotel',
    owner: 'Vikramaditya Rao',
    type: 'Hotel',
    city: 'Nashik',
    activeStaff: 3,
    totalHires: 8,
    outstanding: 24000,
    lastActivity: 'Payment Due',
    lastActivityTime: '26 Jul 2026',
    status: 'Payment Due',
    clientSince: '01 Mar 2026',
    phone: '+91 99221 88334',
    email: 'hr@royalpalacenashik.com',
    deployments: [
      { id: 'DEP-201', role: 'F&B Manager', candidate: 'Amit Deshmukh', joiningDate: '22 Jul 2026', status: 'Active' },
      { id: 'DEP-202', role: 'Housekeeping Supervisor', candidate: 'Kiran Kulkarni', joiningDate: '10 Jun 2026', status: 'Active' }
    ],
    transactions: [
      { id: 'TXN-8803', requirement: 'F&B Manager Deployment', amount: 24000, date: '22 Jul 2026', status: 'Pending' }
    ]
  },
  {
    id: 'CLI-103',
    initials: 'GB',
    name: 'Grand Spice Restaurant',
    owner: 'Sanjay Deshmukh',
    type: 'Restaurant',
    city: 'Pune',
    activeStaff: 1,
    totalHires: 5,
    outstanding: 0,
    lastActivity: 'Payment Received',
    lastActivityTime: '25 Jul 2026',
    status: 'Active',
    clientSince: '10 Feb 2026',
    phone: '+91 98230 11445',
    email: 'contact@grandspicepune.com',
    deployments: [
      { id: 'DEP-301', role: 'Tandoor Master', candidate: 'Rajesh Sharma', joiningDate: '18 Jul 2026', status: 'Active' }
    ],
    transactions: [
      { id: 'TXN-8804', requirement: 'Tandoor Specialist Placement', amount: 28000, date: '18 Jul 2026', status: 'Paid' }
    ]
  }
];

export default function ManpowerClientsPage({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const { user } = useContext(AuthContext);
  const supplierId = user?.registration?.id || user?.id;

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState(SEEDED_CLIENTS);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'transactions'
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transaction filter
  const [txnFilter, setTxnFilter] = useState('All');

  // Detail Drawer / Modal
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview', 'deployments', 'transactions'

  // Selected Transaction Modal
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnModalVisible, setTxnModalVisible] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, candRes, clientRes] = await Promise.all([
        fetchVendorRequirements(supplierId || 'all'),
        fetchVendorCandidatesApi(supplierId || 'all'),
        fetchVendorClientsApi(supplierId || 'all')
      ]);

      const reqs = reqRes?.data || reqRes || [];
      const backendClients = clientRes?.data || clientRes || [];

      if (Array.isArray(backendClients) && backendClients.length > 0) {
        setClients(backendClients);
      } else if (Array.isArray(reqs) && reqs.length > 0) {
        const clientMap = {};
        reqs.forEach((r, idx) => {
          const bizName = r.businessName || 'Chetan Cafe';
          if (!clientMap[bizName]) {
            const initials = bizName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CC';
            clientMap[bizName] = {
              id: `CLI-10${idx + 1}`,
              initials,
              name: bizName,
              owner: r.contactPerson || 'Chetan Patil',
              type: r.businessType || (bizName.toLowerCase().includes('hotel') ? 'Hotel' : bizName.toLowerCase().includes('restaurant') ? 'Restaurant' : 'Cafe'),
              city: r.location || 'Jalgaon',
              activeStaff: r.count || 1,
              totalHires: (r.count || 1) + 2,
              outstanding: r.status === 'candidates_sent' ? 15000 : 0,
              lastActivity: r.status === 'candidates_sent' ? 'Candidates Sent' : 'New Requirement',
              lastActivityTime: 'Today · 10:30 AM',
              status: r.status === 'candidates_sent' ? 'Payment Due' : 'Active',
              clientSince: '2026',
              phone: r.phone || '+91 98765 43210',
              email: `info@${bizName.toLowerCase().replace(/\s+/g, '')}.com`,
              deployments: [
                { id: `DEP-${idx}01`, role: r.role || 'Head Chef', candidate: 'Ramesh Pawar', joiningDate: '28 Jul 2026', status: 'Active' }
              ],
              transactions: [
                { id: `TXN-${idx}901`, requirement: `${r.role || 'Chef'} Hiring`, amount: 15000, date: '28 Jul 2026', status: r.status === 'candidates_sent' ? 'Pending' : 'Paid' }
              ]
            };
          }
        });
        const dynamicClients = Object.values(clientMap);
        if (dynamicClients.length > 0) setClients(dynamicClients);
      }
    } catch (err) {
      console.warn('Load clients note:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supplierId]);

  // Compute metrics
  const totalClients = clients.length;
  const activeDeployments = clients.reduce((acc, c) => acc + (c.activeStaff || 0), 0);
  const repeatPartners = clients.filter(c => (c.totalHires || 0) > 1).length;
  const totalOutstanding = clients.reduce((acc, c) => acc + (c.outstanding || 0), 0);

  // Compute counts per type
  const countHotel = clients.filter(c => c.type === 'Hotel').length;
  const countRestaurant = clients.filter(c => c.type === 'Restaurant').length;
  const countCafe = clients.filter(c => c.type === 'Cafe').length;

  // Filtered clients list
  const filteredClients = clients.filter(c => {
    const matchType = activeTypeFilter === 'All' || c.type === activeTypeFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchType;
    const matchName = (c.name || '').toLowerCase().includes(q);
    const matchOwner = (c.owner || '').toLowerCase().includes(q);
    const matchCity = (c.city || '').toLowerCase().includes(q);
    const matchId = (c.id || '').toLowerCase().includes(q);
    return matchType && (matchName || matchOwner || matchCity || matchId);
  });

  // Extract all transactions
  const allTransactions = clients.flatMap(c => 
    (c.transactions || []).map(t => ({
      ...t,
      clientName: c.name,
      clientId: c.id,
      city: c.city
    }))
  );

  const filteredTransactions = allTransactions.filter(t => {
    const matchStatus = txnFilter === 'All' || t.status === txnFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchStatus;
    const matchTxnId = (t.id || '').toLowerCase().includes(q);
    const matchClient = (t.clientName || '').toLowerCase().includes(q);
    const matchReq = (t.requirement || '').toLowerCase().includes(q);
    return matchStatus && (matchTxnId || matchClient || matchReq);
  });

  const openClientDetail = (client) => {
    setSelectedClient(client);
    setDetailTab('overview');
    setDetailModalVisible(true);
  };

  const openTxnDetail = (txn) => {
    setSelectedTxn(txn);
    setTxnModalVisible(true);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active': return { bg: '#DCFCE7', text: '#15803D' };
      case 'Payment Due': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Inactive': return { bg: '#F1F5F9', text: '#64748B' };
      case 'Paid': return { bg: '#DCFCE7', text: '#15803D' };
      case 'Pending': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'Overdue': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

          {/* 1. PAGE HEADER */}
          <View style={styles.pageHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Clients</Text>
              <Text style={styles.pageSubtitle}>Manage business clients, deployments and payment activity.</Text>
            </View>
            <View style={styles.headerActionsRight}>
              <TouchableOpacity style={styles.btnActionHeader} onPress={loadData}>
                <RefreshCw size={15} color={TEXT_MAIN} style={{ marginRight: 6 }} />
                <Text style={styles.btnActionHeaderText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. SEARCH BAR */}
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchInputBox}>
              <Search size={18} color={TEXT_MUTED} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search clients by business, owner or city..."
                placeholderTextColor={TEXT_MUTED}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3. CLIENT OVERVIEW (4 METRIC CARDS) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            
            {/* Card 1: Total Clients */}
            <View style={[styles.metricCard, { width: isDesktop ? '23.5%' : '48%' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Users size={18} color={INFO} />
              </View>
              <Text style={styles.metricValue}>{totalClients}</Text>
              <Text style={styles.metricLabel}>Total Clients</Text>
              <Text style={styles.metricSubtext}>
                {totalClients === 0 ? 'No clients yet' : 'All registered business clients'}
              </Text>
            </View>

            {/* Card 2: Active Deployments */}
            <View style={[styles.metricCard, { width: isDesktop ? '23.5%' : '48%' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#ECFDF5' }]}>
                <UserCheck size={18} color={SUCCESS} />
              </View>
              <Text style={styles.metricValue}>{activeDeployments}</Text>
              <Text style={styles.metricLabel}>Active Deployments</Text>
              <Text style={styles.metricSubtext}>
                {activeDeployments === 0 ? 'No active deployments' : 'Staff currently working'}
              </Text>
            </View>

            {/* Card 3: Repeat Partners */}
            <View style={[styles.metricCard, { width: isDesktop ? '23.5%' : '48%' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Repeat size={18} color="#9333EA" />
              </View>
              <Text style={styles.metricValue}>{repeatPartners}</Text>
              <Text style={styles.metricLabel}>Repeat Partners</Text>
              <Text style={styles.metricSubtext}>
                {repeatPartners === 0 ? 'No repeat clients yet' : 'Clients with multiple hires'}
              </Text>
            </View>

            {/* Card 4: Outstanding Payments */}
            <View style={[styles.metricCard, { width: isDesktop ? '23.5%' : '48%' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: totalOutstanding > 0 ? '#FEF3C7' : '#F1F5F9' }]}>
                <CreditCard size={18} color={totalOutstanding > 0 ? WARNING : TEXT_MUTED} />
              </View>
              <Text style={styles.metricValue}>
                {totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString('en-IN')}` : '₹0'}
              </Text>
              <Text style={styles.metricLabel}>Outstanding Payments</Text>
              <Text style={styles.metricSubtext}>
                {totalOutstanding === 0 ? 'No pending payments' : 'Awaiting settlement'}
              </Text>
            </View>

          </View>

          {/* 4. PRIMARY TABS (SEGMENTED CONTROL) */}
          <View style={styles.tabBarContainer}>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segmentBtn, activeTab === 'clients' && styles.segmentBtnActive]}
                onPress={() => setActiveTab('clients')}
              >
                <Text style={[styles.segmentBtnText, activeTab === 'clients' && styles.segmentBtnTextActive]}>All Clients</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, activeTab === 'transactions' && styles.segmentBtnActive]}
                onPress={() => setActiveTab('transactions')}
              >
                <Text style={[styles.segmentBtnText, activeTab === 'transactions' && styles.segmentBtnTextActive]}>Transaction History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TAB 1: ALL CLIENTS */}
          {activeTab === 'clients' ? (
            <>
              {/* Client Type Filters */}
              <View style={styles.filterPillsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {[
                    { label: 'All', count: totalClients },
                    { label: 'Hotel', count: countHotel },
                    { label: 'Restaurant', count: countRestaurant },
                    { label: 'Cafe', count: countCafe }
                  ].map(pill => (
                    <TouchableOpacity
                      key={pill.label}
                      style={[styles.filterPill, activeTypeFilter === pill.label && styles.filterPillActive]}
                      onPress={() => setActiveTypeFilter(pill.label)}
                    >
                      <Text style={[styles.filterPillText, activeTypeFilter === pill.label && styles.filterPillTextActive]}>
                        {pill.label} <Text style={{ fontSize: 11, opacity: 0.8 }}>{pill.count}</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Client List / Table */}
              {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={NAVY} />
                  <Text style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 12 }}>Loading clients...</Text>
                </View>
              ) : filteredClients.length > 0 ? (
                isDesktop ? (
                  /* DESKTOP TABLE */
                  <View style={styles.tableContainer}>
                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.tableColHeader, { flex: 2.2 }]}>CLIENT</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>BUSINESS TYPE</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>ACTIVE STAFF</Text>
                      <Text style={[styles.tableColHeader, { flex: 1 }]}>TOTAL HIRES</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>OUTSTANDING</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.5 }]}>LAST ACTIVITY</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>STATUS</Text>
                      <Text style={[styles.tableColHeader, { flex: 1, textAlign: 'right' }]}>ACTION</Text>
                    </View>

                    {filteredClients.map((client, idx) => {
                      const statusStyle = getStatusBadgeStyle(client.status);
                      return (
                        <View key={client.id || idx} style={styles.tableBodyRow}>
                          {/* 1. CLIENT */}
                          <View style={[{ flex: 2.2, flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={styles.clientAvatarBox}>
                              <Text style={styles.clientAvatarText}>{client.initials}</Text>
                            </View>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                              <Text style={styles.clientNameText} numberOfLines={1}>{client.name}</Text>
                              <Text style={styles.clientSubText} numberOfLines={1}>{client.owner} · {client.city}</Text>
                            </View>
                          </View>

                          {/* 2. BUSINESS TYPE */}
                          <View style={{ flex: 1.2 }}>
                            <View style={styles.typeBadgeChip}>
                              <Text style={styles.typeBadgeText}>{client.type}</Text>
                            </View>
                          </View>

                          {/* 3. ACTIVE STAFF */}
                          <View style={{ flex: 1.2 }}>
                            <Text style={styles.tableBodyValue}>
                              {client.activeStaff > 0 ? `${client.activeStaff} Active Staff` : 'No Active Staff'}
                            </Text>
                          </View>

                          {/* 4. TOTAL HIRES */}
                          <View style={{ flex: 1 }}>
                            <Text style={styles.tableBodyValue}>{client.totalHires} Hires</Text>
                          </View>

                          {/* 5. OUTSTANDING */}
                          <View style={{ flex: 1.2 }}>
                            {client.outstanding > 0 ? (
                              <Text style={[styles.tableBodyValue, { color: WARNING, fontWeight: '700' }]}>
                                ₹{client.outstanding.toLocaleString('en-IN')} Due
                              </Text>
                            ) : (
                              <Text style={[styles.tableBodyValue, { color: SUCCESS, fontWeight: '700' }]}>Paid</Text>
                            )}
                          </View>

                          {/* 6. LAST ACTIVITY */}
                          <View style={{ flex: 1.5 }}>
                            <Text style={styles.tableBodyValue} numberOfLines={1}>{client.lastActivity}</Text>
                            <Text style={styles.clientSubText}>{client.lastActivityTime}</Text>
                          </View>

                          {/* 7. STATUS */}
                          <View style={{ flex: 1.2 }}>
                            <View style={[styles.statusBadgeChip, { backgroundColor: statusStyle.bg }]}>
                              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{client.status}</Text>
                            </View>
                          </View>

                          {/* 8. ACTION */}
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.btnTableAction} onPress={() => openClientDetail(client)}>
                              <Text style={styles.btnTableActionText}>View Client →</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  /* MOBILE / TABLET CARDS */
                  <View style={styles.cardsGridMobile}>
                    {filteredClients.map((client, idx) => {
                      const statusStyle = getStatusBadgeStyle(client.status);
                      return (
                        <View key={client.id || idx} style={styles.mobileClientCard}>
                          <View style={styles.mobileCardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                              <View style={styles.clientAvatarBox}>
                                <Text style={styles.clientAvatarText}>{client.initials}</Text>
                              </View>
                              <View style={{ flex: 1, paddingRight: 8 }}>
                                <Text style={styles.clientNameText} numberOfLines={1}>{client.name}</Text>
                                <Text style={styles.clientSubText}>{client.owner} · {client.city}</Text>
                              </View>
                            </View>
                            <View style={styles.typeBadgeChip}>
                              <Text style={styles.typeBadgeText}>{client.type}</Text>
                            </View>
                          </View>

                          <View style={styles.mobileCardBody}>
                            <View style={styles.mobileMetaGrid}>
                              <View style={styles.mobileMetaItem}>
                                <Text style={styles.mobileMetaLabel}>Active Staff</Text>
                                <Text style={styles.mobileMetaValue}>{client.activeStaff > 0 ? `${client.activeStaff} Staff` : 'None'}</Text>
                              </View>
                              <View style={styles.mobileMetaItem}>
                                <Text style={styles.mobileMetaLabel}>Total Hires</Text>
                                <Text style={styles.mobileMetaValue}>{client.totalHires} Hires</Text>
                              </View>
                              <View style={styles.mobileMetaItem}>
                                <Text style={styles.mobileMetaLabel}>Outstanding</Text>
                                {client.outstanding > 0 ? (
                                  <Text style={[styles.mobileMetaValue, { color: WARNING }]}>₹{client.outstanding.toLocaleString('en-IN')}</Text>
                                ) : (
                                  <Text style={[styles.mobileMetaValue, { color: SUCCESS }]}>Paid</Text>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={styles.mobileCardFooter}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.clientSubText}>Last Activity: {client.lastActivity}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnTableAction} onPress={() => openClientDetail(client)}>
                              <Text style={styles.btnTableActionText}>View Client →</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )
              ) : (
                /* EMPTY STATE - CLIENTS */
                <View style={styles.compactEmptyCard}>
                  <View style={styles.emptyIconBox}>
                    <Building2 size={24} color={TEXT_MUTED} />
                  </View>
                  <Text style={styles.emptyCardTitle}>
                    {searchQuery || activeTypeFilter !== 'All' ? 'No matching clients' : 'No clients yet'}
                  </Text>
                  <Text style={styles.emptyCardMessage}>
                    {searchQuery || activeTypeFilter !== 'All'
                      ? 'Try another business type or search term.'
                      : 'Clients will appear after a business accepts your candidates or starts a manpower deployment.'}
                  </Text>
                  <TouchableOpacity
                    style={styles.btnEmptyAction}
                    onPress={() => {
                      if (searchQuery || activeTypeFilter !== 'All') {
                        setSearchQuery('');
                        setActiveTypeFilter('All');
                      } else if (navigation) {
                        navigation.navigate('ManpowerDashboard');
                      }
                    }}
                  >
                    <Text style={styles.btnEmptyActionText}>
                      {searchQuery || activeTypeFilter !== 'All' ? 'Clear Filters' : 'Browse Requirements'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            /* TAB 2: TRANSACTION HISTORY */
            <>
              {/* Transaction Filters */}
              <View style={styles.filterPillsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.filterPill, txnFilter === f && styles.filterPillActive]}
                      onPress={() => setTxnFilter(f)}
                    >
                      <Text style={[styles.filterPillText, txnFilter === f && styles.filterPillTextActive]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Transactions Table / Cards */}
              {filteredTransactions.length > 0 ? (
                isDesktop ? (
                  <View style={styles.tableContainer}>
                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>TRANSACTION ID</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.8 }]}>CLIENT</Text>
                      <Text style={[styles.tableColHeader, { flex: 2 }]}>RELATED REQUIREMENT</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>AMOUNT</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>DATE</Text>
                      <Text style={[styles.tableColHeader, { flex: 1.2 }]}>STATUS</Text>
                      <Text style={[styles.tableColHeader, { flex: 1, textAlign: 'right' }]}>ACTION</Text>
                    </View>

                    {filteredTransactions.map((txn, idx) => {
                      const statusStyle = getStatusBadgeStyle(txn.status);
                      return (
                        <View key={txn.id || idx} style={styles.tableBodyRow}>
                          <View style={{ flex: 1.2 }}>
                            <Text style={[styles.tableBodyValue, { fontWeight: '700' }]}>{txn.id}</Text>
                          </View>
                          <View style={{ flex: 1.8 }}>
                            <Text style={styles.clientNameText}>{txn.clientName}</Text>
                            <Text style={styles.clientSubText}>{txn.city}</Text>
                          </View>
                          <View style={{ flex: 2 }}>
                            <Text style={styles.tableBodyValue}>{txn.requirement}</Text>
                          </View>
                          <View style={{ flex: 1.2 }}>
                            <Text style={[styles.tableBodyValue, { fontWeight: '700' }]}>
                              ₹{(txn.amount || 0).toLocaleString('en-IN')}
                            </Text>
                          </View>
                          <View style={{ flex: 1.2 }}>
                            <Text style={styles.tableBodyValue}>{txn.date}</Text>
                          </View>
                          <View style={{ flex: 1.2 }}>
                            <View style={[styles.statusBadgeChip, { backgroundColor: statusStyle.bg }]}>
                              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{txn.status}</Text>
                            </View>
                          </View>
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.btnTableAction} onPress={() => openTxnDetail(txn)}>
                              <Text style={styles.btnTableActionText}>View →</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.cardsGridMobile}>
                    {filteredTransactions.map((txn, idx) => {
                      const statusStyle = getStatusBadgeStyle(txn.status);
                      return (
                        <TouchableOpacity key={txn.id || idx} style={styles.mobileClientCard} onPress={() => openTxnDetail(txn)}>
                          <View style={styles.mobileCardHeader}>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.tableBodyValue, { fontWeight: '700' }]}>{txn.id}</Text>
                              <Text style={styles.clientNameText}>{txn.clientName}</Text>
                            </View>
                            <View style={[styles.statusBadgeChip, { backgroundColor: statusStyle.bg }]}>
                              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{txn.status}</Text>
                            </View>
                          </View>
                          <View style={styles.mobileCardBody}>
                            <Text style={styles.clientSubText}>Requirement: {txn.requirement}</Text>
                            <Text style={[styles.tableBodyValue, { marginTop: 4, fontWeight: '700' }]}>
                              Amount: ₹{(txn.amount || 0).toLocaleString('en-IN')} · {txn.date}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )
              ) : (
                /* EMPTY STATE - TRANSACTIONS */
                <View style={styles.compactEmptyCard}>
                  <View style={styles.emptyIconBox}>
                    <CreditCard size={24} color={TEXT_MUTED} />
                  </View>
                  <Text style={styles.emptyCardTitle}>No transactions yet</Text>
                  <Text style={styles.emptyCardMessage}>Client payments and settlement records will appear here.</Text>
                </View>
              )}
            </>
          )}

        </View>
      </ScrollView>

      {/* CLIENT DETAILS DRAWER / MODAL */}
      <Modal visible={detailModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.drawerCard, { maxWidth: 640 }]}>
            
            {/* Navy Header */}
            <View style={styles.drawerNavyHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.drawerHeaderTag}>CLIENT PROFILE</Text>
                <Text style={styles.drawerTitle}>{selectedClient?.name}</Text>
                <Text style={styles.drawerSubtitle}>{selectedClient?.owner} · {selectedClient?.city}</Text>
              </View>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.drawerCloseBtn}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* 3 Tabs Header inside Drawer */}
            <View style={styles.drawerTabNav}>
              {['overview', 'deployments', 'transactions'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.drawerTabBtn, detailTab === tab && styles.drawerTabBtnActive]}
                  onPress={() => setDetailTab(tab)}
                >
                  <Text style={[styles.drawerTabBtnText, detailTab === tab && styles.drawerTabBtnTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={{ padding: 20, maxHeight: 480 }} showsVerticalScrollIndicator={false}>
              {selectedClient && (
                <>
                  {detailTab === 'overview' && (
                    <View style={{ gap: 14 }}>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Business Name</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.name}</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Business Type</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.type}</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Owner / Contact</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.owner}</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>City / Location</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.city}</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Total Hires</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.totalHires} Hires</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Active Staff</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.activeStaff} Active Staff</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Client Since</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.clientSince || '2026'}</Text>
                      </View>
                      <View style={styles.drawerDetailRow}>
                        <Text style={styles.drawerDetailLabel}>Contact Phone</Text>
                        <Text style={styles.drawerDetailValue}>{selectedClient.phone}</Text>
                      </View>
                    </View>
                  )}

                  {detailTab === 'deployments' && (
                    <View style={{ gap: 12 }}>
                      {(selectedClient.deployments || []).length > 0 ? (
                        selectedClient.deployments.map((dep, idx) => (
                          <View key={idx} style={styles.drawerCardItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                              <Text style={styles.drawerCardItemTitle}>{dep.role}</Text>
                              <View style={[styles.statusBadgeChip, { backgroundColor: '#DCFCE7' }]}>
                                <Text style={[styles.statusBadgeText, { color: '#15803D' }]}>{dep.status}</Text>
                              </View>
                            </View>
                            <Text style={styles.clientSubText}>Candidate: {dep.candidate}</Text>
                            <Text style={styles.clientSubText}>Joining Date: {dep.joiningDate}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.clientSubText}>No active deployments recorded.</Text>
                      )}
                    </View>
                  )}

                  {detailTab === 'transactions' && (
                    <View style={{ gap: 12 }}>
                      {(selectedClient.transactions || []).length > 0 ? (
                        selectedClient.transactions.map((txn, idx) => (
                          <View key={idx} style={styles.drawerCardItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                              <Text style={styles.drawerCardItemTitle}>{txn.id}</Text>
                              <View style={[styles.statusBadgeChip, { backgroundColor: txn.status === 'Paid' ? '#DCFCE7' : '#EFF6FF' }]}>
                                <Text style={[styles.statusBadgeText, { color: txn.status === 'Paid' ? '#15803D' : '#2563EB' }]}>{txn.status}</Text>
                              </View>
                            </View>
                            <Text style={styles.clientSubText}>Requirement: {txn.requirement}</Text>
                            <Text style={[styles.tableBodyValue, { marginTop: 4, fontWeight: '700' }]}>
                              Amount: ₹{(txn.amount || 0).toLocaleString('en-IN')} · Date: {txn.date}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.clientSubText}>No transactions recorded.</Text>
                      )}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <TouchableOpacity style={styles.btnDrawerClose} onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.btnDrawerCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* TRANSACTION DETAILS MODAL */}
      <Modal visible={txnModalVisible} animationType="fade" transparent={true} onRequestClose={() => setTxnModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.drawerCard, { maxWidth: 480 }]}>
            <View style={styles.drawerNavyHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.drawerHeaderTag}>TRANSACTION DETAILS</Text>
                <Text style={styles.drawerTitle}>{selectedTxn?.id}</Text>
                <Text style={styles.drawerSubtitle}>{selectedTxn?.clientName}</Text>
              </View>
              <TouchableOpacity onPress={() => setTxnModalVisible(false)} style={styles.drawerCloseBtn}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20, gap: 12 }}>
              {selectedTxn && (
                <>
                  <View style={styles.drawerDetailRow}>
                    <Text style={styles.drawerDetailLabel}>Requirement</Text>
                    <Text style={styles.drawerDetailValue}>{selectedTxn.requirement}</Text>
                  </View>
                  <View style={styles.drawerDetailRow}>
                    <Text style={styles.drawerDetailLabel}>Amount</Text>
                    <Text style={[styles.drawerDetailValue, { color: SUCCESS, fontWeight: '800' }]}>
                      ₹{(selectedTxn.amount || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.drawerDetailRow}>
                    <Text style={styles.drawerDetailLabel}>Date</Text>
                    <Text style={styles.drawerDetailValue}>{selectedTxn.date}</Text>
                  </View>
                  <View style={styles.drawerDetailRow}>
                    <Text style={styles.drawerDetailLabel}>Status</Text>
                    <Text style={styles.drawerDetailValue}>{selectedTxn.status}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.drawerFooter}>
              <TouchableOpacity style={styles.btnDrawerClose} onPress={() => setTxnModalVisible(false)}>
                <Text style={styles.btnDrawerCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  mainScroll: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1320,
  },

  // 1. Header
  pageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnActionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MAIN,
  },

  // 2. Search Bar
  searchBarWrapper: {
    marginBottom: 20,
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: TEXT_MAIN,
  },

  // 3. Metrics Grid
  metricsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  metricsGridDesktop: {
    flexDirection: 'row',
  },
  metricsGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    minWidth: '45%',
    minHeight: 118,
    justifyContent: 'center',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
    lineHeight: 26,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginTop: 2,
  },
  metricSubtext: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  // 4. Primary Tabs
  tabBarContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  segmentBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: NAVY,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 5. Filter Pills
  filterPillsRow: {
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: SECONDARY_NAVY,
    borderColor: SECONDARY_NAVY,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 6. Desktop Table
  tableContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tableColHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clientAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clientAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: GOLD,
  },
  clientNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  clientSubText: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  typeBadgeChip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: INFO,
  },
  tableBodyValue: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '600',
  },
  statusBadgeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  btnTableAction: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnTableActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
  },

  // 7. Mobile Cards
  cardsGridMobile: {
    gap: 12,
  },
  mobileClientCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
  },
  mobileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mobileCardBody: {
    marginBottom: 12,
  },
  mobileMetaGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  mobileMetaItem: {
    flex: 1,
  },
  mobileMetaLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginBottom: 2,
  },
  mobileMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  mobileCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },

  // 8. Compact Empty State
  compactEmptyCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
    marginVertical: 24,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 6,
  },
  emptyCardMessage: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  btnEmptyAction: {
    backgroundColor: NAVY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnEmptyActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 9. Drawer / Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  drawerCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    overflow: 'hidden',
  },
  drawerNavyHeader: {
    backgroundColor: NAVY,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  drawerHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drawerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  drawerCloseBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 6,
    borderRadius: 18,
  },
  drawerTabNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#F8FAFC',
  },
  drawerTabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  drawerTabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    backgroundColor: CARD_BG,
  },
  drawerTabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  drawerTabBtnTextActive: {
    color: NAVY,
    fontWeight: '800',
  },
  drawerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  drawerDetailLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  drawerDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  drawerCardItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
  },
  drawerCardItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: CARD_BG,
  },
  btnDrawerClose: {
    height: 44,
    borderRadius: 12,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDrawerCloseText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
