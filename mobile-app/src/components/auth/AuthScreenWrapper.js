import React from 'react';
import { View, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthScreenWrapper({ children }) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(width * 0.92, 430) : width * 0.92;
  const horizontalPadding = width < 340 ? 12 : 16;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentWrapper, { width: contentWidth }]}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: AUTH_COLORS.background,
  },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 24,
  },
  contentWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
