import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Send, Clock, User, AlertCircle } from 'lucide-react-native';

const NAVY = '#081A3A';

export default function TicketDetailsModal({ visible, onClose, ticket }) {
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Support Team', time: '10:00 AM', text: 'Hello, we have received your request and our technical team is looking into the billing discrepancy.' },
    { id: 2, sender: 'You', time: '10:15 AM', text: 'Thank you. Please let me know if you need the invoice copy.' }
  ]);
  
  if (!ticket) return null;

  const handleSend = () => {
    if(!replyText.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', time: 'Just now', text: replyText }]);
    setReplyText("");
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

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
          <Text style={styles.title}>Ticket {ticket.id}</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.subject}>{ticket.subject}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '15' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>{ticket.status}</Text>
                </View>
              </View>
              <Text style={styles.metaText}>Category: {ticket.category}  •  Priority: {ticket.priority}</Text>
              
              <View style={styles.descBox}>
                <Text style={styles.descTitle}>Description</Text>
                <Text style={styles.descText}>I generated an invoice (INV-1002) for Starbucks but the system calculated the GST incorrectly based on the discount provided.</Text>
              </View>
            </View>

            <Text style={styles.timelineTitle}>Conversation</Text>
            
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.msgBubble, msg.sender === 'You' ? styles.msgRight : styles.msgLeft]}>
                <View style={styles.msgHeader}>
                  <Text style={styles.msgSender}>{msg.sender}</Text>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            ))}

            <View style={{height: 20}} />
          </ScrollView>

          {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
            <View style={styles.replyBox}>
              <TextInput style={styles.replyInput} placeholder="Type your reply here..." value={replyText} onChangeText={setReplyText} multiline />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {(ticket.status === 'Closed' || ticket.status === 'Resolved') && (
            <View style={styles.closedBox}>
              <AlertCircle size={20} color="#64748B" />
              <Text style={styles.closedText}>This ticket is closed and cannot accept new replies.</Text>
            </View>
          )}

        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  closeBtn: { padding: 4 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1, padding: 16 },

  infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  subject: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  metaText: { fontSize: 13, color: '#64748B', marginBottom: 16 },

  descBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  descTitle: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginBottom: 4 },
  descText: { fontSize: 13, color: '#334155', lineHeight: 20 },

  timelineTitle: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 16, textTransform: 'uppercase' },

  msgBubble: { padding: 12, borderRadius: 12, marginBottom: 12, maxWidth: '85%' },
  msgLeft: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  msgRight: { backgroundColor: '#EFF6FF', alignSelf: 'flex-end', borderBottomRightRadius: 4, borderWidth: 1, borderColor: '#BFDBFE' },
  
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  msgSender: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  msgTime: { fontSize: 10, color: '#94A3B8', marginLeft: 12 },
  msgText: { fontSize: 14, color: '#334155', lineHeight: 20 },

  replyBox: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  replyInput: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100, minHeight: 44, color: '#1E293B' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },

  closedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#F1F5F9', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  closedText: { marginLeft: 8, fontSize: 13, color: '#64748B' }
});
