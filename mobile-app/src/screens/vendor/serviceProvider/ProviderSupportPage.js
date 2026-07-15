import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, ScrollView, 
  TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Headset, LifeBuoy, FileQuestion, MessageSquare, 
  ChevronRight, Plus, ArrowLeft, Upload, Send
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const MOCK_TICKETS = [
  { id: 'TKT-2026-901', subject: 'Payout delayed for last week', date: '15 Oct 2026', status: 'Open' },
  { id: 'TKT-2026-885', subject: 'App crashing on document upload', date: '10 Oct 2026', status: 'Resolved' },
  { id: 'TKT-2026-812', subject: 'How to update agency bank details?', date: '01 Oct 2026', status: 'Resolved' },
];

const MOCK_FAQS = [
  { q: "How do I add a new team member?", a: "Go to the Team tab, click the floating '+' button, and fill in the details." },
  { q: "When are payouts processed?", a: "Payouts for completed jobs are processed every Monday and credited within 2 business days." },
  { q: "Can I dispute a refund?", a: "Yes, you can create a support ticket with the Job ID and your reasons for disputing." },
];

export default function ProviderSupportPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [activeModal, setActiveModal] = useState(null); // 'create', 'faq', 'details'
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    category: '',
    description: ''
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'Resolved': return { bg: '#D1FAE5', text: '#10B981' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setActiveModal('details');
  };

  const handleCreateSubmit = () => {
    setActiveModal(null);
    setForm({ subject: '', category: '', description: '' });
    alert("Ticket created successfully!");
  };

  const renderTicketCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    return (
      <TouchableOpacity style={styles.ticketCard} onPress={() => openTicketDetails(item)}>
        <View style={styles.ticketCardContent}>
          <View style={styles.ticketHeaderRow}>
            <Text style={styles.ticketId}>{item.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.ticketSubject} numberOfLines={1}>{item.subject}</Text>
          <Text style={styles.ticketDate}>{item.date}</Text>
        </View>
        <ChevronRight size={20} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveModal('create')}>
                <View style={[styles.actionIconBox, { backgroundColor: '#DBEAFE' }]}>
                  <LifeBuoy size={24} color="#3B82F6" />
                </View>
                <Text style={styles.actionTitle}>Create Ticket</Text>
                <Text style={styles.actionDesc}>Report an issue</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveModal('faq')}>
                <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <FileQuestion size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.actionTitle}>FAQs</Text>
                <Text style={styles.actionDesc}>Quick answers</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.contactCard} onPress={() => alert("Calling +91 1800-123-4567")}>
              <View style={styles.contactContent}>
                <View style={[styles.actionIconBox, { backgroundColor: '#D1FAE5' }]}>
                  <Headset size={24} color="#10B981" />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.actionTitle}>Contact Support</Text>
                  <Text style={styles.actionDesc}>Available Mon-Sat, 9 AM - 6 PM</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tickets List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>My Tickets</Text>
            <FlatList
              data={MOCK_TICKETS}
              keyExtractor={item => item.id}
              renderItem={renderTicketCard}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MessageSquare size={48} color="#CBD5E1" />
                  <Text style={styles.emptyText}>No support tickets found.</Text>
                </View>
              }
            />
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Full Screen Modal: Create Ticket */}
        <Modal visible={activeModal === 'create'} animationType="slide" presentationStyle="formSheet">
          <SafeAreaView style={styles.fullScreenModal}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.backBtn}>
                  <ArrowLeft size={24} color={NAVY} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Create Ticket</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Subject</Text>
                <TextInput style={styles.input} placeholder="Briefly describe the issue" value={form.subject} onChangeText={t => setForm({...form, subject: t})} />
                
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput style={styles.input} placeholder="e.g. Payments, Technical, Other" value={form.category} onChangeText={t => setForm({...form, category: t})} />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput style={styles.textArea} placeholder="Provide details about the issue..." multiline numberOfLines={5} value={form.description} onChangeText={t => setForm({...form, description: t})} />

                <Text style={styles.inputLabel}>Attachments</Text>
                <TouchableOpacity style={styles.docUploadBtn}>
                  <Upload size={20} color="#64748B" />
                  <Text style={styles.docUploadText}>Upload Screenshots</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.btnPrimaryLargeGold} onPress={handleCreateSubmit}>
                  <Text style={styles.btnPrimaryLargeText}>Submit Ticket</Text>
                </TouchableOpacity>
                <View style={{ height: 60 }} />
              </ScrollView>
              
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* Full Screen Modal: Ticket Details */}
        <Modal visible={activeModal === 'details'} animationType="slide" presentationStyle="formSheet">
          <SafeAreaView style={styles.fullScreenModal}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.backBtn}>
                  <ArrowLeft size={24} color={NAVY} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedTicket?.id}</Text>
                <View style={{ width: 24 }} />
              </View>
              
              <View style={styles.chatArea}>
                <Text style={styles.chatSubject}>{selectedTicket?.subject}</Text>
                <View style={styles.chatBubbleAgency}>
                  <Text style={styles.chatTextAgency}>I haven't received the payout for last week. Please check.</Text>
                  <Text style={styles.chatTimeAgency}>15 Oct, 10:30 AM</Text>
                </View>
                <View style={styles.chatBubbleSupport}>
                  <Text style={styles.chatTextSupport}>Hello, we are looking into this. It seems there was a bank holiday which delayed processing. It will be cleared by tomorrow.</Text>
                  <Text style={styles.chatTimeSupport}>15 Oct, 11:15 AM</Text>
                </View>
              </View>

              <View style={styles.chatInputRow}>
                <TextInput style={styles.chatInput} placeholder="Type a message..." />
                <TouchableOpacity style={styles.sendBtn}>
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* Full Screen Modal: FAQs */}
        <Modal visible={activeModal === 'faq'} animationType="slide" presentationStyle="formSheet">
          <SafeAreaView style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.backBtn}>
                <ArrowLeft size={24} color={NAVY} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {MOCK_FAQS.map((faq, index) => (
                <View key={index} style={styles.faqBox}>
                  <Text style={styles.faqQ}>{faq.q}</Text>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </Modal>

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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  actionsSection: {
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 12,
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ticketCardContent: {
    flex: 1,
    marginRight: 12,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 6,
  },
  ticketDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 24,
  },
  docUploadText: {
    marginLeft: 8,
    color: '#64748B',
    fontWeight: '500',
  },
  btnPrimaryLargeGold: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  chatSubject: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 20,
    textAlign: 'center',
  },
  chatBubbleAgency: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 12,
  },
  chatTextAgency: {
    color: NAVY,
    fontSize: 14,
    lineHeight: 20,
  },
  chatTimeAgency: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 4,
  },
  chatBubbleSupport: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginBottom: 12,
  },
  chatTextSupport: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  chatTimeSupport: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: NAVY,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  faqBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqQ: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 8,
  },
  faqA: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
