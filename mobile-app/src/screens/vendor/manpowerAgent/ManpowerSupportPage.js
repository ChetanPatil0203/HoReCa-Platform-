import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Plus, ChevronRight, ChevronDown, MessageSquare, AlertCircle } from 'lucide-react-native';
import CreateTicketModal from '../../../components/vendor/manpowerAgent/CreateTicketModal';
import TicketDetailsModal from '../../../components/vendor/manpowerAgent/TicketDetailsModal';

const NAVY = '#081A3A';

const MOCK_TICKETS = [
  { id: "TKT-1045", category: "Billing", subject: "Incorrect GST calculation on Invoice 1002", priority: "High", date: "12 Jul 2026", status: "Open" },
  { id: "TKT-1022", category: "Technical", subject: "App crashing when uploading candidate photo", priority: "Medium", date: "05 Jul 2026", status: "Resolved" },
  { id: "TKT-0998", category: "Account", subject: "Update bank account details", priority: "Low", date: "20 Jun 2026", status: "Closed" }
];

const FAQS = [
  { id: 1, q: "How do I create an invoice for staff records?", a: "Go to the Revenue page, click 'Create' and fill out the details. You can link the invoice directly to an active staff record from the dropdown." },
  { id: 2, q: "How do I request a replacement for a candidate?", a: "Go to Staff Records, locate the candidate, and click 'Handle Replacement'. This will notify the client and begin the search for a new candidate." },
  { id: 3, q: "When do I receive my placement fees?", a: "Payment terms depend on your agreement with the specific employer. Generally, payments are processed within 15-30 days of invoice submission." },
  { id: 4, q: "How do I update my operational cities?", a: "Navigate to Settings > Edit Full Profile, and update the Operational Cities field. The changes will reflect immediately on your public profile." }
];

export default function ManpowerSupportPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState('My Tickets');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleCreateTicket = (data) => {
    const newTkt = {
      id: "TKT-" + Math.floor(Math.random() * 900 + 1000),
      category: data.category,
      subject: data.subject,
      priority: data.priority,
      date: "Just now",
      status: "Open"
    };
    setTickets([newTkt, ...tickets]);
    setCreateVisible(false);
    showToast("Support ticket submitted successfully.");
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return '#3B82F6';
      case 'In Progress': return '#F59E0B';
      case 'Waiting for User': return '#EF4444';
      case 'Resolved': return '#10B981';
      case 'Closed': return '#64748B';
      default: return '#64748B';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyBox}>
      <MessageSquare size={48} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>No Support Tickets</Text>
      <Text style={styles.emptyDesc}>You haven't raised any support tickets yet. If you need help, create one!</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => setCreateVisible(true)}>
        <Text style={styles.emptyBtnText}>Create Ticket</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MessageSquare size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
        <Text style={styles.headerSub}>Manage your support tickets and view FAQs.</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tab, activeTab === 'My Tickets' && styles.tabActive]} onPress={() => setActiveTab('My Tickets')}>
            <Text style={[styles.tabText, activeTab === 'My Tickets' && styles.tabTextActive]}>My Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'FAQs' && styles.tabActive]} onPress={() => setActiveTab('FAQs')}>
            <Text style={[styles.tabText, activeTab === 'FAQs' && styles.tabTextActive]}>FAQs</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'My Tickets' ? (
          <FlatList
            data={tickets}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.ticketCard} onPress={() => setSelectedTicket(item)}>
                <View style={styles.tktHeader}>
                  <Text style={styles.tktId}>{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.tktSubject} numberOfLines={2}>{item.subject}</Text>
                <View style={styles.tktFooter}>
                  <Text style={styles.tktMeta}>{item.category} • {item.date}</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            <View style={styles.faqContactBox}>
              <AlertCircle size={20} color={NAVY} />
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.faqContactTitle}>Can't find what you're looking for?</Text>
                <Text style={styles.faqContactSub}>Create a ticket and our team will get back to you within 24 hours.</Text>
              </View>
            </View>
            
            {FAQS.map((faq) => (
              <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
                <View style={styles.faqQRow}>
                  <Text style={styles.faqQText}>{faq.q}</Text>
                  {expandedFaq === faq.id ? <ChevronDown size={20} color="#64748B" /> : <ChevronRight size={20} color="#64748B" />}
                </View>
                {expandedFaq === faq.id && (
                  <View style={styles.faqABox}><Text style={styles.faqAText}>{faq.a}</Text></View>
                )}
              </TouchableOpacity>
            ))}
            <View style={{height: 40}} />
          </ScrollView>
        )}
      </View>

      {/* Floating Action Button */}
      {activeTab === 'My Tickets' && (
        <TouchableOpacity style={styles.fab} onPress={() => setCreateVisible(true)}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <CreateTicketModal visible={createVisible} onClose={() => setCreateVisible(false)} onSave={handleCreateTicket} />
      <TicketDetailsModal visible={!!selectedTicket} onClose={() => setSelectedTicket(null)} ticket={selectedTicket} />

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B' },

  tabsContainer: { paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#fff' },
  tabsRow: { flexDirection: 'row', gap: 24 },
  tab: { paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: NAVY },
  tabText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  tabTextActive: { color: NAVY, fontWeight: 'bold' },

  content: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },

  ticketCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  tktHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tktId: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold' },
  tktSubject: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  tktFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  tktMeta: { fontSize: 12, color: '#94A3B8' },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyBtn: { backgroundColor: NAVY, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  faqContactBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 24 },
  faqContactTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A' },
  faqContactSub: { fontSize: 13, color: '#1E40AF', marginTop: 4, lineHeight: 18 },

  faqItem: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  faqQRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B', paddingRight: 16 },
  faqABox: { padding: 16, paddingTop: 0, backgroundColor: '#F8FAFC' },
  faqAText: { fontSize: 14, color: '#475569', lineHeight: 22 },

  fab: { position: 'absolute', bottom: 90, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
