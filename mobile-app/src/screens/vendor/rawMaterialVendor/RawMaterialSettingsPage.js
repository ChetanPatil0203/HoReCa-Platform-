import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  User, MapPin, Clock, CreditCard, FileText, Bell, Shield, ChevronRight, XCircle
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SETTINGS_SECTIONS = [
  { id: 'profile', title: 'Business Profile', icon: User },
  { id: 'warehouse', title: 'Warehouse & Delivery Areas', icon: MapPin },
  { id: 'hours', title: 'Working Hours', icon: Clock },
  { id: 'bank', title: 'Bank Details', icon: CreditCard },
  { id: 'gst', title: 'GST Information', icon: FileText },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'security', title: 'Password & Security', icon: Shield },
];

export default function RawMaterialSettingsPage() {
  const [activeModal, setActiveModal] = useState(null);

  const renderModalContent = () => {
    return (
      <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionDesc}>Update your {activeModal?.title.toLowerCase()} below.</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Field 1</Text>
          <TextInput style={styles.inputField} placeholder="Enter value" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Field 2</Text>
          <TextInput style={styles.inputField} placeholder="Enter value" />
        </View>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => setActiveModal(null)}>
          <Text style={styles.btnPrimaryText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionGroup}>
            {SETTINGS_SECTIONS.map((sec, idx) => (
              <TouchableOpacity 
                key={sec.id} 
                style={[styles.settingRow, idx === SETTINGS_SECTIONS.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => setActiveModal(sec)}
              >
                <View style={styles.settingIconBox}>
                  <sec.icon size={20} color="#64748B" />
                </View>
                <Text style={styles.settingTitle}>{sec.title}</Text>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{height: 40}} />
        </ScrollView>

        <Modal visible={!!activeModal} animationType="slide">
          <SafeAreaView style={styles.modalSafeArea}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{activeModal?.title}</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              {renderModalContent()}
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
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  scrollContent: { padding: 16 },
  sectionGroup: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingTitle: { flex: 1, fontSize: 16, color: '#334155', fontWeight: '500' },
  
  modalSafeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  sectionDesc: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#475569', marginBottom: 8 },
  inputField: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#F8FAFC' },
  btnPrimary: { backgroundColor: NAVY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
