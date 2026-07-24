import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Building2, Star, Clock3, CreditCard, IndianRupee, User, Calendar, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const PURPLE = '#071B3A';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const RED = '#EF4444';
const ORANGE = '#F59E0B';
const GRAY = '#64748B';
const LIGHT_BG = '#F8FAFC';
const BORDER_COLOR = '#E2E8F0';

const CLIENTS = [
  { id: "C-1", name: "The Meridian Grand", type: "Luxury Hotel", lifetime: "₹12.4L", rating: 4.9, location: "Andheri, Mumbai", activeCampaigns: 1 },
  { id: "C-2", name: "Spice Route Restaurant", type: "Fine Dining", lifetime: "₹4.2L", rating: 4.7, location: "Bandra, Mumbai", activeCampaigns: 0 },
  { id: "C-3", name: "Azure Palace Hotel", type: "Resort", lifetime: "₹8.9L", rating: 4.8, location: "Juhu, Mumbai", activeCampaigns: 1 },
  { id: "C-4", name: "Café Zephyr Group", type: "Café Chain", lifetime: "₹1.1L", rating: 4.5, location: "Lower Parel, Mumbai", activeCampaigns: 0 },
];

const TRANSACTIONS = [
  {
    id: 'ORD-284',
    client: 'The Meridian Grand',
    type: 'June Social Campaign',
    amount: '₹35,000',
    date: '12 Jun 2026',
    status: 'Active',
    method: 'Bank Transfer'
  },
  {
    id: 'INV-26001',
    client: 'Azure Palace Hotel',
    type: 'Campaign Fee',
    amount: '₹50,000',
    date: '01 Jul 2026',
    status: 'Sent',
    method: 'Net Banking'
  },
  {
    id: 'INV-26002',
    client: 'Café Zephyr Group',
    type: 'Photography Fee',
    amount: '₹12,000',
    date: '15 Jun 2026',
    status: 'Paid',
    method: 'UPI'
  },
  {
    id: 'INV-26003',
    client: 'Spice Route Restaurant',
    type: 'Printing Fee',
    amount: '₹8,500',
    date: '01 Jun 2026',
    status: 'Overdue',
    method: 'Cash'
  },
];

