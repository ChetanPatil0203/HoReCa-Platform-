import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { User, Mail, ArrowRight, Building2, MapPin, CheckCircle2, Shield } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import SelectField from '../../components/auth/SelectField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

export default function RegisterStepTwoScreen({ navigation, route }) {
  const existingState = route.params?.registrationData || {};
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const isNarrowMobile = width < 390;

  const [firstName, setFirstName] = useState(existingState.firstName || '');
  const [lastName, setLastName] = useState(existingState.lastName || '');
  const [email, setEmail] = useState(existingState.email || '');
  const [password, setPassword] = useState(existingState.password || '');
  const [confirmPassword, setConfirmPassword] = useState(existingState.confirmPassword || '');
  const [city, setCity] = useState(existingState.city || '');

  const [fnError, setFnError] = useState('');
  const [lnError, setLnError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [confError, setConfError] = useState('');
  const [cityError, setCityError] = useState('');

  const validate = () => {
    let isValid = true;
    setFnError(''); setLnError(''); setEmailError(''); setPwdError(''); setConfError(''); setCityError('');

    if (!firstName.trim()) { setFnError('Required'); isValid = false; }
    if (!lastName.trim()) { setLnError('Required'); isValid = false; }
    
    if (!email) {
      setEmailError('Enter your email address.'); isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.'); isValid = false;
    }

    if (!password) {
      setPwdError('Enter your password.'); isValid = false;
    } else if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setPwdError('Password does not meet requirements.'); isValid = false;
    }

    if (!confirmPassword) {
      setConfError('Confirm your password.'); isValid = false;
    } else if (confirmPassword !== password) {
      setConfError('Passwords do not match.'); isValid = false;
    }

    if (!city) {
      setCityError('Select an operational city.'); isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;
    const registrationData = { ...existingState, firstName, lastName, email, password, confirmPassword, city };
    navigation.navigate('RegisterStepThree', { registrationData });
  };

  const docCount = Object.keys(existingState.documents || {}).length;
  
  const getTypeString = () => {
    if (existingState.bizCategory === 'Vendor / Supplier') {
      return `Vendor / Supplier`;
    }
    return existingState.bizCategory || '-';
  };

  const isFormComplete = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword || !city) return false;
    return true;
  };

  return (
    <AuthScreenWrapper>
      <AuthCard>
        <AuthTabs activeTab="register" onTabChange={(tab) => tab === 'login' && navigation.navigate('Login')} />
        <RegistrationStepIndicator currentStep={2} />

        <View style={styles.headerBlock}>
          <Text style={styles.stepHeader}>STEP 2 OF 3</Text>
          <Text style={styles.heading}>Executive Account Details</Text>
          <Text style={styles.subtitle}>Add the authorised administrator who will manage this business account.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <User size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Executive Identity</Text>
        </View>

        <View style={isMobile ? styles.colLayout : styles.rowLayout}>
          <FormField 
            label="FIRST NAME *" 
            icon={User} 
            placeholder="John"
            value={firstName}
            onChangeText={(v) => { setFirstName(v); setFnError(''); }}
            error={fnError}
            containerStyle={!isMobile && { flex: 1, marginRight: 8 }}
          />
          <FormField 
            label="LAST NAME *" 
            placeholder="Doe"
            value={lastName}
            onChangeText={(v) => { setLastName(v); setLnError(''); }}
            error={lnError}
            containerStyle={!isMobile && { flex: 1, marginLeft: 8 }}
          />
        </View>

        <FormField 
          label="EXECUTIVE EMAIL ADDRESS *" 
          icon={Mail} 
          placeholder="admin@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(v) => { setEmail(v); setEmailError(''); }}
          error={emailError}
        />

        <View style={styles.sectionHeader}>
          <Shield size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Account Security</Text>
        </View>

        <View style={isNarrowMobile ? styles.colLayout : styles.rowLayout}>
          <PasswordField 
            label="ACCESS PASSWORD *" 
            placeholder="••••••••"
            value={password}
            onChangeText={(v) => { setPassword(v); setPwdError(''); }}
            error={pwdError}
            showChecklist
            containerStyle={!isNarrowMobile && { flex: 1, marginRight: 8 }}
          />
          <PasswordField 
            label="CONFIRM PASSWORD *" 
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setConfError(''); }}
            error={confError}
            containerStyle={!isNarrowMobile && { flex: 1, marginLeft: 8 }}
          />
        </View>

        <View style={styles.sectionHeader}>
          <MapPin size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Operational Location</Text>
        </View>

        <SelectField 
          label="OPERATIONAL HEADQUARTERS CITY *"
          icon={MapPin}
          options={CITIES}
          searchable
          value={city}
          onSelect={(v) => { setCity(v); setCityError(''); }}
          error={cityError}
        />

        <View style={styles.sectionHeader}>
          <Building2 size={16} color={AUTH_COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Business Profile Review</Text>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Business</Text>
            <Text style={styles.reviewValue}>{existingState.bizName || '-'}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Type</Text>
            <Text style={styles.reviewValue}>{getTypeString()}</Text>
          </View>
          {existingState.specialized && (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Specialization</Text>
              <Text style={styles.reviewValue}>{existingState.specialized} • {existingState.subCategory}</Text>
            </View>
          )}
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Mobile</Text>
            <Text style={styles.reviewValue}>{existingState.mobile || '-'}</Text>
          </View>
          <View style={[styles.reviewRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.reviewLabel}>Documents</Text>
            <View style={styles.docReadyWrap}>
              <CheckCircle2 size={14} color={AUTH_COLORS.success} style={{ marginRight: 4 }} />
              <Text style={styles.docReadyText}>{docCount} required files ready</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerAction}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>Back to Business Details</Text>
          </TouchableOpacity>
          <PrimaryButton 
            title="NEXT: COMPLETE SECURITY" 
            icon={ArrowRight} 
            onPress={handleNext} 
            disabled={!isFormComplete()} 
          />
        </View>

      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 26 },
  stepHeader: { fontSize: 11, fontWeight: '700', color: AUTH_COLORS.primary, letterSpacing: 1, marginBottom: 8 },
  heading: { fontSize: 26, fontWeight: 'bold', color: AUTH_COLORS.primary, marginBottom: 6, lineHeight: 30 },
  subtitle: { fontSize: 14, color: AUTH_COLORS.muted, lineHeight: 20 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: AUTH_COLORS.primary },

  rowLayout: { flexDirection: 'row', alignItems: 'flex-start' },
  colLayout: { flexDirection: 'column' },

  reviewCard: {
    backgroundColor: AUTH_COLORS.input,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    padding: 16,
    marginBottom: 8
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: AUTH_COLORS.border
  },
  reviewLabel: {
    fontSize: 13,
    color: AUTH_COLORS.muted,
    flex: 1,
    paddingRight: 8
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '600',
    color: AUTH_COLORS.text,
    flex: 2,
    textAlign: 'right'
  },
  docReadyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end'
  },
  docReadyText: {
    fontSize: 13,
    fontWeight: '600',
    color: AUTH_COLORS.success
  },

  footerAction: { marginTop: 24, alignItems: 'center' },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.muted
  }
});
