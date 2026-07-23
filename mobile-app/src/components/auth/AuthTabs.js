import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AUTH_COLORS } from './AuthTheme';

export default function AuthTabs({ activeTab, onTabChange }) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabBtn, activeTab === 'login' && styles.tabActive]} 
        onPress={() => onTabChange('login')}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>SIGN IN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tabBtn, activeTab === 'register' && styles.tabActive]} 
        onPress={() => onTabChange('register')}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F3F7',
    borderRadius: 16, 
    padding: 4,
    marginBottom: 26,
    height: 48,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border
  },
  tabBtn: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 12 
  },
  tabActive: { 
    backgroundColor: AUTH_COLORS.primary,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2 
  },
  tabText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: AUTH_COLORS.primary, 
    letterSpacing: 0.5 
  },
  tabTextActive: { 
    color: '#FFFFFF' 
  }
});
