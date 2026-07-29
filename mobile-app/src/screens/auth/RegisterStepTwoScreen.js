import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { User, Mail, ArrowRight, Building2, MapPin, CircleCheck as CheckCircle, Shield, ChevronDown, ChevronUp, Lock } from 'lucide-react-native';

import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import SelectField from '../../components/auth/SelectField';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';
import { registerApi } from '../../services/api.service';
import { getDocumentRequirements } from '../../config/authDocumentRequirements';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurugram', 'Jaipur', 'Lucknow', 'Indore', 'Amritsar', 'Chandigarh'];

export default function RegisterStepTwoScreen({ navigation, route }) {
  const existingState = route.params?.registrationData || {};
  const { width } = useWindowDimensions();
  
  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(width * 0.92, 540) : width * 0.92;
  const showTwoColumns = width >= 360;

  // Form State
  const [firstName, setFirstName] = useState(existingState.firstName || '');
  const [lastName, setLastName] = useState(existingState.lastName || '');
  const [email, setEmail] = useState(existingState.email || '');
  const [password, setPassword] = useState(existingState.password || '');
  const [confirmPassword, setConfirmPassword] = useState(existingState.confirmPassword || '');
  const [city, setCity] = useState(existingState.city || '');

  // Errors & UI State
  const [errors, setErrors] = useState({});
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUploadedCount = () => {
    const docs = existingState.documents || {};
    const reqs = getDocumentRequirements(
      existingState.bizCategory,
      existingState.specialized,
      existingState.subCategory
    );
    const reqList = reqs.filter(d => d.requirement === 'Required');
    const reqUploaded = reqList.filter(d => docs[d.id]).length;
    return `${reqUploaded} of ${reqList.length}`;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: AUTH_COLORS.muted };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    
    if (score <= 2) return { label: 'Weak', color: AUTH_COLORS.error };
    if (score === 3) return { label: 'Medium', color: AUTH_COLORS.warning };
    return { label: 'Strong', color: AUTH_COLORS.success };
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    let isValid = true;
    const nextErrors = {};

    if (!firstName.trim()) { nextErrors.firstName = 'Required'; isValid = false; }
    if (!lastName.trim()) { nextErrors.lastName = 'Required'; isValid = false; }
    
    if (!email.trim()) {
      nextErrors.email = 'Email is required'; isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address'; isValid = false;
    }

    if (!password) {
      nextErrors.password = 'Password is required'; isValid = false;
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'; isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      nextErrors.password = 'Password needs uppercase, lowercase & number'; isValid = false;
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password'; isValid = false;
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match'; isValid = false;
    }

    if (!city) {
      nextErrors.city = 'Operational Headquarters City is required'; isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validate()) return;
    const registrationData = { 
      ...existingState, 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      confirmPassword, 
      city 
    };
    
    setIsSubmitting(true);
    try {
      const response = await registerApi(registrationData);
      const token = response?.data?.token || response?.token;
      navigation.navigate('RegisterStepThree', { registrationData, token });
    } catch (error) {
      console.error('Registration Step 2 Error:', error);
      alert(error.response?.data?.message || error.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = () => {
    return (
      firstName.trim() && 
      lastName.trim() && 
      email.trim() && 
      password && 
      confirmPassword && 
      city
    );
  };

  const toggleSummary = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSummaryExpanded(!summaryExpanded);
  };

  const strength = getPasswordStrength(password);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentWrapper, { width: contentWidth }]}>
            <AuthCard>
              <AuthTabs activeTab="register" onTabChange={(tab) => tab === 'login' && navigation.navigate('Login')} />
              <RegistrationStepIndicator currentStep={2} />

              <View style={styles.headerBlock}>
                <Text style={styles.stepHeader}>STEP 2 OF 3</Text>
                <Text style={styles.heading}>Owner Account Details</Text>
                <Text style={styles.subtitle}>Create the account that will manage this business.</Text>
              </View>

              {/* Section 1: Owner Information */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>Owner Information</Text>

                <View style={showTwoColumns ? styles.rowFields : styles.colFields}>
                  <FormField 
                    label="First Name *" 
                    icon={User} 
                    placeholder="John"
                    value={firstName}
                    onChangeText={(val) => { setFirstName(val); clearError('firstName'); }}
                    error={errors.firstName}
                    containerStyle={showTwoColumns ? { flex: 1, marginRight: 6, marginBottom: 0 } : { marginBottom: 12 }}
                  />
                  <FormField 
                    label="Last Name *" 
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={(val) => { setLastName(val); clearError('lastName'); }}
                    error={errors.lastName}
                    containerStyle={showTwoColumns ? { flex: 1, marginLeft: 6, marginBottom: 0 } : { marginBottom: 12 }}
                  />
                </View>

                <FormField 
                  label="Email Address *" 
                  icon={Mail} 
                  placeholder="admin@company.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => { setEmail(val); clearError('email'); }}
                  error={errors.email}
                />

                <SelectField 
                  label="Operational Headquarters City *"
                  icon={MapPin}
                  options={CITIES}
                  searchable
                  value={city}
                  onSelect={(val) => { setCity(val); clearError('city'); }}
                  error={errors.city}
                />
              </View>

              {/* Section 2: Account Security */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>Account Security</Text>

                <PasswordField 
                  label="Password *" 
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(val) => { setPassword(val); clearError('password'); }}
                  error={errors.password}
                  showChecklist={false}
                />

                <PasswordField 
                  label="Confirm Password *" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(val) => { setConfirmPassword(val); clearError('confirmPassword'); }}
                  error={errors.confirmPassword}
                  showChecklist={false}
                />

                <Text style={styles.passwordHelper}>
                  Use at least 8 characters with uppercase, lowercase and a number.
                </Text>

                {password.length > 0 && (
                  <View style={styles.strengthRow}>
                    <Text style={styles.strengthLabel}>Password Strength: </Text>
                    <Text style={[styles.strengthValue, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Section 3: Business Summary Review */}
              <View style={styles.sectionCard}>
                <TouchableOpacity 
                  style={styles.summaryHeader} 
                  onPress={toggleSummary}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.summaryTitle}>Business Summary</Text>
                    <Text style={styles.summarySubtitle} numberOfLines={1}>
                      {existingState.bizName || 'Business Name'} • {existingState.bizCategory || 'Category'}
                    </Text>
                  </View>
                  <View style={styles.summaryToggleRight}>
                    <Text style={styles.summaryToggleText}>{summaryExpanded ? 'Hide Details' : 'View Details'}</Text>
                    {summaryExpanded ? <ChevronUp size={16} color={AUTH_COLORS.accent} /> : <ChevronDown size={16} color={AUTH_COLORS.accent} />}
                  </View>
                </TouchableOpacity>

                {summaryExpanded && (
                  <View style={styles.summaryDetails}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryDetailLabel}>Business Name</Text>
                      <Text style={styles.summaryDetailVal}>{existingState.bizName}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryDetailLabel}>Type</Text>
                      <Text style={styles.summaryDetailVal}>{existingState.bizCategory}</Text>
                    </View>
                    {existingState.specialized ? (
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryDetailLabel}>Specialization</Text>
                        <Text style={styles.summaryDetailVal}>{existingState.specialized} • {existingState.subCategory}</Text>
                      </View>
                    ) : null}
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryDetailLabel}>Mobile</Text>
                      <Text style={styles.summaryDetailVal}>+91 {existingState.mobile}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryDetailLabel}>City</Text>
                      <Text style={styles.summaryDetailVal}>{existingState.city}</Text>
                    </View>
                    <View style={[styles.summaryRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                      <Text style={styles.summaryDetailLabel}>Documents</Text>
                      <Text style={styles.summaryDetailVal}>{getUploadedCount()} required files uploaded</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.editDetailsBtn} 
                  onPress={() => navigation.navigate('RegisterStepOne', { 
                    registrationData: { 
                      ...existingState, 
                      firstName, 
                      lastName, 
                      email, 
                      city, 
                      password, 
                      confirmPassword 
                    } 
                  })}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.editDetailsText}>Edit Business Details</Text>
                </TouchableOpacity>
              </View>
            </AuthCard>
          </View>
        </ScrollView>

        <View style={[styles.footerSticky, { width: contentWidth, alignSelf: 'center' }]}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.navigate('RegisterStepOne', { 
              registrationData: { 
                ...existingState, 
                firstName, 
                lastName, 
                email, 
                city, 
                password, 
                confirmPassword 
              } 
            })}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextBtn, (!isFormComplete() || isSubmitting) && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={isSubmitting}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.nextBtnText}>{isSubmitting ? "Registering..." : "Next: Verify Account"}</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AUTH_COLORS.background },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 16 
  },
  contentWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  headerBlock: { marginBottom: 16 },
  stepHeader: { fontSize: 10, fontWeight: '700', color: AUTH_COLORS.primary, letterSpacing: 1, marginBottom: 4 },
  heading: { fontSize: 22, fontWeight: '800', color: AUTH_COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: AUTH_COLORS.muted, lineHeight: 18 },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AUTH_COLORS.primary,
    marginBottom: 14
  },
  rowFields: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  colFields: { flexDirection: 'column', marginBottom: 0 },

  passwordHelper: {
    fontSize: 11,
    color: AUTH_COLORS.muted,
    lineHeight: 15,
    marginTop: 4,
    marginBottom: 8
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  strengthLabel: {
    fontSize: 12,
    color: AUTH_COLORS.primary,
    fontWeight: '600'
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '800'
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AUTH_COLORS.primary,
    marginBottom: 2
  },
  summarySubtitle: {
    fontSize: 12,
    color: AUTH_COLORS.muted
  },
  summaryToggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  summaryToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: AUTH_COLORS.accent
  },
  summaryDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AUTH_COLORS.border,
    gap: 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFD'
  },
  summaryDetailLabel: {
    fontSize: 12,
    color: AUTH_COLORS.muted,
    fontWeight: '500'
  },
  summaryDetailVal: {
    fontSize: 12,
    color: AUTH_COLORS.text,
    fontWeight: '700'
  },
  editDetailsBtn: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F8FAFD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border
  },
  editDetailsText: {
    fontSize: 12,
    fontWeight: '800',
    color: AUTH_COLORS.primary
  },

  footerSticky: {
    borderTopWidth: 1,
    borderTopColor: AUTH_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  backBtn: {
    borderWidth: 1.5,
    borderColor: AUTH_COLORS.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  backBtnText: {
    color: AUTH_COLORS.primary,
    fontSize: 14,
    fontWeight: '800'
  },
  nextBtn: {
    flex: 1,
    backgroundColor: AUTH_COLORS.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  nextBtnDisabled: {
    opacity: 0.6
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2
  }
});
