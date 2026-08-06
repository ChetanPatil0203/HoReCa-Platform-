import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function PrimaryButton({ title, onPress, icon: Icon, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryBtn,
        disabled && styles.primaryBtnDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>{title}</Text>
          {Icon && <Icon size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#071B3A',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryBtnDisabled: {
    backgroundColor: '#A8B4C6',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.85,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryBtnTextDisabled: {
    color: '#FFFFFF',
  },
});
