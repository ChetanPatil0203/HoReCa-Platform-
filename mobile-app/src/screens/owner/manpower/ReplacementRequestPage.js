import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, UserMinus, ShieldCheck, Clock, CheckCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { REPLACEMENT_HISTORY } from '../../../constants/manpowerData';

const GOLD = '#D97706';
const BLUE = '#2563EB';

const STATUS_COLORS = {
  'Pending': { bg: '#FEF3C7', text: '#D97706' },
  'Approved': { bg: '#EFF6FF', text: BLUE },
  'Completed': { bg: '#DCFCE7', text: '#16A34A' },
  'Rejected': { bg: '#FEF2F2', text: '#EF4444' }
};

export default function ReplacementRequestPage({ employee, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [activeTab, setActiveTab] = useState('New Request'); // New Request | History
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    employeeName: employee ? employee.name : '',
    agency: employee ? employee.agency : '',
    reason: '',
    replacementDate: '',
    sameRole: true,
    urgent: false,
    notes: ''
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateAndSubmit = () => {
    const newErrors = {};
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Required';
    if (!formData.agency.trim()) newErrors.agency = 'Required';
    if (!formData.reason.trim()) newErrors.reason = 'Required';
    if (!formData.replacementDate.trim()) newErrors.replacementDate = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSuccess(true);
  };

  const handleReturnToHistory = () => {
    setIsSuccess(false);
    setActiveTab('History');
    setFormData({
      employeeName: '',
      agency: '',
      reason: '',
      replacementDate: '',
      sameRole: true,
      urgent: false,
      notes: ''
    });
  };

  if (isSuccess) {
    return (
      <View style={styles.successWrapper}>
        <View style={styles.successBox}>
          <ShieldCheck size={64} color="#16A34A" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Replacement Request Submitted</Text>
          <Text style={styles.successDesc}>The agency will process your replacement request for <Text style={styles.boldText}>{formData.employeeName}</Text> and revert shortly.</Text>
          
          <TouchableOpacity style={styles.primarySuccessBtn} onPress={handleReturnToHistory}>
            <Text style={styles.primarySuccessText}>View History</Text>
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Replacement Request</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          <View style={styles.tabsContainer}>
            {['New Request', 'History'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {activeTab === 'New Request' ? (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Request Details</Text>

              <View style={[styles.row, isMobile && styles.rowMobile]}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Employee Name *</Text>
                  <TextInput 
                    style={[styles.input, errors.employeeName && styles.inputError]} 
                    placeholder="e.g. Rahul Sharma"
                    placeholderTextColor="#94A3B8"
                    value={formData.employeeName}
                    onChangeText={(val) => updateForm('employeeName', val)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Agency *</Text>
                  <TextInput 
                    style={[styles.input, errors.agency && styles.inputError]} 
                    placeholder="e.g. Elite Staffing Co."
                    placeholderTextColor="#94A3B8"
                    value={formData.agency}
                    onChangeText={(val) => updateForm('agency', val)}
                  />
                </View>
              </View>

              <View style={[styles.row, isMobile && styles.rowMobile]}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Reason for Replacement *</Text>
                  <TextInput 
                    style={[styles.input, errors.reason && styles.inputError]} 
                    placeholder="e.g. Medical Leave, Performance"
                    placeholderTextColor="#94A3B8"
                    value={formData.reason}
                    onChangeText={(val) => updateForm('reason', val)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Required Replacement Date *</Text>
                  <TextInput 
                    style={[styles.input, errors.replacementDate && styles.inputError]} 
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#94A3B8"
                    value={formData.replacementDate}
                    onChangeText={(val) => updateForm('replacementDate', val)}
                  />
                </View>
              </View>

              <View style={styles.switchesRow}>
                <View style={styles.switchBox}>
                  <Switch 
                    value={formData.sameRole}
                    onValueChange={(val) => updateForm('sameRole', val)}
                    trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                    thumbColor={formData.sameRole ? BLUE : "#94A3B8"}
                  />
                  <Text style={styles.switchLabel}>Replacement for Same Role</Text>
                </View>
                <View style={styles.switchBox}>
                  <Switch 
                    value={formData.urgent}
                    onValueChange={(val) => updateForm('urgent', val)}
                    trackColor={{ false: "#E2E8F0", true: "#FECACA" }}
                    thumbColor={formData.urgent ? "#DC2626" : "#94A3B8"}
                  />
                  <Text style={styles.switchLabel}>Urgent Requirement</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Additional Notes</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Any specific comments..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={formData.notes}
                  onChangeText={(val) => updateForm('notes', val)}
                />
              </View>

              <View style={styles.submitWrapper}>
                <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit}>
                  <Text style={styles.submitBtnText}>Submit Request</Text>
                </TouchableOpacity>
              </View>

            </View>
          ) : (
            <View style={styles.historyList}>
              {REPLACEMENT_HISTORY.map(history => {
                const sColor = STATUS_COLORS[history.status] || STATUS_COLORS['Pending'];
                
                return (
                  <View key={history.id} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <View>
                        <Text style={styles.historyId}>{history.id}</Text>
                        <Text style={styles.historyEmp}>{history.employeeName}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
                        <Text style={[styles.statusText, { color: sColor.text }]}>{history.status}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.historyBody}>
                      <Text style={styles.historyText}><Text style={styles.boldText}>Reason:</Text> {history.reason}</Text>
                      <Text style={styles.historyText}><Text style={styles.boldText}>Agency:</Text> {history.agency}</Text>
                      <Text style={styles.historyText}><Text style={styles.boldText}>Requested On:</Text> {history.requestDate}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

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
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  tabsContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 24, alignSelf: 'flex-start' },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#0F172A' },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20 },

  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  rowMobile: { flexDirection: 'column', gap: 0 },
  inputGroup: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  textArea: { height: 100, textAlignVertical: 'top' },

  switchesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: 8, marginBottom: 24 },
  switchBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#0F172A' },

  submitWrapper: { marginTop: 16, alignItems: 'center' },
  submitBtn: { backgroundColor: BLUE, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 12, width: Platform.OS === 'web' ? 'auto' : '100%', alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  historyList: { gap: 16 },
  historyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 },
  historyId: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  historyEmp: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '800' },
  historyBody: { gap: 8 },
  historyText: { fontSize: 14, color: '#475569' },
  boldText: { fontWeight: '700', color: '#0F172A' },

  // Success Screen
  successWrapper: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successBox: { backgroundColor: '#fff', borderRadius: 24, padding: 40, alignItems: 'center', maxWidth: 480, width: '100%', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  primarySuccessBtn: { backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center', width: '100%' },
  primarySuccessText: { color: '#fff', fontSize: 15, fontWeight: '800' }
});
