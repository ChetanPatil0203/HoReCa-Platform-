import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Clock, KeyRound, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthButton from '../../components/auth/AuthButton';
import AuthBackButton from '../../components/auth/AuthBackButton';
import BrandHeader from '../../components/auth/BrandHeader';
import { verifyResetOtpApi, forgotPasswordApi } from '../../services/api.service';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

export default function VerifyResetOtpScreen({ route, navigation }) {
  const { email, maskedEmail } = route.params || { email: '', maskedEmail: '' };

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timers
  const [expiryTime, setExpiryTime] = useState(585); // 09:45
  const [resendTimer, setResendTimer] = useState(30); // 00:30

  const inputRefs = useRef([]);

  // Expiry Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiryTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resend Timer Countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const formatExpiryTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (text, index) => {
    setError('');
    setSuccessMsg('');
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    
    if (cleanText.length > 1) {
      // Support paste
      const pastedData = cleanText.slice(0, 6).split('');
      const updatedOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) {
          updatedOtp[i] = pastedData[i];
        }
      }
      setOtp(updatedOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = cleanText;
    setOtp(newOtp);

    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      setError('');
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await verifyResetOtpApi(email, otpCode);
      if (response.success) {
        navigation.navigate('ResetPassword', { email });
      } else {
        setError(response.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await forgotPasswordApi(email);
      if (response.success) {
        setOtp(['', '', '', '', '', '']);
        setResendTimer(30);
        setExpiryTime(585); // Reset expiry to 09:45
        setSuccessMsg('A new verification code has been sent to your email.');
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message || 'Failed to resend verification code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((val) => val !== '');

  return (
    <AuthScreenWrapper>
      {/* Top Header Back Button Bar */}
      <View style={styles.topBar}>
        <AuthBackButton onPress={() => navigation.goBack()} />
      </View>

      <BrandHeader />

      <AuthCard>
        <Text style={styles.heading}>Verify Your Identity</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to </Text>
          <View style={styles.emailEditContainer}>
            <Text style={styles.emailText}>{maskedEmail || 'your email'}</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword', { initialEmail: email })}
              style={styles.editBtn}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((val, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                val ? styles.otpInputFilled : null,
                focusedIndex === index ? styles.otpInputFocused : null,
                error ? styles.otpInputError : null,
              ]}
              maxLength={Platform.OS === 'web' ? 6 : 1} // allow web paste
              keyboardType="number-pad"
              value={val}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Demo Assistant text */}
        <Text style={styles.demoText}>
          For demo mode, enter any 6 digits.
        </Text>

        {/* Expiry Timer Strip */}
        <View style={styles.timerStrip}>
          <Clock size={16} color={AUTH_COLORS.muted} style={styles.timerIcon} />
          <Text style={styles.timerText}>
            This code will expire in <Text style={styles.timerCountdown}>{formatExpiryTime(expiryTime)}</Text>
          </Text>
        </View>

        {!!error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={AUTH_COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {!!successMsg && (
          <View style={styles.successBanner}>
            <CheckCircle size={18} color={AUTH_COLORS.success} style={{ marginRight: 8 }} />
            <Text style={styles.successBannerText}>{successMsg}</Text>
          </View>
        )}

        <AuthButton
          title={isLoading ? "VERIFYING..." : "VERIFY CODE"}
          icon={isLoading ? null : KeyRound}
          onPress={handleVerify}
          loading={isLoading}
          disabled={!isOtpComplete || isLoading}
          style={styles.actionBtn}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn’t receive the code? </Text>
          {resendTimer > 0 ? (
            <Text style={styles.resendDisabledText}>Resend Code (00:{resendTimer.toString().padStart(2, '0')})</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} accessibilityRole="button">
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
  },
  heading: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: AUTH_COLORS.primary, 
    marginBottom: 8, 
    marginTop: 10 
  },
  subtitleRow: {
    marginBottom: 24,
  },
  subtitle: { 
    fontSize: 14, 
    color: AUTH_COLORS.muted, 
    lineHeight: 20 
  },
  emailEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
  },
  editBtn: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#E6EDF8',
    borderRadius: 6,
  },
  editText: {
    fontSize: 11,
    fontWeight: '700',
    color: AUTH_COLORS.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  otpInput: {
    backgroundColor: AUTH_COLORS.input,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 12,
    width: '14%',
    aspectRatio: 1,
    fontSize: 20,
    fontWeight: '700',
    color: AUTH_COLORS.primary,
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: AUTH_COLORS.border,
  },
  otpInputFocused: {
    borderColor: AUTH_COLORS.info,
    backgroundColor: '#FFFFFF',
    shadowColor: AUTH_COLORS.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  otpInputError: {
    borderColor: AUTH_COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  demoText: {
    fontSize: 12,
    color: AUTH_COLORS.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerStrip: {
    flexDirection: 'row',
    backgroundColor: '#F3F5F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerIcon: {
    marginRight: 6,
  },
  timerText: {
    fontSize: 13,
    color: AUTH_COLORS.muted,
  },
  timerCountdown: {
    fontWeight: '600',
    color: AUTH_COLORS.primary,
  },
  errorBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F5', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#FEE2E2' 
  },
  errorBannerText: { 
    fontSize: 13, 
    color: AUTH_COLORS.error, 
    fontWeight: '500', 
    flex: 1 
  },
  successBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EBFDF5', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#D1FAE5' 
  },
  successBannerText: { 
    fontSize: 13, 
    color: AUTH_COLORS.success, 
    fontWeight: '500', 
    flex: 1 
  },
  actionBtn: {
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
  },
  resendDisabledText: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
  },
});
