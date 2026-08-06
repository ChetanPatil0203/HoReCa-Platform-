import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function BrandHeader() {
  const { width } = useWindowDimensions();
  const logoSize = width < 360 ? 48 : 52;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/HRCHUB_Logo.png')}
          style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
        />
      </View>
      <Text style={styles.title}>
        <Text style={styles.titleHrc}>HRC</Text>
        <Text style={styles.titleHub}> HUB</Text>
      </Text>
      <Text style={styles.subtitle}>HoReCa Business Partner</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 24,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  titleHrc: {
    color: AUTH_COLORS.primary,
  },
  titleHub: {
    color: AUTH_COLORS.accent,
  },
  subtitle: {
    fontSize: 14,
    color: AUTH_COLORS.muted,
    fontWeight: '500',
    textAlign: 'center',
  },
});
