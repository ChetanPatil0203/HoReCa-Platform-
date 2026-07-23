import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { 
  LifeBuoy, MessageSquare, Phone, Mail, ChevronRight, 
  Plus, CheckCircle, Clock, X, ChevronDown, Send
} from 'lucide-react-native';

const TABS = ["FAQ", "My Tickets", "Contact Us"];
const TICKET_TYPES = ["Billing Issue", "Technical Issue", "Campaign Dispute", "Account Setting", "Other"];

const FAQS = [
  { q: "How do I withdraw my campaign revenue?", a: "Revenue is automatically transferred to your registered bank account on the 1st and 15th of every month." },
  { q: "Can I assign multiple team members to a campaign?", a: "Yes, you can assign multiple team members to a campaign from the Team module." },
  { q: "What happens if a client rejects a creative?", a: "The status changes to 'Changes Requested'. You can view their feedback and upload a new version directly." }
];

const TICKETS = [
  { id: 'TKT-1042', subject: 'Invoice not generating for CMP-003', date: '12 Jul 2026', status: 'Open' },
  { id: 'TKT-0988', subject: 'How to update GST details?', date: '01 Jun 2026', status: 'Resolved' },
];

export default function MarketingSupportScreen() {
  const [activeTab, setActiveTab] = useState("My Tickets");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // Form State
  const [issueType, setIssueType] = useState('Technical Issue');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Support ticket submitted.", ToastAndroid.SHORT);
    }
    setAddModalVisible(false);
  };

  const renderFAQ = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={{padding: 16}}>
       <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
       {FAQS.map((faq, idx) => (
         <View key={idx} style={styles.faqCard}>
            <Text style={styles.faqQ}>{faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
         </View>
       ))}
    </ScrollView>
  );

  const renderContact = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={{padding: 16}}>
       <Text style={styles.sectionTitle}>Get in Touch</Text>
        <View style={styles.contactCard}>
          <Phone size={24} color="#071B3A" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Call Support</Text>
            <Text style={styles.contactVal}>+91 98765 43210</Text>
            <Text style={styles.contactSub}>Mon-Sat, 9 AM - 6 PM</Text>
          </View>
        </View>
        <View style={styles.contactCard}>
          <Mail size={24} color="#071B3A" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email Us</Text>
            <Text style={styles.contactVal}>support@hrechub.com</Text>
            <Text style={styles.contactSub}>Response within 24 hours</Text>
          </View>
        </View>
    </ScrollView>
  );

  const renderTicketCard = ({ item }) => {
    const isResolved = item.status === 'Resolved';
    return (
      <View style={styles.ticketCard}>
         <View style={{flex: 1}}>
           <Text style={styles.ticketSubject}>{item.subject}</Text>
           <Text style={styles.ticketId}>{item.id} • {item.date}</Text>
         </View>
         <View style={[styles.badge, isResolved ? {backgroundColor: '#D1FAE5'} : {backgroundColor: '#FEF3C7'}]}>
           {isResolved ? <CheckCircle size={12} color="#059669"/> : <Clock size={12} color="#D97706"/>}
           <Text style={[styles.badgeText, isResolved ? {color: '#059669'} : {color: '#D97706'}]}>{item.status}</Text>
         </View>
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal visible={addModalVisible} animationType="slide">
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalHeader}>
           <Text style={styles.modalTitle}>Create Support Ticket</Text>
           <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={24} color="#0F172A"/></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScroll} contentContainerStyle={{padding: 16}}>
           
           <Text style={styles.label}>Issue Type</Text>
           <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
              <Text style={styles.dropdownText}>{issueType}</Text>
              <ChevronDown size={20} color="#64748B" />
           </TouchableOpacity>
           {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {TICKET_TYPES.map(c => (
                  <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => { setIssueType(c); setShowTypeDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
           )}

           <Text style={styles.label}>Subject</Text>
           <TextInput style={styles.input} placeholder="Brief summary of the issue..." value={subject} onChangeText={setSubject} />
           
           <Text style={styles.label}>Description</Text>
           <TextInput style={styles.textArea} placeholder="Please explain the issue in detail..." multiline numberOfLines={5} value={desc} onChangeText={setDesc} />

        </ScrollView>
        <View style={styles.modalFooter}>
           <TouchableOpacity style={styles.btnPrimaryFull} onPress={handleSave}>
             <Send size={18} color="#fff" />
             <Text style={styles.btnPrimaryFullText}>Submit Ticket</Text>
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map(t => (
            <TouchableOpacity key={t} style={[styles.tabChip, activeTab === t && styles.tabChipActive]} onPress={() => setActiveTab(t)}>
               <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {activeTab === 'FAQ' && renderFAQ()}
      {activeTab === 'Contact Us' && renderContact()}
      {activeTab === 'My Tickets' && (
        <View style={{flex: 1}}>
          <FlatList
            data={TICKETS}
            keyExtractor={item => item.id}
            renderItem={renderTicketCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
             <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {renderAddModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  tabWrapper: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  tabScroll: { paddingHorizontal: 16, gap: 8 },
  tabChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  tabChipActive: { backgroundColor: '#071B3A', borderColor: '#071B3A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },
  tabContent: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  
  // FAQ
  faqCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  faqQ: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  faqA: { fontSize: 13, color: '#475569', lineHeight: 20 },
  
  // Contact
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 16 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 2 },
  contactVal: { fontSize: 16, color: '#0F172A', fontWeight: 'bold', marginBottom: 4 },
  contactSub: { fontSize: 12, color: '#94A3B8' },

  // Tickets
  listContainer: { padding: 16, paddingBottom: 80 },
  ticketCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  ticketSubject: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  ticketId: { fontSize: 12, color: '#64748B' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, marginLeft: 12 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#071B3A', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4 },
  
  // Modals
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalScroll: { flex: 1 },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff', textAlignVertical: 'top', minHeight: 120 },
  modalFooter: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimaryFull: { flexDirection: 'row', backgroundColor: '#071B3A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimaryFullText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16, backgroundColor: '#fff' },
  dropdownText: { fontSize: 14, color: '#0F172A' },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 16, marginTop: -12, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, color: '#334155' },
});
