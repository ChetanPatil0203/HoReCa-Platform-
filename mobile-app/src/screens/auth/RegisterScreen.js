import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { User, Building2, ShieldCheck, Check, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';

const BUSINESS_TYPES = [
  { value: "hotel", label: "Hotel", icon: "🏨" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "cafe", label: "Café", icon: "☕" },
  { value: "vendor", label: "Vendor / Agency", icon: "🏢" },
];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const { login } = useContext(AuthContext);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    let newErrors = {};
    if (!businessName) newErrors.businessName = 'Required';
    if (!businessType) newErrors.businessType = 'Required';
    if (!mobile || mobile.length < 10) newErrors.mobile = 'Enter valid mobile';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!firstName) newErrors.firstName = 'Required';
    if (!email || !email.includes('@')) newErrors.email = 'Enter valid email';
    if (!password || password.length < 6) newErrors.password = 'Min 6 chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleRegister = () => {
    // Mock registration login
    login(businessType === 'vendor' ? 'vendor' : 'owner', 'mock-jwt-token');
  };

  const steps = [
    { label: "Business", icon: Building2 },
    { label: "Owner", icon: User },
    { label: "Verify", icon: ShieldCheck },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        {/* Header & Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = i < step - 1;
              const active = i === step - 1;
              return (
                <View key={i} style={styles.stepContainer}>
                  <View style={[styles.stepIconBox, done && styles.stepIconBoxDone, active && styles.stepIconBoxActive]}>
                    {done ? <Check size={16} color={colors.white} /> : <Icon size={16} color={active ? colors.white : colors.muted} />}
                  </View>
                  <Text style={[styles.stepLabel, (active || done) && styles.stepLabelActive]}>{s.label}</Text>
                  {i < steps.length - 1 && (
                    <View style={styles.stepLine}>
                       <View style={[styles.stepLineFill, done && { width: '100%' }]} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.formCard}>
            
            {step === 1 && (
              <View style={styles.formStep}>
                <Text style={styles.stepTitle}>Business Details</Text>
                <Text style={styles.stepSubtitle}>Let's start with your company profile</Text>
                
                <CustomInput
                  label="Business Name"
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="The Meridian Hotels"
                  error={errors.businessName}
                  required
                />
                
                <CustomSelect
                  label="Business Type"
                  value={businessType}
                  onChange={setBusinessType}
                  options={BUSINESS_TYPES}
                  placeholder="Select primary category"
                  error={errors.businessType}
                  required
                />

                <CustomInput
                  label="Contact Number"
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  error={errors.mobile}
                  required
                />
              </View>
            )}

            {step === 2 && (
              <View style={styles.formStep}>
                <Text style={styles.stepTitle}>Owner Profile</Text>
                <Text style={styles.stepSubtitle}>Who is managing this account?</Text>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <CustomInput label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Arjun" error={errors.firstName} required />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomInput label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Mehta" />
                  </View>
                </View>

                <CustomInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="arjun@company.com"
                  keyboardType="email-address"
                  error={errors.email}
                  required
                />

                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password}
                  required
                />
              </View>
            )}

            {step === 3 && (
              <View style={styles.formStep}>
                <View style={styles.verifyIconBox}>
                   <ShieldCheck size={40} color={colors.primary} />
                </View>
                <Text style={[styles.stepTitle, { textAlign: 'center' }]}>Verify Mobile</Text>
                <Text style={[styles.stepSubtitle, { textAlign: 'center' }]}>We sent an OTP to +91 {mobile}</Text>
                
                {/* Mock OTP inputs for demo */}
                <View style={styles.otpContainer}>
                  {[1,2,3,4].map(i => (
                    <View key={i} style={styles.otpBox}>
                       <Text style={styles.otpText}>-</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <PrimaryButton 
              title={step === 3 ? "COMPLETE VERIFICATION" : "CONTINUE"} 
              onPress={step === 3 ? handleRegister : handleNext} 
              style={{ marginTop: 24 }} 
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.dark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepIconBoxActive: {
    backgroundColor: colors.primary,
  },
  stepIconBoxDone: {
    backgroundColor: colors.success,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.muted,
    fontWeight: 'bold',
  },
  stepLabelActive: {
    color: colors.dark,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  stepLineFill: {
    height: '100%',
    width: '0%',
    backgroundColor: colors.success,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  formStep: {
    width: '100%',
  },
  stepTitle: {
    ...typography.h2,
    fontSize: 22,
    color: colors.dark,
    marginBottom: 4,
  },
  stepSubtitle: {
    ...typography.bodySmall,
    color: colors.body,
    marginBottom: 24,
  },
  verifyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  otpBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  otpText: {
    fontSize: 20,
    color: colors.muted,
  }
});
