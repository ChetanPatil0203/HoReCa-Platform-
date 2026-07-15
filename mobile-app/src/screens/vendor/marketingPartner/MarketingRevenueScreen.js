import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, ToastAndroid } from 'react-native';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, 
  FileText, Download, CheckCircle, Clock, XCircle, 
  AlertCircle, Plus, ChevronDown, X, Send, CreditCard
} from 'lucide-react-native';

const DATE_FILTERS = ["Week", "Month", "Quarter", "Year", "Custom"];
const CHARGE_TYPES = [
  "Campaign Fee", "Monthly Retainer", "Creative Fee", 
  "Ad Management Fee", "Photography Fee", "Video Production Fee", 
  "Printing Fee", "Event Fee", "Website Fee"
];

const MOCK_INVOICES = [
  { id: 'INV-26001', campaignId: 'CMP-001', client: 'Azure Palace Hotel', type: 'Campaign Fee', amount: '₹50,000', date: '01 Jul 2026', due: '15 Jul 2026', status: 'Sent' },
  { id: 'INV-26002', campaignId: 'CMP-002', client: 'Café Zephyr Group', type: 'Photography Fee', amount: '₹12,000', date: '15 Jun 2026', due: '30 Jun 2026', status: 'Paid' },
  { id: 'INV-26003', campaignId: 'CMP-003', client: 'Spice Route Restaurant', type: 'Printing Fee', amount: '₹8,500', date: '01 Jun 2026', due: '15 Jun 2026', status: 'Overdue' },
  { id: 'INV-26004', campaignId: 'CMP-004', client: 'The Urban Spa', type: 'Monthly Retainer', amount: '₹20,000', date: '10 Jul 2026', due: '25 Jul 2026', status: 'Partially Paid' },
];

