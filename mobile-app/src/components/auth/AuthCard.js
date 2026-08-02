import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthCard({ children }) {
  const { width } = useWindowDimensions();

  let dynamicPadding = 20;
  if (width < 360) dynamicPadding = 12;
  else if (width < 480) dynamicPadding = 16;
  else dynamicPadding = 24;

  return (
    <View style={[styles.card, { padding: dynamicPadding }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AUTH_COLORS.card,
    width: '100%',
    maxWidth: 620,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderColor: AUTH_COLORS.border,
    borderWidth: 1
  }
});
