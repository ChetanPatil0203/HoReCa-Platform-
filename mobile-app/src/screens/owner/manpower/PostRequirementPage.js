import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, CheckCircle, Building, ShieldCheck, MapPin } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function PostRequirementPage({ onBack, onViewRequirements }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    jobRole: '',
    numberOfStaff: '',
    experience: '',
    salaryRange: '',
    employmentType: 'Full-time',
    shift: 'Day Shift',
    joiningDate: '',
    branch: '',
    location: '',
    accommodation: false,
    food: false,
    weeklyOff: '1 Day',
    workingHours: '9 Hours',
    urgentRequirement: false,
    description: ''
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateAndSubmit = () => {
    const newErrors = {};
    if (!formData.jobRole.trim()) newErrors.jobRole = 'Job Role is required';
    if (!formData.numberOfStaff.trim()) newErrors.numberOfStaff = 'Number of staff is required';
    if (!formData.salaryRange.trim()) newErrors.salaryRange = 'Salary range is required';
    if (!formData.joiningDate.trim()) newErrors.joiningDate = 'Joining date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success!
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={styles.successWrapper}>
        <View style={styles.successBox}>
          <ShieldCheck size={64} color="#16A34A" style={{ marginBottom: 24 }} />
          <Text style={styles.successTitle}>Requirement Posted Successfully</Text>
          <Text style={styles.successDesc}>Your manpower requirement has been shared with all verified manpower agencies in our network.</Text>
          
          <View style={styles.successActions}>

            <TouchableOpacity style={styles.secondarySuccessBtn} onPress={onBack}>
              <Text style={styles.secondarySuccessText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Post Requirement</Text>
          <Text style={styles.headerSub}>Find the right staff for your property</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Job Role *</Text>
                <TextInput 
                  style={[styles.input, errors.jobRole && styles.inputError]} 
                  placeholder="e.g. Head Chef, Waiter"
                  placeholderTextColor="#94A3B8"
                  value={formData.jobRole}
                  onChangeText={(val) => updateForm('jobRole', val)}
                />
                {errors.jobRole && <Text style={styles.errorText}>{errors.jobRole}</Text>}
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
                {errors.numberOfStaff && <Text style={styles.errorText}>{errors.numberOfStaff}</Text>}
              </View>
            </View>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Experience Required</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 2-3 Years"
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
                {errors.salaryRange && <Text style={styles.errorText}>{errors.salaryRange}</Text>}
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Work Preferences</Text>

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Employment Type</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.employmentType}
                  onChangeText={(val) => updateForm('employmentType', val)}
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

            <View style={[styles.row, isMobile && styles.rowMobile]}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Working Hours</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.workingHours}
                  onChangeText={(val) => updateForm('workingHours', val)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weekly Off</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.weeklyOff}
                  onChangeText={(val) => updateForm('weeklyOff', val)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Location & Facilities</Text>

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
                {errors.joiningDate && <Text style={styles.errorText}>{errors.joiningDate}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Branch</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Andheri East"
                  placeholderTextColor="#94A3B8"
                  value={formData.branch}
                  onChangeText={(val) => updateForm('branch', val)}
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
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            <View style={styles.switchesRow}>
              <View style={styles.switchBox}>
                <Switch 
                  value={formData.accommodation}
                  onValueChange={(val) => updateForm('accommodation', val)}
                  trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                  thumbColor={formData.accommodation ? BLUE : "#94A3B8"}
                />
                <Text style={styles.switchLabel}>Accommodation Provided</Text>
              </View>
              <View style={styles.switchBox}>
                <Switch 
                  value={formData.food}
                  onValueChange={(val) => updateForm('food', val)}
                  trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                  thumbColor={formData.food ? BLUE : "#94A3B8"}
                />
                <Text style={styles.switchLabel}>Food Provided</Text>
              </View>
              <View style={styles.switchBox}>
                <Switch 
                  value={formData.urgentRequirement}
                  onValueChange={(val) => updateForm('urgentRequirement', val)}
                  trackColor={{ false: "#E2E8F0", true: "#FECACA" }}
                  thumbColor={formData.urgentRequirement ? "#DC2626" : "#94A3B8"}
                />
                <Text style={styles.switchLabel}>Urgent Requirement</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Write any specific skills or requirements..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(val) => updateForm('description', val)}
              />
            </View>

            <View style={styles.submitWrapper}>
              <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit}>
                <Text style={styles.submitBtnText}>Post Requirement</Text>
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
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 24 },

  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  rowMobile: { flexDirection: 'column', gap: 0 },
  inputGroup: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  textArea: { height: 100, textAlignVertical: 'top' },

  switchesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: 8 },
  switchBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#0F172A' },

  submitWrapper: { marginTop: 32, alignItems: 'center' },
  submitBtn: { backgroundColor: GOLD, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 12, width: Platform.OS === 'web' ? 'auto' : '100%', alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Success Screen
  successWrapper: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successBox: { backgroundColor: '#fff', borderRadius: 24, padding: 40, alignItems: 'center', maxWidth: 480, width: '100%', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  successDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  successActions: { width: '100%', gap: 12 },
  primarySuccessBtn: { backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center', width: '100%' },
  primarySuccessText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondarySuccessBtn: { backgroundColor: '#F8FAFC', paddingVertical: 14, borderRadius: 12, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: colors.border },
  secondarySuccessText: { color: '#0F172A', fontSize: 15, fontWeight: '700' }
});
