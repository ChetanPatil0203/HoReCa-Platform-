import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthCard({ children, style }) {
  const { width } = useWindowDimensions();
  const cardPadding = width < 360 ? 18 : 22;

  return (
    <View style={[styles.card, { padding: cardPadding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  }
});
