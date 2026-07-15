import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Calendar, CheckCircle } from 'lucide-react-native';

const NAVY = '#081A3A';

export default function CreateDeploymentModal({ visible, onClose, interviewData, onSave }) {
  const [formData, setFormData] = useState({
    joiningDate: '',
    salary: '',
    shift: '',
    workingHours: '',
    weeklyOff: '',
    employmentType: 'Full-Time',
    contractDuration: '11 Months',
    replacementPeriod: '30',
    food: 'Not Provided',
    accommodation: 'Not Provided',
    notes: ''
  });

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  if (!interviewData) return null;

  const handleSave = () => {
    if (!formData.joiningDate || !formData.salary) {
      showToast("Joining date and salary are required.");
      return;
    }
    if (parseInt(formData.replacementPeriod) < 0) {
      showToast("Replacement period cannot be negative.");
      return;
    }
    
    // Simulate save
    onSave && onSave(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
          <Text style={styles.title}>Create Deployment</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            <View style={styles.summaryCard}>
               <Text style={styles.summaryTitle}>Selected Candidate</Text>
               <Text style={styles.summaryCandidate}>{interviewData.candidateName}</Text>
               <Text style={styles.summaryDetail}>{interviewData.role} • {interviewData.business}</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Key Terms *</Text>
              
              <Text style={styles.inputLabel}>Joining Date *</Text>
              <TextInput style={styles.input} value={formData.joiningDate} onChangeText={t => setFormData({...formData, joiningDate: t})} placeholder="DD MMM YYYY (e.g. 20 Jul 2026)" />

              <Text style={styles.inputLabel}>Finalized Salary *</Text>
              <TextInput style={styles.input} value={formData.salary} onChangeText={t => setFormData({...formData, salary: t})} placeholder="e.g. 25000" keyboardType="numeric" />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Working Conditions</Text>
              
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Shift</Text>
                  <TextInput style={styles.input} value={formData.shift} onChangeText={t => setFormData({...formData, shift: t})} placeholder="e.g. Morning" />
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Working Hrs</Text>
                  <TextInput style={styles.input} value={formData.workingHours} onChangeText={t => setFormData({...formData, workingHours: t})} placeholder="e.g. 9 Hours" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Weekly Off</Text>
              <TextInput style={styles.input} value={formData.weeklyOff} onChangeText={t => setFormData({...formData, weeklyOff: t})} placeholder="e.g. Rotational / Sunday" />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Contract Details</Text>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Contract Duration</Text>
                  <TextInput style={styles.input} value={formData.contractDuration} onChangeText={t => setFormData({...formData, contractDuration: t})} placeholder="e.g. 11 Months" />
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Replacement (Days)</Text>
                  <TextInput style={styles.input} value={formData.replacementPeriod} onChangeText={t => setFormData({...formData, replacementPeriod: t})} placeholder="e.g. 30" keyboardType="numeric" />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Perks & Notes</Text>
              
              <Text style={styles.inputLabel}>Food Provided?</Text>
              <TextInput style={styles.input} value={formData.food} onChangeText={t => setFormData({...formData, food: t})} placeholder="Yes / No" />

              <Text style={styles.inputLabel}>Accommodation Provided?</Text>
              <TextInput style={styles.input} value={formData.accommodation} onChangeText={t => setFormData({...formData, accommodation: t})} placeholder="Yes / No" />

              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput style={styles.inputArea} value={formData.notes} onChangeText={t => setFormData({...formData, notes: t})} placeholder="Any special instructions..." multiline />
            </View>

            <View style={{height: 40}} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleSave}>
              <CheckCircle size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.primaryBtnLargeText}>Save & Create Deployment</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Toast */}
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

  summaryCard: { backgroundColor: '#F3E8FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#D8B4FE', marginBottom: 24 },
  summaryTitle: { fontSize: 12, fontWeight: 'bold', color: '#7E22CE', marginBottom: 4 },
  summaryCandidate: { fontSize: 18, fontWeight: 'bold', color: '#4C1D95' },
  summaryDetail: { fontSize: 14, color: '#6B21A8', marginTop: 4 },

  formSection: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },

  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16, color: '#1E293B' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
