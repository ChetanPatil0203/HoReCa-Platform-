import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search, Bell, Menu } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export default function Topbar({ activePage, title, user, onMobileMenuPress }) {
  return (
    <View style={styles.topbar}>
      <View style={styles.leftSection}>
        {onMobileMenuPress && (
          <TouchableOpacity onPress={onMobileMenuPress} style={styles.mobileMenuBtn}>
            <Menu size={24} color={colors.dark} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>{title || 'Dashboard Overview'}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.searchContainer}>
          <Search size={14} color={colors.muted} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search operations..."
            placeholderTextColor={colors.muted}
          />
          <View style={styles.cmdBadge}>
            <Text style={styles.cmdText}>⌘K</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={18} color={colors.muted} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.profileBtn}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'O'}</Text>
          </View>
          <Text style={styles.profileName}>Hello, {user?.name?.split(" ")[0] || 'User'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileMenuBtn: {
    marginRight: 16,
    display: 'none', // handled via media queries in parent, or we can just pass onMobileMenuPress selectively
  },
  titleContainer: {
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    width: 240,
    height: 36,
    paddingHorizontal: 12,
    marginRight: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.dark,
    height: '100%',
    paddingVertical: 0,
    outlineStyle: 'none',
  },
  cmdBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  cmdText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
  },
  iconBtn: {
    padding: 8,
    position: 'relative',
    marginRight: 24,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: '#fff',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 24,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.dark,
    marginLeft: 10,
    letterSpacing: 1,
  }
});
