import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';
import { loginApi } from '../../services/api.service';

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 340;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthContext);

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    if (!email) {
      setEmailError('Enter your email address.');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Enter your password.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setLoginError('');
    try {
      const response = await loginApi(email, password);
      if (response.success && response.data) {
        const { token, panelType, user, registration } = response.data;
        
        const userObj = {
          ...user,
          ...registration,
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          businessName: registration?.bizName || '',
          businessType: registration?.bizCategory || '',
          location: registration?.city || '',
          accountStatus: 'Active',
          verificationStatus: registration?.status === 'approved' ? 'Verified' : 'Pending Verification',
        };
        
        login(panelType || 'owner', token, user?.vendorType || 'raw-material', userObj);
      } else {
        setLoginError(response.message || 'Login failed.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return email && /^\S+@\S+\.\S+$/.test(email) && password && password.length >= 8;
  };

  return (
    <AuthScreenWrapper>
      {/* Top Branding Section */}
      <View style={styles.brandContainer}>
        {/* Rounded Navy Card */}
        <View style={styles.brandCard}>
          {/* Thin Gold Circle */}
          <View style={styles.monogramCircle}>
            <Text style={styles.monogram}>H</Text>
          </View>
        </View>
        {/* Brand Text below the Navy card */}
        <Text style={styles.brandName}>
          <Text style={{ color: '#0E2244' }}>HRC </Text>
          <Text style={{ color: '#D4A017' }}>HUB</Text>
        </Text>
        <Text style={styles.brandSub}>HoReCa Business Partner</Text>
      </View>

      {/* Main Login Card */}
      <AuthCard>
        <AuthTabs 
          activeTab="login" 
          onTabChange={(tab) => tab === 'register' && navigation.navigate('RegisterStepOne')} 
        />

        {/* Heading & Subtitle */}
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>

        {/* Input Fields */}
        <FormField
          label="Email Address"
          icon={Mail}
          placeholder="business@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          value={email}
          onChangeText={(val) => { setEmail(val); setEmailError(''); setLoginError(''); }}
          error={emailError}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          returnKeyType="done"
          value={password}
          onChangeText={(val) => { setPassword(val); setPasswordError(''); setLoginError(''); }}
          error={passwordError}
          containerStyle={{ marginBottom: 12 }}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword')} 
          style={styles.forgotLink} 
          accessibilityRole="button"
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Inline Error Banner */}
        {!!loginError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        )}

        {/* Primary Action Button */}
        <PrimaryButton
          title={isLoading ? "SIGNING IN..." : "SIGN IN"}
          icon={isLoading ? null : ArrowRight}
          onPress={handleLogin}
          loading={isLoading}
          disabled={!isFormValid()}
        />

        {/* Registration Prompt */}
        <View style={[styles.regPrompt, isNarrow && { alignItems: 'center' }]}>
          <Text style={styles.regPromptText}>Don't have a business account?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('RegisterStepOne')} 
            accessibilityRole="button"
          >
            <Text style={styles.regPromptLink}>Create Business Profile</Text>
          </TouchableOpacity>
        </View>
      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    marginTop: 40,
    width: '100%',
    maxWidth: 620
  },
  brandCard: {
    backgroundColor: '#0E2244',
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0E2244',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3
  },
  monogramCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D4A017',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monogram: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4A017',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: Platform.OS === 'ios' ? 26 : 30,
  },
  brandName: { 
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: 1.5, 
    marginBottom: 6,
    textAlign: 'center'
  },
  brandSub: { 
    fontSize: 12, 
    color: '#71829B',
    fontWeight: '600', 
    letterSpacing: 0.8,
    textAlign: 'center'
  },
  heading: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1A1A1A', 
    marginBottom: 6, 
    marginTop: 8,
    letterSpacing: -0.5
  },
  subtitle: { 
    fontSize: 14, 
    color: '#71829B', 
    marginBottom: 24, 
    lineHeight: 20 
  },
  forgotLink: { 
    alignSelf: 'flex-end', 
    paddingVertical: 4, 
    paddingHorizontal: 4, 
    marginBottom: 24, 
    marginTop: -8
  },
  forgotText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#0E2244' 
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
    color: '#DC2626', 
    fontWeight: '500', 
    flex: 1 
  },
  regPrompt: { 
    alignItems: 'center', 
    marginTop: 28, 
    justifyContent: 'center' 
  },
  regPromptText: { 
    fontSize: 14, 
    color: '#71829B', 
    marginBottom: 6 
  },
  regPromptLink: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#0E2244' 
  }
});
