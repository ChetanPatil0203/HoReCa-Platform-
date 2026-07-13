import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  required,
  error,
  icon: Icon,
  suffix,
  hint,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>

      <View style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        {Icon && (
          <View style={styles.iconWrapper}>
            <Icon size={16} color={colors.muted} />
          </View>
        )}
        
        <TextInput
          style={[styles.input, Icon && { paddingLeft: 42 }, suffix && { paddingRight: 42 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
        />

        {suffix && (
          <View style={styles.suffixWrapper}>
            {suffix}
          </View>
        )}
      </View>

      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={12} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    height: 48,
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    // Simulate the box-shadow 0 0 0 4px #EFF6FF
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  iconWrapper: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    color: colors.dark,
    fontSize: 14,
    // Add outline: 'none' for React Native Web
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  suffixWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  hint: {
    ...typography.caption,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 4,
  }
});
