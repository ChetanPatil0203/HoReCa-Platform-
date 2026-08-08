import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Lock, Eye, EyeOff, CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function PasswordField({
  label, error, containerStyle, labelStyle, showChecklist = false, secureTextEntry, rightAction, ...textInputProps
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

  let iconColor = '#71829B';
  if (error) iconColor = AUTH_COLORS.error;
  else if (isFocused) iconColor = AUTH_COLORS.accent;

  return (
    <View style={[styles.fieldBlock, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, labelStyle]}>
            {displayLabel}
            {isRequired && <Text style={styles.asterisk}> *</Text>}
          </Text>
          {rightAction}
        </View>
      )}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        <Lock size={21} color={iconColor} style={styles.inputIcon} pointerEvents="none" />
        <TextInput
          key={showPassword ? 'text' : 'password'}
          style={styles.input}
          placeholderTextColor="#94A3B8"
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
          activeOpacity={0.7}
        >
          {showPassword ? <EyeOff size={21} color="#071B3A" /> : <Eye size={21} color="#71829B" />}
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071B3A',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  asterisk: { color: '#EF4444' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DCE3ED',
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#071B3A',
    backgroundColor: '#F0F4F8'
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2'
  },
  inputIcon: { marginRight: 10 },
  rightIcon: { padding: 4, marginLeft: 8 },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#071B3A',
    paddingVertical: 0,
    paddingHorizontal: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' }
    }),
  },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },
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
    color: '#71829B',
    marginLeft: 4
  },
  checkTextMet: {
    color: AUTH_COLORS.success
  }
});
