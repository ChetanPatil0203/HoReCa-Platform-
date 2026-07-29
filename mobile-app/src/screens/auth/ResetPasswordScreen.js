import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle, BadgeCheck } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthBackButton from '../../components/auth/AuthBackButton';
import BrandHeader from '../../components/auth/BrandHeader';
import { resetPasswordApi } from '../../services/api.service';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params || { email: '' };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Requirements check
  const requirements = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: AUTH_COLORS.muted };
    
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: AUTH_COLORS.error };
    if (score <= 4) return { score, label: 'Medium', color: '#F59E0B' };
    return { score, label: 'Strong', color: AUTH_COLORS.success };
  };

  const strength = calculateStrength(password);
  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = password && password === confirmPassword;

  const handleResetPassword = async () => {
    if (!allRequirementsMet) {
      setError('Please meet all the password requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await resetPasswordApi(email, password);
      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (isSuccess) {
    return (
      <AuthScreenWrapper>
        <BrandHeader />
        <AuthCard>
          <View style={styles.successContainer}>
            <View style={styles.successIconBox}>
              <CheckCircle size={56} color={AUTH_COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Password Reset Successfully</Text>
            <Text style={styles.successSubtitle}>
              Your password has been updated. Sign in using your new password.
            </Text>
            
            <AuthButton
              title="BACK TO SIGN IN"
              onPress={handleBackToLogin}
              style={styles.successBtn}
            />
          </View>
        </AuthCard>
      </AuthScreenWrapper>
    );
  }

  return (
    <AuthScreenWrapper>
      {/* Top Header Back Button Bar */}
      <View style={styles.topBar}>
        <AuthBackButton onPress={() => navigation.goBack()} />
      </View>

      <BrandHeader />

      <AuthCard>
        <Text style={styles.heading}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Choose a strong password for your HRC HUB account.
        </Text>

        <AuthInput
          label="New Password"
          required
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconPress={() => setShowPassword(!showPassword)}
          placeholder="Enter new password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setError('');
          }}
        />

        {/* Strength Indicator Bar */}
        {password.length > 0 && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthTextRow}>
              <Text style={styles.strengthLabel}>Password Strength:</Text>
              <Text style={[styles.strengthValue, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
            <View style={styles.strengthBarContainer}>
              <View 
                style={[
                  styles.strengthBar, 
                  { 
                    width: `${(strength.score / 5) * 100}%`,
                    backgroundColor: strength.color 
                  }
                ]} 
              />
            </View>
          </View>
        )}

        <AuthInput
          label="Confirm New Password"
          required
          icon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder="Confirm new password"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            setError('');
          }}
          error={confirmPassword && !passwordsMatch ? 'Passwords do not match.' : ''}
        />

        {/* Password Requirements Checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Password Requirements</Text>
          {requirements.map((req, idx) => (
            <View key={idx} style={styles.checkRow}>
              <CheckCircle 
                size={16} 
                color={req.met ? AUTH_COLORS.success : '#CBD5E1'} 
                style={styles.checkIcon}
              />
              <Text style={[styles.checkText, req.met ? styles.checkTextMet : null]}>
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        {!!error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={AUTH_COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <AuthButton
          title={isLoading ? "RESETTING..." : "RESET PASSWORD"}
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={!allRequirementsMet || !passwordsMatch || isLoading}
          style={styles.actionBtn}
        />
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
  subtitle: { 
    fontSize: 14, 
    color: AUTH_COLORS.muted, 
    marginBottom: 24, 
    lineHeight: 20 
  },
  strengthContainer: {
    marginBottom: 18,
    marginTop: -8,
  },
  strengthTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  strengthLabel: {
    fontSize: 12,
    color: AUTH_COLORS.muted,
    fontWeight: '500',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  checklistCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AUTH_COLORS.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  checkText: {
    fontSize: 13,
    color: AUTH_COLORS.muted,
  },
  checkTextMet: {
    color: AUTH_COLORS.primary,
    fontWeight: '500',
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
  actionBtn: {
    marginBottom: 10,
  },
  // Success state styling
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  successIconBox: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AUTH_COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
    paddingHorizontal: 10,
  },
  successBtn: {
    width: '100%',
  },
});
