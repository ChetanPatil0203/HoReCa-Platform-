import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Star } from 'lucide-react-native';

const NAVY = '#081A3A';
const MUTED = '#64748B';

export default function VendorCard({ vendor, onViewProducts, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress(vendor);
    } else if (onViewProducts) {
      onViewProducts(vendor);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={[styles.avatar, { backgroundColor: vendor.bg || '#F1F5F9' }]}>
        <Text style={[styles.avatarText, { color: vendor.color || NAVY }]}>
          {vendor.initials || (vendor.name ? vendor.name.charAt(0).toUpperCase() : 'V')}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{vendor.name}</Text>
        <Text style={styles.category} numberOfLines={1}>{vendor.category || 'Raw Material'}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.ratingBadge}>
          <Star size={12} color="#D97706" fill="#D97706" />
          <Text style={styles.ratingText}>{vendor.rating || 4.5}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  info: {
    flex: 1,
    paddingRight: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 2,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  category: {
    fontSize: 11,
    color: MUTED,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
});
