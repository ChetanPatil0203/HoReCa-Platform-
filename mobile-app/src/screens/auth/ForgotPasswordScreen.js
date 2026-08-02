import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Send, ShieldCheck } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthBackButton from '../../components/auth/AuthBackButton';
import BrandHeader from '../../components/auth/BrandHeader';
import { forgotPasswordApi } from '../../services/api.service';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    setError('');
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return false;
    }
    return true;
  };

  const maskEmail = (emailStr) => {
    const parts = emailStr.split('@');
    if (parts.length !== 2) return emailStr;
    const username = parts[0];
    const domain = parts[1];
    if (username.length <= 4) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.substring(0, 4)}*****@${domain}`;
  };

  const handleSendCode = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await forgotPasswordApi(email);
      if (response.success) {
        const masked = maskEmail(email);
        navigation.navigate('VerifyResetOtp', { email, maskedEmail: masked });
      } else {
        setError(response.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = () => {
    return email && /^\S+@\S+\.\S+$/.test(email);
  };

  return (
    <AuthScreenWrapper>
      {/* Top Header Back Button Bar */}
      <View style={styles.topBar}>
        <AuthBackButton onPress={() => navigation.goBack()} />
      </View>

      <BrandHeader />

      <AuthCard>
        <Text style={styles.heading}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address to receive a verification code.
        </Text>

        <AuthInput
          label="Registered Email"
          required
          icon={Mail}
          placeholder="business@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setError('');
          }}
          error={error}
        />

        <Text style={styles.helperText}>
          We will send a 6-digit verification code to this email.
        </Text>

        {/* Security Information Strip */}
        <View style={styles.securityStrip}>
          <ShieldCheck size={18} color={AUTH_COLORS.info} style={styles.securityIcon} />
          <Text style={styles.securityText}>
            For your security, we will never share your information with anyone.
          </Text>
        </View>

        <AuthButton
          title={isLoading ? "SENDING..." : "SEND VERIFICATION CODE"}
          icon={isLoading ? null : Send}
          onPress={handleSendCode}
          loading={isLoading}
          disabled={!isEmailValid() || isLoading}
          style={styles.actionBtn}
        />

        <View style={styles.bottomLinkContainer}>
          <Text style={styles.bottomLinkText}>Remembered your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="button">
            <Text style={styles.bottomLink}>Back to Sign In</Text>
          </TouchableOpacity>
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
  subtitle: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
    marginBottom: 24,
    lineHeight: 20
  },
  helperText: {
    fontSize: 13,
    color: AUTH_COLORS.muted,
    marginBottom: 20,
    marginTop: -8,
  },
  securityStrip: {
    flexDirection: 'row',
    backgroundColor: '#F0F4FC', // soft blue-gray
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  securityIcon: {
    marginRight: 10,
  },
  securityText: {
    fontSize: 12,
    color: '#3B5998', // matching blue-gray text
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  actionBtn: {
    marginBottom: 20,
  },
  bottomLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  bottomLinkText: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
  },
});
