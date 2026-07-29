import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function BrandHeader() {
  const { width } = useWindowDimensions();

  // Responsive logo size
  let logoSize = 86; // default standard mobile
  if (width < 340) {
    logoSize = 72; // small mobile
  } else if (width > 768) {
    logoSize = 100; // tablet / large screen
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/HRCHUB_Logo.png')}
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
    marginBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
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
    fontSize: 13,
    color: AUTH_COLORS.muted,
    fontWeight: '500',
    textAlign: 'center',
  },
});
