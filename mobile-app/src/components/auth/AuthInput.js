import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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
      <View style={[styles.inputWrapper, disabled && styles.disabledWrapper]}>
        {Icon && <Icon size={20} color={iconColor} style={styles.leftIcon} />}
        <TextInput
          style={[
            styles.input,
            Icon ? styles.inputWithLeftIcon : styles.inputWithoutLeftIcon,
            RightIcon ? styles.inputWithRightIcon : styles.inputWithoutRightIcon,
            isFocused && styles.inputFocused,
            error && styles.inputError,
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
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 2,
  },
  rightIconWrapper: {
    position: 'absolute',
    right: 8,
    zIndex: 2,
    padding: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: AUTH_COLORS.input,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 14,
    height: 52,
    fontSize: 15,
    color: AUTH_COLORS.text,
    width: '100%',
  },
  inputFocused: {
    borderColor: AUTH_COLORS.primary,
    backgroundColor: '#F2F6FC', // subtle focus background
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithoutLeftIcon: {
    paddingLeft: 16,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  inputWithoutRightIcon: {
    paddingRight: 16,
  },
  inputError: {
    borderColor: AUTH_COLORS.error,
    backgroundColor: '#FEF2F2',
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
