import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator, Platform } from 'react-native';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import BrandHeader from '../../components/auth/BrandHeader';
import GoogleLogo from '../../components/auth/GoogleLogo';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';
import { loginApi, googleLoginApi } from '../../services/api.service';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthContext);

  const GOOGLE_CLIENT_ID = '437742488411-sc066inldt6dfkv6l1nl8a2kmepfe68p.apps.googleusercontent.com';

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'hrc-hub',
    preferLocalhost: true,
  });

  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const idToken = googleResponse.params?.id_token || googleResponse.authentication?.idToken;
      if (idToken) {
        processGoogleLogin(idToken);
      } else {
        setIsGoogleLoading(false);
        setLoginError('Unable to retrieve Google ID token.');
      }
    } else if (googleResponse?.type === 'dismiss' || googleResponse?.type === 'cancel') {
      setIsGoogleLoading(false);
    } else if (googleResponse?.type === 'error') {
      setIsGoogleLoading(false);
      setLoginError('Google sign-in was cancelled or failed.');
    }
  }, [googleResponse]);

  const handleGooglePress = async () => {
    setLoginError('');
    setIsGoogleLoading(true);

    try {
      if (promptGoogleAsync) {
        const res = await promptGoogleAsync();
        if (!res || res.type !== 'success') {
          setIsGoogleLoading(false);
        }
      } else {
        setIsGoogleLoading(false);
        setLoginError('Google Sign-In is initializing. Please try again.');
      }
    } catch (err) {
      setIsGoogleLoading(false);
      setLoginError(err.message || 'Unable to open Google sign-in.');
    }
  };

  const processGoogleLogin = async (idToken) => {
    try {
      setIsGoogleLoading(true);
      const response = await googleLoginApi(idToken);
      if (response.success && response.data) {
        const { token, panelType, user, requiresOnboarding, registration } = response.data;
        if (requiresOnboarding) {
          navigation.navigate('RegisterStepOne', { user });
        } else {
          const userObj = {
            ...user,
            ...registration,
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Google User',
            businessName: registration?.bizName || '',
            businessType: registration?.bizCategory || '',
            location: registration?.city || '',
            accountStatus: 'Active',
            verificationStatus: registration?.status === 'approved' ? 'Verified' : 'Pending Verification',
            profilePhoto: user?.profilePhoto || registration?.profilePhoto || null,
          };
          login(panelType || 'owner', token, user?.vendorType || 'raw-material', userObj);
        }
      } else {
        setLoginError(response.message || 'Google authentication failed.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || 'Unable to sign in with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
      {/* Brand Header */}
      <BrandHeader />

      {/* Main Login Card */}
      <AuthCard>
        <AuthTabs
          activeTab="login"
          onTabChange={(tab) => tab === 'register' && navigation.navigate('RegisterStepOne')}
        />

        <FormField
          label="Email Address *"
          labelStyle={styles.fontUi}
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
          label="Password *"
          labelStyle={styles.fontUi}
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
          rightAction={
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          }
        />

        {!!loginError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        )}

        <PrimaryButton
          title={isLoading ? "Signing in..." : "Sign In"}
          icon={isLoading ? null : ArrowRight}
          onPress={handleLogin}
          loading={isLoading}
          disabled={!isFormValid() || isLoading || isGoogleLoading}
          style={styles.signInButton}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={[styles.googleBtn, (isGoogleLoading || isLoading) && styles.googleBtnDisabled]}
          onPress={handleGooglePress}
          disabled={isGoogleLoading || isLoading}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          {isGoogleLoading ? (
            <ActivityIndicator color="#071B3A" size="small" />
          ) : (
            <>
              <GoogleLogo size={20} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>


      </AuthCard>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  fontUi: {
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
    fontSize: 13,
    fontWeight: '700',
    color: '#071B3A',
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#071B3A'
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5'
  },
  errorBannerText: {
    fontSize: 13,
    color: '#C2410C',
    fontWeight: '500',
    flex: 1
  },

  signInButton: {
    marginTop: 0,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#71829B',
    marginHorizontal: 12,
    fontWeight: '500',
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE3ED',
    width: '100%',
    minHeight: 44,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  googleBtnDisabled: {
    opacity: 0.7,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#071B3A',
    letterSpacing: 0.2,
  },


});
