import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function FormField({ 
  label, icon: Icon, error, containerStyle, valid, ...textInputProps 
}) {
  const [isFocused, setIsFocused] = useState(false);

  let displayLabel = label;
  let isRequired = false;
  if (label && label.endsWith('*')) {
    isRequired = true;
    displayLabel = label.slice(0, -1).trim();
  }

  let iconColor = AUTH_COLORS.muted;
  if (error) iconColor = AUTH_COLORS.error;
  else if (valid) iconColor = AUTH_COLORS.success;
  else if (isFocused) iconColor = AUTH_COLORS.accent;

  return (
    <View style={[styles.fieldBlock, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {displayLabel}
          {isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {Icon && <Icon size={20} color={iconColor} style={styles.inputIcon} />}
        <TextInput 
          style={[
            styles.input, 
            Icon ? styles.inputWithIcon : styles.inputWithoutIcon,
            isFocused && styles.inputFocused,
            error && styles.inputError
          ]} 
          placeholderTextColor={AUTH_COLORS.muted}
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
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
  input: { 
    backgroundColor: AUTH_COLORS.input, 
    borderWidth: 1, 
    borderColor: AUTH_COLORS.border, 
    borderRadius: 14, 
    height: 52, 
    fontSize: 15, 
    color: AUTH_COLORS.text 
  },
  inputFocused: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F0F4F8' // Very soft navy-tinted background
  },
  inputWithIcon: { paddingLeft: 46, paddingRight: 16 },
  inputWithoutIcon: { paddingHorizontal: 16 },
  inputError: { borderColor: AUTH_COLORS.error, backgroundColor: '#FEF2F2' },
  errorText: { color: AUTH_COLORS.error, fontSize: 12, marginTop: 6, fontWeight: '500' }
});
