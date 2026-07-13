import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function DirectRequirementPage({ agency, onBack, onHome }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    jobRole: '',
    numberOfStaff: '',
    experience: '',
    salaryRange: '',
    joiningDate: '',
    shift: 'Day Shift',
    location: '',
    notes: ''
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateAndSubmit = () => {
    const newErrors = {};
    if (!formData.jobRole.trim()) newErrors.jobRole = 'Required';
    if (!formData.numberOfStaff.trim()) newErrors.numberOfStaff = 'Required';
    if (!formData.salaryRange.trim()) newErrors.salaryRange = 'Required';
    if (!formData.joiningDate.trim()) newErrors.joiningDate = 'Required';
    if (!formData.location.trim()) newErrors.location = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={styles.successWrapper}>
        <View style={styles.successBox}>
          <ShieldCheck size={64} color="#16A34A" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Requirement Sent Successfully</Text>
          <Text style={styles.successDesc}>This requirement has been sent only to <Text style={styles.boldText}>{agency?.name}</Text>. They will review it and get back to you shortly.</Text>
          
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.primarySuccessBtn} onPress={onHome}>
              <Text style={styles.primarySuccessText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Direct Requirement</Text>
          <Text style={styles.headerSub}>Sending to {agency?.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Requirement Details</Text>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Job Role *</Text>
                <TextInput 
                  style={[styles.input, errors.jobRole && styles.inputError]} 
                  placeholder="e.g. Head Chef"
                  placeholderTextColor="#94A3B8"
                  value={formData.jobRole}
                  onChangeText={(val) => updateForm('jobRole', val)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number Of Staff *</Text>
                <TextInput 
                  style={[styles.input, errors.numberOfStaff && styles.inputError]} 
                  placeholder="e.g. 5"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  value={formData.numberOfStaff}
                  onChangeText={(val) => updateForm('numberOfStaff', val)}
                />
              </View>
            </View>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Experience</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 2 Years"
                  placeholderTextColor="#94A3B8"
                  value={formData.experience}
                  onChangeText={(val) => updateForm('experience', val)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Salary Range *</Text>
                <TextInput 
                  style={[styles.input, errors.salaryRange && styles.inputError]} 
                  placeholder="e.g. ₹15,000 - ₹20,000"
                  placeholderTextColor="#94A3B8"
                  value={formData.salaryRange}
                  onChangeText={(val) => updateForm('salaryRange', val)}
                />
              </View>
            </View>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Joining Date *</Text>
                <TextInput 
                  style={[styles.input, errors.joiningDate && styles.inputError]} 
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#94A3B8"
                  value={formData.joiningDate}
                  onChangeText={(val) => updateForm('joiningDate', val)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Shift</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.shift}
                  onChangeText={(val) => updateForm('shift', val)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput 
                style={[styles.input, errors.location && styles.inputError]} 
                placeholder="Full Address or City"
                placeholderTextColor="#94A3B8"
                value={formData.location}
                onChangeText={(val) => updateForm('location', val)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes / Specific Needs</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Write any specific skills or requirements..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={formData.notes}
                onChangeText={(val) => updateForm('notes', val)}
              />
            </View>

            <View style={styles.submitWrapper}>
              <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit}>
                <Text style={styles.submitBtnText}>Send Directly to Agency</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },

  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  rowMobile: { flexDirection: 'column', gap: 0 },
  inputGroup: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  textArea: { height: 100, textAlignVertical: 'top' },

  submitWrapper: { marginTop: 32, alignItems: 'center' },
  submitBtn: { backgroundColor: BLUE, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 12, width: Platform.OS === 'web' ? 'auto' : '100%', alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Success Screen
  successWrapper: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successBox: { backgroundColor: '#fff', borderRadius: 24, padding: 40, alignItems: 'center', maxWidth: 480, width: '100%', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  boldText: { fontWeight: '700', color: '#0F172A' },
  successActions: { width: '100%' },
  primarySuccessBtn: { backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center', width: '100%' },
  primarySuccessText: { color: '#fff', fontSize: 15, fontWeight: '800' }
});