export default function MarketingClientsScreen({ setActivePage }) {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'transactions'
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnModalVisible, setTxnModalVisible] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle2 };
      case 'Active': return { bg: '#EFF6FF', text: '#2563EB', icon: Clock3 };
      case 'Sent': return { bg: '#FEF3C7', text: '#D97706', icon: HelpCircle };
      case 'Overdue': return { bg: '#FEE2E2', text: '#EF4444', icon: AlertCircle };
      default: return { bg: '#F1F5F9', text: '#475569', icon: HelpCircle };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Building2 size={24} color="#D4AF37" />
          </View>
          <View>
            <Text style={styles.title}>Client Base & Transactions</Text>
            <Text style={styles.subtitle}>Manage B2B partners and history of transaction records.</Text>
          </View>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Clients</Text>
          <Text style={styles.metricValue}>4</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Active Projects</Text>
          <Text style={styles.metricValue}>2</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Lifetime Revenue</Text>
          <Text style={[styles.metricValue, { color: GREEN }]}>₹1.05L</Text>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'clients' ? (
          <View style={styles.gridContainer}>
            {CLIENTS.map((client) => (
              <TouchableOpacity 
                key={client.id} 
                style={styles.clientCard}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedClient(client);
                  setClientModalVisible(true);
                }}
              >
                <View style={styles.clientCardHeader}>
                  <View>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientType}>{client.type}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.ratingText}>{client.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.clientCardDivider} />
                
                <View style={styles.clientCardBody}>
                  <View style={styles.clientInfoItem}>
                    <Text style={styles.clientInfoLabel}>Location</Text>
                    <Text style={styles.clientInfoVal}>{client.location}</Text>
                  </View>
                  <View style={styles.clientInfoItem}>
                    <Text style={styles.clientInfoLabel}>Lifetime Value</Text>
                    <Text style={[styles.clientInfoVal, { fontWeight: 'bold', color: GREEN }]}>{client.lifetime}</Text>
                  </View>
                  <View style={styles.clientInfoItem}>
                    <Text style={styles.clientInfoLabel}>Active Campaigns</Text>
                    <Text style={styles.clientInfoVal}>{client.activeCampaigns}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            {TRANSACTIONS.map((txn) => {
              const statusConfig = getStatusColor(txn.status);
              const StatusIcon = statusConfig.icon;

              return (
                <TouchableOpacity 
                  key={txn.id} 
                  style={styles.txnCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTxn(txn);
                    setTxnModalVisible(true);
                  }}
                >
                  <View style={styles.txnCardTop}>
                    <View>
                      <Text style={styles.txnId}>{txn.id}</Text>
                      <Text style={styles.txnClient}>{txn.client}</Text>
                      <Text style={styles.txnType}>{txn.type}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                      <StatusIcon size={12} color={statusConfig.text} style={{ marginRight: 4 }} />
                      <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>{txn.status}</Text>
                    </View>
                  </View>

                  <View style={styles.clientCardDivider} />

                  <View style={styles.txnDetailsRow}>
                    <View style={styles.txnDetailCol}>
                      <Text style={styles.txnDetailLabel}>Transaction Amount</Text>
                      <Text style={styles.txnDetailValue}>{txn.amount}</Text>
                    </View>
                    <View style={styles.txnDetailCol}>
                      <Text style={styles.txnDetailLabel}>Transaction Date</Text>
                      <Text style={styles.txnDetailValue}>{txn.date}</Text>
                    </View>
                    <View style={styles.txnDetailCol}>
                      <Text style={styles.txnDetailLabel}>Payment Method</Text>
                      <Text style={styles.txnDetailValue}>{txn.method}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Client Detail Modal */}
      <Modal visible={clientModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setClientModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContentSmall}>
                <View style={styles.modalHeaderSmall}>
                  <Text style={styles.modalTitleSmall}>Client Details</Text>
                  <TouchableOpacity onPress={() => setClientModalVisible(false)}>
                    <XCircle size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
                {selectedClient && (
                  <View style={styles.modalBodySmall}>
                    <Text style={styles.modalTxnClientName}>{selectedClient.name}</Text>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Type:</Text>
                      <Text style={styles.modalTxnVal}>{selectedClient.type}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Location:</Text>
                      <Text style={styles.modalTxnVal}>{selectedClient.location}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Lifetime Value:</Text>
                      <Text style={[styles.modalTxnVal, {color: GREEN, fontWeight: 'bold'}]}>{selectedClient.lifetime}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Active Campaigns:</Text>
                      <Text style={styles.modalTxnVal}>{selectedClient.activeCampaigns}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Rating:</Text>
                      <Text style={styles.modalTxnVal}>{selectedClient.rating} ★</Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
                    <Text style={styles.modalTxnClientName}>{selectedTxn.client}</Text>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Type:</Text>
                      <Text style={styles.modalTxnVal}>{selectedTxn.type}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Amount:</Text>
                      <Text style={[styles.modalTxnVal, {color: GREEN, fontWeight: 'bold'}]}>{selectedTxn.amount}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Date:</Text>
                      <Text style={styles.modalTxnVal}>{selectedTxn.date}</Text>
                    </View>
                    <View style={styles.modalTxnDetailRow}>
                      <Text style={styles.modalTxnLabel}>Method:</Text>
                      <Text style={styles.modalTxnVal}>{selectedTxn.method}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG, padding: 24 },
  header: { marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: BORDER_COLOR, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  metricLabel: { fontSize: 12, color: colors.muted, marginBottom: 6 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginBottom: 20, maxWidth: 400 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabButtonText: { fontSize: 13, fontWeight: '600', color: GRAY },
  activeTabButtonText: { color: NAVY, fontWeight: 'bold' },
  
  scrollContent: { paddingBottom: 60 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  clientCard: { width: isMobile ? '100%' : '48%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: BORDER_COLOR, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  clientCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  clientType: { fontSize: 12, color: colors.muted, marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#F59E0B' },
  clientCardDivider: { height: 1, backgroundColor: BORDER_COLOR, marginVertical: 12 },
  clientCardBody: { flexDirection: 'row', justifyContent: 'space-between' },
  clientInfoItem: { flex: 1 },
  clientInfoLabel: { fontSize: 11, color: colors.muted, marginBottom: 4 },
  clientInfoVal: { fontSize: 13, color: NAVY, fontWeight: '500' },
  
  transactionsContainer: { gap: 16 },
  txnCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: BORDER_COLOR, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  txnCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  txnId: { fontSize: 11, color: colors.muted, fontWeight: '600', textTransform: 'uppercase' },
  txnClient: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginTop: 2 },
  txnType: { fontSize: 12, color: colors.muted, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  txnDetailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  txnDetailCol: { flex: 1 },
  txnDetailLabel: { fontSize: 11, color: colors.muted, marginBottom: 4 },
  txnDetailValue: { fontSize: 13, color: NAVY, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContentSmall: { width: '90%', maxWidth: 450, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  modalHeaderSmall: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitleSmall: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBodySmall: { gap: 12 },
  modalTxnId: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  modalTxnClientName: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  modalTxnDetailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 8 },
  modalTxnLabel: { fontSize: 13, color: '#64748B' },
  modalTxnVal: { fontSize: 13, color: NAVY, fontWeight: '500' },
});
