import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Mail, ArrowRight, AlertCircle, Building2, Zap, ChevronRight, X } from 'lucide-react-native';

import AuthScreenWrapper from '../../components/auth/AuthScreenWrapper';
import AuthCard from '../../components/auth/AuthCard';
import AuthTabs from '../../components/auth/AuthTabs';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import PrimaryButton from '../../components/auth/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_COLORS } from '../../components/auth/AuthTheme';

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 340;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [demoModalVisible, setDemoModalVisible] = useState(false);

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

  const handleLogin = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('owner', 'demo-token');
    }, 1500);
  };

  const handleDemoSelect = (panel) => {
    setDemoModalVisible(false);
    if (panel === 'Owner Panel') login('owner', 'demo-token');
    else if (panel === 'Super Admin Panel') login('superadmin', 'demo-token');
    else if (panel === 'Service Provider Panel') login('serviceProvider', 'demo-token');
    else if (panel === 'Manpower Agent Panel') login('manpower', 'demo-token');
    else if (panel === 'Raw Material Vendor Panel') login('vendor', 'demo-token');
    else if (panel === 'Marketing Agency Panel') login('marketing', 'demo-token');
  };

  const isFormValid = () => {
    return email && /^\S+@\S+\.\S+$/.test(email) && password && password.length >= 8;
  };

  return (
    <AuthScreenWrapper>

      {/* Brand Identity */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIconBox}>
          <Building2 size={24} color={AUTH_COLORS.accent} />
        </View>
        <Text style={styles.brandName}>
          <Text style={{ color: AUTH_COLORS.card }}>HRC </Text>
          <Text style={{ color: AUTH_COLORS.accent }}>HUB</Text>
        </Text>
        <Text style={styles.brandSub}>HoReCa Business Partner</Text>
      </View>

      <AuthCard>
        <AuthTabs activeTab="login" onTabChange={(tab) => tab === 'register' && navigation.navigate('RegisterStepOne')} />

        {/* Login Introduction */}
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your HRC HUB business account.</Text>

        <FormField
          label="EMAIL ADDRESS *"
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
          label="PASSWORD *"
          placeholder="Enter your password"
          returnKeyType="done"
          value={password}
          onChangeText={(val) => { setPassword(val); setPasswordError(''); setLoginError(''); }}
          error={passwordError}
          containerStyle={{ marginBottom: 12 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink} accessibilityRole="button">
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Inline Error Banner */}
        {!!loginError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={AUTH_COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        )}

        <PrimaryButton
          title={isLoading ? "SIGNING IN..." : "SIGN IN"}
          icon={isLoading ? null : ArrowRight}
          onPress={handleLogin}
          loading={isLoading}
          disabled={!isFormValid()}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Demo Access Button */}
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => setDemoModalVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Zap size={20} color={AUTH_COLORS.accent} style={{ marginRight: 8 }} />
          <Text style={styles.demoBtnText}>QUICK DEMO ACCESS</Text>
        </TouchableOpacity>
        <Text style={styles.demoHelper}>Explore the application using demo business data.</Text>

        {/* Registration Prompt */}
        <View style={[styles.regPrompt, isNarrow && { flexDirection: 'column', alignItems: 'center' }]}>
          <Text style={styles.regPromptText}>Don't have a business account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterStepOne')} accessibilityRole="button">
            <Text style={styles.regPromptLink}>Create a business profile</Text>
          </TouchableOpacity>
        </View>
      </AuthCard>

      {/* Demo Selection Modal */}
      <Modal visible={demoModalVisible} transparent animationType="slide" onRequestClose={() => setDemoModalVisible(false)}>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Demo Account</Text>
              <TouchableOpacity onPress={() => setDemoModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={AUTH_COLORS.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.demoList}>
              {[
                'Super Admin Panel',
                'Owner Panel',
                'Service Provider Panel',
                'Manpower Agent Panel',
                'Raw Material Vendor Panel',
                'Marketing Agency Panel'
              ].map((panel, idx) => (
                <TouchableOpacity key={idx} style={styles.demoItem} onPress={() => handleDemoSelect(panel)}>
                  <Text style={styles.demoItemText}>{panel}</Text>
                  <ChevronRight size={20} color={AUTH_COLORS.muted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
    backgroundColor: AUTH_COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20
  },
  brandIconBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  brandName: { fontSize: 20, fontWeight: '900', letterSpacing: 0.5, marginBottom: 2 },
  brandSub: { fontSize: 13, color: '#A0B3C6', fontWeight: '500' }, // slightly lighter than muted for dark bg

  heading: { fontSize: 26, fontWeight: 'bold', color: AUTH_COLORS.primary, marginBottom: 8, marginTop: 24 },
  subtitle: { fontSize: 14, color: AUTH_COLORS.muted, marginBottom: 24, lineHeight: 20 },

  forgotLink: { alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 4, marginBottom: 20, marginTop: 2 },
  forgotText: { fontSize: 13, fontWeight: '600', color: AUTH_COLORS.primary },

  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FFEDD5' },
  errorBannerText: { fontSize: 13, color: '#C2410C', fontWeight: '500', flex: 1 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: AUTH_COLORS.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: AUTH_COLORS.muted, fontWeight: 'bold' },

  demoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50, backgroundColor: AUTH_COLORS.input, borderWidth: 1, borderColor: AUTH_COLORS.border, borderRadius: 14 },
  demoBtnText: { fontSize: 14, fontWeight: 'bold', color: AUTH_COLORS.text },
  demoHelper: { fontSize: 12, color: AUTH_COLORS.muted, textAlign: 'center', marginTop: 8, marginBottom: 24 },

  regPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' },
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
