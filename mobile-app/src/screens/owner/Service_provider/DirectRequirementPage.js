import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CircleCheck as CheckCircle, MapPin, Calendar, Clock, DollarSign, Briefcase } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { AuthContext } from '../../../context/AuthContext';
import { createRequirementApi } from '../../../services/api.service';

const NAVY = '#0E2042';

export default function DirectRequirementPage({ provider, onBack, onHome }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    service: '',
    date: '',
    time: '',
    budget: '',
    location: '',
    description: ''
  });

  const handleSubmit = async () => {
    try {
      await createRequirementApi({
        ownerId,
        supplierId: provider?.id, // specific provider vendor
        type: 'serviceProvider',
        requestType: 'direct',
        title: formData.service || `${formData.category} Service Request`,
        description: formData.description,
        budget: formData.budget,
        location: formData.location,
        extraData: {
          category: formData.category,
          date: formData.date,
          time: formData.time,
        }
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit direct service requirement:', err);
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <CheckCircle size={64} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>Requirement Sent Successfully</Text>
          <Text style={styles.successDesc}>
            This requirement has been sent ONLY to {provider?.name || 'the selected provider'}.
          </Text>
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onHome}>
              <Text style={styles.primaryBtnText}>Back to Services</Text>
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
          <Text style={styles.pageTitle}>Direct Requirement</Text>
          <Text style={styles.pageSubtitle}>Sending exclusively to {provider?.name || 'Selected Provider'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Form Container */}
          <View style={styles.formCard}>
            
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.inputWrapper}>
                  <Briefcase size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Cleaning" 
                    placeholderTextColor="#94A3B8"
                    value={formData.category}
                    onChangeText={(t) => setFormData({...formData, category: t})}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Kitchen Deep Cleaning" 
                    placeholderTextColor="#94A3B8"
                    value={formData.service}
                    onChangeText={(t) => setFormData({...formData, service: t})}
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
                <Text style={styles.label}>Budget</Text>
                <View style={styles.inputWrapper}>
                  <DollarSign size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. ₹5,000" 
                    placeholderTextColor="#94A3B8"
                    value={formData.budget}
                    onChangeText={(t) => setFormData({...formData, budget: t})}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.inputWrapper}>
                  <MapPin size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Branch / Address" 
                    placeholderTextColor="#94A3B8"
                    value={formData.location}
                    onChangeText={(t) => setFormData({...formData, location: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  placeholder="Provide specific details about your requirement..." 
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={formData.description}
                  onChangeText={(t) => setFormData({...formData, description: t})}
                />
              </View>
            </View>



            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Direct Requirement</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 14, paddingVertical: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pageTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 12, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 12, gap: 12 },
  contentLayoutWeb: { padding: 24, maxWidth: 800, alignSelf: 'center', width: '100%', gap: 20 },

  formCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
  formRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', zIndex: 1 },
  inputGroup: { flex: 1, minWidth: 160, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '700', color: NAVY, marginBottom: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 10, height: 40 },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, fontSize: 13, color: '#0F172A', outlineStyle: 'none' },

  uploadSection: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 16, flexWrap: 'wrap' },
  uploadBox: { flex: 1, minWidth: 160, height: 90, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { marginBottom: 4 },
  uploadTitle: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 2 },
  uploadSubtitle: { fontSize: 11, color: '#64748B' },

  submitBtn: { height: 44, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  // Success State
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  successIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '900', color: NAVY, marginBottom: 10, textAlign: 'center' },
  successDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', maxWidth: 400, marginBottom: 24, lineHeight: 20 },
  successActions: { flexDirection: 'row', gap: 12, width: '100%', maxWidth: 400, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { flex: 1, minWidth: 140, height: 44, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});
