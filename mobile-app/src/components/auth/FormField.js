import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function FormField({
  label, icon: Icon, error, containerStyle, labelStyle, valid, ...textInputProps
}) {
  const [isFocused, setIsFocused] = useState(false);

  let displayLabel = label;
  let isRequired = false;
  if (label && label.endsWith('*')) {
    isRequired = true;
    displayLabel = label.slice(0, -1).trim();
  }

  let iconColor = '#71829B';
  if (error) iconColor = AUTH_COLORS.error;
  else if (valid) iconColor = AUTH_COLORS.success;
  else if (isFocused) iconColor = AUTH_COLORS.accent;

  return (
    <View style={[styles.fieldBlock, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {displayLabel}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {Icon && <Icon size={21} color={iconColor} style={styles.inputIcon} pointerEvents="none" />}
        <TextInput
          style={[
            styles.input,
            Icon ? styles.inputWithIcon : styles.inputWithoutIcon,
            isFocused && styles.inputFocused,
            error && styles.inputError
          ]}
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071B3A',
    marginBottom: 6,
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  asterisk: { color: '#EF4444' },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DCE3ED',
    borderRadius: 14,
    height: 54,
    fontSize: 16,
    color: '#071B3A',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  inputFocused: {
    borderColor: '#071B3A',
    backgroundColor: '#F0F4F8'
  },
  inputWithIcon: { paddingLeft: 48, paddingRight: 16 },
  inputWithoutIcon: { paddingHorizontal: 16 },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' }
});
