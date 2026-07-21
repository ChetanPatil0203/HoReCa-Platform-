import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Upload, Image as ImageIcon, FileText, MapPin, Calendar, Clock, DollarSign, Briefcase } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

export default function BroadcastRequirementPage({ onBack, onViewRequests }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    category: '',
    type: '',
    title: '',
    branch: '',
    location: '',
    date: '',
    time: '',
    urgency: 'Normal',
    budget: '',
    description: ''
  });

  const handleSubmit = () => {
    // In a real app, API call goes here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle size={64} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>Requirement Posted Successfully</Text>
          <Text style={styles.successDesc}>
            Your requirement has been shared with all eligible verified service providers.
          </Text>
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onBack}>
              <Text style={styles.secondaryBtnText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Broadcast Requirement</Text>
          <Text style={styles.pageSubtitle}>Send your service request to all verified providers</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Form Container */}
          <View style={styles.formCard}>
            
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Category</Text>
                <View style={styles.inputWrapper}>
                  <Briefcase size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Cleaning, Maintenance, Plumbing" 
                    placeholderTextColor="#94A3B8"
                    value={formData.category}
                    onChangeText={(t) => setFormData({...formData, category: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Type</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Deep Kitchen Cleaning" 
                    placeholderTextColor="#94A3B8"
                    value={formData.type}
                    onChangeText={(t) => setFormData({...formData, type: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Requirement Title</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Clear and concise title for the providers" 
                  placeholderTextColor="#94A3B8"
                  value={formData.title}
                  onChangeText={(t) => setFormData({...formData, title: t})}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Branch</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Downtown Branch" 
                    placeholderTextColor="#94A3B8"
                    value={formData.branch}
                    onChangeText={(t) => setFormData({...formData, branch: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.inputWrapper}>
                  <MapPin size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Full Address" 
                    placeholderTextColor="#94A3B8"
                    value={formData.location}
                    onChangeText={(t) => setFormData({...formData, location: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Date</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="DD/MM/YYYY" 
                    placeholderTextColor="#94A3B8"
                    value={formData.date}
                    onChangeText={(t) => setFormData({...formData, date: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Time</Text>
                <View style={styles.inputWrapper}>
                  <Clock size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="HH:MM AM/PM" 
                    placeholderTextColor="#94A3B8"
                    value={formData.time}
                    onChangeText={(t) => setFormData({...formData, time: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Urgency</Text>
                <View style={styles.urgencyRow}>
                  {['Normal', 'High', 'Emergency'].map(level => (
                    <TouchableOpacity 
                      key={level}
                      style={[
                        styles.urgencyBtn, 
                        formData.urgency === level && styles.urgencyBtnActive,
                        formData.urgency === level && level === 'Emergency' && { backgroundColor: '#FEF2F2', borderColor: '#DC2626' }
                      ]}
                      onPress={() => setFormData({...formData, urgency: level})}
                    >
                      <Text style={[
                        styles.urgencyBtnText, 
                        formData.urgency === level && styles.urgencyBtnTextActive,
                        formData.urgency === level && level === 'Emergency' && { color: '#DC2626' }
                      ]}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Budget Range</Text>
                <View style={styles.inputWrapper}>
                  <DollarSign size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. ₹5,000 - ₹10,000" 
                    placeholderTextColor="#94A3B8"
                    value={formData.budget}
                    onChangeText={(t) => setFormData({...formData, budget: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  placeholder="Provide detailed information about your service requirement..." 
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={formData.description}
                  onChangeText={(t) => setFormData({...formData, description: t})}
                />
              </View>
            </View>

            {/* Uploads */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadBox}>
                <ImageIcon size={24} color="#64748B" style={styles.uploadIcon} />
                <Text style={styles.uploadTitle}>Upload Images</Text>
                <Text style={styles.uploadSubtitle}>PNG, JPG up to 5MB</Text>
              </View>
              <View style={styles.uploadBox}>
                <FileText size={24} color="#64748B" style={styles.uploadIcon} />
                <Text style={styles.uploadTitle}>Upload Documents</Text>
                <Text style={styles.uploadSubtitle}>PDF, DOCX up to 10MB</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Requirement</Text>
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
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%', gap: 32 },

  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  formRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', zIndex: 1 },
  inputGroup: { flex: 1, minWidth: 200, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 12, height: 44 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },

  urgencyRow: { flexDirection: 'row', gap: 8 },
  urgencyBtn: { flex: 1, height: 44, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  urgencyBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  urgencyBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  urgencyBtnTextActive: { color: '#2563EB' },

  uploadSection: { flexDirection: 'row', gap: 16, marginTop: 8, marginBottom: 24, flexWrap: 'wrap' },
  uploadBox: { flex: 1, minWidth: 200, height: 120, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { marginBottom: 8 },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 4 },
  uploadSubtitle: { fontSize: 12, color: '#64748B' },

  submitBtn: { height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Success State
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIconBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 12, textAlign: 'center' },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', maxWidth: 400, marginBottom: 32, lineHeight: 22 },
  successActions: { flexDirection: 'row', gap: 16, width: '100%', maxWidth: 400, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { flex: 1, minWidth: 150, height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  secondaryBtn: { flex: 1, minWidth: 150, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: NAVY }
});
