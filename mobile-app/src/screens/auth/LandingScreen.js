import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ChefHat, Play } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import HeroIllustration from '../../components/HeroIllustration';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ── Logo mark ── */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/HoReCa_Logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <View>
            <Text style={styles.logoText}>HoReCa</Text>
            <Text style={styles.logoTextHighlight}>CONNECT</Text>
          </View>
        </View>

        {/* ── Tagline ── */}
        <Text style={styles.tagline}>
          All-in-One Platform for HoReCa Businesses
        </Text>

        {/* ── Hero headline ── */}
        <Text style={styles.headline}>
          Connect.{'\n'}
          Manage. Grow{'\n'}
          Your Business{'\n'}
          <Text style={{ color: colors.primary }}>Seamlessly</Text>
        </Text>

        {/* ── Sub-headline ── */}
        <Text style={styles.subHeadline}>
          Manage procurement, manpower, services, marketing and more in one place.
        </Text>

        {/* ── Illustration ── */}
        <View style={styles.illustrationContainer}>
          <HeroIllustration />
        </View>

        {/* ── CTAs ── */}
        <View style={styles.actionContainer}>
          <PrimaryButton 
            title="GET STARTED" 
            onPress={() => navigation.navigate('Auth')} 
          />
          <SecondaryButton 
            title="BOOK A DEMO" 
            onPress={() => navigation.navigate('Auth')} 
            style={{ marginTop: 12 }}
          />
          
          <View style={styles.loginHint}>
            <Text style={styles.hintText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Trust text ── */}
        <Text style={styles.trustText}>
          Trusted by <Text style={{ color: colors.body, fontWeight: 'bold' }}>1500+</Text> HoReCa Businesses
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  logoText: {
    ...typography.body,
    fontWeight: '800',
    color: colors.dark,
    lineHeight: 18,
  },
  logoTextHighlight: {
    ...typography.body,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 18,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  headline: {
    ...typography.h1,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subHeadline: {
    ...typography.body,
    color: colors.body,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '90%',
  },
  illustrationContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 380,
    marginBottom: 28,
  },
  loginHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.muted,
  },
  loginText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: 'bold',
  },
  trustText: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 8,
  }
});
