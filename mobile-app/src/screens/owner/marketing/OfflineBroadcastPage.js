import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Upload, MapPin, Calendar, DollarSign, Target, Briefcase, FileText, Presentation } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';

export default function OfflineBroadcastPage({ onBack, onViewRequests }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    campaignType: '',
    businessType: '',
    budget: '',
    duration: '',
    location: '',
    targetArea: '',
    description: '',
    services: {
      Banner: false,
      Hoarding: false,
      Newspaper: false,
      Radio: false,
      Event: false,
      'Vehicle Branding': false
    }
  });

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const handleSubmit = () => {
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
            Your requirement has been shared with all verified Offline Marketing Agencies.
          </Text>
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onViewRequests}>
              <Text style={styles.primaryBtnText}>View Requests</Text>
            </TouchableOpacity>
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
          <Text style={styles.pageTitle}>Offline Marketing</Text>
          <Text style={styles.pageSubtitle}>Broadcast traditional campaign requirement to agencies</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Form Container */}
          <View style={styles.formCard}>
            
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Campaign Type</Text>
                <View style={styles.inputWrapper}>
                  <Presentation size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Festival Promo, Grand Opening" 
                    placeholderTextColor="#94A3B8"
                    value={formData.campaignType}
                    onChangeText={(t) => setFormData({...formData, campaignType: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Type</Text>
                <View style={styles.inputWrapper}>
                  <Briefcase size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Restaurant, Retail Store" 
                    placeholderTextColor="#94A3B8"
                    value={formData.businessType}
                    onChangeText={(t) => setFormData({...formData, businessType: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Budget Range</Text>
                <View style={styles.inputWrapper}>
                  <DollarSign size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. ₹50,000 - ₹1,00,000" 
                    placeholderTextColor="#94A3B8"
                    value={formData.budget}
                    onChangeText={(t) => setFormData({...formData, budget: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Campaign Duration</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. 1 Month, 15 Days" 
                    placeholderTextColor="#94A3B8"
                    value={formData.duration}
                    onChangeText={(t) => setFormData({...formData, duration: t})}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.inputWrapper}>
                  <MapPin size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Pune, Maharashtra" 
                    placeholderTextColor="#94A3B8"
                    value={formData.location}
                    onChangeText={(t) => setFormData({...formData, location: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Area (Landmarks/Pincodes)</Text>
                <View style={styles.inputWrapper}>
                  <Target size={16} color="#64748B" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Viman Nagar, MG Road" 
                    placeholderTextColor="#94A3B8"
                    value={formData.targetArea}
                    onChangeText={(t) => setFormData({...formData, targetArea: t})}
                  />
                </View>
              </View>
            </View>

            {/* Service Required Select */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Required</Text>
              <View style={styles.platformsGrid}>
                {['Banner', 'Hoarding', 'Newspaper', 'Radio', 'Event', 'Vehicle Branding'].map(service => {
                  const isActive = formData.services[service];
                  return (
                    <TouchableOpacity 
                      key={service}
                      style={[styles.platformBtn, isActive && styles.platformBtnActive]}
                      onPress={() => toggleService(service)}
                    >
                      <Text style={[styles.platformBtnText, isActive && styles.platformBtnTextActive]}>{service}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Detailed Description</Text>
              <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingVertical: 12 }]}>
                <TextInput 
                  style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                  placeholder="Describe your goals, audience, and any specific offline media requirements..." 
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
                <Upload size={24} color="#64748B" style={styles.uploadIcon} />
                <Text style={styles.uploadTitle}>Upload Files</Text>
                <Text style={styles.uploadSubtitle}>Designs, References, Guidelines (PDF, ZIP)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Broadcast Requirement</Text>
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
  input: { flex: 1, fontSize: 14, color: '#0F172A', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  platformsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  platformBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  platformBtnActive: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' }, // Differentiating offline with red accent
  platformBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  platformBtnTextActive: { color: '#DC2626' },

  uploadSection: { flexDirection: 'row', gap: 16, marginTop: 8, marginBottom: 24, flexWrap: 'wrap' },
  uploadBox: { flex: 1, minWidth: 200, height: 100, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
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
