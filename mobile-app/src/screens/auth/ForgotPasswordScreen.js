import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, ArrowRight } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import FormField from '../../components/auth/FormField';
import PrimaryButton from '../../components/auth/PrimaryButton';

const PRIMARY_BLUE = '#2563EB';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#64748B';
const SUCCESS_GREEN = '#10B981';

export default function ForgotPasswordScreen({ navigation }) {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    setError('');
    if (!contact.trim()) {
      setError('Please enter your email or mobile number.');
      return false;
    }
    return true;
  };

  const handleReset = () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <AuthScreenWrapper>
      <AuthCard>
        <Text style={styles.heading}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your registered email address or mobile number to continue.</Text>

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Reset instructions have been sent.</Text>
          </View>
        ) : (
          <>
            <FormField 
              label="ACCOUNT EMAIL / MOBILE *" 
              icon={Mail} 
              placeholder="you@company.com or 10-digit mobile"
              keyboardType="email-address"
              autoCapitalize="none"
              value={contact}
              onChangeText={(val) => { setContact(val); setError(''); }}
              error={error}
            />

            <PrimaryButton 
              title="SEND RESET INSTRUCTIONS" 
              icon={ArrowRight} 
              onPress={handleReset} 
              loading={isLoading} 
              style={{ marginBottom: 32 }}
            />
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.bottomLink}>
          <Text style={styles.bottomText}>Back to <Text style={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>Sign In</Text></Text>
        </TouchableOpacity>

      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 28, fontWeight: 'bold', color: TEXT_DARK, marginBottom: 8 },
  subtitle: { fontSize: 15, color: TEXT_MUTED, marginBottom: 32, lineHeight: 22 },
  
  successBox: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, padding: 16, borderRadius: 12, marginBottom: 32, alignItems: 'center' },
  successText: { color: SUCCESS_GREEN, fontWeight: 'bold', fontSize: 14 },

  bottomLink: { alignItems: 'center' },
  bottomText: { fontSize: 14, color: TEXT_MUTED }
});
