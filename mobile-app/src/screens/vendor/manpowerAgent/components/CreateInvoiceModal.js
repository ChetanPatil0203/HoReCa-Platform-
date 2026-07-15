import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X, CheckCircle, FileText, Calculator } from 'lucide-react-native';

const NAVY = '#081A3A';

export default function CreateInvoiceModal({ visible, onClose, onSave }) {
  const [formData, setFormData] = useState({
    client: '',
    deployment: '',
    chargeType: 'Placement Fee',
    serviceAmount: '',
    taxRate: '18', // standard GST
    discount: '0',
    dueDate: '',
    notes: ''
  });

  const [total, setTotal] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    const amount = parseFloat(formData.serviceAmount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const taxRate = parseFloat(formData.taxRate) || 0;

    const postDiscount = Math.max(0, amount - discount);
    const taxAmt = postDiscount * (taxRate / 100);
    setTotal(postDiscount + taxAmt);
  }, [formData.serviceAmount, formData.taxRate, formData.discount]);

  const handleSave = () => {
    if (!formData.client || !formData.serviceAmount || !formData.dueDate) {
      showToast("Client, Service Amount, and Due Date are required.");
      return;
    }
    onSave && onSave({ ...formData, total });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
          <Text style={styles.title}>Create Invoice</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              
              <Text style={styles.inputLabel}>Client / Business *</Text>
              <TextInput style={styles.input} value={formData.client} onChangeText={t => setFormData({...formData, client: t})} placeholder="e.g. JW Marriott" />

              <Text style={styles.inputLabel}>Linked Deployment (Optional)</Text>
              <TextInput style={styles.input} value={formData.deployment} onChangeText={t => setFormData({...formData, deployment: t})} placeholder="e.g. Vikram Singh - Sous Chef" />

              <Text style={styles.inputLabel}>Charge Type</Text>
              <TextInput style={styles.input} value={formData.chargeType} onChangeText={t => setFormData({...formData, chargeType: t})} placeholder="Placement Fee, Monthly Service Charge..." />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Financials</Text>
              
              <Text style={styles.inputLabel}>Service Amount (₹) *</Text>
              <TextInput style={styles.input} value={formData.serviceAmount} onChangeText={t => setFormData({...formData, serviceAmount: t})} placeholder="e.g. 25000" keyboardType="numeric" />

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Discount (₹)</Text>
                  <TextInput style={styles.input} value={formData.discount} onChangeText={t => setFormData({...formData, discount: t})} keyboardType="numeric" />
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>Tax Rate (%)</Text>
                  <TextInput style={styles.input} value={formData.taxRate} onChangeText={t => setFormData({...formData, taxRate: t})} keyboardType="numeric" />
                </View>
              </View>

              <View style={styles.calcBox}>
                <Calculator size={20} color="#10B981" />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.calcLabel}>Total Invoice Value</Text>
                  <Text style={styles.calcValue}>₹{total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Terms</Text>
              
              <Text style={styles.inputLabel}>Due Date *</Text>
              <TextInput style={styles.input} value={formData.dueDate} onChangeText={t => setFormData({...formData, dueDate: t})} placeholder="DD MMM YYYY" />

              <Text style={styles.inputLabel}>Notes / Terms</Text>
              <TextInput style={styles.inputArea} value={formData.notes} onChangeText={t => setFormData({...formData, notes: t})} placeholder="Any specific payment instructions..." multiline />
            </View>

            <View style={{height: 40}} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleSave}>
              <FileText size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.primaryBtnLargeText}>Generate Invoice</Text>
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

  formSection: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },

  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16, color: '#1E293B' },
  inputArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  calcBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 8, padding: 16, marginTop: 8 },
  calcLabel: { fontSize: 13, color: '#065F46', fontWeight: '500' },
  calcValue: { fontSize: 20, fontWeight: 'bold', color: '#064E3B' },

  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  toastContainer: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
