import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  MessageSquare, Mail, Phone, ChevronDown, ChevronUp, PlusCircle, XCircle, FileText
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const TICKETS = [
  { id: 'TKT-1045', subject: 'Payment not reflected', status: 'Open', date: '14 Jul 2026' },
  { id: 'TKT-1042', subject: 'Change bank details', status: 'Resolved', date: '10 Jul 2026' },
];

const FAQS = [
  { q: 'How do I update my delivery areas?', a: 'You can update your delivery areas from Settings > Warehouse & Delivery Areas.' },
  { q: 'When is the settlement processed?', a: 'Settlements are processed every Tuesday for the previous week.' },
  { q: 'How do I report a missing payment?', a: 'Please create a support ticket with the Order ID and we will investigate it.' },
];

export default function RawMaterialSupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity style={styles.createBtn} onPress={() => setTicketModalVisible(true)}>
            <PlusCircle size={20} color="#FFFFFF" />
            <Text style={styles.createBtnText}>Create New Ticket</Text>
          </TouchableOpacity>

          {/* Recent Tickets */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recent Tickets</Text>
            {TICKETS.map(tkt => (
              <View key={tkt.id} style={styles.ticketRow}>
                <View style={styles.ticketIconBox}><FileText size={18} color="#64748B" /></View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketSubject} numberOfLines={1}>{tkt.subject}</Text>
                  <Text style={styles.ticketIdDate}>{tkt.id} • {tkt.date}</Text>
                </View>
                <View style={[styles.statusBadge, tkt.status === 'Resolved' ? styles.bgSuccess : styles.bgWarning]}>
                  <Text style={[styles.statusText, tkt.status === 'Resolved' ? styles.textSuccess : styles.textWarning]}>{tkt.status}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* FAQ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <View key={idx} style={styles.faqItem}>
                  <TouchableOpacity 
                    style={styles.faqHeader} 
                    onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                  >
                    <Text style={styles.faqQText}>{faq.q}</Text>
                    {isExpanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
                  </TouchableOpacity>
                  {isExpanded && (
                    <Text style={styles.faqAText}>{faq.a}</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Contact Support */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Contact Us Directly</Text>
            <View style={styles.contactRow}>
              <View style={styles.contactIconBox}><Phone size={20} color={NAVY} /></View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Vendor Helpline</Text>
                <Text style={styles.contactVal}>1800-123-4567</Text>
              </View>
            </View>
            <View style={styles.contactRow}>
              <View style={styles.contactIconBox}><Mail size={20} color={NAVY} /></View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactVal}>vendorsupport@hrchub.com</Text>
              </View>
            </View>
          </View>
          
          <View style={{height: 40}} />
        </ScrollView>

        <Modal visible={ticketModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalSafeArea}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Ticket</Text>
                <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subject</Text>
                  <TextInput style={styles.inputField} placeholder="E.g. Payment Issue" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput style={styles.textArea} placeholder="Describe your issue in detail..." multiline />
                </View>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setTicketModalVisible(false)}>
                  <Text style={styles.btnPrimaryText}>Submit Ticket</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  scrollContent: { padding: 16 },
  
  createBtn: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  
  ticketRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  ticketIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  ticketInfo: { flex: 1 },
  ticketSubject: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 2 },
  ticketIdDate: { fontSize: 12, color: '#94A3B8' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgWarning: { backgroundColor: '#FEF3C7' },
  textSuccess: { color: '#059669', fontSize: 11, fontWeight: '600' },
  textWarning: { color: '#D97706', fontSize: 11, fontWeight: '600' },

  faqItem: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 12 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#334155', paddingRight: 16 },
  faqAText: { fontSize: 14, color: '#64748B', marginTop: 8, lineHeight: 20 },

  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  contactIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  contactVal: { fontSize: 15, fontWeight: '600', color: NAVY },

  modalSafeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#475569', marginBottom: 8 },
  inputField: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#F8FAFC' },
  textArea: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#F8FAFC', height: 120, textAlignVertical: 'top' },
  btnPrimary: { backgroundColor: NAVY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
