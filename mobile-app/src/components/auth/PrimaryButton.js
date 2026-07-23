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
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>{title}</Text>
          {Icon && <Icon size={20} color={disabled ? AUTH_COLORS.background : AUTH_COLORS.accent} style={{ marginLeft: 8 }} />}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: { 
    flexDirection: 'row', 
    backgroundColor: AUTH_COLORS.primary, 
    height: 52, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  primaryBtnDisabled: { 
    backgroundColor: AUTH_COLORS.muted,
    shadowOpacity: 0,
    elevation: 0
  },
  primaryBtnText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  primaryBtnTextDisabled: {
    color: AUTH_COLORS.border
  }
});
