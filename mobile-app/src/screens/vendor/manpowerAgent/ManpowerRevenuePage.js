import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, FlatList } from 'react-native';
import { DollarSign, FileText, CheckCircle, Clock, AlertCircle, Plus, Download, Send } from 'lucide-react-native';
import CreateInvoiceModal from '../../../components/vendor/manpowerAgent/CreateInvoiceModal';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const MOCK_INVOICES = [
  { id: "INV-1001", client: "JW Marriott", candidate: "Vikram Singh", type: "Placement Fee", date: "12 Jul 2026", due: "22 Jul 2026", amount: 50000, status: "Sent" },
  { id: "INV-1002", client: "Starbucks", candidate: "Neha Gupta", type: "Placement Fee", date: "01 Jul 2026", due: "10 Jul 2026", amount: 45000, status: "Paid" },
  { id: "INV-1003", client: "Olive Bar", candidate: "Ravi Kumar", type: "Replacement Charge", date: "15 Jun 2026", due: "25 Jun 2026", amount: 15000, status: "Overdue" },
];

export default function ManpowerRevenuePage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeDateFilter, setActiveDateFilter] = useState('This Month');
  const [activeTab, setActiveTab] = useState('Invoices'); // Invoices, Pending
  const [createInvVisible, setCreateInvVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return '#10B981';
      case 'Partially Paid': return '#F59E0B';
      case 'Sent': return '#3B82F6';
      case 'Draft': return '#64748B';
      case 'Overdue': return '#EF4444';
      case 'Cancelled': return '#94A3B8';
      default: return '#64748B';
    }
  };

  const handleMarkPaid = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    showToast("Invoice marked as Paid.");
  };

  const handleCreateInvoice = (data) => {
    const newInv = {
      id: "INV-" + Math.floor(Math.random() * 9000 + 1000),
      client: data.client,
      candidate: data.deployment || "General Service",
      type: data.chargeType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      due: data.dueDate,
      amount: data.total,
      status: 'Sent'
    };
    setInvoices([newInv, ...invoices]);
    setCreateInvVisible(false);
    showToast("Invoice generated successfully.");
  };

  const renderSummary = (label, amount, color) => (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryAmt, { color }]}>₹{amount.toLocaleString()}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );

  const pendingInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <DollarSign size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Revenue & Payments</Text>
        </View>
        <Text style={styles.headerSub}>Track placement fees, contract revenue, and invoices.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Filters */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {['This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'].map(f => (
              <TouchableOpacity key={f} style={[styles.filterChip, activeDateFilter === f && styles.filterChipActive]} onPress={() => setActiveDateFilter(f)}>
                <Text style={[styles.filterChipText, activeDateFilter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryScrollContent}>
          {renderSummary("Total Revenue", 110000, NAVY)}
          {renderSummary("Placement Fees", 95000, "#10B981")}
          {renderSummary("Replacement Chg.", 15000, "#F59E0B")}
          {renderSummary("Pending Amt", 65000, "#3B82F6")}
          {renderSummary("Overdue Amt", 15000, "#EF4444")}
        </ScrollView>

        {/* Native Trend Chart (Visual Simulation) */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Revenue Trend (Paid vs Pending)</Text>
          <View style={styles.chartBox}>
            {/* Simple Bar Chart using Views */}
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '80%', backgroundColor: '#10B981' }]} />
              <View style={[styles.bar, { height: '30%', backgroundColor: '#3B82F6' }]} />
              <Text style={styles.barLabel}>W1</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '50%', backgroundColor: '#10B981' }]} />
              <View style={[styles.bar, { height: '60%', backgroundColor: '#3B82F6' }]} />
              <Text style={styles.barLabel}>W2</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '90%', backgroundColor: '#10B981' }]} />
              <View style={[styles.bar, { height: '20%', backgroundColor: '#3B82F6' }]} />
              <Text style={styles.barLabel}>W3</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: '40%', backgroundColor: '#10B981' }]} />
              <View style={[styles.bar, { height: '70%', backgroundColor: '#3B82F6' }]} />
              <Text style={styles.barLabel}>W4</Text>
            </View>
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#10B981'}]} /><Text style={styles.legendText}>Paid</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#3B82F6'}]} /><Text style={styles.legendText}>Pending</Text></View>
          </View>
        </View>

        {/* Tabs & Create Btn */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            <TouchableOpacity style={[styles.tab, activeTab === 'Invoices' && styles.tabActive]} onPress={() => setActiveTab('Invoices')}>
              <Text style={[styles.tabText, activeTab === 'Invoices' && styles.tabTextActive]}>All Invoices</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'Pending' && styles.tabActive]} onPress={() => setActiveTab('Pending')}>
              <Text style={[styles.tabText, activeTab === 'Pending' && styles.tabTextActive]}>Pending Payments</Text>
              {pendingInvoices.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{pendingInvoices.length}</Text></View>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => setCreateInvVisible(true)}>
            <Plus size={16} color="#fff" />
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Lists */}
        <View style={styles.listContainer}>
          {(activeTab === 'Invoices' ? invoices : pendingInvoices).map(item => (
            <View key={item.id} style={styles.invCard}>
              <View style={styles.invHeader}>
                <View style={{flex: 1}}>
                  <Text style={styles.invClient}>{item.client}</Text>
                  <Text style={styles.invId}>{item.id} • {item.type}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.invAmt}>₹{item.amount.toLocaleString()}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.invDetailsRow}>
                <Text style={styles.invDetailText}>Target: {item.candidate}</Text>
              </View>

              <View style={styles.invDatesRow}>
                <View style={styles.invDateBox}><Text style={styles.invDateLabel}>Date</Text><Text style={styles.invDateVal}>{item.date}</Text></View>
                <View style={styles.invDateBox}><Text style={styles.invDateLabel}>Due</Text><Text style={[styles.invDateVal, item.status === 'Overdue' && {color: '#EF4444'}]}>{item.due}</Text></View>
              </View>

              <View style={styles.invFooter}>
                <TouchableOpacity style={styles.iconBtnOutline}><Download size={16} color="#64748B" /></TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtnOutline}><Text style={styles.secondaryBtnText}>View</Text></TouchableOpacity>
                {item.status !== 'Paid' && (
                  <>
                    <TouchableOpacity style={styles.iconBtnOutline} onPress={() => showToast("Reminder sent to client")}><Send size={16} color={NAVY} /></TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => handleMarkPaid(item.id)}><Text style={styles.primaryBtnSmallText}>Mark Paid</Text></TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal 
        visible={createInvVisible} 
        onClose={() => setCreateInvVisible(false)} 
        onSave={handleCreateInvoice} 
      />

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B' },

  filterSection: { padding: 16, paddingBottom: 0 },
  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  summaryScroll: { paddingVertical: 16 },
  summaryScrollContent: { paddingHorizontal: 16, gap: 12 },
  summaryCard: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  summaryAmt: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  summaryLabel: { fontSize: 11, color: '#64748B' },

  chartSection: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  chartBox: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 8 },
  barGroup: { flexDirection: 'row', alignItems: 'flex-end', height: '100%', gap: 4, paddingHorizontal: 8 },
  bar: { width: 12, borderRadius: 4 },
  barLabel: { position: 'absolute', bottom: -24, left: 10, fontSize: 11, color: '#64748B' },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: '#64748B' },

  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#fff' },
  tabsRow: { flexDirection: 'row', gap: 16 },
  tab: { paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent', flexDirection: 'row', alignItems: 'center' },
  tabActive: { borderBottomColor: NAVY },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  tabTextActive: { color: NAVY, fontWeight: 'bold' },
  badge: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  createBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

  listContainer: { padding: 16 },
  invCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  invHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  invClient: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  invId: { fontSize: 12, color: '#64748B' },
  invAmt: { fontSize: 16, fontWeight: 'bold', color: '#10B981', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold' },

  invDetailsRow: { marginBottom: 12 },
  invDetailText: { fontSize: 13, color: '#475569' },

  invDatesRow: { flexDirection: 'row', gap: 24, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16 },
  invDateBox: { flex: 1 },
  invDateLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  invDateVal: { fontSize: 13, color: '#1E293B', fontWeight: '500' },

  invFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  iconBtnOutline: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnOutline: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  primaryBtnSmall: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
  primaryBtnSmallText: { fontSize: 13, color: '#fff', fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
