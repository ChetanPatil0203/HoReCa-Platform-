import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthScreenWrapper({ children }) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(width * 0.95, 440) : Math.min(width * 0.94, 440);
  const horizontalPadding = width < 340 ? 12 : 16;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
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
    backgroundColor: '#F4F7FB',
  },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 24,
  },
  contentWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
