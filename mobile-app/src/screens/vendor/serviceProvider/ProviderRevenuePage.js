import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, ScrollView, Modal, Alert 
} from 'react-native';
import { 
  IndianRupee, TrendingUp, Clock, AlertCircle, FileText,
  Download, Send, CheckCircle, ChevronRight, BarChart3, CreditCard
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: "Total Revenue", value: "₹2,45,000", icon: TrendingUp, color: "#10B981", bg: "#D1FAE5" },
  { label: "Completed Jobs", value: "₹1,90,000", icon: CheckCircle, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Pending Payments", value: "₹45,000", icon: Clock, color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Outstanding Invs", value: "8", icon: FileText, color: "#8B5CF6", bg: "#F3E8FF" },
  { label: "Visit Charges", value: "₹15,000", icon: CreditCard, color: "#6366F1", bg: "#E0E7FF" },
  { label: "Refunds", value: "₹5,000", icon: AlertCircle, color: "#EF4444", bg: "#FEE2E2" },
];

const MOCK_INVOICES = [
  {
    id: "INV-2026-101",
    jobId: "JOB-448",
    client: "Sunset Resort",
    service: "HVAC Annual Maintenance",
    amount: "₹45,000",
    dueDate: "20 Oct 2026",
    status: "Pending"
  },
  {
    id: "INV-2026-100",
    jobId: "JOB-445",
    client: "The Meridian Grand",
    service: "Kitchen Equipment Repair",
    amount: "₹18,500",
    dueDate: "15 Oct 2026",
    status: "Overdue"
  },
  {
    id: "INV-2026-099",
    jobId: "JOB-440",
    client: "Cafe Zephyr",
    service: "Plumbing Refit",
    amount: "₹32,000",
    dueDate: "10 Oct 2026",
    status: "Paid"
  }
];

const MOCK_SETTLEMENTS = [
  { id: "SET-891", date: "12 Oct 2026", amount: "₹85,000", ref: "UTR-SBIN000123" },
  { id: "SET-890", date: "05 Oct 2026", amount: "₹42,000", ref: "UTR-HDFC000456" }
];

export default function ProviderRevenuePage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState('Invoices');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return { bg: '#D1FAE5', text: '#10B981' };
      case 'Pending': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'Overdue': return { bg: '#FEE2E2', text: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleMarkPaid = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  const handleAction = (action, id) => {
    if (action === 'download') {
      alert(`Downloading ${id}.pdf...`);
    } else if (action === 'remind') {
      alert(`Payment reminder sent for ${id}.`);
    }
  };

  const renderSummaryCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Icon size={20} color={item.color} />
          </View>
        </View>
        <Text style={styles.summaryValue}>{item.value}</Text>
        <Text style={styles.summaryLabel}>{item.label}</Text>
      </View>
    );
  };

  const renderInvoiceCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.serviceName}>{item.jobId} - {item.service}</Text>
          
          <View style={styles.invoiceInfoRow}>
            <View style={styles.invoiceInfoBox}>
              <Text style={styles.invoiceInfoLabel}>Amount Due</Text>
              <Text style={styles.invoiceInfoValue}>{item.amount}</Text>
            </View>
            <View style={styles.invoiceInfoBox}>
              <Text style={styles.invoiceInfoLabel}>Due Date</Text>
              <Text style={styles.invoiceInfoValue}>{item.dueDate}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.cardFooter, isSmallScreen && { flexDirection: 'column' }]}>
          <View style={[styles.actionBtnsLeft, isSmallScreen && { width: '100%', marginBottom: 8 }]}>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleAction('download', item.id)}>
              <Download size={16} color="#64748B" />
            </TouchableOpacity>
            {item.status !== 'Paid' && (
              <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleAction('remind', item.id)}>
                <Send size={16} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={[styles.actionBtnsRight, isSmallScreen && { width: '100%' }]}>
            {item.status !== 'Paid' ? (
              <TouchableOpacity 
                style={styles.btnPrimaryGold} 
                onPress={() => handleMarkPaid(item.id)}
              >
                <CheckCircle size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnPrimaryGoldText}>Mark Paid</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>View Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.dashboardContent}>
      
      {/* Scrollable Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
          {SUMMARY_DATA.map(item => (
            <View key={item.label} style={{ marginRight: 12 }}>
              {renderSummaryCard({ item })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Mock Revenue Trend */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Revenue Trend (Last 6 Mos)</Text>
          <BarChart3 size={20} color="#64748B" />
        </View>
        <View style={styles.mockChartBox}>
          {/* Extremely simplified mock bar chart using views */}
          <View style={styles.mockChartArea}>
            <View style={[styles.mockBar, { height: '40%' }]} />
            <View style={[styles.mockBar, { height: '60%' }]} />
            <View style={[styles.mockBar, { height: '50%' }]} />
            <View style={[styles.mockBar, { height: '80%' }]} />
            <View style={[styles.mockBar, { height: '70%' }]} />
            <View style={[styles.mockBar, { height: '90%', backgroundColor: GOLD }]} />
          </View>
          <View style={styles.mockChartLabels}>
            <Text style={styles.chartLabel}>May</Text>
            <Text style={styles.chartLabel}>Jun</Text>
            <Text style={styles.chartLabel}>Jul</Text>
            <Text style={styles.chartLabel}>Aug</Text>
            <Text style={styles.chartLabel}>Sep</Text>
            <Text style={styles.chartLabel}>Oct</Text>
          </View>
        </View>
      </View>

      {/* Recent Settlements */}
      <View style={styles.settlementsSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Recent Settlements</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {MOCK_SETTLEMENTS.map(set => (
          <View key={set.id} style={styles.settlementRow}>
            <View style={styles.settlementIconBox}>
              <IndianRupee size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settlementDate}>{set.date}</Text>
              <Text style={styles.settlementRef}>Ref: {set.ref}</Text>
            </View>
            <Text style={styles.settlementAmount}>{set.amount}</Text>
          </View>
        ))}
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revenue & Invoices</Text>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('Dashboard')}
          >
            <Text style={[styles.tabText, activeTab === 'Dashboard' && styles.activeTabText]}>
              Dashboard
            </Text>
            {activeTab === 'Dashboard' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Invoices' && styles.activeTab]}
            onPress={() => setActiveTab('Invoices')}
          >
            <Text style={[styles.tabText, activeTab === 'Invoices' && styles.activeTabText]}>
              Invoices
            </Text>
            {activeTab === 'Invoices' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content View */}
        {activeTab === 'Dashboard' ? renderDashboard() : (
          <FlatList
            data={invoices}
            keyExtractor={item => item.id}
            renderItem={renderInvoiceCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: NAVY,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  dashboardContent: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryScroll: {
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 4,
  },
  mockChartBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mockChartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  mockBar: {
    width: 24,
    backgroundColor: '#DBEAFE',
    borderRadius: 4,
  },
  mockChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  settlementsSection: {
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 13,
    color: GOLD,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settlementIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settlementDate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 2,
  },
  settlementRef: {
    fontSize: 12,
    color: '#64748B',
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  cardId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  invoiceInfoBox: {
    flex: 1,
  },
  invoiceInfoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  invoiceInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtnsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconActionBtn: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnPrimaryGold: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: GOLD,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryGoldText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  btnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
});
