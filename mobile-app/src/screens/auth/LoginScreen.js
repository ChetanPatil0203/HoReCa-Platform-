import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldX, ChevronDown } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  
  const { login } = useContext(AuthContext);

  const DEMO_ACCOUNTS = [
    { label: "Hotel Owner Demo", email: "owner@themeridian.com", role: "owner" },
    { label: "Raw Material Vendor", email: "vendor@metrofresh.com", role: "vendor", vendorType: "raw-material" },
    { label: "Manpower Agency Vendor", email: "vendor@elitemanpower.com", role: "vendor", vendorType: "manpower" },
    { label: "Service Provider Vendor", email: "vendor@proclean.com", role: "vendor", vendorType: "service" },
    { label: "Marketing Agency Vendor", email: "vendor@brandcraft.com", role: "vendor", vendorType: "marketing" },
  ];

  const handleLogin = () => {
    setError('');
    const demo = DEMO_ACCOUNTS.find(d => d.email === email.trim().toLowerCase());
    if (demo) {
      login(demo.role, 'mock-jwt-token', demo.vendorType || 'raw-material');
    } else if (email && password.length >= 6) {
      // Basic mock login fallback
      login('owner', 'mock-jwt-token');
    } else {
      setError('Please enter a valid email and password (min 6 chars).');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
             <Image source={require('../../assets/HoReCa_Logo.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.formCard}>
            {/* Sliding Pill Tab Switcher */}
            <View style={styles.tabSwitcher}>
               <View style={[styles.tabSlider, { left: 4 }]} />
               <TouchableOpacity style={styles.tabButton}>
                  <Text style={[styles.tabText, { color: colors.dark }]}>SIGN IN</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.tabText, { color: colors.muted }]}>REGISTER</Text>
               </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Enter your credentials to access your control panel.</Text>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <ShieldX size={14} color={colors.error} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <CustomInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                keyboardType="email-address"
                icon={Mail}
                required
              />

              <View style={styles.passwordGroup}>
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  secureTextEntry={!showPassword}
                  icon={Lock}
                  required
                  suffix={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} color={colors.muted} /> : <Eye size={16} color={colors.muted} />}
                    </TouchableOpacity>
                  }
                />
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <PrimaryButton title="SIGN IN" onPress={handleLogin} style={styles.submitBtn} />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>QUICK DEMO LOGIN</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* DEMO BUTTONS */}
            <View style={{ flexDirection: 'column', gap: 10, marginTop: 12 }}>
              <PrimaryButton 
                title="Login as Hotel Owner" 
                onPress={() => login('owner', 'mock-jwt-token')} 
                style={{ backgroundColor: '#0F172A' }}
              />
              <PrimaryButton 
                title="Login as Raw Material Vendor" 
                onPress={() => login('vendor', 'mock-jwt-token', 'raw-material')} 
                style={{ backgroundColor: '#1E40AF' }}
              />
              <PrimaryButton 
                title="Login as Manpower Vendor" 
                onPress={() => login('vendor', 'mock-jwt-token', 'manpower')} 
                style={{ backgroundColor: '#2563EB' }}
              />
              <PrimaryButton 
                title="Login as Service Provider Vendor" 
                onPress={() => login('vendor', 'mock-jwt-token', 'service')} 
                style={{ backgroundColor: '#10B981' }}
              />
              <PrimaryButton 
                title="Login as Marketing Vendor" 
                onPress={() => login('vendor', 'mock-jwt-token', 'marketing')} 
                style={{ backgroundColor: '#8B5CF6' }}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060D1E',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
    position: 'relative',
  },
  tabSlider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '49%',
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    ...typography.h2,
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.body,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    borderWidth: 1,
    borderColor: colors.error + '40',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  form: {
    marginBottom: 24,
  },
  passwordGroup: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
  },
  submitBtn: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.muted,
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
  demoContainer: {
    alignItems: 'center',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  demoText: {
    ...typography.caption,
    color: colors.muted,
    marginRight: 4,
  },
  demoList: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  demoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoItemText: {
    ...typography.bodySmall,
    color: colors.dark,
  }
});
