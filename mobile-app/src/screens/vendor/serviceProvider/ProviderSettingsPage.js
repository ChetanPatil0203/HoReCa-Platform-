import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, Modal, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  User, MapPin, Clock, FileText, CreditCard, 
  Bell, Shield, ChevronRight, ArrowLeft, Camera, Upload
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SETTINGS_MENU = [
  { id: 'profile', title: 'Agency Profile', icon: User, desc: 'Name, contact, and logo' },
  { id: 'coverage', title: 'Coverage Areas', icon: MapPin, desc: 'Service locations and zones' },
  { id: 'hours', title: 'Working Hours', icon: Clock, desc: 'Operational timings and days' },
  { id: 'documents', title: 'Documents', icon: FileText, desc: 'Licenses and verification docs' },
  { id: 'bank', title: 'Bank Details', icon: CreditCard, desc: 'Account and payout preferences' },
  { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Alert and email preferences' },
  { id: 'security', title: 'Security', icon: Shield, desc: 'Password and 2FA' },
];

export default function ProviderSettingsPage() {
  const [activeModal, setActiveModal] = useState(null);

  const [form, setForm] = useState({
    agencyName: 'HRC HUB Services',
    email: 'contact@hrchub.com',
    phone: '+91 9876543210',
    address: 'Bandra West, Mumbai',
    bankName: 'HDFC Bank',
    accNo: 'XXXX-XXXX-1234',
    ifsc: 'HDFC0001234',
  });

  const handleSave = () => {
    setActiveModal(null);
  };

  const renderModalContent = () => {
    switch(activeModal) {
      case 'profile':
        return (
          <>
            <View style={styles.photoUploadCenter}>
              <TouchableOpacity style={styles.avatarUpload}>
                <Camera size={24} color="#94A3B8" />
                <Text style={styles.photoTextSmall}>Change Logo</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Agency Name</Text>
            <TextInput style={styles.input} value={form.agencyName} onChangeText={t => setForm({...form, agencyName: t})} />
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({...form, email: t})} />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={t => setForm({...form, phone: t})} />
            <Text style={styles.inputLabel}>Registered Address</Text>
            <TextInput style={styles.textArea} value={form.address} multiline numberOfLines={3} onChangeText={t => setForm({...form, address: t})} />
          </>
        );
      case 'bank':
        return (
          <>
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput style={styles.input} value={form.bankName} onChangeText={t => setForm({...form, bankName: t})} />
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput style={styles.input} value={form.accNo} onChangeText={t => setForm({...form, accNo: t})} />
            <Text style={styles.inputLabel}>IFSC Code</Text>
            <TextInput style={styles.input} value={form.ifsc} onChangeText={t => setForm({...form, ifsc: t})} />
            <Text style={styles.inputLabel}>Upload Cancelled Cheque</Text>
            <TouchableOpacity style={styles.docUploadBtn}>
              <Upload size={20} color="#64748B" />
              <Text style={styles.docUploadText}>Select File</Text>
            </TouchableOpacity>
          </>
        );
      case 'hours':
        return (
          <>
            <Text style={styles.infoText}>Configure your standard operational hours for the agency.</Text>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.dayText}>{day}</Text>
                <TextInput style={styles.hoursInput} placeholder="09:00 AM" />
                <Text style={{marginHorizontal: 8, color: '#64748B'}}>to</Text>
                <TextInput style={styles.hoursInput} placeholder="06:00 PM" />
              </View>
            ))}
          </>
        );
      case 'coverage':
      case 'documents':
      case 'notifications':
      case 'security':
        return (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Configuration options for {SETTINGS_MENU.find(m => m.id === activeModal)?.title} will be available here.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Menu List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuContent}>
          {SETTINGS_MENU.map(item => {
            const Icon = item.icon;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                onPress={() => setActiveModal(item.id)}
              >
                <View style={styles.menuIconBox}>
                  <Icon size={24} color={NAVY} />
                </View>
                <View style={styles.menuTextContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Full Screen Modal */}
        <Modal visible={activeModal !== null} animationType="slide" presentationStyle="formSheet">
          <SafeAreaView style={styles.fullScreenModal}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.backBtn}>
                  <ArrowLeft size={24} color={NAVY} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {activeModal ? SETTINGS_MENU.find(m => m.id === activeModal)?.title : ''}
                </Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {renderModalContent()}
                
                <TouchableOpacity style={styles.btnPrimaryLarge} onPress={handleSave}>
                  <Text style={styles.btnPrimaryLargeText}>Save Changes</Text>
                </TouchableOpacity>
                <View style={{ height: 60 }} />
              </ScrollView>
              
            </KeyboardAvoidingView>
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
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
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
  menuContent: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  menuDesc: {
    fontSize: 13,
    color: '#64748B',
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
  photoUploadCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarUpload: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTextSmall: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
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
    minHeight: 80,
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
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayText: {
    width: 90,
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  hoursInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  placeholderBox: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 24,
  },
  placeholderText: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  btnPrimaryLarge: {
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
