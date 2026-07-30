import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { X, Send, Clock, User, CircleAlert as AlertCircle } from 'lucide-react-native';
import { sendSupportTicketMessageApi } from '../../../services/api.service';
import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#081A3A';

export default function TicketDetailsModal({ visible, onClose, ticket }) {
  const auth = useContext(AuthContext);
  const user = auth?.userData;
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (ticket) {
      if (Array.isArray(ticket.messages) && ticket.messages.length > 0) {
        setMessages(ticket.messages.map((m, idx) => ({
          id: m.id || idx,
          sender: m.senderRole === 'admin' || m.senderName === 'Super Admin' ? 'Super Admin' : 'You',
          isAdmin: m.senderRole === 'admin' || m.senderName === 'Super Admin',
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          text: m.message || m.text
        })));
      } else {
        setMessages([
          { id: 1, sender: 'You', isAdmin: false, time: ticket.createdAt || 'Just now', text: ticket.description || 'Ticket created.' },
          ...(ticket.adminNotes ? [{ id: 2, sender: 'Super Admin', isAdmin: true, time: ticket.lastUpdated || 'Just now', text: ticket.adminNotes }] : [])
        ]);
      }
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSend = async () => {
    if (!replyText.trim() || sending) return;

    const msgContent = replyText.trim();
    const tempMsg = {
      id: Date.now(),
      sender: 'You',
      isAdmin: false,
      time: 'Just now',
      text: msgContent
    };

    setMessages(prev => [...prev, tempMsg]);
    setReplyText("");
    setSending(true);

    try {
      const res = await sendSupportTicketMessageApi(ticket.id, {
        senderName: user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Owner'),
        senderRole: auth?.userRole || 'owner',
        message: msgContent
      });

      if (res && res.success && res.data && res.data.messages) {
        setMessages(res.data.messages.map((m, idx) => ({
          id: m.id || idx,
          sender: m.senderRole === 'admin' || m.senderName === 'Super Admin' ? 'Super Admin' : 'You',
          isAdmin: m.senderRole === 'admin' || m.senderName === 'Super Admin',
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          text: m.message || m.text
        })));
      }
    } catch (err) {
      console.warn('Send support message error:', err?.message);
    } finally {
      setSending(false);
    }
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
                <Text style={styles.descText}>{ticket.description || 'No description provided.'}</Text>
              </View>
            </View>

            <Text style={styles.timelineTitle}>CONVERSATION</Text>
            
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.msgBubble, msg.isAdmin ? styles.msgLeft : styles.msgRight]}>
                <View style={styles.msgHeader}>
                  <Text style={[styles.msgSender, msg.isAdmin && { color: '#3B82F6', fontWeight: '700' }]}>
                    {msg.sender}
                  </Text>
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
              <TouchableOpacity style={[styles.sendBtn, sending && { opacity: 0.6 }]} onPress={handleSend} disabled={sending}>
                {sending ? <ActivityIndicator size="small" color="#fff" /> : <Send size={20} color="#fff" />}
              </TouchableOpacity>
            </View>
          )}
          {(ticket.status === 'Closed' || ticket.status === 'Resolved') && (
            <View style={styles.closedBox}>
              <AlertCircle size={20} color="#64748B" />
              <Text style={styles.closedText}>This ticket is resolved/closed and cannot accept new replies.</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFF' },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  content: { flex: 1, padding: 16 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  subject: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  metaText: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  descBox: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 12 },
  descTitle: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 4 },
  descText: { fontSize: 14, color: '#1E293B', lineHeight: 20 },
  timelineTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 12, letterSpacing: 0.5 },
  msgBubble: { borderRadius: 16, padding: 12, marginBottom: 10, maxWidth: '85%' },
  msgLeft: { backgroundColor: '#EFF6FF', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#BFDBFE' },
  msgRight: { backgroundColor: '#E0F2FE', alignSelf: 'flex-end', borderBottomRightRadius: 4, borderWidth: 1, borderColor: '#BAE6FD' },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  msgSender: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginRight: 12 },
  msgTime: { fontSize: 10, color: '#94A3B8' },
  msgText: { fontSize: 14, color: '#1E293B', lineHeight: 20 },
  replyBox: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  replyInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100, marginRight: 10, color: '#0F172A' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center' },
  closedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#F1F5F9', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  closedText: { fontSize: 13, color: '#64748B', marginLeft: 8, fontWeight: '500' }
});
