import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ShieldCheck, ArrowRight, Lock, CircleCheck as CheckCircle2, RotateCcw } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import RegistrationStepIndicator from '../../components/auth/RegistrationStepIndicator';
import PrimaryButton from '../../components/auth/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';
import { verifyOTPApi, resendOTPApi } from '../../services/api.service';

export default function RegisterStepThreeScreen({ navigation, route }) {
  const { login } = useContext(AuthContext);
  const registrationData = route.params?.registrationData || {};
  const token = route.params?.token;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveIndex(index + 1);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveIndex(index - 1);
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        await resendOTPApi(token);
        setResendTimer(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
        setActiveIndex(0);
        alert('Verification code resent successfully.');
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to resend code.');
      }
    }
  };

  const isOtpComplete = otp.every(val => val !== '');

  const handleCompleteRegistration = async () => {
    if (!isOtpComplete) return;

    setIsSubmitting(true);
    try {
      const otpCode = otp.join('');
      await verifyOTPApi(otpCode, token);
      alert('Verification Successful! Please log in with your credentials to continue.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const obfuscateEmail = (email) => {
    if (!email) return 'your email address';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
  };

  return (
    <AuthScreenWrapper>
      <AuthCard>
        <AuthTabs activeTab="register" onTabChange={(tab) => tab === 'login' && navigation.navigate('Login')} />
        <RegistrationStepIndicator currentStep={3} />

        <View style={styles.headerBlock}>
          <Text style={styles.stepHeader}>STEP 3 OF 3</Text>
          <Text style={styles.heading}>Security Verification</Text>
          <Text style={styles.subtitle}>Enter the 6-digit verification code sent to {obfuscateEmail(registrationData.email)} to activate your business profile.</Text>
        </View>

        <View style={styles.securityNotice}>
          <ShieldCheck size={20} color={AUTH_COLORS.success} />
          <Text style={styles.securityText}>Secure authentication protocol active</Text>
        </View>

        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>ENTER VERIFICATION CODE</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={[
                  styles.otpBox,
                  activeIndex === index && styles.otpBoxActive,
                  digit !== '' && styles.otpBoxFilled
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleBackspace(e, index)}
                onFocus={() => setActiveIndex(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            style={[styles.resendBtn, resendTimer > 0 && styles.resendBtnDisabled]}
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            {resendTimer === 0 ? <RotateCcw size={14} color={AUTH_COLORS.primary} style={{ marginRight: 6 }} /> : null}
            <Text style={[styles.resendBtnText, resendTimer > 0 && styles.resendBtnTextDisabled]}>
              {resendTimer > 0 ? `Resend available in 00:${resendTimer.toString().padStart(2, '0')}` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSummary}>
          <View style={styles.summaryRow}>
            <CheckCircle2 size={16} color={AUTH_COLORS.success} style={{ marginRight: 8 }} />
            <Text style={styles.summaryText}>Business Details Verified</Text>
          </View>
          <View style={styles.summaryRow}>
            <CheckCircle2 size={16} color={AUTH_COLORS.success} style={{ marginRight: 8 }} />
            <Text style={styles.summaryText}>Documents Uploaded</Text>
          </View>
          <View style={styles.summaryRow}>
            <CheckCircle2 size={16} color={AUTH_COLORS.success} style={{ marginRight: 8 }} />
            <Text style={styles.summaryText}>Executive Details Complete</Text>
          </View>
        </View>

        <View style={styles.footerAction}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <Text style={styles.backBtnText}>Back to Executive Details</Text>
          </TouchableOpacity>
          <PrimaryButton
            title={isSubmitting ? "VERIFYING..." : "ACTIVATE BUSINESS PROFILE"}
            icon={isSubmitting ? null : Lock}
            onPress={handleCompleteRegistration}
            disabled={!isOtpComplete || isSubmitting}
            loading={isSubmitting}
          />
        </View>

      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 24 },
  stepHeader: { fontSize: 11, fontWeight: '700', color: AUTH_COLORS.primary, letterSpacing: 1, marginBottom: 8 },
  heading: { fontSize: 26, fontWeight: 'bold', color: AUTH_COLORS.primary, marginBottom: 6, lineHeight: 30 },
  subtitle: { fontSize: 14, color: AUTH_COLORS.muted, lineHeight: 22 },

  securityNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 24 },
  securityText: { fontSize: 13, fontWeight: '600', color: '#065F46', marginLeft: 8, flex: 1 },

  otpLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 14,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System'
  },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 6, width: '100%', maxWidth: 340, alignSelf: 'center' },
  otpBox: {
    flex: 1,
    maxWidth: 46,
    minWidth: 36,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.input,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AUTH_COLORS.text,
    paddingHorizontal: 0
  },
  otpBoxActive: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F0F4F8',
    shadowColor: AUTH_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  otpBoxFilled: {
    borderColor: AUTH_COLORS.muted,
    backgroundColor: AUTH_COLORS.card
  },

  resendContainer: { alignItems: 'center', marginBottom: 32 },
  resendText: { fontSize: 13, color: AUTH_COLORS.muted, marginBottom: 8 },
  resendBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#F0F4F8', borderRadius: 20 },
  resendBtnDisabled: { backgroundColor: 'transparent' },
  resendBtnText: { fontSize: 13, fontWeight: 'bold', color: AUTH_COLORS.primary },
  resendBtnTextDisabled: { color: AUTH_COLORS.muted, fontWeight: '500' },

  footerSummary: { backgroundColor: AUTH_COLORS.input, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: AUTH_COLORS.border },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryText: { fontSize: 13, fontWeight: '600', color: AUTH_COLORS.text },

  footerAction: { alignItems: 'center' },
  backBtn: { paddingVertical: 12, paddingHorizontal: 20, marginBottom: 12 },
  backBtnText: { fontSize: 14, fontWeight: '600', color: AUTH_COLORS.muted }
});
