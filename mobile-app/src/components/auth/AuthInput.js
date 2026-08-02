import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthInput({
  label,
  required,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconPress,
  error,
  containerStyle,
  disabled,
  secureTextEntry,
  ...textInputProps
}) {
  const [isFocused, setIsFocused] = useState(false);

  let iconColor = AUTH_COLORS.muted;
  if (error) iconColor = AUTH_COLORS.error;
  else if (isFocused) iconColor = AUTH_COLORS.primary;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError,
        disabled && styles.disabledWrapper
      ]}>
        {Icon && <Icon size={20} color={iconColor} style={styles.leftIcon} />}
        <TextInput
          key={secureTextEntry ? 'password' : 'text'}
          style={[
            styles.input,
            disabled && styles.inputDisabled,
          ]}
          placeholderTextColor={AUTH_COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {RightIcon && (
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={onRightIconPress}
            disabled={disabled}
            accessibilityRole="button"
          >
            <RightIcon size={20} color={AUTH_COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: AUTH_COLORS.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_COLORS.input,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    width: '100%',
  },
  inputWrapperFocused: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F2F6FC', // subtle focus background
  },
  inputWrapperError: {
    borderColor: AUTH_COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIconWrapper: {
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  inputDisabled: {
    color: AUTH_COLORS.muted,
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  errorText: {
    color: AUTH_COLORS.error,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
