import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, ScrollView, SafeAreaView, Image } from 'react-native';
import { Mail, ArrowRight, AlertCircle, Zap, ChevronRight, X } from 'lucide-react-native';

import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import BrandHeader from '../../components/auth/BrandHeader';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';
import { loginApi } from '../../services/api.service';

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthContext);

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
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
          profilePhoto: user?.profilePhoto || registration?.profilePhoto || (typeof window !== 'undefined' && window.localStorage ? (JSON.parse(window.localStorage.getItem('hrc_user') || '{}').profilePhoto) : null),
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

      {/* Clean Compact Brand Header */}
      <View style={styles.brandHeader}>
        <Image
          source={require('../../../assets/HRCHUB_Logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>
          HRC <Text style={{ color: AUTH_COLORS.accent }}>HUB</Text>
        </Text>
        <Text style={styles.brandSubtitle}>HoReCa Business Partner</Text>
      </View>

      {/* Main Login Card */}
      <AuthCard>
        <AuthTabs
          activeTab="login"
          onTabChange={(tab) => tab === 'register' && navigation.navigate('RegisterStepOne')}
        />

        {/* Compact Login Introduction */}
        <Text style={styles.compactHeading}>Sign in to your business account</Text>

        <FormField
          label="EMAIL ADDRESS *"
          icon={Mail}
          placeholder="business@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setEmailError('');
            setLoginError('');
          }}
          error={emailError}
        />

        <PasswordField
          label="PASSWORD *"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setPasswordError('');
            setLoginError('');
          }}
          error={passwordError}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink} accessibilityRole="button">
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {!!loginError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        )}

        <PrimaryButton
          title={isLoading ? "SIGNING IN..." : "SIGN IN"}
          icon={isLoading ? null : ArrowRight}
          onPress={handleLogin}
          loading={isLoading}
          disabled={!isFormValid() || isLoading}
          style={styles.signInButton}
        />

        {/* Registration Prompt */}
        <View style={[styles.regPrompt, isNarrow && { flexDirection: 'column', alignItems: 'center' }]}>
          <Text style={styles.regPromptText}>New to HRC HUB? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterStepOne')} accessibilityRole="button">
            <Text style={styles.regPromptLink}>Create a business profile</Text>
          </TouchableOpacity>
        </View>
      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  brandHeader: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    width: '100%',
  },
  brandLogo: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: AUTH_COLORS.primary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 2,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: AUTH_COLORS.muted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },

  compactHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
    textAlign: 'left',
    marginTop: 24,
    marginBottom: 18,
  },

  forgotLink: { alignSelf: 'flex-end', paddingVertical: 2, paddingHorizontal: 2, marginBottom: 18, marginTop: 2 },
  forgotText: { fontSize: 13, fontWeight: '600', color: AUTH_COLORS.primary },

  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FFEDD5' },
  errorBannerText: { fontSize: 13, color: '#C2410C', fontWeight: '500', flex: 1 },

  signInButton: { marginTop: 4 },

  regPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  regPromptText: { fontSize: 14, color: AUTH_COLORS.muted },
  regPromptLink: { fontSize: 14, fontWeight: '600', color: AUTH_COLORS.primary },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,27,58,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: AUTH_COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: AUTH_COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: AUTH_COLORS.primary },
  closeBtn: { padding: 4 },
  demoList: { paddingHorizontal: 8, paddingBottom: 32 },
  demoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: AUTH_COLORS.border },
  demoItemText: { fontSize: 15, color: AUTH_COLORS.text, fontWeight: '500' }
});
