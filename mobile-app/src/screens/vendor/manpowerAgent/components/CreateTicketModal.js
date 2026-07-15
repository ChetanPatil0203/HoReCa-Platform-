import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Send, Paperclip } from 'lucide-react-native';

const NAVY = '#081A3A';

export default function CreateTicketModal({ visible, onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'Medium',
    relatedEntity: ''
  });

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleSave = () => {
    if (!formData.category || !formData.subject || !formData.description) {
      showToast("Category, Subject, and Description are required.");
      return;
    }
    onSave && onSave(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
          <Text style={styles.title}>Submit Support Ticket</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TextInput style={styles.input} value={formData.category} onChangeText={t => setFormData({...formData, category: t})} placeholder="e.g. Billing, Technical, Candidates" />

              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput style={styles.input} value={formData.subject} onChangeText={t => setFormData({...formData, subject: t})} placeholder="Brief summary of the issue" />

              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput style={styles.inputArea} value={formData.description} onChangeText={t => setFormData({...formData, description: t})} placeholder="Provide detailed information..." multiline />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Related Entity (Optional)</Text>
              <TextInput style={styles.input} value={formData.relatedEntity} onChangeText={t => setFormData({...formData, relatedEntity: t})} placeholder="Invoice ID, Candidate Name, etc." />

              <Text style={styles.inputLabel}>Priority Level</Text>
              <View style={styles.priorityRow}>
                {['Low', 'Medium', 'High'].map(p => (
                  <TouchableOpacity key={p} style={[styles.priorityBtn, formData.priority === p && styles.priorityBtnActive]} onPress={() => setFormData({...formData, priority: p})}>
                    <Text style={[styles.priorityBtnText, formData.priority === p && styles.priorityBtnTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Attachments</Text>
              <TouchableOpacity style={styles.attachBox} onPress={() => showToast("Attachment system unavailable in demo")}>
                <Paperclip size={20} color="#64748B" />
                <Text style={styles.attachText}>Tap to upload files (Screenshots, PDFs)</Text>
              </TouchableOpacity>
            </View>

            <View style={{height: 40}} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleSave}>
              <Send size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.primaryBtnLargeText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
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

  formSection: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16, color: '#1E293B' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  priorityBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#F8FAFC' },
  priorityBtnActive: { backgroundColor: NAVY, borderColor: NAVY },
  priorityBtnText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  priorityBtnTextActive: { color: '#fff' },

  attachBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 16, backgroundColor: '#F8FAFC' },
  attachText: { marginLeft: 8, fontSize: 13, color: '#64748B' },

  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