export default function MarketingRevenueScreen() {
  const [activeDateFilter, setActiveDateFilter] = useState("Month");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // Invoice Form State
  const [newType, setNewType] = useState('Campaign Fee');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle };
      case 'Partially Paid': return { bg: '#DBEAFE', text: '#2563EB', icon: CreditCard };
      case 'Sent': return { bg: '#FEF3C7', text: '#D97706', icon: Send };
      case 'Draft': return { bg: '#F1F5F9', text: '#475569', icon: FileText };
      case 'Overdue': return { bg: '#FEE2E2', text: '#EF4444', icon: AlertCircle };
      case 'Cancelled': return { bg: '#F1F5F9', text: '#64748B', icon: XCircle };
      default: return { bg: '#F1F5F9', text: '#475569', icon: CheckCircle };
    }
  };

  const markPaid = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Invoice marked as Paid successfully.", ToastAndroid.SHORT);
    }
  };

  const handleSave = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Invoice created and sent!", ToastAndroid.SHORT);
    }
    setAddModalVisible(false);
  };

  const renderKPIs = () => (
    <View style={styles.kpiWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiScroll}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Revenue</Text>
          <Text style={[styles.kpiVal, {color: '#8B5CF6'}]}>₹8,50,000</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pending Payments</Text>
          <Text style={[styles.kpiVal, {color: '#EF4444'}]}>₹1,20,000</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Ad Spend Managed</Text>
          <Text style={[styles.kpiVal, {color: '#3B82F6'}]}>₹4,00,000</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Paid Invoices</Text>
          <Text style={[styles.kpiVal, {color: '#10B981'}]}>145</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Refunds</Text>
          <Text style={[styles.kpiVal, {color: '#64748B'}]}>₹5,000</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderInvoiceCard = ({ item }) => {
    const stat = getStatusColor(item.status);
    const Icon = stat.icon;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
             <Text style={styles.invoiceId}>{item.id}</Text>
             <Text style={styles.clientText}>{item.client}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: stat.bg }]}>
             <Icon size={12} color={stat.text} />
             <Text style={[styles.badgeText, { color: stat.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
           <View style={{flex: 1}}>
             <Text style={styles.labelSmall}>Charge Type</Text>
             <Text style={styles.valText}>{item.type}</Text>
           </View>
           <View style={{flex: 1, alignItems: 'flex-end'}}>
             <Text style={styles.labelSmall}>Amount</Text>
             <Text style={styles.amountText}>{item.amount}</Text>
           </View>
        </View>

        <View style={[styles.detailsRow, {marginTop: 12, marginBottom: 16}]}>
           <View style={{flex: 1}}>
             <Text style={styles.labelSmall}>Invoice Date</Text>
             <Text style={styles.valSmallText}>{item.date}</Text>
           </View>
           <View style={{flex: 1, alignItems: 'flex-end'}}>
             <Text style={styles.labelSmall}>Due Date</Text>
             <Text style={[styles.valSmallText, item.status === 'Overdue' && {color: '#EF4444'}]}>{item.due}</Text>
           </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
           <TouchableOpacity style={styles.btnOutline}><FileText size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>View</Text></TouchableOpacity>
           <TouchableOpacity style={styles.btnOutline}><Download size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>Download PDF</Text></TouchableOpacity>
           
           {(item.status === 'Sent' || item.status === 'Overdue') && (
             <TouchableOpacity style={styles.btnDangerOutline}><AlertCircle size={16} color="#EF4444"/><Text style={styles.btnDangerText}>Send Reminder</Text></TouchableOpacity>
           )}
           
           {item.status !== 'Paid' && (
             <TouchableOpacity style={styles.btnPrimary} onPress={markPaid}><CheckCircle size={16} color="#fff"/><Text style={styles.btnPrimaryText}>Mark Paid</Text></TouchableOpacity>
           )}
        </ScrollView>
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal visible={addModalVisible} animationType="slide">
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalHeader}>
           <Text style={styles.modalTitle}>Create Invoice</Text>
           <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={24} color="#0F172A"/></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScroll} contentContainerStyle={{padding: 16}}>
           
           <Text style={styles.label}>Client Name</Text>
           <TextInput style={styles.input} placeholder="e.g. Azure Palace Hotel" />
           
           <Text style={styles.label}>Campaign ID (Optional)</Text>
           <TextInput style={styles.input} placeholder="e.g. CMP-001" />

           <Text style={styles.label}>Charge Type</Text>
           <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
              <Text style={styles.dropdownText}>{newType}</Text>
              <ChevronDown size={20} color="#64748B" />
           </TouchableOpacity>
           {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {CHARGE_TYPES.map(c => (
                  <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => { setNewType(c); setShowTypeDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
           )}

           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Amount (₹)</Text><TextInput style={styles.input} placeholder="e.g. 50000" keyboardType="numeric" /></View>
             <View style={styles.col}><Text style={styles.label}>Due Date</Text><TextInput style={styles.input} placeholder="DD/MM/YYYY" /></View>
           </View>

           <Text style={styles.label}>Line Items / Description</Text>
           <TextInput style={styles.textArea} placeholder="Describe the charges in detail..." multiline numberOfLines={3} />
           
        </ScrollView>
        <View style={styles.modalFooter}>
           <TouchableOpacity style={styles.btnOutlineFull}><Text style={styles.btnOutlineText}>Save as Draft</Text></TouchableOpacity>
           <TouchableOpacity style={styles.btnPrimaryFull} onPress={handleSave}><Text style={styles.btnPrimaryFullText}>Send Invoice</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Revenue & Invoices</Text>
         <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addBtnText}>Create Invoice</Text>
         </TouchableOpacity>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {DATE_FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeDateFilter === f && styles.filterChipActive]} onPress={() => setActiveDateFilter(f)}>
               <Text style={[styles.filterText, activeDateFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={MOCK_INVOICES}
        keyExtractor={item => item.id}
        renderItem={renderInvoiceCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
           <View>
             {renderKPIs()}
             
             <View style={styles.chartPlaceholder}>
                <TrendingUp size={32} color="#8B5CF6" />
                <Text style={styles.chartText}>Revenue Trend Chart Placeholder</Text>
                <Text style={styles.chartSubText}>Data synced for: {activeDateFilter}</Text>
             </View>

             <Text style={styles.sectionTitle}>Recent Invoices</Text>
           </View>
        )}
      />

      {renderAddModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A',
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6,
  },
  addBtnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  filterWrapper: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16, gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6', borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 13, fontWeight: '600', color: '#64748B',
  },
  filterTextActive: {
    color: '#fff',
  },
  kpiWrapper: {
    marginBottom: 16,
  },
  kpiScroll: {
    gap: 12,
  },
  kpiCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, width: 140,
  },
  kpiLabel: {
    fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: '500',
  },
  kpiVal: {
    fontSize: 18, fontWeight: 'bold',
  },
  chartPlaceholder: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderStyle: 'dashed'
  },
  chartText: {
    marginTop: 12, fontSize: 14, color: '#475569', fontWeight: '600'
  },
  chartSubText: {
    marginTop: 4, fontSize: 12, color: '#94A3B8'
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12,
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  invoiceId: {
    fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 2,
  },
  clientText: {
    fontSize: 13, color: '#64748B',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  badgeText: {
    fontSize: 10, fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  labelSmall: {
    fontSize: 11, color: '#94A3B8', fontWeight: '500', textTransform: 'uppercase', marginBottom: 4,
  },
  valText: {
    fontSize: 13, color: '#334155', fontWeight: '500',
  },
  valSmallText: {
    fontSize: 13, color: '#334155', fontWeight: '600',
  },
  amountText: {
    fontSize: 16, color: '#0F172A', fontWeight: 'bold',
  },
  actionsRow: {
    borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, gap: 8,
  },
  btnPrimary: {
    flexDirection: 'row', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  btnOutline: {
    flexDirection: 'row', backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  btnDangerOutline: {
    flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnDangerText: {
    color: '#EF4444', fontWeight: 'bold', fontSize: 13,
  },
  
  // Modals
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalScroll: { flex: 1 },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff', textAlignVertical: 'top', minHeight: 80 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  modalFooter: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  btnOutlineFull: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryFull: { flex: 2, backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryFullText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16, backgroundColor: '#fff' },
  dropdownText: { fontSize: 14, color: '#0F172A' },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 16, marginTop: -12, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, color: '#334155' },
});
