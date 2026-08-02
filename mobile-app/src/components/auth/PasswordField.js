import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Lock, Eye, EyeOff, CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function PasswordField({
  label, error, containerStyle, showChecklist = false, secureTextEntry, ...textInputProps
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  let displayLabel = label;
  let isRequired = false;
  if (label && label.endsWith('*')) {
    isRequired = true;
    displayLabel = label.slice(0, -1).trim();
  }

  const value = textInputProps.value || '';

  const rules = [
    { label: '8+ characters', met: value.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'Lowercase letter', met: /[a-z]/.test(value) },
    { label: 'Number', met: /[0-9]/.test(value) }
  ];

  let iconColor = AUTH_COLORS.muted;
  if (error) iconColor = AUTH_COLORS.error;
  else if (isFocused) iconColor = AUTH_COLORS.accent;

  return (
    <View style={[styles.fieldBlock, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {displayLabel}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        <Lock size={20} color={iconColor} style={styles.inputIcon} />
        <TextInput
          key={showPassword ? 'text' : 'password'}
          style={styles.input}
          placeholderTextColor={AUTH_COLORS.muted}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => setShowPassword(!showPassword)}
          accessibilityRole="button"
        >
          {showPassword ? <EyeOff size={20} color={AUTH_COLORS.primary} /> : <Eye size={20} color={AUTH_COLORS.muted} />}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showChecklist && isFocused && (
        <View style={styles.checklist}>
          {rules.map((rule, idx) => (
            <View key={idx} style={styles.checkItem}>
              {rule.met ? (
                <CheckCircle2 size={12} color={AUTH_COLORS.success} />
              ) : (
                <Circle size={12} color={AUTH_COLORS.border} />
              )}
              <Text style={[styles.checkText, rule.met && styles.checkTextMet]}>
                {rule.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  asterisk: { color: AUTH_COLORS.error },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_COLORS.input,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F0F4F8'
  },
  inputWrapperError: {
    borderColor: AUTH_COLORS.error,
    backgroundColor: '#FEF2F2'
  },
  inputIcon: { marginRight: 10 },
  rightIcon: { padding: 8, marginLeft: 10 },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: AUTH_COLORS.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    // Add outline: 'none' for React Native Web
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  errorText: { color: AUTH_COLORS.error, fontSize: 12, marginTop: 6, fontWeight: '500' },

  checklist: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8
  },
  checkText: {
    fontSize: 11,
    color: AUTH_COLORS.muted,
    marginLeft: 4
  },
  checkTextMet: {
    color: AUTH_COLORS.success
  }
});
