import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Upload, AlertCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

export default function ServiceComplaintPage({ onBack, onHome }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [reason, setReason] = useState('Poor Quality of Work');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reasons = ['Poor Quality of Work', 'Unprofessional Behavior', 'Late Arrival', 'Overcharged', 'Other'];

  if (isSubmitted) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color="#16A34A" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Complaint Registered</Text>
          <Text style={styles.successDesc}>Your complaint has been successfully registered. Our escalation team will review it and get back to you within 24 hours.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onHome}>
            <Text style={styles.primaryBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>File a Complaint</Text>
          <Text style={styles.pageSubtitle}>For Service BKG-84729</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={styles.warningBox}>
            <AlertCircle size={20} color="#991B1B" />
            <Text style={styles.warningText}>Complaints are taken seriously and thoroughly investigated. Please provide accurate information.</Text>
          </View>

          <View style={styles.formCard}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason for Complaint</Text>
              <View style={styles.reasonsList}>
                {reasons.map((r) => (
                  <TouchableOpacity 
                    key={r} 
                    style={[styles.reasonChip, reason === r && styles.reasonChipActive]}
                    onPress={() => setReason(r)}
                  >
                    <Text style={[styles.reasonChipText, reason === r && styles.reasonChipTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Detailed Description</Text>
              <View style={[styles.inputWrapper, { height: 120, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  placeholder="Please describe the issue in detail..." 
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Evidence (Optional)</Text>
              <View style={styles.uploadBox}>
                <Upload size={24} color="#64748B" style={{ marginBottom: 8 }} />
                <Text style={styles.uploadText}>Click to upload images or documents</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => setIsSubmitted(true)}>
              <Text style={styles.submitBtnText}>Submit Complaint</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 600, alignSelf: 'center', width: '100%' },

  warningBox: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', gap: 12 },
  warningText: { flex: 1, fontSize: 13, color: '#991B1B', lineHeight: 20 },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 12 },
  
  reasonsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: colors.border },
  reasonChipActive: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  reasonChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  reasonChipTextActive: { color: '#DC2626' },

  inputWrapper: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12 },
  input: { flex: 1, fontSize: 15, color: '#0F172A', outlineStyle: 'none' },

  uploadBox: { height: 100, borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  uploadText: { fontSize: 13, color: '#64748B' },

  submitBtn: { height: 48, borderRadius: 12, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 12, textAlign: 'center' },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', maxWidth: 350, marginBottom: 32, lineHeight: 22 },
  primaryBtn: { height: 48, paddingHorizontal: 32, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
